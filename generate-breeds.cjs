#!/usr/bin/env node
/**
 * generate-breeds.cjs
 * Génère tout le site statique depuis data/breeds.json et templates/ :
 * pages, fiches des races, sélections thématiques, sitemap, robots,
 * index de données léger pour l'accueil, CSS compilé et numéros de version des fichiers.
 *
 * Usage : npm run generate
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const I18N = require('./lib/i18n.cjs');
// js/scoring.js est partagé avec le navigateur (le dépôt est en "type": "module") : on l'évalue à la main
const S = (() => {
    const m = { exports: {} };
    new Function('module', 'exports', fs.readFileSync(path.join(__dirname, 'js/scoring.js'), 'utf8'))(m, m.exports);
    return m.exports;
})();

const ROOT = __dirname;
const SITE_URL = 'https://race-de-chien.com';
const TODAY = new Date().toISOString().split('T')[0];
const written = [];

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Date de dernière modification réelle de chaque page (sitemap, JSON-LD, « mis à jour le ») :
// on garde la date précédente tant que le contenu ne change pas, numéros de version des fichiers exclus.
const LASTMOD_FILE = 'data/lastmod.json';
const lastmodPrev = fs.existsSync(path.join(ROOT, LASTMOD_FILE)) ? JSON.parse(fs.readFileSync(path.join(ROOT, LASTMOD_FILE), 'utf8')) : {};
const lastmod = {};
const DATE = '__LASTMOD__', DATE_FR = '__LASTMOD_FR__';
// Date affichée « mis à jour le » selon la langue de la page
const FMT_DATE = {
    fr: d => d.split('-').reverse().join('/'),
    en: d => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    es: d => new Date(`${d}T00:00:00Z`).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    de: d => new Date(`${d}T00:00:00Z`).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    pt: d => new Date(`${d}T00:00:00Z`).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
};
function stamp(p, html, fmt = FMT_DATE.fr) {
    if (!html.includes('<html')) return html;
    const h = crypto.createHash('sha1').update(html.replace(/\?v=[\w-]+/g, '').split('__V_CSS__').join('')).digest('hex').slice(0, 12);
    const prev = lastmodPrev[p];
    const d = prev && prev.h === h ? prev.d : TODAY;
    lastmod[p] = { h, d };
    return html.split(DATE_FR).join(fmt(d)).split(DATE).join(d);
}
// Typographie française : espace insécable avant : ; ? ! » et après «, entre un nombre et son unité.
// Appliquée au texte des pages seulement, jamais dans les balises, les scripts ou les styles.
function frTypo(html) {
    let raw = false;
    return html.split(/(<[^>]+>)/).map(part => {
        if (part.startsWith('<')) {
            if (/^<(script|style)\b/i.test(part)) raw = true;
            else if (/^<\/(script|style)/i.test(part)) raw = false;
            return part;
        }
        if (raw) return part;
        return part.replace(/(\S) ([:;?!»])/g, '$1\u00a0$2').replace(/« /g, '«\u00a0')
            .replace(/(\d) (h|min|minutes|ans|cm|kg|%)(?![\p{L}])/gu, '$1\u00a0$2');
    }).join('');
}
const writeFile = (p, s) => {
    fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, p), s, 'utf8');
    written.push(p);
};
// Autres langues (i18n/<langue>/) : chargées plus bas, une fois les sélections et les groupes connus
let L10N = [];
const pageUrl = p => (p === 'index.html' ? '/' : `/${p.replace(/\.html$/, '')}`);
// Sélecteur de langue du pied de page : un menu repliable sans script, chaque langue écrite dans sa propre langue
const langLinks = (versions, cur) => `<details class="lang-menu relative" translate="no">
            <summary class="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 py-1.5 font-medium text-slate-300 hover:text-white [&::-webkit-details-marker]:hidden">${icon('globe', 'h-4 w-4')}${versions.find(v => v.lang === cur).label}${icon('caret-down', 'h-3.5 w-3.5')}</summary>
            <ul class="absolute bottom-full right-0 z-10 mb-2 w-44 rounded-2xl border border-slate-700 bg-slate-800 p-1.5 text-sm shadow-lg">
                ${versions.map(v => (v.lang === cur
        ? `<li><span aria-current="true" class="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-white">${icon('check', 'h-4 w-4')}${v.label}</span></li>`
        : `<li><a href="${v.url}" hreflang="${v.lang}" lang="${v.lang}" class="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white"><span class="h-4 w-4" aria-hidden="true"></span>${v.label}</a></li>`)).join('')}
            </ul>
        </details>`;
/**
 * Écrit une page en français, puis sa version dans chaque autre langue (même page, phrases traduites).
 * variants : { en: html } quand la version d'une langue part d'un autre rendu (ordre alphabétique des noms traduits).
 */
const write = (p, s, variants = {}) => {
    if (!p.endsWith('.html')) return writeFile(p, s);
    const url = pageUrl(p);
    const alts = L10N.map(L => [L, L.routes[url]]).filter(([, u]) => u);
    const abs = u => SITE_URL + u;
    const head = alts.length
        ? [['fr', url], ...alts.map(([L, u]) => [L.lang, u]), ['x-default', url]].map(([l, u]) => `<link rel="alternate" hreflang="${l}" href="${abs(u)}">`).join('\n    ')
        : '';
    const versions = [{ lang: 'fr', url, label: 'Français' }, ...alts.map(([L, u]) => ({ lang: L.lang, url: u, label: L.cfg.switchLabel }))];
    const finish = (html, sw) => (head ? html.replace('</head>', `    ${head}\n</head>`) : html).replace(/__LANG_SWITCH__\n?/, sw ? `${sw}\n` : '');
    for (const [L, u] of alts) {
        let html = L.localize(frTypo(variants[L.lang] || s), p);
        html = html.replace(/\/data\/breeds-index\.json(\?v=[\w-]+)?/g, `/data/breeds-index.${L.lang}.json?v=${L.vData}`)
            .replace('<script src="/js/icons.js', `<script src="/js/i18n.${L.lang}.js?v=${L.vClient}" defer></script>\n    <script src="/js/icons.js`);
        const file = L.fileOf(u);
        writeFile(file, stamp(file, finish(html, langLinks(versions, L.lang)), FMT_DATE[L.lang] || FMT_DATE.fr));
    }
    writeFile(p, stamp(p, finish(frTypo(s), alts.length ? langLinks(versions, 'fr') : '')));
};
const hash = p => crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, p))).digest('hex').slice(0, 10);

// ============================================
// DONNÉES
// ============================================

const data = JSON.parse(read('data/breeds.json'));
const breeds = data.breeds.slice().sort((a, b) => a.name_fr.localeCompare(b.name_fr, 'fr'));
const COUNT = breeds.length;
breeds.filter(b => b.lof?.['2025']).sort((a, b) => b.lof['2025'] - a.lof['2025']).forEach((b, i) => { b.lofRank = i + 1; });
const popular = breeds.filter(b => b.lofRank).sort((a, b) => a.lofRank - b.lofRank);

// ============================================
// UTILS
// ============================================

