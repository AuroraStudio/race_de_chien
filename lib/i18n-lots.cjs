#!/usr/bin/env node
/**
 * lib/i18n-lots.cjs
 * Traduire les phrases qui manquent, par lots.
 *
 *   node lib/i18n-lots.cjs decouper en     → i18n/en/_lots/lot-01.json… (phrases de i18n/en/_a-traduire.json)
 *   node lib/i18n-lots.cjs fusionner en    → lit les lot-XX.en.json traduits, les vérifie, les ajoute à dictionnaire.json
 *
 * Un lot : [{ id, fr, page }]. Sa traduction : { "<id>": "<texte traduit>" }.
 * Ensuite : npm run generate.
 */
const fs = require('fs');
const path = require('path');

const [cmd, lang = 'en', maxWords = '9500'] = process.argv.slice(2);
const dir = path.join(__dirname, '..', 'i18n', lang);
const lots = path.join(dir, '_lots');
const words = s => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const tags = s => (s.match(/<\/?[gx]\d+\/?>/g) || []).sort().join(' ');
const html = s => (s.match(/<\/?[a-z][^>]*>/g) || []).sort().join(' ');
const tokens = s => (s.match(/__[A-Z_]+__|\{\d+\}/g) || []).sort().join(' ');

// Une traduction garde les mêmes balises, marqueurs et valeurs que la phrase française
function check(fr, t) {
    return t == null ? 'manquante'
        : typeof t !== 'string' || !t.trim() ? 'vide'
        : tags(t) !== tags(fr) ? `balises ${tags(fr)} ≠ ${tags(t)}`
        : tokens(t) !== tokens(fr) ? `marqueurs ${tokens(fr)} ≠ ${tokens(t)}`
        : html(t) !== html(fr) ? `balises HTML ${html(fr)} ≠ ${html(t)}`
        : /</.test(t.replace(/<\/?[gx]\d+\/?>|<\/?[a-z][^>]*>/g, '')) ? 'chevron < non échappé'
        : null;
}

