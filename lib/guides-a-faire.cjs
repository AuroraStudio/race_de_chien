#!/usr/bin/env node
/**
 * Sections « Vivre avec un… » des fiches (data/guides.json), écrites lot par lot.
 * Utilisé par la tâche planifiée `fiches-race-de-chien-enrichies` (12 races par jour).
 *
 *   node lib/guides-a-faire.cjs liste [N]              les N prochaines races sans section (12 par défaut),
 *                                                      avec leurs données et deux exemples déjà écrits
 *   node lib/guides-a-faire.cjs fusionner <lot.json>   contrôle le lot puis l'ajoute à data/guides.json
 *                                                      (rien n'est écrit si une seule erreur)
 *   node lib/guides-a-faire.cjs verifier               après `npm run generate` : sections présentes sur les
 *                                                      fiches françaises, absentes des versions traduites
 *
 * Ordre : races les plus inscrites au LOF en 2025 d'abord, puis les autres par ordre alphabétique.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GFILE = path.join(ROOT, 'data/guides.json');
const breeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/breeds.json'), 'utf8')).breeds;
const bySlug = Object.fromEntries(breeds.map(b => [b.slug, b]));
const guides = JSON.parse(fs.readFileSync(GFILE, 'utf8'));
const has = s => Object.prototype.hasOwnProperty.call(guides, s);
const lof = b => b.lof?.['2025'] ?? -1;
const todo = () => breeds.filter(b => !has(b.slug)).sort((a, b) => lof(b) - lof(a) || a.name_fr.localeCompare(b.name_fr, 'fr'));
const FIELDS = ['quotidien', 'education', 'activite', 'soins', 'vigilance'];
const EXEMPLES = ['teckel', 'cane-corso'];
const [cmd, arg] = process.argv.slice(2);

function liste(n) {
    const rest = todo();
    const pick = rest.slice(0, n).map(b => ({
        slug: b.slug, name_fr: b.name_fr, name_alt: b.name_alt, origin: b.origin, description: b.description, history: b.history,
        bred_for: b.bred_for, physical: b.physical, coat: b.coat, temperament: b.temperament, scores: b.scores, health: b.health,
        legal_category: b.legal_category, fci: b.fci, training: b.training, living: b.living, hypoallergenic: b.hypoallergenic,
        review_confidence: b.review_confidence
    }));
    console.log(JSON.stringify({
        restantes: rest.length, deja_ecrites: Object.keys(guides).filter(k => !k.startsWith('_')).length,
        notes: 'scores de 1 à 5 ; exercice_min_jour en minutes ; legal_category 1 ou 2 = chien catégorisé en France',
        exemples: EXEMPLES.filter(has).map(s => ({ slug: s, guide: guides[s] })),
        lot: pick
    }, null, 1));
}

function words(g) {
    return [...FIELDS.slice(0, 4).map(f => g[f]), ...(g.vigilance || [])].join(' ').split(/\s+/).filter(Boolean).length;
}

function fusionner(file) {
    if (!file || !fs.existsSync(file)) { console.error(`Lot introuvable : ${file}`); process.exit(1); }
    let lot;
    try { lot = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error(`JSON invalide : ${e.message}`); process.exit(1); }
    const errors = [];
    const ok = {};
    for (const [slug, g0] of Object.entries(lot)) {
        const b = bySlug[slug];
        const err = m => errors.push(`${slug} : ${m}`);
        if (!b) { err('race inconnue dans data/breeds.json'); continue; }
        if (has(slug)) { err('section déjà écrite'); continue; }
        if (!g0 || typeof g0 !== 'object') { err('pas un objet'); continue; }
        const keys = Object.keys(g0).sort().join(',');
        if (keys !== [...FIELDS].sort().join(',')) { err(`champs attendus ${FIELDS.join(', ')} (reçu : ${keys})`); continue; }
        // Apostrophe typographique partout
        const fix = s => String(s).replace(/'/g, '’').replace(/\s+/g, ' ').trim();
        const g = Object.fromEntries(FIELDS.map(f => [f, f === 'vigilance' ? (Array.isArray(g0[f]) ? g0[f].map(fix) : g0[f]) : fix(g0[f])]));
        for (const f of FIELDS.slice(0, 4)) if (!g[f] || g[f].length < 80) err(`« ${f} » vide ou trop court`);
        if (!Array.isArray(g.vigilance) || g.vigilance.length < 3 || g.vigilance.length > 5 || g.vigilance.some(x => !x)) err('« vigilance » : 3 à 5 points non vides');
        const all = [...FIELDS.slice(0, 4).map(f => g[f]), ...(Array.isArray(g.vigilance) ? g.vigilance : [])].join(' ');
        if (/[—–]/.test(all)) err('tiret long ou demi-cadratin interdit (mettre une virgule ou deux-points)');
        if (/!/.test(all)) err('point d’exclamation interdit');
        if (/\b(nous|notre|nos)\b/i.test(all)) err('« nous / notre / nos » interdit (écrire au vouvoiement, sans nous)');
        const n = words(g);
        if (n < 140 || n > 320) err(`${n} mots (attendu 140 à 320)`);
        // Aucun chiffre qui ne figure pas déjà dans les données de la race : rien d'inventé
        const data = JSON.stringify(b);
        const nums = [...new Set(all.match(/\d+(?:[.,]\d+)?/g) || [])];
        const unknown = nums.filter(x => !data.includes(x) && !data.includes(x.replace(',', '.')));
        if (unknown.length) err(`chiffre(s) absent(s) des données de la race : ${unknown.join(', ')} (écrire en lettres ou retirer)`);
        ok[slug] = g;
    }
    if (!Object.keys(lot).length) errors.push('lot vide');
    if (errors.length) {
        console.error(`❌ ${errors.length} erreur(s), rien n'a été écrit :`);
        for (const e of errors) console.error('  - ' + e);
        process.exit(1);
    }
    Object.assign(guides, ok);
    fs.writeFileSync(GFILE, JSON.stringify(guides, null, 1) + '\n', 'utf8');
    console.log(`✅ ${Object.keys(ok).length} section(s) ajoutée(s) : ${Object.keys(ok).join(', ')}`);
    console.log(`   ${todo().length} race(s) restante(s)`);
}

function verifier() {
    const errors = [];
    const slugs = Object.keys(guides).filter(k => !k.startsWith('_'));
    for (const s of slugs) {
        const f = path.join(ROOT, 'races', `${s}.html`);
        if (!fs.existsSync(f)) { errors.push(`races/${s}.html absent`); continue; }
        const html = fs.readFileSync(f, 'utf8');
        if (!html.includes('id="vivre"')) errors.push(`races/${s}.html sans section « Vivre avec »`);
        if (html.includes('guide-->')) errors.push(`races/${s}.html contient encore les marqueurs <!--guide-->`);
    }
    for (const l of ['en', 'es', 'de', 'pt']) {
        const dir = path.join(ROOT, l);
        if (!fs.existsSync(dir)) continue;
        const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
        const hit = walk(dir).filter(f => f.endsWith('.html') && fs.readFileSync(f, 'utf8').includes('id="vivre"'));
        if (hit.length) errors.push(`${hit.length} page(s) ${l} contiennent la section française (ex. ${path.relative(ROOT, hit[0])})`);
        const t = path.join(ROOT, 'i18n', l, '_a-traduire.json');
        if (fs.existsSync(t)) { const n = Object.keys(JSON.parse(fs.readFileSync(t, 'utf8'))).length; if (n) errors.push(`i18n/${l}/_a-traduire.json : ${n} phrase(s) à traduire`); }
    }
    if (errors.length) { console.error(`❌ ${errors.length} problème(s) :`); errors.forEach(e => console.error('  - ' + e)); process.exit(1); }
    console.log(`✅ ${slugs.length} fiches avec la section « Vivre avec », aucune dans les traductions, rien à traduire. Restantes : ${todo().length}`);
}

// Attend que les fiches données soient en ligne avec leur section (après le push, Vercel redéploie en 1 à 3 min)
async function attendre(slugs) {
    if (!slugs.length) { console.error('Usage : attendre <slug> [slug…]'); process.exit(1); }
    const until = Date.now() + 12 * 60000;
    let left = slugs.slice();
    while (left.length && Date.now() < until) {
        const still = [];
        for (const s of left) {
            try {
                const r = await fetch(`https://race-de-chien.com/races/${s}`, { headers: { 'Cache-Control': 'no-cache' } });
                if (!(r.ok && (await r.text()).includes('id="vivre"'))) still.push(s);
            } catch { still.push(s); }
        }
        left = still;
        if (left.length) await new Promise(r => setTimeout(r, 20000));
    }
    if (left.length) { console.error(`❌ Pas encore en ligne après 12 min : ${left.join(', ')}`); process.exit(1); }
    console.log(`✅ En ligne : ${slugs.map(s => `https://race-de-chien.com/races/${s}`).join(' ')}`);
}

if (cmd === 'liste') liste(Number(arg) || 12);
else if (cmd === 'attendre') attendre(process.argv.slice(3));
else if (cmd === 'fusionner') fusionner(arg && path.resolve(arg));
else if (cmd === 'verifier') verifier();
else { console.error('Usage : node lib/guides-a-faire.cjs liste [N] | fusionner <lot.json> | verifier'); process.exit(1); }