function esc(text) {
    return String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const num = n => String(n).replace('.', ',');
const fmtInt = n => Number(n).toLocaleString('fr-FR').replace(/ | /g, ' ');
const ordinal = n => (n === 1 ? '1re' : `${n}e`);
// « le Golden Retriever », « l’Akita » (le h des noms de races est aspiré : « le Husky »)
const le = n => (/^[AEIOUYÉÈÊÂÎÔ]/i.test(n) ? `l’${n}` : `le ${n}`);
const Le = n => le(n).replace(/^l/, 'L');
// Suffixe de marque seulement s'il tient dans les 60 caractères affichés par Google
const withBrand = t => (t.length + 16 <= 60 ? `${t} | Race de Chien` : t);
// Coupe une description au dernier mot avant la limite (Google affiche environ 155 caractères)
function clip(text, max = 158) {
    const t = text.replace(/\s+/g, ' ').trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 1).replace(/[\s,;:.]+\S*$/, '') + '…';
}
function range(min, max, unit) {
    if (min == null && max == null) return '';
    if (min == null || max == null || min === max) return `${num(min ?? max)} ${unit}`;
    return `${num(min)} à ${num(max)} ${unit}`;
}
const MASC = ['Japon', 'Mexique', 'Canada', 'Tibet', 'Mali', 'Maroc', 'Portugal', 'Royaume-Uni', 'Pays de Galles', 'Danemark', 'Congo', 'Groenland', 'Zimbabwe', 'Brésil', 'Chili', 'Pérou', 'Liechtenstein', 'Luxembourg', 'Vietnam', 'Cambodge'];
function fromOrigin(origin) {
    if (!origin) return '';
    const o = origin.split(/[,(]/)[0].trim();
    if (/^(États-Unis|Pays-Bas)/.test(o)) return `des ${o}`;
    if (MASC.some(m => o.startsWith(m))) return `du ${o}`;
    if (/^[AEIOUÉÈÊÂ]/i.test(o)) return `d'${o}`;
    return `de ${o}`;
}
const SIZE_WORD = { toy: 'très petit', small: 'petit', medium: 'moyen', large: 'grand', giant: 'géant' };
const SIZE_LABEL = { toy: 'Très petit', small: 'Petit', medium: 'Moyen', large: 'Grand', giant: 'Géant' };

const SCORE_META = {
    energie: { label: 'Énergie', words: ['Très calme', 'Calme', 'Modérée', 'Élevée', 'Débordante'], neutral: true },
    appartement: { label: 'En appartement', words: ['Impossible', 'Difficile', 'Possible', 'Bien', 'Parfait'] },
    solitude: { label: 'Seul à la maison', words: ['Très mal', 'Mal', 'Quelques heures', 'Bien', 'Très bien'] },
    enfants: { label: 'Avec les enfants', words: ['À éviter', 'Prudence', 'Correct', 'Bon', 'Excellent'] },
    chiens: { label: 'Avec les autres chiens', words: ['À éviter', 'Prudence', 'Correct', 'Bon', 'Excellent'] },
    chats: { label: 'Avec les chats', words: ['À éviter', 'Prudence', 'Correct', 'Bon', 'Excellent'] },
    inconnus: { label: 'Avec les inconnus', words: ['Très méfiant', 'Réservé', 'Poli', 'Ouvert', 'Très ouvert'] },
    education: { label: "Facilité d'éducation", words: ['Très difficile', 'Difficile', 'Moyenne', 'Facile', 'Très facile'] },
    premier_chien: { label: 'Pour un premier chien', words: ['Déconseillé', 'Peu adapté', 'Possible', 'Bien adapté', 'Idéal'] },
    garde: { label: 'Instinct de garde', words: ['Nul', 'Faible', 'Modéré', 'Marqué', 'Très marqué'], neutral: true },
    instinct_chasse: { label: 'Instinct de chasse', words: ['Très faible', 'Faible', 'Modéré', 'Fort', 'Très fort'], reverse: true },
    fugue: { label: 'Tendance à fuguer', words: ['Très faible', 'Faible', 'Modérée', 'Forte', 'Très forte'], reverse: true },
    entretien_pelage: { label: 'Entretien du poil', words: ['Minimal', 'Faible', 'Moyen', 'Important', 'Très important'], reverse: true },
    perte_poils: { label: 'Perte de poils', words: ['Quasi nulle', 'Faible', 'Modérée', 'Forte', 'Très forte'], reverse: true },
    bave: { label: 'Bave', words: ['Jamais', 'Rarement', 'Un peu', 'Souvent', 'Beaucoup'], reverse: true },
    aboiements: { label: 'Aboiements', words: ['Très discret', 'Discret', 'Modérés', 'Fréquents', 'Très bavard'], reverse: true },
    chaleur: { label: 'Tolérance à la chaleur', words: ['Très faible', 'Faible', 'Moyenne', 'Bonne', 'Excellente'] },
    froid: { label: 'Tolérance au froid', words: ['Très faible', 'Faible', 'Moyenne', 'Bonne', 'Excellente'] },
    robustesse: { label: 'Robustesse', words: ['Fragile', 'Plutôt fragile', 'Moyenne', 'Bonne', 'Excellente'] }
};
const SCORE_GROUPS = [
    ['Mode de vie', ['energie', 'appartement', 'solitude']],
    ['Famille et sociabilité', ['enfants', 'chiens', 'chats', 'inconnus']],
    ['Éducation et caractère', ['education', 'premier_chien', 'garde', 'instinct_chasse', 'fugue']],
    ['Entretien et voisinage', ['entretien_pelage', 'perte_poils', 'bave', 'aboiements']],
    ['Climat et santé', ['chaleur', 'froid', 'robustesse']]
];

// Ce que la note veut dire pour la plupart des foyers : atout, neutre ou à prévoir.
// L'énergie et la garde ne sont ni bonnes ni mauvaises : tout dépend du maître.
function tone(k, v) {
    const m = SCORE_META[k];
    if (m.neutral) return 'neutral';
    const fav = m.reverse ? 6 - v : v;
    return fav >= 4 ? 'good' : fav <= 2 ? 'watch' : 'mid';
}
const TONE = {
    good: { text: 'text-emerald-700', bar: 'bg-slate-500' },
    mid: { text: 'text-slate-800', bar: 'bg-slate-500' },
    watch: { text: 'text-amber-700', bar: 'bg-slate-500' },
    neutral: { text: 'text-slate-800', bar: 'bg-slate-500' }
};
function gauge(k, v, cls = '') {
    const t = TONE[tone(k, v)];
    return `<span class="gauge ${cls}" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? t.bar : ''}"></i>`).join('')}</span>`;
}
// Les 8 notes qui pèsent le plus dans le choix, résumées en tête de fiche
const KEY_SCORES = [
    ['energie', 'lightning', 'Énergie'], ['enfants', 'baby', 'Enfants'], ['appartement', 'buildings', 'Appartement'], ['solitude', 'house', 'Seul à la maison'],
    ['premier_chien', 'plant', 'Premier chien'], ['chats', 'cat', 'Avec les chats'], ['aboiements', 'speaker-high', 'Aboiements'], ['perte_poils', 'broom', 'Perte de poils']
];

// Versions réduites de chaque photo (créées par sources/photos/ajouter-photos.py) : les cartes chargent 9 Ko au lieu de 60
const VARIANTS = [480, 768];
function srcset(b) {
    const base = b.image.url.replace(/\.jpg$/, '');
    const ok = VARIANTS.filter(w => fs.existsSync(path.join(ROOT, `${base}-${w}.webp`)));
    if (ok.length < VARIANTS.length) console.warn(`⚠️  versions réduites manquantes : ${base}`);
    return [...ok.map(w => `/${base}-${w}.webp ${w}w`), `/${base}.webp ${b.image.width}w`].join(', ');
}
const SIZES_CARD = '(min-width: 1024px) 300px, (min-width: 640px) calc(50vw - 40px), calc(100vw - 32px)';
const SIZES_HERO = '(min-width: 1024px) 620px, calc(100vw - 32px)';

function picture(b, cls, opts = {}) {
    if (!b.image) {
        return `<div class="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-slate-400 ${opts.box || ''}">${icon('paw-print', opts.big ? 'h-16 w-16' : 'h-10 w-10')}<span class="text-xs font-medium text-slate-500">Photo à venir</span></div>`;
    }
    const src = `/${b.image.url}`;
    const load = opts.eager ? 'fetchpriority="high"' : opts.soon ? '' : 'loading="lazy"';
    return `<picture><source srcset="${srcset(b)}" sizes="${opts.sizes || SIZES_CARD}" type="image/webp"><img src="${src}" alt="${esc(opts.alt ?? b.name_fr)}" width="${b.image.width}" height="${b.image.height}" class="${cls}" ${load} decoding="async"></picture>`;
}

function staticCard(b, extra = {}) {
    const h = extra.h || 'h3';
    // Score à côté du nom, jamais sur la photo
    const pct = extra.pct != null ? `<span class="score ${extra.pct >= 75 ? 'score-hi' : extra.pct >= 55 ? 'score-mid' : 'score-lo'}" title="${extra.pct} % de compatibilité">${extra.pct} %<span class="sr-only"> de compatibilité</span></span>` : '';
    const reasons = (extra.reasons || []).slice(0, 4).map(x => `<span class="${x.ok ? 'chip-ok' : 'chip-ko'}">${icon(x.ok ? 'check' : 'warning-circle')}${esc(x.text)}</span>`).join('');
    // Repères pour départager des races qui répondent toutes au critère : taille, énergie, entretien, et ce qu'il faut prévoir
    const keyFacts = extra.facts ? `<p class="mt-2 text-sm text-slate-600">${esc(SIZE_LABEL[b.physical?.size_category] || '')} · énergie ${esc(SCORE_META.energie.words[b.scores.energie - 1].toLowerCase())} · entretien ${esc(SCORE_META.entretien_pelage.words[b.scores.entretien_pelage - 1].toLowerCase())}</p>` : '';
    const watch = extra.facts ? watchOuts(b, extra.skip)[0] : null;
    const watchChip = watch ? `<span class="chip-ko">${icon('warning-circle')}${esc(watch)}</span>` : '';
    const law = b.legal_category ? `<span class="chip-law">Catégorie ${esc(b.legal_category)}</span>` : '';
    return `<li class="group overflow-hidden rounded-2xl border border-slate-200 bg-white card-hover">
                <a href="/races/${b.slug}" class="block">
                    <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">${picture(b, 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105', { eager: extra.eager, soon: extra.soon })}</div>
                    <div class="p-4">
                        <div class="flex items-start justify-between gap-2"><${h} class="text-[17px] font-bold leading-snug text-slate-900">${esc(b.name_fr)}</${h}>${pct}</div>
                        <p class="mt-0.5 text-sm text-slate-500">${esc(b.origin || '')}${b.fci?.group ? ` · ${esc(S.FCI_GROUPS[b.fci.group])}` : ''}</p>
                        ${keyFacts}
                        ${extra.note ? `<p class="mt-2 text-sm text-slate-600">${esc(extra.note)}</p>` : ''}
                        ${reasons || law || watchChip ? `<div class="mt-3 flex flex-wrap gap-1.5">${law}${reasons}${watchChip}</div>` : ''}
                    </div>
                </a>
            </li>`;
}

// ============================================
// TEXTES GÉNÉRÉS DEPUIS LES NOTES
// ============================================

function forWho(b) {
    const s = b.scores;
    const yes = [], no = [];
    if (s.enfants >= 5) yes.push('une famille avec de jeunes enfants');
    else if (s.enfants >= 4) yes.push('une famille avec des enfants');
    if (s.appartement >= 4) yes.push('la vie en appartement, avec des sorties régulières');
    if (s.premier_chien >= 4) yes.push('un premier chien');
    if (s.energie >= 5) yes.push('un maître sportif : course, randonnée, canicross');
    else if (s.energie <= 2) yes.push('une vie calme et plutôt casanière');
    if (s.solitude >= 4) yes.push('rester seul quelques heures dans la journée');
    if (s.chats >= 4) yes.push('cohabiter avec un chat');
    if (b.hypoallergenic) yes.push('les personnes gênées par les poils (aucune race n’est garantie sans allergie)');
    if (s.aboiements <= 2) yes.push('un voisinage proche : il aboie peu');
    if (s.garde >= 4) yes.push('veiller sur la maison');

    if (s.appartement <= 2) no.push('un appartement : il lui faut de l’espace');
    if (s.enfants <= 2) no.push('de jeunes enfants, sans surveillance attentive');
    if (s.premier_chien <= 2) no.push('un premier chien : il demande un maître expérimenté');
    if (s.energie >= 5) no.push(`une vie sédentaire : comptez ${s.exercice_min_jour} minutes d’activité par jour`);
    if (s.solitude <= 2) no.push('de longues absences : il supporte mal la solitude');
    if (s.chats <= 2) no.push('un foyer avec des chats');
    if (s.perte_poils >= 4) no.push('les allergiques : il perd beaucoup de poils');
    if (s.aboiements >= 4) no.push('un voisinage sensible au bruit : il aboie volontiers');
    if (s.chaleur <= 2) no.push('les fortes chaleurs : prudence en été');
    if (s.instinct_chasse >= 4 && s.fugue >= 4) no.push('les balades sans laisse : instinct de chasse et rappel difficile');
    if (s.bave >= 4) no.push('ceux que la bave rebute');
    return { yes: yes.slice(0, 4), no: no.slice(0, 4) };
}

// Ce qu'il faut prévoir, en mots courts pour une étiquette (le critère de la page est passé dans skip)
function watchOuts(b, skip = []) {
    const s = b.scores, w = [];
    const add = (key, cond, text) => { if (cond && !skip.includes(key)) w.push(text); };
    add('solitude', s.solitude <= 2, 'Supporte mal la solitude');
    add('perte_poils', s.perte_poils >= 4, 'Perd beaucoup de poils');
    add('energie', s.energie >= 5, 'Très énergique');
    add('appartement', s.appartement <= 2, 'Pas fait pour l’appartement');
    add('entretien_pelage', s.entretien_pelage >= 4, 'Entretien du poil important');
    add('aboiements', s.aboiements >= 4, 'Aboie volontiers');
    add('education', s.education <= 2, 'Éducation exigeante');
    add('enfants', s.enfants <= 2, 'Prudence avec de jeunes enfants');
    add('chats', s.chats <= 2, 'À éviter avec un chat');
    add('chaleur', s.chaleur <= 2, 'Craint la chaleur');
    add('bave', s.bave >= 4, 'Bave beaucoup');
    return w;
}

const SIM_KEYS = ['energie', 'enfants', 'appartement', 'education', 'premier_chien', 'entretien_pelage', 'perte_poils', 'garde', 'solitude'];
function similar(b, limit = 4) {
    const size = S.SIZE_ID[b.physical.size_category];
    return breeds
        .filter(o => o.slug !== b.slug && o.fci?.recognized !== false)
        .map(o => {
            let d = Math.abs(S.SIZE_ID[o.physical.size_category] - size) * 1.5;
            for (const k of SIM_KEYS) d += Math.abs(o.scores[k] - b.scores[k]);
            if (o.fci?.group && o.fci.group === b.fci?.group) d -= 1;
            return { o, d };
        })
        .sort((a, c) => a.d - c.d)
        .slice(0, limit)
        .map(x => x.o);
}

const LAW = {
    '1': 'Chien de 1re catégorie (loi du 6 janvier 1999) : acquisition, cession et importation interdites, stérilisation obligatoire, permis de détention, muselière et laisse sur la voie publique. Un chien de ce type sans pedigree LOF est classé par diagnose vétérinaire.',
    '2': 'Chien de 2e catégorie (loi du 6 janvier 1999) : permis de détention, évaluation comportementale, assurance responsabilité civile, muselière et laisse tenue par un majeur sur la voie publique.'
};

// ============================================
// ICÔNES : une seule famille, Phosphor Regular (MIT), insérée en SVG
// ============================================

const ICON_DIR = path.join(ROOT, 'node_modules/@phosphor-icons/core/assets/regular');
const iconSrc = {};
function icon(name, cls = 'h-5 w-5') {
    if (!iconSrc[name]) iconSrc[name] = fs.readFileSync(path.join(ICON_DIR, `${name}.svg`), 'utf8').trim();
    return iconSrc[name].replace('<svg ', `<svg class="${cls}" aria-hidden="true" focusable="false" `);
}
// Celles que les scripts du navigateur dessinent (en-tête, accueil, test, comparateur, Tel Maître)
const CLIENT_ICONS = ['camera', 'list', 'globe', 'caret-down', 'x', 'check', 'warning-circle', 'paw-print', 'plus', 'arrow-right', 'arrow-left',
    'couch', 'person-simple-walk', 'tree', 'boot', 'person-simple-run', 'buildings', 'house', 'farm', 'user', 'student', 'baby',
    'cat', 'dog', 'prohibit', 'hourglass-simple-low', 'hourglass-simple-medium', 'hourglass-simple-high', 'plant', 'thumbs-up',
    'graduation-cap', 'smiley', 'broom', 'sparkle', 'speaker-simple-slash', 'clock', 'armchair', 'sun', 'flag', 'arrow-counter-clockwise'];
write('js/icons.js', `// Généré par generate-breeds.cjs : icônes Phosphor (MIT) dessinées par les scripts du site
window.RDCIcons = ${JSON.stringify(Object.fromEntries(CLIENT_ICONS.map(n => [n, icon(n, '__C__')])))};
window.RDCIcon = function (name, cls) { return (window.RDCIcons[name] || '').replace('__C__', cls || 'h-5 w-5'); };
// Textes et adresses des scripts : js/i18n.<langue>.js les traduit sur les pages d'une autre langue, sinon le français reste
window.RDCT = window.RDCT || function (s) { var o = ''; for (var i = 0; i < s.length; i++) o += s[i] + (i + 1 < arguments.length ? arguments[i + 1] : ''); return o; };
window.RDCPath = window.RDCPath || function (h) { return h; };
window.RDCOrd = window.RDCOrd || function (n) { return n === 1 ? '1re' : n + 'e'; };
`);

// ============================================
// PARTIALS ET VERSIONS
// ============================================

const versions = {
    V_SCORING: hash('js/scoring.js'),
    V_APP: hash('js/app.js'),
    V_HEADER: hash('js/header.js'),
    V_ICONS: hash('js/icons.js'),
    V_COMPARE: fs.existsSync(path.join(ROOT, 'js/compare.js')) ? hash('js/compare.js') : '1',
    V_QUIZ: fs.existsSync(path.join(ROOT, 'js/quiz.js')) ? hash('js/quiz.js') : '1',
    V_TELMAITRE: hash('js/tel-maitre.js'),
    V_CSS: '__V_CSS__'
};

// ============================================
// SÉLECTIONS THÉMATIQUES (pages /selections/...)
// ============================================

const SELECTIONS = [
    { slug: 'chiens-pour-appartement', seo: 'Chiens pour appartement : les races qui s’y plaisent', short: 'Chiens pour appartement', icon: 'buildings', state: { logement: 'appart' },
      title: 'Chiens pour appartement : les races qui s’y plaisent vraiment',
      intro: 'Un chien peut être heureux en appartement si ses besoins d’activité sont couverts dehors. Nous avons classé les races selon leur adaptation à un logement sans jardin : calme à l’intérieur, aboiements, taille, besoin d’espace.',
      avoid: 'Les races qui supportent le moins un appartement' },
    { slug: 'chiens-calmes', short: 'Chiens calmes et pantouflards', icon: 'couch', state: { rythme: 1 },
      title: 'Races de chiens calmes et pantouflards',
      intro: 'Vous rêvez d’un compagnon de canapé plutôt que d’un athlète ? Voici les races les moins énergiques, qui se contentent de promenades tranquilles et adorent la sieste.',
      avoid: 'Les races les plus énergiques' },
    { slug: 'chiens-pour-enfants', short: 'Chiens pour enfants', icon: 'baby', state: { enfants: 'jeunes' },
      title: 'Chiens pour enfants : les races les plus douces en famille',
      intro: 'Patience, tolérance aux câlins un peu maladroits, absence d’agressivité : certaines races sont réputées pour leur douceur avec les petits. Aucune race ne dispense de surveiller un enfant avec un chien.',
      avoid: 'Les races à éviter avec de jeunes enfants' },
    { slug: 'chiens-qui-perdent-peu-de-poils', seo: 'Chien qui ne perd pas ses poils : les races pour allergiques', short: 'Chiens qui perdent peu de poils', icon: 'broom', state: { hypo: true },
      title: 'Chiens qui perdent peu de poils : les races conseillées aux personnes allergiques',
      intro: 'Aucun chien n’est vraiment hypoallergénique : l’allergie vient de protéines présentes dans la salive et les squames. Les races à poil qui pousse en continu (caniches, bichons, schnauzers…) perdent très peu de poils et sont souvent mieux tolérées. Passez du temps avec la race avant de vous décider.' },
    { slug: 'chiens-pour-personnes-agees', seo: 'Chiens pour personnes âgées : races calmes et faciles', short: 'Chiens pour personnes âgées', icon: 'armchair', state: { rythme: 2, experience: 'premier', sizes: [1, 2, 3] },
      title: 'Chiens pour personnes âgées : calmes, faciles et pas trop grands',
      intro: 'Pour une retraite paisible, mieux vaut un chien calme, facile à éduquer, de petite ou moyenne taille, qui ne tire pas en laisse. Notre sélection croise ces critères.' },
    { slug: 'chiens-qui-supportent-la-solitude', seo: 'Chiens qui supportent la solitude : les races indépendantes', short: 'Chiens qui supportent la solitude', icon: 'clock', state: { seul: 'long' },
      title: 'Chiens qui supportent la solitude : les races les plus indépendantes',
      intro: 'Aucun chien n’est fait pour rester seul huit heures par jour tous les jours. Certaines races, plus indépendantes, vivent cependant mieux les absences. Pensez aussi au promeneur ou à la garderie.',
      avoid: 'Les races qui vivent le plus mal la solitude' },
    { slug: 'chiens-sportifs', seo: 'Chiens sportifs : les races pour courir et randonner', short: 'Chiens sportifs', icon: 'person-simple-run', state: { rythme: 5 },
      title: 'Chiens sportifs : les meilleures races pour courir et randonner',
      intro: 'Canicross, trail, randonnée, vélo : ces races ont l’endurance et l’envie de vous suivre. Elles demandent en retour une à deux heures d’activité par jour et de la stimulation mentale.' },
    { slug: 'premier-chien', short: 'Pour un premier chien', icon: 'plant', state: { experience: 'premier' },
      title: 'Premier chien : les races les plus faciles à vivre',
      intro: 'Facile à éduquer, bonne humeur, peu de comportements difficiles : ces races pardonnent les erreurs de débutant. Une éducation positive dès l’arrivée du chiot reste indispensable.',
      avoid: 'Les races déconseillées pour un premier chien' },
    { slug: 'chiens-qui-aboient-peu', short: 'Chiens qui aboient peu', icon: 'speaker-simple-slash', state: { discret: true },
      title: 'Chiens qui aboient peu : les races les plus discrètes',
      intro: 'Pour un immeuble ou des voisins proches, certaines races sont nettement plus silencieuses que d’autres. L’éducation et l’activité comptent aussi beaucoup : un chien qui s’ennuie aboie.' },
    { slug: 'races-francaises', short: 'Races françaises', icon: 'flag', state: { france: true },
      title: 'Les races de chiens françaises',
      intro: 'La France compte une cinquantaine de races reconnues : bergers, braques, épagneuls, chiens courants, molosses et chiens de compagnie. Les voici, de la plus inscrite au LOF à la plus rare.' },
    { slug: 'petits-chiens', short: 'Petits chiens', icon: 'dog', state: { sizes: [1, 2] }, all: true,
      title: 'Petits chiens : toutes les races de petite taille',
      intro: 'Moins de 40 cm au garrot : des chiens faciles à emmener partout. Petit ne veut pas dire calme : beaucoup de terriers débordent d’énergie.' },
    { slug: 'chiens-de-taille-moyenne', short: 'Chiens de taille moyenne', icon: 'dog', state: { sizes: [3] }, all: true,
      title: 'Chiens de taille moyenne : toutes les races de 40 à 60 cm',
      intro: 'Entre 40 et 60 cm au garrot, les chiens de taille moyenne sont le compromis le plus courant : assez robustes pour les longues balades, assez compacts pour la voiture et la maison. Bergers, épagneuls, braques, spitz : les tempéraments vont du très calme au très sportif.' },
    { slug: 'grands-chiens', short: 'Grands chiens', icon: 'dog', state: { sizes: [4, 5] }, all: true,
      title: 'Grands chiens : toutes les races de plus de 60 cm',
      intro: 'Plus de 60 cm au garrot : chiens de garde, de troupeau, de trait ou de chasse. Souvent calmes à la maison, ils ont besoin d’espace et d’une éducation précoce, et coûtent plus cher à nourrir et à soigner. Leur espérance de vie est aussi plus courte que celle des petits chiens.' },
    { slug: 'chiens-de-garde', short: 'Chiens de garde', icon: 'shield-check', state: { nocat: true },
      custom: b => ({ pct: Math.round(((b.scores.garde - 1) / 4) * 100), ok: b.scores.garde >= 4 }),
      title: 'Chiens de garde : les races à fort instinct de protection',
      intro: 'Un bon chien de garde prévient plus qu’il n’attaque. Ces races ont un instinct de protection marqué ; elles demandent une socialisation précoce et un maître ferme et juste. Nous excluons les chiens catégorisés.' },
    { slug: 'chiens-qui-supportent-la-chaleur', short: 'Chiens qui supportent la chaleur', icon: 'sun', state: { chaleur: true },
      title: 'Chiens qui supportent la chaleur : les races pour le Sud',
      intro: 'Poil court, museau long, silhouette fine : certaines races encaissent mieux les étés chauds. À l’inverse, les chiens à museau écrasé souffrent vite. Promenades tôt le matin et eau fraîche restent la règle.',
      avoid: 'Les races qui craignent le plus la chaleur' },
    { slug: 'chiens-et-chats', short: 'Chiens qui s’entendent avec les chats', icon: 'cat', state: { chat: true },
      title: 'Chiens qui s’entendent avec les chats',
      intro: 'Les races au faible instinct de chasse cohabitent plus facilement avec un chat, surtout si elles le côtoient dès le plus jeune âge.',
      avoid: 'Les races à éviter avec un chat' }
];

let SELECTION_MEMBERS = null;
function selectionResults(sel) {
    const state = { ...S.emptyState(), ...sel.state };
    if (sel.custom) {
        const list = breeds.filter(b => S.passesHard(b, state)).map(b => ({ breed: b, ...sel.custom(b), reasons: [] }))
            .filter(x => x.ok).sort((a, c) => c.pct - a.pct || (c.breed.lof?.['2025'] ?? 0) - (a.breed.lof?.['2025'] ?? 0));
        return { top: list.slice(0, 24), avoid: [], state };
    }
    const { results, criteria } = S.rank(breeds, state);
    const top = criteria.length ? results.filter(r => r.pct >= 70) : results;
    const avoid = criteria.length && sel.avoid ? results.slice().reverse().filter(r => r.pct <= 40).slice(0, 6) : [];
    return { top: sel.all ? top : top.slice(0, 24), total: top.length, avoid, state };
}

// ============================================
// TEMPLATES DE PAGES
// ============================================

function fill(tpl, vars) {
    let html = tpl
        .replace('<!-- @head -->', read('templates/partials/head.html'))
        .replace('<!-- @footer -->', read('templates/partials/footer.html'));
    for (const [k, v] of Object.entries(vars)) html = html.split(`{{${k}}}`).join(v);
    // {{icon:nom|classes}} dans les modèles
    return html.replace(/\{\{icon:([a-z0-9-]+)(?:\|([^}]*))?\}\}/g, (m, name, cls) => icon(name, cls || undefined));
}

const commonVars = {
    COUNT: String(COUNT),
    UPDATED: DATE_FR,
    SELECTION_LINKS: SELECTIONS.slice(0, 7).map(s => `                        <li><a href="/selections/${s.slug}" class="inline-block py-1.5 hover:text-white">${esc(s.short)}</a></li>`).join('\n'),
    POPULAR_LINKS: popular.slice(0, 7).map(b => `                        <li><a href="/races/${b.slug}" class="inline-block py-1.5 hover:text-white">${esc(b.name_fr)}</a></li>`).join('\n'),
    ...versions
};

function headMeta({ title, description, url, image, type = 'website' }) {
    return `    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="${type}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${url}">
    ${image ? `<meta property="og:image" content="${image}">` : ''}
    <meta property="og:locale" content="fr_FR">
    <meta property="og:site_name" content="Race de Chien">
    <meta name="twitter:card" content="summary_large_image">`;
}

function page({ head, body, scripts = '' }) {
    return fill(`<!DOCTYPE html>