if (cmd === 'decouper') {
    const todo = Object.entries(JSON.parse(fs.readFileSync(path.join(dir, '_a-traduire.json'), 'utf8'))).filter(([k]) => !k.startsWith('race:'));
    fs.mkdirSync(lots, { recursive: true });
    for (const f of fs.readdirSync(lots)) if (/^lot-\d+\.json$/.test(f)) fs.rmSync(path.join(lots, f));
    // Les phrases communes à plusieurs pages et les textes des scripts d'abord, puis page par page
    const common = todo.filter(([, v]) => v.n >= 3 || v.where === 'scripts');
    const rest = todo.filter(([, v]) => !(v.n >= 3 || v.where === 'scripts'));
    const out = [];
    let cur = [], w = 0, page = null;
    const flush = () => { if (cur.length) out.push(cur); cur = []; w = 0; };
    for (const group of [common, rest]) {
        for (const [fr, v] of group) {
            // Un lot se ferme entre deux pages, jamais au milieu d'une fiche
            if (w > Number(maxWords) && v.where !== page) flush();
            cur.push({ fr, page: v.where });
            w += words(fr);
            page = v.where;
        }
        flush();
    }
    // Pour une autre langue que l'anglais, la version anglaise relue aide à lever les ambiguïtés
    const enFile = path.join(__dirname, '..', 'i18n', 'en', 'dictionnaire.json');
    const en = lang !== 'en' && fs.existsSync(enFile) ? JSON.parse(fs.readFileSync(enFile, 'utf8')) : {};
    let id = 0;
    out.forEach((lot, i) => {
        const file = path.join(lots, `lot-${String(i + 1).padStart(2, '0')}.json`);
        fs.writeFileSync(file, JSON.stringify(lot.map(x => ({ id: ++id, ...x, ...(en[x.fr] ? { en: en[x.fr] } : {}) })), null, 1) + '\n', 'utf8');
        console.log(path.basename(file), lot.length, 'phrases,', lot.reduce((a, x) => a + words(x.fr), 0), 'mots');
    });
} else if (cmd === 'verifier') {
    // node lib/i18n-lots.cjs verifier en 03 : contrôle un lot traduit sans rien écrire
    const n = String(process.argv[5] || process.argv[4]).padStart(2, '0');
    const src = JSON.parse(fs.readFileSync(path.join(lots, `lot-${n}.json`), 'utf8'));
    const tr = JSON.parse(fs.readFileSync(path.join(lots, `lot-${n}.${lang}.json`), 'utf8'));
    let bad = 0;
    for (const { id, fr } of src) {
        const err = check(fr, tr[id]);
        if (err) { bad++; if (bad <= 60) console.log(`#${id} ${err} : ${fr.slice(0, 80)}`); }
    }
    const dash = Object.entries(tr).filter(([, t]) => /[\u2013\u2014]/.test(t)).length;
    console.log(`${src.length - bad}/${src.length} correctes, ${bad} à reprendre${dash ? `, ${dash} avec un tiret long à remplacer` : ''}`);
} else if (cmd === 'controler') {
    // node lib/i18n-lots.cjs controler en : cherche du français resté dans les pages générées de la langue
    const parse5 = require('parse5');
    const root = path.join(__dirname, '..');
    const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'), 'utf8'));
    const names = Object.values(JSON.parse(fs.readFileSync(path.join(dir, 'races.json'), 'utf8'))).map(x => x.name);
    // Mots et lettres propres au français ; l'espagnol partage « la », « le », « sin », le « é »
    // (frontières de mot Unicode : « está » ne doit pas passer pour « est »)
    const words = w => new RegExp(`(?<!\\p{L})(${w})(?!\\p{L})`, 'iu');
    const FR = lang === 'en'
        ? { test: t => words('le|la|les|des|du|une|est|et|pour|avec|sans|chien|chiens|race|races|très|plus|vous|votre|aux').test(t) || /[éèàçùêâîôû]/i.test(t) }
        : { test: t => words('des|du|une|est|et|pour|avec|sans|chien|chiens|race|races|très|vous|votre|aux|dans|qui|leur|cette').test(t) || /[èàçùêâîôûœ]/i.test(t) };
    const files = [];
    const walkDir = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walkDir(p); else if (f.endsWith('.html')) files.push(p); } };
    walkDir(path.join(root, cfg.pages['/'].slice(1)));
    const found = new Map();
    for (const f of files) {
        const doc = parse5.parse(fs.readFileSync(f, 'utf8'));
        const visit = n => {
            if (n.attrs?.some(a => a.name === 'translate' && a.value === 'no') || ['script', 'style', 'svg'].includes(n.tagName)) return;
            if (n.nodeName === '#text') {
                let t = n.value.replace(/\s+/g, ' ').trim();
                for (const nm of names) t = t.split(nm).join('');
                if (t && FR.test(t) && !found.has(n.value.trim())) found.set(n.value.trim(), path.relative(root, f));
            }
            for (const c of n.childNodes || []) visit(c);
            if (n.content) visit(n.content);
        };
        visit(doc);
    }
    console.log(`${files.length} pages, ${found.size} textes qui ressemblent à du français`);
    for (const [t, f] of [...found].slice(0, Number(process.argv[4] || 40))) console.log(`  ${f} : ${t.slice(0, 110)}`);
} else if (cmd === 'fusionner') {
    const dictFile = path.join(dir, 'dictionnaire.json');
    const dict = fs.existsSync(dictFile) ? JSON.parse(fs.readFileSync(dictFile, 'utf8')) : {};
    let added = 0, errors = 0;
    for (const f of fs.readdirSync(lots).filter(f => /^lot-\d+\.json$/.test(f)).sort()) {
        const tf = path.join(lots, f.replace('.json', '.en.json').replace('.en.json', `.${lang}.json`));
        if (!fs.existsSync(tf)) { console.log(`${f} : pas encore traduit`); continue; }
        const src = JSON.parse(fs.readFileSync(path.join(lots, f), 'utf8'));
        const tr = JSON.parse(fs.readFileSync(tf, 'utf8'));
        let ok = 0;
        for (const { id, fr } of src) {
            const t = tr[id];
            const err = check(fr, t);
            if (err) { errors++; if (errors <= 40) console.log(`  ✗ ${f} #${id} ${err} : ${fr.slice(0, 70)}`); continue; }
            dict[fr] = t.trim().replace(/[–—]/g, m => (m === '–' ? '-' : ','));
            ok++;
        }
        added += ok;
        console.log(`${f} : ${ok}/${src.length}`);
    }
    fs.writeFileSync(dictFile, JSON.stringify(Object.fromEntries(Object.entries(dict).sort(([a], [b]) => a.localeCompare(b))), null, 1) + '\n', 'utf8');
    console.log(`${added} traductions ajoutées, ${errors} refusées, ${Object.keys(dict).length} dans le dictionnaire`);
} else {
    console.log('Usage : node lib/i18n-lots.cjs decouper|fusionner <langue>');
}