<html lang="fr">
<head>
<!-- @head -->
${head}
</head>
<body class="bg-slate-50 font-sans antialiased text-slate-800">
    <div class="site-header"></div>
    <div class="h-[68px]" aria-hidden="true"></div>
${body}
<!-- @footer -->
${scripts}
    <script src="/js/header.js?v={{V_HEADER}}" defer></script>
</body>
</html>
`, commonVars);
}

// ============================================
// FICHE RACE
// ============================================

// Titre de fiche : le plus complet qui tient dans les 60 caractères affichés par Google
function breedTitle(n) {
    const names = [n, n.replace(/\s*\([^)]*\)/, '')];
    for (const x of names) {
        const t = [`${x} : caractère, éducation, santé et entretien`, `${x} : caractère, santé et entretien`, `${x} : caractère et santé`].find(t => t.length <= 60);
        if (t) return t;
    }
    return n;
}

// Questions fréquentes, réponses tirées des notes et mesures de la race
function faq(b) {
    const s = b.scores, p = b.physical || {}, n = b.name_fr, N = Le(n);
    const w = k => SCORE_META[k].words[s[k] - 1].toLowerCase();
    const out = [];
    const h = range(p.height_cm?.min, p.height_cm?.max, 'cm'), kg = range(p.weight_kg?.min, p.weight_kg?.max, 'kg');
    if (h || kg) out.push([`Quelle taille et quel poids pour ${le(n)} ?`, `${esc(N)} mesure ${h ? `${h} au garrot` : ''}${h && kg ? ' pour ' : ''}${kg}. C’est un chien ${{ toy: 'de très petite taille', small: 'de petite taille', medium: 'de taille moyenne', large: 'de grande taille', giant: 'de taille géante' }[p.size_category] || 'de taille moyenne'}.`]);
    const poils = [`Sa perte de poils est ${w('perte_poils')} et l’entretien de son poil est ${w('entretien_pelage')}.`];
    if (b.hypoallergenic) poils.push('Il fait partie des races qui perdent très peu de poils, souvent mieux tolérées par les personnes allergiques, sans garantie : passez du temps avec la race avant de vous décider.');
    else if (s.perte_poils >= 4) poils.push('Prévoyez un brossage plusieurs fois par semaine, et davantage pendant les mues de printemps et d’automne.');
    if (s.entretien_pelage >= 4) poils.push('Son poil demande un toilettage régulier, parfois chez un professionnel.');
    out.push([`${N} perd-il beaucoup de poils ?`, esc(poils.join(' '))]);
    const appart = {
        5: 'Oui, très bien : calme à l’intérieur, il s’adapte parfaitement à un appartement.',
        4: 'Oui, s’il sort plusieurs fois par jour : il s’adapte bien à un logement sans jardin.',
        3: 'C’est possible, à condition de lui offrir de vraies sorties chaque jour ; un jardin reste un plus.',
        2: 'C’est difficile : il a besoin d’espace et d’activité, un logement avec jardin lui convient mieux.',
        1: 'Ce n’est pas recommandé : il lui faut de l’espace, idéalement une maison avec jardin.'
    }[s.appartement];
    out.push([`${N} peut-il vivre en appartement ?`, esc(appart + (s.aboiements >= 4 ? ' Attention au voisinage : il aboie volontiers.' : ''))]);
    if (s.exercice_min_jour) out.push([`Combien de temps faut-il promener ${le(n)} ?`, esc(`Comptez environ ${s.exercice_min_jour} minutes d’activité par jour, pour une énergie ${w('energie')}.${s.energie >= 4 ? ' Ajoutez des jeux et des exercices d’éducation pour occuper aussi sa tête.' : ''}`)]);
    const kids = {
        5: 'Oui : patient et doux, c’est un excellent chien de famille, même avec de jeunes enfants.',
        4: 'Oui, il s’entend bien avec les enfants qui le respectent.',
        3: 'Correctement, plutôt avec des enfants assez grands pour respecter ses limites.',
        2: 'Avec prudence : il tolère mal l’agitation des jeunes enfants.',
        1: 'Il est déconseillé avec de jeunes enfants.'
    }[s.enfants];
    out.push([`${N} est-il adapté aux enfants ?`, esc(kids + ' Ne laissez jamais un jeune enfant seul avec un chien, quelle que soit sa race.')]);
    const life = range(p.life_span_years?.min, p.life_span_years?.max, 'ans');
    const lcFirst = x => (/^[A-ZÀ-Ý][a-zà-ÿ]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x);
    const issues = (b.health?.common_issues || []).slice(0, 2).map(x => lcFirst(x.split(/ \(|, /)[0]));
    if (life) out.push([`Quelle est l’espérance de vie ${/^[AEIOUYÉÈÊÂÎÔ]/i.test(n) ? 'de l’' : 'du '}${n} ?`, esc(`Elle est de ${life}, pour une robustesse ${w('robustesse')}.${issues.length ? ` Les problèmes de santé à surveiller en priorité : ${issues.join(' et ')}.` : ''}`)]);
    if (b.legal_category) out.push([`${N} est-il un chien catégorisé ?`, `${esc(LAW[b.legal_category])} <a href="/chiens-categorises" class="font-semibold text-primary-700 underline">Tout sur les chiens catégorisés</a>.`]);
    return out;
}

function breedPage(b) {
    const url = `${SITE_URL}/races/${b.slug}`;
    const s = b.scores;
    const p = b.physical || {};
    const who = forWho(b);
    const sims = similar(b);
    const groupLabel = b.fci?.group ? S.FCI_GROUPS[b.fci.group] : null;
    const gUrl = groupUrl(b.fci?.group);
    const word = k => SCORE_META[k].words[s[k] - 1].toLowerCase();
    const title = breedTitle(b.name_fr);
    const size = [range(p.height_cm?.min, p.height_cm?.max, 'cm'), range(p.weight_kg?.min, p.weight_kg?.max, 'kg')].filter(Boolean).join(', ');
    const description = clip(`${b.name_fr}, ${SIZE_WORD[p.size_category] || ''} chien ${fromOrigin(b.origin)}${size ? ` (${size})` : ''}. Énergie ${word('energie')}, ${word('enfants')} avec les enfants. Caractère, santé, entretien et 20 notes.`);
    const img = b.image ? `${SITE_URL}/${b.image.url}` : null;
    const ld = [{
        '@context': 'https://schema.org', '@type': 'Article', headline: `${b.name_fr} : fiche complète de la race`, description,
        image: img || undefined, author: { '@type': 'Organization', name: 'Race de Chien' },
        publisher: { '@type': 'Organization', name: 'Race de Chien', url: SITE_URL }, mainEntityOfPage: url,
        datePublished: '2026-02-28', dateModified: DATE
    }, {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Races de chiens', item: SITE_URL + '/' },
            ...(gUrl ? [{ '@type': 'ListItem', position: 2, name: groupLabel, item: SITE_URL + gUrl }] : []),
            { '@type': 'ListItem', position: gUrl ? 3 : 2, name: b.name_fr, item: url }
        ]
    }];

    const badges = [];
    if (b.lofRank) badges.push(`<span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">${ordinal(b.lofRank)} race en France · ${fmtInt(b.lof['2025'])} chiots LOF en 2025</span>`);
    if (b.legal_category) badges.push(`<span class="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">Chien de ${b.legal_category === '1' ? '1re' : '2e'} catégorie</span>`);
    if (b.hypoallergenic) badges.push('<span class="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Perd très peu de poils</span>');
    if (b.fci?.recognized === false) badges.push('<span class="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">Race non reconnue par la FCI</span>');
    if (b.fci?.scc_only) badges.push('<span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Reconnue par la SCC, pas encore par la FCI</span>');
    if (b.fci?.provisional) badges.push('<span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Reconnue à titre provisoire (FCI)</span>');

    const facts = [
        ['Taille au garrot', range(p.height_cm?.min, p.height_cm?.max, 'cm')],
        ['Poids', range(p.weight_kg?.min, p.weight_kg?.max, 'kg')],
        ['Espérance de vie', range(p.life_span_years?.min, p.life_span_years?.max, 'ans')],
        ['Activité par jour', `${s.exercice_min_jour} minutes`],
        ['Origine', b.origin],
        ['Groupe FCI', groupLabel ? `${b.fci.group} · ${groupLabel}` : (b.fci?.recognized === false ? 'Non reconnue' : b.breed_group)]
    ].filter(([, v]) => v);

    const coat = b.coat || {};
    const issues = b.health?.common_issues || [];
    const traits = b.temperament?.traits || [];
    const inSelections = SELECTIONS.filter(x => SELECTION_MEMBERS[x.slug].has(b.slug));

    const body = `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <nav class="pt-6 pb-4 text-sm text-slate-500" aria-label="Fil d'Ariane">
            <a href="/" class="hover:text-primary-600">Races de chiens</a>
            ${gUrl ? `<span class="mx-1.5" aria-hidden="true">›</span><a href="${gUrl}" class="hover:text-primary-600">${esc(groupLabel)}</a>` : ''}
            <span class="mx-1.5" aria-hidden="true">›</span><span class="text-slate-800" aria-current="page">${esc(b.name_fr)}</span>
        </nav>

        <article>
            <header class="grid gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-[1.15fr_1fr]">
                <div class="relative aspect-[4/3] bg-slate-100 lg:aspect-auto lg:min-h-[420px]">
                    ${picture(b, 'absolute inset-0 h-full w-full object-cover', { eager: true, big: true, sizes: SIZES_HERO, alt: `${b.name_fr}, chien de race` })}
                </div>
                <div class="flex flex-col justify-center p-6 lg:py-10 lg:pr-10">
                               <h1 class="display">${esc(b.name_fr)}</h1>
                    ${(b.name_alt || []).length ? `<p class="mt-1 text-sm text-slate-500">Aussi appelé ${b.name_alt.map(esc).join(', ')}</p>` : ''}
                    ${badges.length ? `<div class="mt-4 flex flex-wrap gap-2">${badges.join('')}</div>` : ''}
                    <dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                        ${facts.map(([k, v]) => `<div><dt class="text-[13px] text-slate-500">${k}</dt><dd class="mt-0.5 font-semibold text-slate-900">${esc(v)}</dd></div>`).join('')}
                    </dl>
                    <div class="mt-6 flex flex-wrap gap-2">
                        <a href="/quel-chien-choisir?race=${b.slug}" class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Est-il fait pour moi ?</a>
                        <button type="button" data-compare-one="${b.slug}" aria-pressed="false" class="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-primary-300 aria-pressed:border-primary-600 aria-pressed:bg-primary-50 aria-pressed:text-primary-800"><span data-off class="inline-flex items-center gap-2">${icon('plus', 'h-[18px] w-[18px]')}Comparer</span><span data-on hidden class="inline-flex items-center gap-2">${icon('check', 'h-[18px] w-[18px]')}Dans la comparaison</span></button>
                    </div>
                </div>
            </header>

            ${b.legal_category ? `<div class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-relaxed text-red-900"><p class="font-bold">Ce que dit la loi</p><p class="mt-1">${LAW[b.legal_category]}</p><p class="mt-2"><a class="underline" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F1839" target="_blank" rel="noopener">Les règles complètes sur service-public.gouv.fr</a></p></div>` : ''}
            ${b.fci?.recognized === false ? `<div class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">Cette race n’est pas reconnue par la Fédération cynologique internationale : aucun chiot ne peut être inscrit au LOF en France, et elle y est très rare. Les informations ci-dessous viennent des clubs étrangers qui la suivent.</div>` : ''}

            <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div class="min-w-0 space-y-10">
                    <section aria-labelledby="pour-qui">
                        <h2 id="pour-qui" class="text-2xl font-bold text-slate-900">Pour qui ?</h2>
                        <div class="mt-4 grid items-start gap-4 sm:grid-cols-2">
                            <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                                <p class="font-bold text-emerald-900">Idéal pour</p>
                                <ul class="mt-2 space-y-1.5 text-sm text-emerald-800">${(who.yes.length ? who.yes : ['un maître qui connaît bien la race']).map(x => `<li class="flex gap-2">${icon('check', 'mt-0.5 h-4 w-4 shrink-0 text-emerald-700')}<span>${esc(x)}</span></li>`).join('')}</ul>
                            </div>
                            <div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                                <p class="font-bold text-amber-900">Moins adapté pour</p>
                                <ul class="mt-2 space-y-1.5 text-sm text-amber-800">${(who.no.length ? who.no : ['peu de contre-indications : il s’adapte à beaucoup de foyers']).map(x => `<li class="flex gap-2">${icon('warning-circle', 'mt-0.5 h-4 w-4 shrink-0 text-amber-700')}<span>${esc(x)}</span></li>`).join('')}</ul>
                            </div>
                        </div>
                    </section>

                    <section aria-labelledby="presentation">
                        <h2 id="presentation" class="text-2xl font-bold text-slate-900">Présentation</h2>
                        <p class="mt-3 leading-relaxed text-slate-700">${esc(b.description)}</p>
                        ${traits.length ? `<div class="mt-4 flex flex-wrap gap-2">${traits.map(t => `<span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">${esc(t)}</span>`).join('')}</div>` : ''}
                    </section>

                    <section aria-labelledby="histoire">
                        <h2 id="histoire" class="text-2xl font-bold text-slate-900">Histoire et origines</h2>
                        <p class="mt-3 leading-relaxed text-slate-700">${esc(b.history)}</p>
                    </section>

                    <section aria-labelledby="sante">
                        <h2 id="sante" class="text-2xl font-bold text-slate-900">Santé</h2>
                        <p class="mt-3 leading-relaxed text-slate-700">Espérance de vie de ${range(p.life_span_years?.min, p.life_span_years?.max, 'ans')}, robustesse ${word('robustesse')}. ${issues.length ? 'Les affections les plus fréquentes dans la race :' : ''}</p>
                        ${issues.length ? `<ul class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">${issues.map(i => `<li class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700">${esc(i)}</li>`).join('')}</ul>` : ''}
                        <p class="mt-3 text-sm text-slate-500">Choisissez un éleveur qui fait pratiquer les dépistages de la race sur les parents, et demandez-en les résultats.</p>
                    </section>

                    <section aria-labelledby="entretien">
                        <h2 id="entretien" class="text-2xl font-bold text-slate-900">Poil et entretien</h2>
                        <p class="mt-3 leading-relaxed text-slate-700">Poil ${esc((coat.length || '').toLowerCase())}${coat.type ? `, ${esc(coat.type.toLowerCase())}` : ''}. Perte de poils ${word('perte_poils')}, entretien ${word('entretien_pelage')}.${(coat.colors || []).length ? ` Robes : ${coat.colors.map(esc).join(', ')}.` : ''}</p>
                    </section>
                </div>

                <aside class="order-first min-w-0 lg:order-none" aria-labelledby="bref">
                    <div class="rounded-3xl border border-slate-200 bg-white p-5 lg:sticky lg:top-[88px]">
                        <h2 id="bref" class="text-lg font-bold text-slate-900">En bref</h2>
                        <p class="mt-1 text-[13px] text-slate-500"><span class="font-semibold text-emerald-700">En vert</span> un atout, <span class="font-semibold text-amber-700">en orange</span> ce qu’il faut prévoir.</p>
                        <dl class="mt-4 grid grid-cols-2 gap-2">
                            ${KEY_SCORES.map(([k, ic, label]) => `<div class="rounded-2xl bg-slate-50 p-3">
                                <dt class="flex items-center gap-1.5 text-[13px] text-slate-500">${icon(ic, 'h-4 w-4 shrink-0')}${label}</dt>
                                <dd class="mt-1 text-[15px] font-bold leading-tight ${TONE[tone(k, s[k])].text}" data-ctx="${k}">${SCORE_META[k].words[s[k] - 1]}<span class="sr-only">, ${s[k]} sur 5</span></dd>
                                <dd class="mt-2">${gauge(k, s[k])}</dd>
                            </div>`).join('')}
                        </dl>
                        <a href="#notes" class="mt-4 flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:text-primary-700">Toutes ses notes${icon('arrow-down', 'h-4 w-4')}</a>
                    </div>
                </aside>
            </div>

            <div class="mt-12 space-y-12">

                <section aria-labelledby="notes" class="scroll-mt-24">
                    <h2 id="notes" class="text-2xl font-bold text-slate-900">Toutes ses notes</h2>
                    <p class="mt-2 text-sm text-slate-600">De 1 à 5, comparables d’une race à l’autre. En vert ce qui est un atout pour la plupart des foyers, en orange ce qu’il faut prévoir.</p>
                    <div class="mt-5 gap-4 sm:columns-2 lg:columns-3">
                        ${SCORE_GROUPS.map(([g, keys]) => `<div class="mb-4 break-inside-avoid rounded-2xl border border-slate-200 bg-white p-4">
                            <h3 class="text-sm font-bold text-slate-900">${g}</h3>
                            <dl class="mt-3 space-y-3">
                                ${keys.map(k => `<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1.5 text-sm">
                                    <dt class="text-slate-600">${SCORE_META[k].label}</dt>
                                    <dd class="text-right font-semibold ${TONE[tone(k, s[k])].text}" data-ctx="${k}">${SCORE_META[k].words[s[k] - 1]}<span class="sr-only">, ${s[k]} sur 5</span></dd>
                                    <dd class="col-span-2">${gauge(k, s[k])}</dd>
                                </div>`).join('')}
                            </dl>
                        </div>`).join('')}
                    </div>
                </section>

                ${inSelections.length ? `<section aria-labelledby="selections-race">
                    <h2 id="selections-race" class="text-2xl font-bold text-slate-900">Dans nos sélections</h2>
                    <ul class="mt-4 flex flex-wrap gap-2">${inSelections.map(x => `<li><a href="/selections/${x.slug}" class="opt">${icon(x.icon)}${esc(x.short)}</a></li>`).join('')}</ul>
                </section>` : ''}

                <section aria-labelledby="faq" class="max-w-3xl">
                    <h2 id="faq" class="text-2xl font-bold text-slate-900">Questions fréquentes sur ${esc(le(b.name_fr))}</h2>
                    <div class="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                        ${faq(b).map(([q, a]) => `<div class="p-5"><h3 class="font-bold text-slate-900">${esc(q).replace(/(\S+-(?:il|elle|on))\b/g, '<span class="whitespace-nowrap">$1</span>')}</h3><p class="mt-1.5 text-sm leading-relaxed text-slate-700">${a}</p></div>`).join('')}
                    </div>
                </section>
            </div>
        </article>

        <section class="mt-14" aria-labelledby="similaires">
            <h2 id="similaires" class="text-2xl font-bold text-slate-900">Races proches</h2>
            <p class="mt-1 text-sm text-slate-600">Même gabarit et notes voisines.${gUrl ? ` <a href="${gUrl}" class="inline-flex items-center gap-1 font-semibold text-primary-700 hover:underline">Toutes les races du groupe ${esc(groupLabel)}${icon('arrow-right', 'h-4 w-4')}</a>` : ''}</p>
            <ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            ${sims.map(o => staticCard(o)).join('')}
            </ul>
        </section>

        <section class="mt-14 grid gap-4 sm:grid-cols-2">
            <a href="/quel-chien-choisir" class="rounded-3xl bg-slate-900 p-6 text-white hover:bg-slate-800"><p class="flex items-center gap-2 text-lg font-bold">${icon('compass', 'h-6 w-6')}Quel chien pour moi ?</p><p class="mt-1 text-sm text-slate-300">8 questions sur votre vie, votre classement personnalisé en 45 secondes.</p></a>
            <a href="/tel-maitre-tel-chien" class="rounded-3xl border border-slate-200 bg-white p-6 hover:border-primary-300"><p class="flex items-center gap-2 text-lg font-bold text-slate-900">${icon('camera', 'h-6 w-6')}Tel Maître, Tel Chien</p><p class="mt-1 text-sm text-slate-600">Un selfie, et l’IA vous trouve votre sosie canin.</p></a>
        </section>
    </main>`;

    const script = `    <script>
    (function () {
        var KEY = 'rdc-compare', btn = document.querySelector('[data-compare-one]');
        if (!btn) return;
        var slug = btn.getAttribute('data-compare-one');
        function list() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
        function paint() { var on = list().indexOf(slug) >= 0; btn.querySelector('[data-off]').hidden = on; btn.querySelector('[data-on]').hidden = !on; btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
        btn.addEventListener('click', function () {
            var l = list(), i = l.indexOf(slug);
            if (i >= 0) l.splice(i, 1); else { if (l.length >= 3) l.shift(); l.push(slug); }
            try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {}
            paint();
            if (l.indexOf(slug) >= 0 && l.length >= 2) location.href = (window.RDCPath ? RDCPath('/compare') : '/compare') + '?races=' + l.join(',');
        });
        paint();
    })();
    </script>`;

    return page({
        head: headMeta({ title, description, url, image: img, type: 'article' }) + `\n    <script type="application/ld+json">${JSON.stringify(ld)}</script>`,
        body,
        scripts: script
    });
}

// ============================================
// PAGE DE SÉLECTION
// ============================================

function selectionPage(sel) {
    const url = `${SITE_URL}/selections/${sel.slug}`;
    const { top, avoid, state } = selectionResults(sel);
    // Le critère de la page ne revient pas dans « à prévoir »
    const SKIP = { logement: ['appartement'], seul: ['solitude'], rythme: ['energie'], enfants: ['enfants'], hypo: ['perte_poils'], chat: ['chats'], discret: ['aboiements'], chaleur: ['chaleur'], experience: ['education'] };
    const skip = Object.keys(sel.state).flatMap(k => SKIP[k] || []);
    const q = S.toQuery(state);
    const description = clip(`${sel.intro.split('. ')[0]}. ${sel.all ? `Les ${top.length} races, avec photos et notes.` : `Notre classement de ${top.length} races, avec les raisons.`}`);
    const ld = {
        '@context': 'https://schema.org', '@type': 'ItemList', name: sel.title,
        itemListElement: top.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/races/${r.breed.slug}`, name: r.breed.name_fr }))
    };
    const others = SELECTIONS.filter(x => x.slug !== sel.slug);
    const body = `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <nav class="pt-6 pb-4 text-sm text-slate-500" aria-label="Fil d'Ariane"><a href="/" class="hover:text-primary-600">Races de chiens</a><span class="mx-1.5" aria-hidden="true">›</span><span class="text-slate-800" aria-current="page">${esc(sel.short)}</span></nav>
        <header class="max-w-3xl">
            <h1 class="display">${esc(sel.title)}</h1>
            <p class="mt-3 leading-relaxed text-slate-700">${esc(sel.intro)}</p>
            <p class="mt-3 text-sm text-slate-500">Classement établi à partir de nos notes de 1 à 5 sur 20 critères, à jour du ${DATE_FR}.</p>
            <a href="/?${q}" class="mt-5 inline-flex rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-700">Affiner avec vos propres critères</a>
        </header>
        <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${top.map((r, i) => staticCard(r.breed, { facts: true, skip, h: 'h2', eager: i === 0, soon: i > 0 && i < 4 })).join('')}
        </ul>
        ${avoid.length ? `
        <section class="mt-14" aria-labelledby="eviter">
            <h2 id="eviter" class="text-2xl font-bold text-slate-900">${esc(sel.avoid)}</h2>
            <ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            ${avoid.map(r => staticCard(r.breed, { reasons: r.reasons.filter(x => !x.ok) })).join('')}
            </ul>
        </section>` : ''}
        <section class="mt-14 rounded-3xl border border-slate-200 bg-white p-6" aria-labelledby="autres">
            <h2 id="autres" class="text-lg font-bold text-slate-900">Autres sélections</h2>
            <ul class="mt-3 flex flex-wrap gap-2">${others.map(o => `<li><a href="/selections/${o.slug}" class="opt">${icon(o.icon)}${esc(o.short)}</a></li>`).join('')}</ul>
        </section>
    </main>`;
    return page({ head: headMeta({ title: withBrand(sel.seo || sel.title), description, url }) + ldTag([ld, crumbsLd([[sel.short, `/selections/${sel.slug}`]])]), body });
}

// ============================================
// SITEMAP & ROBOTS
// ============================================

function sitemap() {
    const file = u => (u === '/' ? 'index.html' : `${u.slice(1)}.html`);
    const urls = [
        ['/', '1.0', 'weekly'], ['/quel-chien-choisir', '0.9', 'monthly'], ['/liste-des-races', '0.8', 'monthly'], ['/groupes-de-races', '0.7', 'monthly'],
        ['/chiens-categorises', '0.7', 'yearly'], ['/compare', '0.6', 'monthly'], ['/tel-maitre-tel-chien', '0.8', 'monthly'],
        ...SELECTIONS.map(s => [`/selections/${s.slug}`, '0.8', 'monthly']),
        ...Object.values(GROUPS).map(G => [`/groupes/${G.slug}`, '0.7', 'monthly']),
        ...breeds.map(b => [`/races/${b.slug}`, '0.7', 'monthly', b]),
        ['/mentions-legales', '0.2', 'yearly'], ['/confidentialite', '0.2', 'yearly']
    ];
    const image = b => (b?.image ? `<image:image><image:loc>${SITE_URL}/${b.image.url}</image:loc></image:image>` : '');
    // Chaque page et ses versions dans les autres langues, liées entre elles
    const alt = u => {
        const a = L10N.map(L => [L.lang, L.routes[u]]).filter(([, x]) => x);
        return a.length ? [['fr', u], ...a, ['x-default', u]].map(([l, x]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${x}"/>`).join('') : '';
    };
    const entries = urls.flatMap(([u, pr, f, b]) => [[u, file(u), pr, f, b, u], ...L10N.filter(L => L.routes[u]).map(L => [L.routes[u], L.fileOf(L.routes[u]), pr, f, b, u])]);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(([u, fp, pr, f, b, fr]) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${lastmod[fp]?.d || TODAY}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority>${alt(fr)}${image(b)}</url>`).join('\n')}
</urlset>
`;
}

// ============================================
// GROUPES FCI (pages /groupes/...), LISTE DE A À Z, CHIENS CATÉGORISÉS
// ============================================

// Le groupe 4 (Teckels) ne compte qu'une race : pas de page dédiée, le fil d'Ariane renvoie à l'accueil
const GROUPS = {
    1: { slug: 'chiens-de-berger-et-bouviers', h1: 'Chiens de berger et de bouvier', title: 'Chiens de berger et bouviers',
         intro: 'Le groupe 1 de la FCI réunit les chiens nés pour conduire et garder les troupeaux : bergers allemands, belges et australiens, border collies, bouviers des Flandres… Intelligents, vifs et très attachés à leur maître, ils ont besoin d’activité physique et mentale chaque jour. Les bouviers suisses, plus massifs, sont classés dans le groupe 2.' },
    2: { slug: 'molosses-pinschers-et-bouviers-suisses', h1: 'Molosses, pinschers, schnauzers et bouviers suisses', title: 'Molosses, pinschers et bouviers suisses', seo: 'Molosses, pinschers et bouviers suisses : {n} races',
         intro: 'Le groupe 2 rassemble trois familles : les pinschers et schnauzers, les molossoïdes (dogues, mâtins et chiens de montagne comme le Terre-Neuve ou le Saint-Bernard) et les bouviers suisses. Souvent grands et puissants, ce sont d’anciens chiens de garde, de défense et de trait, calmes à la maison mais protecteurs.' },
    3: { slug: 'terriers', h1: 'Terriers', title: 'Terriers',
         intro: 'Les terriers ont été sélectionnés pour chasser les nuisibles et déloger le renard ou le blaireau de son terrier. Du minuscule Yorkshire au grand Airedale, ils partagent un caractère bien trempé : courageux, vifs, joueurs et parfois têtus. Leur instinct de chasse demande une éducation ferme et patiente.' },
    5: { slug: 'spitz-et-chiens-primitifs', h1: 'Spitz et chiens de type primitif', title: 'Spitz et chiens primitifs',
         intro: 'Le groupe 5 regroupe les spitz (chiens nordiques de traîneau comme le Husky ou le Malamute, spitz allemands, Shiba, Akita…) et les chiens de type primitif, restés proches de leurs ancêtres, comme le Basenji ou le Chien du Pharaon. Indépendants et souvent peu démonstratifs, ils demandent un maître patient.' },
    6: { slug: 'chiens-courants', h1: 'Chiens courants et chiens de recherche au sang', title: 'Chiens courants (chiens de chasse)',
         intro: 'Les chiens courants chassent en meute en suivant la piste du gibier à la voix ; les chiens de recherche au sang retrouvent le gibier blessé. Beagles, bassets, griffons, Saint-Hubert : ce sont des chiens de chasse sociables et endurants, guidés par leur flair, qui fuguent facilement dès qu’ils tiennent une piste.' },
    7: { slug: 'chiens-d-arret', h1: 'Chiens d’arrêt', title: 'Chiens d’arrêt', seo: 'Chiens d’arrêt : les {n} races (braques, setters, épagneuls)',
         intro: 'Les chiens d’arrêt s’immobilisent devant le gibier pour le signaler au chasseur. Braques, épagneuls bretons, setters et pointers sont des chiens de chasse doux, proches de leur famille, mais endurants et dynamiques : ils ont besoin d’espace et de longues sorties.' },
    8: { slug: 'rapporteurs-leveurs-et-chiens-d-eau', h1: 'Rapporteurs, leveurs de gibier et chiens d’eau', title: 'Retrievers, cockers et chiens d’eau', seo: 'Retrievers, cockers et chiens d’eau : les {n} races',
         intro: 'Le groupe 8 réunit les rapporteurs (Golden et Labrador retrievers), les leveurs de gibier (cockers, springers) et les chiens d’eau. Joyeux, faciles à éduquer et très sociables, ce sont parmi les meilleurs chiens de famille, à condition de leur offrir de l’exercice.' },
    9: { slug: 'chiens-de-compagnie', h1: 'Chiens d’agrément et de compagnie', title: 'Chiens de compagnie',
         intro: 'Les chiens d’agrément ou de compagnie ont été sélectionnés pour vivre auprès de l’homme : bichons, caniches, Cavalier King Charles, chihuahuas, bouledogues français… Souvent petits et affectueux, ils s’adaptent bien à l’appartement. Les races à museau écrasé supportent mal la chaleur et l’effort.' },
    10: { slug: 'levriers', h1: 'Lévriers', title: 'Lévriers',
         intro: 'Les lévriers chassent à vue grâce à leur vitesse : Whippet, Greyhound, Lévrier afghan, Barzoï… Étonnamment calmes à la maison, ils dorment beaucoup mais ont besoin de courir librement dans un espace clos, car leur instinct de poursuite est très fort.' }
};
const groupUrl = g => (GROUPS[g] ? `/groupes/${GROUPS[g].slug}` : null);
// Ordre alphabétique selon la langue de la page (les races rares, à égalité, se suivent par nom)
const FR_NAMES = { name: b => b.name_fr, locale: 'fr' };
const byPopularity = (N = FR_NAMES) => (a, b) => (b.lof?.['2025'] ?? 0) - (a.lof?.['2025'] ?? 0) || N.name(a).localeCompare(N.name(b), N.locale);
const groupBreeds = (g, N) => breeds.filter(b => b.fci?.group === g).sort(byPopularity(N));

function crumbs(items) {
    return `<nav class="pt-6 pb-4 text-sm text-slate-500" aria-label="Fil d'Ariane"><a href="/" class="hover:text-primary-600">Races de chiens</a>${items.map(([label, href]) => `<span class="mx-1.5" aria-hidden="true">›</span>${href ? `<a href="${href}" class="hover:text-primary-600">${esc(label)}</a>` : `<span class="text-slate-800" aria-current="page">${esc(label)}</span>`}`).join('')}</nav>`;
}
function crumbsLd(items) {
    const all = [['Races de chiens', '/'], ...items];
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: all.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE_URL + href })) };
}
const ldTag = ld => `\n    <script type="application/ld+json">${JSON.stringify(ld)}</script>`;

function groupPage(g, N) {
    const G = GROUPS[g];
    const list = groupBreeds(g, N);
    const url = `${SITE_URL}${groupUrl(g)}`;
    const title = (G.seo || `${G.title} : les {n} races (groupe ${g})`).replace('{n}', list.length);
    const description = clip(`${G.intro.split(/(?<=[.:]) /)[0]} Les ${list.length} races du groupe ${g} de la FCI, avec photos, caractère et notes.`);
    const others = Object.entries(GROUPS).filter(([k]) => Number(k) !== g);
    const ld = [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: G.h1, description, url,
        mainEntity: { '@type': 'ItemList', numberOfItems: list.length, itemListElement: list.map((b, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/races/${b.slug}`, name: b.name_fr })) } },
        crumbsLd([['Groupes de races', '/groupes-de-races'], [G.h1, groupUrl(g)]])];
    const body = `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        ${crumbs([['Groupes de races', '/groupes-de-races'], [G.h1]])}
        <header class="max-w-3xl">
            <h1 class="display">${esc(G.h1)}</h1>
            <p class="mt-3 leading-relaxed text-slate-700">${esc(G.intro)}</p>
            <p class="mt-3 text-sm text-slate-500">Groupe ${g} de la FCI, ${list.length} races, de la plus inscrite au LOF en 2025 à la plus rare.</p>
            <a href="/?groups=${g}" class="mt-5 inline-flex rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-700">Classer ces races selon votre vie</a>
        </header>
        <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${list.map((b, i) => staticCard(b, { facts: true, h: 'h2', eager: i === 0, soon: i > 0 && i < 4 })).join('')}
        </ul>
        <section class="mt-14 rounded-3xl border border-slate-200 bg-white p-6" aria-labelledby="autres-groupes">
            <h2 id="autres-groupes" class="text-lg font-bold text-slate-900">Les autres groupes</h2>
            <ul class="mt-4 flex flex-wrap gap-2">${others.map(([k, o]) => `<li><a href="/groupes/${o.slug}" class="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-primary-300 hover:text-primary-700">${esc(o.title)}</a></li>`).join('')}</ul>
        </section>
    </main>`;
    return page({ head: headMeta({ title: withBrand(title), description, url, image: list[0]?.image ? `${SITE_URL}/${list[0].image.url}` : null }) + ldTag(ld), body });
}

function groupsIndexPage() {
    const url = `${SITE_URL}/groupes-de-races`;
    const title = 'Les groupes de races de chiens (classification FCI)';
    const description = clip('Bergers, molosses, terriers, spitz, chiens de chasse, de compagnie, lévriers : les 10 groupes de la Fédération cynologique internationale et toutes leurs races.');
    const cards = Object.entries(GROUPS).map(([g, G]) => {
        const list = groupBreeds(Number(g));
        const lead = list[0];
        return `<li class="overflow-hidden rounded-2xl border border-slate-200 bg-white card-hover"><a href="/groupes/${G.slug}" class="flex gap-4 p-4">
            <div class="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">${lead?.image ? picture(lead, 'h-full w-full object-cover', { sizes: '112px', alt: '' }) : ''}</div>
            <div class="min-w-0"><h2 class="font-bold leading-snug text-slate-900">${esc(G.h1)}</h2><p class="mt-0.5 text-sm text-slate-500">Groupe ${g}, ${list.length} races : ${list.slice(0, 3).map(b => esc(b.name_fr)).join(', ')}…</p></div>
        </a></li>`;
    }).join('');
    const teckel = groupBreeds(4)[0];
    const body = `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        ${crumbs([['Groupes de races']])}
        <header class="max-w-3xl">
                       <h1 class="display">Les groupes de races de chiens</h1>
            <p class="mt-3 leading-relaxed text-slate-700">La Fédération cynologique internationale (FCI), à laquelle appartient la Société Centrale Canine, classe les races en 10 groupes selon leur fonction d’origine : garde des troupeaux, chasse, compagnie… Connaître le groupe d’une race, c’est déjà connaître une bonne part de son caractère.</p>
        </header>
        <ul class="mt-10 grid gap-4 md:grid-cols-2">${cards}</ul>
        ${teckel ? `<p class="mt-6 text-sm text-slate-600">Le groupe 4 ne compte qu’une race, avec ses variétés de taille et de poil : <a href="/races/${teckel.slug}" class="font-semibold text-primary-700 underline">le ${esc(teckel.name_fr)}</a>.</p>` : ''}
    </main>`;
    return page({ head: headMeta({ title: withBrand(title), description, url }) + ldTag(crumbsLd([['Groupes de races', '/groupes-de-races']])), body });
}

function azPage(N = FR_NAMES) {
    const url = `${SITE_URL}/liste-des-races`;
    const title = `Liste des races de chiens de A à Z : ${COUNT} races avec photos`;
    const description = clip(`Toutes les races de chiens de A à Z, avec photo, origine et groupe : ${COUNT} races décrites et notées sur 20 critères, des plus courantes aux plus rares.`);
    const letter = b => N.name(b).normalize('NFD').replace(/[\u0300-\u036f]/g, '')[0].toUpperCase();
    const byLetter = {};
    for (const b of breeds.slice().sort((a, c) => N.name(a).localeCompare(N.name(c), N.locale))) (byLetter[letter(b)] ||= []).push(b);
    const letters = Object.keys(byLetter).sort();
    const item = b => `<li><a href="/races/${b.slug}" class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 pr-3 hover:border-primary-300">
                <span class="h-14 w-[75px] shrink-0 overflow-hidden rounded-xl bg-slate-100">${b.image ? picture(b, 'h-full w-full object-cover', { sizes: '75px', alt: '' }) : ''}</span>
                <span class="min-w-0"><span class="block font-semibold leading-snug text-slate-900">${esc(b.name_fr)}</span><span class="block truncate text-xs text-slate-500">${esc(b.origin || '')}${b.fci?.group ? ` · ${esc(S.FCI_GROUPS[b.fci.group])}` : ''}</span></span>
            </a></li>`;
    const body = `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        ${crumbs([['Liste de A à Z']])}
        <header class="max-w-3xl">
                       <h1 class="display">Liste des races de chiens de A à Z</h1>
            <p class="mt-3 leading-relaxed text-slate-700">Les ${COUNT} races du site, par ordre alphabétique. Pour trouver celles qui vont avec votre vie, <a href="/" class="font-semibold text-primary-700 underline">classez-les selon vos critères</a> ou <a href="/quel-chien-choisir" class="font-semibold text-primary-700 underline">faites le test</a>.</p>
        </header>
        <nav class="sticky top-[68px] z-10 -mx-4 mt-6 border-y border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border" aria-label="Lettres">
            <ul class="no-scrollbar flex gap-1 overflow-x-auto">${letters.map(l => `<li><a href="#lettre-${l}" class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-slate-700 hover:bg-white hover:text-primary-700">${l}</a></li>`).join('')}</ul>
        </nav>
        ${letters.map(l => `<section class="mt-8 scroll-mt-32" id="lettre-${l}" aria-labelledby="h-${l}">
            <h2 id="h-${l}" class="text-2xl font-extrabold text-slate-900">${l}</h2>
            <ul class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">${byLetter[l].map(item).join('')}</ul>
        </section>`).join('')}
    </main>`;
    return page({ head: headMeta({ title: withBrand(title), description, url }) + ldTag(crumbsLd([['Liste de A à Z', '/liste-des-races']])), body });
}

function categorizedPage() {
    const url = `${SITE_URL}/chiens-categorises`;
    const title = 'Chiens de 1re et 2e catégorie : liste et obligations';
    const description = clip('Quels chiens sont classés en 1re ou 2e catégorie en France, et ce que la loi impose : permis de détention, muselière, assurance, stérilisation. La liste et les règles.');
    const cat = c => breeds.filter(b => b.legal_category === c);
    const body = `
    <main class="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        ${crumbs([['Chiens catégorisés']])}
        <article>
                       <h1 class="display">Chiens de 1re et 2e catégorie : la liste et les obligations</h1>
            <p class="mt-3 leading-relaxed text-slate-700">La loi du 6 janvier 1999 classe certains chiens jugés potentiellement dangereux en deux catégories, définies par l’arrêté du 27 avril 1999. Le classement dépend de la race et, pour les chiens sans pedigree, de leur apparence.</p>

            <section class="mt-10" aria-labelledby="cat1">
                <h2 id="cat1" class="text-2xl font-bold text-slate-900">1re catégorie : chiens d’attaque</h2>
                <p class="mt-3 leading-relaxed text-slate-700">Ce sont des chiens <strong>sans pedigree LOF</strong> dont l’apparence se rapproche du Staffordshire terrier ou de l’American Staffordshire terrier (les chiens souvent appelés « pit-bulls »), du Mastiff (« boerbulls ») ou du Tosa. Les races non reconnues en France, comme l’American Bully ou le Boerboel, y sont rattachées quand elles en ont l’apparence.</p>
                <ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">${cat('1').map(b => staticCard(b)).join('')}</ul>
            </section>

            <section class="mt-10" aria-labelledby="cat2">
                <h2 id="cat2" class="text-2xl font-bold text-slate-900">2e catégorie : chiens de garde et de défense</h2>
                <p class="mt-3 leading-relaxed text-slate-700">Ce sont les Staffordshire terriers, American Staffordshire terriers et Tosas <strong>inscrits au LOF</strong>, les Rottweilers avec ou sans pedigree, et les chiens sans pedigree d’apparence proche du Rottweiler. Le Staffordshire Bull Terrier, race différente, n’est pas catégorisé.</p>
                <ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">${cat('2').map(b => staticCard(b)).join('')}</ul>
            </section>

            <section class="mt-10" aria-labelledby="obligations">
                <h2 id="obligations" class="text-2xl font-bold text-slate-900">Ce que la loi impose</h2>
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                    <div class="rounded-2xl border border-slate-200 bg-white p-5">
                        <h3 class="font-bold text-slate-900">Pour les deux catégories</h3>
                        <ul class="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                            <li>• Un <strong>permis de détention</strong> délivré par la mairie, après une formation du maître et une évaluation comportementale du chien.</li>
                            <li>• Une <strong>assurance responsabilité civile</strong>, l’identification et la vaccination antirabique à jour.</li>
                            <li>• <strong>Muselière et laisse</strong> tenue par un majeur sur la voie publique et dans les parties communes des immeubles.</li>
                            <li>• Interdits aux mineurs, aux majeurs sous tutelle et aux personnes condamnées pour certains délits.</li>
                        </ul>
                    </div>
                    <div class="rounded-2xl border border-red-200 bg-red-50 p-5">
                        <h3 class="font-bold text-red-900">En plus pour la 1re catégorie</h3>
                        <ul class="mt-3 space-y-2 text-sm leading-relaxed text-red-950">
                            <li>• Acquisition, vente, don et importation <strong>interdits</strong>.</li>
                            <li>• <strong>Stérilisation obligatoire</strong>.</li>
                            <li>• Accès interdit aux transports en commun et aux lieux ouverts au public, sauf la voie publique ; stationnement interdit dans les parties communes des immeubles.</li>
                        </ul>
                    </div>
                </div>
                <p class="mt-5 text-sm text-slate-600">Ce résumé ne remplace pas les textes officiels. Les règles complètes et les démarches sont sur <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F1839" target="_blank" rel="noopener" class="font-semibold text-primary-700 underline">service-public.gouv.fr</a>.</p>
            </section>

            <section class="mt-10 rounded-3xl bg-slate-900 p-6 text-slate-300" aria-labelledby="alternatives">
                <h2 id="alternatives" class="text-xl font-bold text-white">Vous cherchez un chien protecteur sans ces contraintes ?</h2>
                <p class="mt-2 text-sm leading-relaxed">Notre sélection de <a href="/selections/chiens-de-garde" class="font-semibold text-white underline">chiens de garde non catégorisés</a> réunit les races à fort instinct de protection qui ne demandent pas de permis.</p>
            </section>
        </article>
    </main>`;
    const ld = [{ '@context': 'https://schema.org', '@type': 'Article', headline: title, description, url, mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'Race de Chien' }, publisher: { '@type': 'Organization', name: 'Race de Chien', url: SITE_URL }, dateModified: DATE },
        crumbsLd([['Chiens catégorisés', '/chiens-categorises']])];
    return page({ head: headMeta({ title: withBrand(title), description, url, type: 'article' }) + ldTag(ld), body });
}

// ============================================
// AUTRES LANGUES (i18n/<langue>/)
// ============================================

L10N = I18N.languages(ROOT).map(lang => I18N.load({ root: ROOT, siteUrl: SITE_URL, breeds, selections: SELECTIONS, groups: GROUPS }, lang));
// Chaque langue est régénérée en entier : on repart d'un dossier vide
for (const L of L10N) fs.rmSync(path.join(ROOT, L.routes['/'].slice(1)), { recursive: true, force: true });
const namesOf = L => ({ name: b => L.breedName[b.slug], locale: L.lang });
// Variantes d'une page pour chaque langue (rendu trié selon les noms traduits)
const variantsOf = render => Object.fromEntries(L10N.map(L => [L.lang, render(namesOf(L))]));
// Textes des scripts du navigateur : chaque T`…` de js/
const CLIENT_KEYS = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js') && !/^(icons|i18n\.)/.test(f))
    .flatMap(f => I18N.scanT(read(`js/${f}`), f));

// ============================================
// MAIN
// ============================================

// 1. Index léger pour l'accueil, le comparateur, le test et Tel Maître
const index = breeds.map(b => ({
    id: b.id, slug: b.slug, name: b.name, name_fr: b.name_fr, name_alt: b.name_alt || [], origin: b.origin, country_code: b.country_code,
    fci: { group: b.fci?.group ?? null, recognized: b.fci?.recognized !== false }, legal_category: b.legal_category || null,
    lof: { '2025': b.lof?.['2025'] ?? null }, physical: {
        size_category: b.physical.size_category, height_cm: b.physical.height_cm, weight_kg: b.physical.weight_kg, life_span_years: b.physical.life_span_years
    },
    coat: { length: b.coat?.length }, scores: b.scores, hypoallergenic: !!b.hypoallergenic, image: b.image || null, is_new: !!b.is_new
}));
write('data/breeds-index.json', JSON.stringify({ updated: TODAY, breeds: index }));
commonVars.V_DATA = hash('data/breeds-index.json');
// Même index par langue : name_fr y porte le nom affiché dans la langue de la page,
// le nom français rejoint les autres noms pour que la recherche le trouve aussi
const bySlug = Object.fromEntries(breeds.map(b => [b.slug, b]));
for (const L of L10N) {
    const idx = index.map(e => ({ ...e, name_fr: L.breedName[e.slug], name_alt: [...new Set([bySlug[e.slug].name_fr, ...e.name_alt])], origin: L.plain(e.origin, 'index des races') }));
    write(`data/breeds-index.${L.lang}.json`, JSON.stringify({ updated: TODAY, breeds: idx }));
    L.vData = hash(`data/breeds-index.${L.lang}.json`);
    write(`js/i18n.${L.lang}.js`, I18N.clientFile(L, CLIENT_KEYS));
    L.vClient = hash(`js/i18n.${L.lang}.js`);
}

// 2. Fiches (chacune liste les sélections où elle figure)
SELECTION_MEMBERS = Object.fromEntries(SELECTIONS.map(x => [x.slug, new Set(selectionResults(x).top.map(r => r.breed.slug))]));
fs.rmSync(path.join(ROOT, 'races'), { recursive: true, force: true });
for (const b of breeds) write(`races/${b.slug}.html`, breedPage(b));

// 3. Sélections
fs.rmSync(path.join(ROOT, 'selections'), { recursive: true, force: true });
for (const sel of SELECTIONS) write(`selections/${sel.slug}.html`, selectionPage(sel));

// 3 bis. Groupes FCI, liste de A à Z, chiens catégorisés
fs.rmSync(path.join(ROOT, 'groupes'), { recursive: true, force: true });
for (const g of Object.keys(GROUPS)) write(`groupes/${GROUPS[g].slug}.html`, groupPage(Number(g)), variantsOf(N => groupPage(Number(g), N)));
write('groupes-de-races.html', groupsIndexPage());
write('liste-des-races.html', azPage(), variantsOf(azPage));
write('chiens-categorises.html', categorizedPage());

// 4. Pages à partir des modèles
const selectionCards = SELECTIONS.map(s => {
    const { top } = selectionResults(s);
    return `                        <li><a href="/selections/${s.slug}" class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white hover:bg-white/20">${icon(s.icon, 'h-[18px] w-[18px] text-slate-300')}${esc(s.short)}<span class="tabular-nums text-slate-400">${top.length}</span></a></li>`;
}).join('\n');
const groupLinks = Object.entries(GROUPS).map(([g, G]) => `<li><a href="/groupes/${G.slug}" class="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-sm font-medium text-slate-200 hover:border-white/40 hover:text-white">${esc(G.title)}<span class="tabular-nums text-slate-400">${groupBreeds(Number(g)).length}</span></a></li>`).join('');
const noscript = breeds.map(b => `                            <li><a href="/races/${b.slug}">${esc(b.name_fr)}</a></li>`).join('\n');
// Boutons de profil écrits dans la page (le JS les redessine à l'identique) : la liste ne saute pas au chargement
// Tel Maître : cinq portraits de la collection en tête de page (le chien d'abord)
const TM_SLUGS = ['golden-retriever', 'bouledogue-francais', 'berger-australien', 'cavalier-king-charles-spaniel', 'chihuahua'];
const tmPortraits = TM_SLUGS.map(slug => breeds.find(b => b.slug === slug)).filter(b => b?.image).map((b, i) =>
    `<li class="h-[60px] w-[80px] overflow-hidden rounded-xl bg-slate-200 ring-4 ring-slate-50 sm:h-[72px] sm:w-[96px] ${i % 2 ? 'translate-y-1.5' : ''}"><img src="/${b.image.url.replace(/\.jpg$/, '-480.webp')}" alt="${esc(b.name_fr)}" width="96" height="72" class="h-full w-full object-cover"></li>`).join('');
// Ligne de tri telle que le script l'écrit pour l'état par défaut : rien ne bouge quand il prend la main
const sortHint = `<span class="hidden sm:inline">classées par popularité en France (LOF 2025)</span><span class="sm:hidden">classées par popularité en France (LOF 2025)</span>`;
const profileButtons = S.PROFILES.map(p => `<button type="button" class="opt" data-profile="${p.id}" aria-pressed="false">${icon(p.icon)}${esc(p.label)}</button>`).join('');
for (const f of fs.readdirSync(path.join(ROOT, 'templates/pages'))) {
    if (!f.endsWith('.html')) continue;
    const html = fill(read(`templates/pages/${f}`), { ...commonVars, SELECTION_CARDS: selectionCards, NOSCRIPT_LIST: noscript, PROFILE_BUTTONS: profileButtons, GROUP_LINKS: groupLinks, TM_PORTRAITS: tmPortraits, SORT_HINT: sortHint });
    write(f, html);
}

// 5. Sitemap et robots
write('sitemap.xml', sitemap());
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(ROOT, LASTMOD_FILE), JSON.stringify(Object.fromEntries(Object.entries(lastmod).sort()), null, 1) + '\n', 'utf8');

// 6. CSS compilé (après les pages : Tailwind lit les classes utilisées), puis numéro de version
execFileSync(path.join(ROOT, 'node_modules/.bin/tailwindcss'), ['-c', 'tailwind.config.cjs', '-i', 'css/tailwind.src.css', '-o', 'css/site.css', '--minify'], { cwd: ROOT, stdio: 'pipe' });
const vCss = hash('css/site.css');
for (const p of written.filter(p => p.endsWith('.html'))) {
    const full = path.join(ROOT, p);
    fs.writeFileSync(full, fs.readFileSync(full, 'utf8').split('__V_CSS__').join(vCss), 'utf8');
}

for (const L of L10N) {
    const r = L.report();
    console.log(`🌐 ${L.lang} : ${r.used} phrases traduites, ${r.missing} à traduire (i18n/${L.lang}/_a-traduire.json)`);
    for (const w of r.warnings.slice(0, 20)) console.warn(`   ⚠️  ${w}`);
}
console.log(`✅ ${breeds.length} fiches, ${SELECTIONS.length} sélections, ${written.filter(p => !p.includes('/')).length} pages, CSS ${(fs.statSync(path.join(ROOT, 'css/site.css')).size / 1024).toFixed(0)} Ko`);
