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
const write = (p, s) => {
    fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, p), s, 'utf8');
    written.push(p);
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
    good: { text: 'text-emerald-700', bar: 'bg-emerald-500' },
    mid: { text: 'text-slate-800', bar: 'bg-slate-400' },
    watch: { text: 'text-amber-700', bar: 'bg-amber-500' },
    neutral: { text: 'text-slate-800', bar: 'bg-primary-500' }
};
function gauge(k, v, cls = '') {
    const t = TONE[tone(k, v)];
    return `<span class="gauge ${cls}" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? t.bar : ''}"></i>`).join('')}</span>`;
}
// Les 8 notes qui pèsent le plus dans le choix, résumées en tête de fiche
const KEY_SCORES = [
    ['energie', '⚡', 'Énergie'], ['enfants', '👶', 'Enfants'], ['appartement', '🏢', 'Appartement'], ['solitude', '🏠', 'Seul à la maison'],
    ['premier_chien', '🌱', 'Premier chien'], ['chats', '🐈', 'Avec les chats'], ['aboiements', '🔊', 'Aboiements'], ['perte_poils', '🧹', 'Perte de poils']
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
        return `<div class="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary-50 via-white to-secondary-50 text-slate-400 ${opts.box || ''}"><span class="${opts.big ? 'text-7xl' : 'text-4xl'}" aria-hidden="true">🐾</span><span class="text-xs font-semibold uppercase tracking-wider">Photo à venir</span></div>`;
    }
    const src = `/${b.image.url}`;
    const load = opts.eager ? 'fetchpriority="high"' : opts.soon ? '' : 'loading="lazy"';
    return `<picture><source srcset="${srcset(b)}" sizes="${opts.sizes || SIZES_CARD}" type="image/webp"><img src="${src}" alt="${esc(opts.alt ?? b.name_fr)}" width="${b.image.width}" height="${b.image.height}" class="${cls}" ${load} decoding="async"></picture>`;
}

function staticCard(b, extra = {}) {
    const h = extra.h || 'h3';
    const pct = extra.pct != null ? `<span class="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-sm font-extrabold shadow ${extra.pct >= 75 ? 'text-emerald-700' : extra.pct >= 55 ? 'text-amber-700' : 'text-slate-500'}">${extra.pct} %</span>` : '';
    const reasons = (extra.reasons || []).slice(0, 4).map(x => `<span class="${x.ok ? 'chip-ok' : 'chip-ko'}">${x.ok ? '✓ ' : ''}${esc(x.text)}</span>`).join('');
    const law = b.legal_category ? `<span class="chip-law">Catégorie ${esc(b.legal_category)}</span>` : '';
    return `<li class="group overflow-hidden rounded-2xl border border-slate-200 bg-white card-hover">
                <a href="/races/${b.slug}" class="block">
                    <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">${picture(b, 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105', { eager: extra.eager, soon: extra.soon })}${pct}</div>
                    <div class="p-4">
                        <${h} class="text-[17px] font-bold leading-snug text-slate-900">${esc(b.name_fr)}</${h}>
                        <p class="mt-0.5 text-sm text-slate-500">${esc(b.origin || '')}${b.fci?.group ? ` · ${esc(S.FCI_GROUPS[b.fci.group])}` : ''}</p>
                        ${extra.note ? `<p class="mt-2 text-sm text-slate-600">${esc(extra.note)}</p>` : ''}
                        ${reasons || law ? `<div class="mt-3 flex flex-wrap gap-1.5">${law}${reasons}</div>` : ''}
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
// PARTIALS ET VERSIONS
// ============================================

const versions = {
    V_SCORING: hash('js/scoring.js'),
    V_APP: hash('js/app.js'),
    V_HEADER: hash('js/header.js'),
    V_COMPARE: fs.existsSync(path.join(ROOT, 'js/compare.js')) ? hash('js/compare.js') : '1',
    V_QUIZ: fs.existsSync(path.join(ROOT, 'js/quiz.js')) ? hash('js/quiz.js') : '1',
    V_TELMAITRE: hash('js/tel-maitre.js'),
    V_CSS: '__V_CSS__'
};

// ============================================
// SÉLECTIONS THÉMATIQUES (pages /selections/...)
// ============================================

const SELECTIONS = [
    { slug: 'chiens-pour-appartement', short: 'Chiens pour appartement', icon: '🏢', state: { logement: 'appart' },
      title: 'Chiens pour appartement : les races qui s’y plaisent vraiment',
      intro: 'Un chien peut être heureux en appartement si ses besoins d’activité sont couverts dehors. Nous avons classé les races selon leur adaptation à un logement sans jardin : calme à l’intérieur, aboiements, taille, besoin d’espace.',
      avoid: 'Les races qui supportent le moins un appartement' },
    { slug: 'chiens-calmes', short: 'Chiens calmes et pantouflards', icon: '🛋️', state: { rythme: 1 },
      title: 'Races de chiens calmes et pantouflards',
      intro: 'Vous rêvez d’un compagnon de canapé plutôt que d’un athlète ? Voici les races les moins énergiques, qui se contentent de promenades tranquilles et adorent la sieste.',
      avoid: 'Les races les plus énergiques' },
    { slug: 'chiens-pour-enfants', short: 'Chiens pour enfants', icon: '👶', state: { enfants: 'jeunes' },
      title: 'Chiens pour enfants : les races les plus douces en famille',
      intro: 'Patience, tolérance aux câlins un peu maladroits, absence d’agressivité : certaines races sont réputées pour leur douceur avec les petits. Aucune race ne dispense de surveiller un enfant avec un chien.',
      avoid: 'Les races à éviter avec de jeunes enfants' },
    { slug: 'chiens-qui-perdent-peu-de-poils', short: 'Chiens qui perdent peu de poils', icon: '🤧', state: { hypo: true },
      title: 'Chiens qui perdent peu de poils : les races conseillées aux personnes allergiques',
      intro: 'Aucun chien n’est vraiment hypoallergénique : l’allergie vient de protéines présentes dans la salive et les squames. Les races à poil qui pousse en continu (caniches, bichons, schnauzers…) perdent très peu de poils et sont souvent mieux tolérées. Passez du temps avec la race avant de vous décider.' },
    { slug: 'chiens-pour-personnes-agees', short: 'Chiens pour personnes âgées', icon: '🧓', state: { rythme: 2, experience: 'premier', sizes: [1, 2, 3] },
      title: 'Chiens pour personnes âgées : calmes, faciles et pas trop grands',
      intro: 'Pour une retraite paisible, mieux vaut un chien calme, facile à éduquer, de petite ou moyenne taille, qui ne tire pas en laisse. Notre sélection croise ces critères.' },
    { slug: 'chiens-qui-supportent-la-solitude', short: 'Chiens qui supportent la solitude', icon: '⏰', state: { seul: 'long' },
      title: 'Chiens qui supportent la solitude : les races les plus indépendantes',
      intro: 'Aucun chien n’est fait pour rester seul huit heures par jour tous les jours. Certaines races, plus indépendantes, vivent cependant mieux les absences. Pensez aussi au promeneur ou à la garderie.',
      avoid: 'Les races qui vivent le plus mal la solitude' },
    { slug: 'chiens-sportifs', short: 'Chiens sportifs', icon: '🏃', state: { rythme: 5 },
      title: 'Chiens sportifs : les meilleures races pour courir et randonner',
      intro: 'Canicross, trail, randonnée, vélo : ces races ont l’endurance et l’envie de vous suivre. Elles demandent en retour une à deux heures d’activité par jour et de la stimulation mentale.' },
    { slug: 'premier-chien', short: 'Pour un premier chien', icon: '🐣', state: { experience: 'premier' },
      title: 'Premier chien : les races les plus faciles à vivre',
      intro: 'Facile à éduquer, bonne humeur, peu de comportements difficiles : ces races pardonnent les erreurs de débutant. Une éducation positive dès l’arrivée du chiot reste indispensable.',
      avoid: 'Les races déconseillées pour un premier chien' },
    { slug: 'chiens-qui-aboient-peu', short: 'Chiens qui aboient peu', icon: '🤫', state: { discret: true },
      title: 'Chiens qui aboient peu : les races les plus discrètes',
      intro: 'Pour un immeuble ou des voisins proches, certaines races sont nettement plus silencieuses que d’autres. L’éducation et l’activité comptent aussi beaucoup : un chien qui s’ennuie aboie.' },
    { slug: 'races-francaises', short: 'Races françaises', icon: '🇫🇷', state: { france: true },
      title: 'Les races de chiens françaises',
      intro: 'La France compte une cinquantaine de races reconnues : bergers, braques, épagneuls, chiens courants, molosses et chiens de compagnie. Les voici, de la plus inscrite au LOF à la plus rare.' },
    { slug: 'petits-chiens', short: 'Petits chiens', icon: '🐕', state: { sizes: [1, 2] },
      title: 'Petits chiens : toutes les races de petite taille',
      intro: 'Moins de 40 cm au garrot : des chiens faciles à emmener partout. Petit ne veut pas dire calme : beaucoup de terriers débordent d’énergie.' },
    { slug: 'chiens-de-garde', short: 'Chiens de garde', icon: '🛡️', state: { nocat: true },
      custom: b => ({ pct: Math.round(((b.scores.garde - 1) / 4) * 100), ok: b.scores.garde >= 4 }),
      title: 'Chiens de garde : les races à fort instinct de protection',
      intro: 'Un bon chien de garde prévient plus qu’il n’attaque. Ces races ont un instinct de protection marqué ; elles demandent une socialisation précoce et un maître ferme et juste. Nous excluons les chiens catégorisés.' },
    { slug: 'chiens-qui-supportent-la-chaleur', short: 'Chiens qui supportent la chaleur', icon: '☀️', state: { chaleur: true },
      title: 'Chiens qui supportent la chaleur : les races pour le Sud',
      intro: 'Poil court, museau long, silhouette fine : certaines races encaissent mieux les étés chauds. À l’inverse, les chiens à museau écrasé souffrent vite. Promenades tôt le matin et eau fraîche restent la règle.',
      avoid: 'Les races qui craignent le plus la chaleur' },
    { slug: 'chiens-et-chats', short: 'Chiens qui s’entendent avec les chats', icon: '🐱', state: { chat: true },
      title: 'Chiens qui s’entendent avec les chats',
      intro: 'Les races au faible instinct de chasse cohabitent plus facilement avec un chat, surtout si elles le côtoient dès le plus jeune âge.',
      avoid: 'Les races à éviter avec un chat' }
];

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
    return { top: top.slice(0, 24), total: top.length, avoid, state };
}

// ============================================
// TEMPLATES DE PAGES
// ============================================

function fill(tpl, vars) {
    let html = tpl
        .replace('<!-- @head -->', read('templates/partials/head.html'))
        .replace('<!-- @footer -->', read('templates/partials/footer.html'));
    for (const [k, v] of Object.entries(vars)) html = html.split(`{{${k}}}`).join(v);
    return html;
}

const commonVars = {
    COUNT: String(COUNT),
    UPDATED: TODAY,
    SELECTION_LINKS: SELECTIONS.slice(0, 7).map(s => `                        <li><a href="/selections/${s.slug}" class="hover:text-white">${esc(s.short)}</a></li>`).join('\n'),
    POPULAR_LINKS: popular.slice(0, 7).map(b => `                        <li><a href="/races/${b.slug}" class="hover:text-white">${esc(b.name_fr)}</a></li>`).join('\n'),
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
    <script src="/js/header.js?v={{V_HEADER}}"></script>
</body>
</html>
`, commonVars);
}

// ============================================
// FICHE RACE
// ============================================

function breedPage(b) {
    const url = `${SITE_URL}/races/${b.slug}`;
    const s = b.scores;
    const p = b.physical || {};
    const who = forWho(b);
    const sims = similar(b);
    const groupLabel = b.fci?.group ? S.FCI_GROUPS[b.fci.group] : null;
    const word = k => SCORE_META[k].words[s[k] - 1].toLowerCase();
    const title = `${b.name_fr} : caractère, éducation, santé et entretien | Race de Chien`;
    const description = `${b.name_fr}, ${SIZE_WORD[p.size_category] || ''} chien ${fromOrigin(b.origin)}. Énergie ${word('energie')}, ${word('enfants')} avec les enfants, ${word('appartement').replace('bien', 'à l’aise')} en appartement. Notes sur 20 critères, santé, entretien.`.replace(/\s+/g, ' ').slice(0, 300);
    const img = b.image ? `${SITE_URL}/${b.image.url}` : null;
    const ld = [{
        '@context': 'https://schema.org', '@type': 'Article', headline: `${b.name_fr} : fiche complète de la race`, description,
        image: img || undefined, author: { '@type': 'Organization', name: 'Race de Chien' },
        publisher: { '@type': 'Organization', name: 'Race de Chien', url: SITE_URL }, mainEntityOfPage: url,
        datePublished: '2026-02-28', dateModified: TODAY
    }, {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Races de chiens', item: SITE_URL + '/' },
            ...(groupLabel ? [{ '@type': 'ListItem', position: 2, name: groupLabel, item: `${SITE_URL}/?groups=${b.fci.group}` }] : []),
            { '@type': 'ListItem', position: groupLabel ? 3 : 2, name: b.name_fr, item: url }
        ]
    }];

    const badges = [];
    if (b.lofRank) badges.push(`<span class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">${ordinal(b.lofRank)} race en France · ${fmtInt(b.lof['2025'])} chiots LOF en 2025</span>`);
    if (b.legal_category) badges.push(`<span class="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Chien de ${b.legal_category === '1' ? '1re' : '2e'} catégorie</span>`);
    if (b.hypoallergenic) badges.push('<span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Perd très peu de poils</span>');
    if (b.fci?.recognized === false) badges.push('<span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Race non reconnue par la FCI</span>');
    if (b.fci?.scc_only) badges.push('<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Reconnue par la SCC, pas encore par la FCI</span>');
    if (b.fci?.provisional) badges.push('<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Reconnue à titre provisoire (FCI)</span>');

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

    const body = `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <nav class="pt-6 pb-4 text-sm text-slate-500" aria-label="Fil d'Ariane">
            <a href="/" class="hover:text-primary-600">Races de chiens</a>
            ${groupLabel ? `<span class="mx-1.5" aria-hidden="true">›</span><a href="/?groups=${b.fci.group}" class="hover:text-primary-600">${esc(groupLabel)}</a>` : ''}
            <span class="mx-1.5" aria-hidden="true">›</span><span class="text-slate-800" aria-current="page">${esc(b.name_fr)}</span>
        </nav>

        <article>
            <header class="grid gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-[1.15fr_1fr]">
                <div class="relative aspect-[4/3] bg-slate-100 lg:aspect-auto lg:min-h-[420px]">
                    ${picture(b, 'absolute inset-0 h-full w-full object-cover', { eager: true, big: true, sizes: SIZES_HERO, alt: `${b.name_fr}, chien de race` })}
                </div>
                <div class="flex flex-col justify-center p-6 lg:py-10 lg:pr-10">
                    <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">${esc(b.name_fr)}</h1>
                    ${(b.name_alt || []).length ? `<p class="mt-1 text-sm text-slate-500">Aussi appelé ${b.name_alt.map(esc).join(', ')}</p>` : ''}
                    ${badges.length ? `<div class="mt-4 flex flex-wrap gap-2">${badges.join('')}</div>` : ''}
                    <dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                        ${facts.map(([k, v]) => `<div><dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">${k}</dt><dd class="mt-0.5 font-semibold text-slate-900">${esc(v)}</dd></div>`).join('')}
                    </dl>
                    <div class="mt-6 flex flex-wrap gap-2">
                        <a href="/quel-chien-choisir?race=${b.slug}" class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Est-il fait pour moi ?</a>
                        <button type="button" data-compare-one="${b.slug}" class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-primary-300">+ Comparer</button>
                    </div>
                </div>
            </header>

            ${b.legal_category ? `<div class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-relaxed text-red-900"><p class="font-bold">Ce que dit la loi</p><p class="mt-1">${LAW[b.legal_category]}</p><p class="mt-2"><a class="underline" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F1839" target="_blank" rel="noopener">Les règles complètes sur service-public.gouv.fr</a></p></div>` : ''}
            ${b.fci?.recognized === false ? `<div class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">Cette race n’est pas reconnue par la Fédération cynologique internationale : aucun chiot ne peut être inscrit au LOF en France, et elle y est très rare. Les informations ci-dessous viennent des clubs étrangers qui la suivent.</div>` : ''}

            <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div class="min-w-0 space-y-10">
                    <section aria-labelledby="pour-qui">
                        <h2 id="pour-qui" class="text-2xl font-bold text-slate-900">Pour qui ?</h2>
                        <div class="mt-4 grid gap-4 sm:grid-cols-2">
                            <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                                <p class="font-bold text-emerald-900">Idéal pour</p>
                                <ul class="mt-2 space-y-1.5 text-sm text-emerald-950">${(who.yes.length ? who.yes : ['un maître qui connaît bien la race']).map(x => `<li class="flex gap-2"><span aria-hidden="true">✓</span><span>${esc(x)}</span></li>`).join('')}</ul>
                            </div>
                            <div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                                <p class="font-bold text-amber-900">Moins adapté pour</p>
                                <ul class="mt-2 space-y-1.5 text-sm text-amber-950">${(who.no.length ? who.no : ['peu de contre-indications : il s’adapte à beaucoup de foyers']).map(x => `<li class="flex gap-2"><span aria-hidden="true">!</span><span>${esc(x)}</span></li>`).join('')}</ul>
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
                        ${issues.length ? `<ul class="mt-3 grid gap-2 sm:grid-cols-2">${issues.map(i => `<li class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700">${esc(i)}</li>`).join('')}</ul>` : ''}
                        <p class="mt-3 text-sm text-slate-500">Choisissez un éleveur qui fait pratiquer les dépistages de la race sur les parents, et demandez-en les résultats.</p>
                    </section>

                    <section aria-labelledby="entretien">
                        <h2 id="entretien" class="text-2xl font-bold text-slate-900">Poil et entretien</h2>
                        <p class="mt-3 leading-relaxed text-slate-700">Poil ${esc((coat.length || '').toLowerCase())}${coat.type ? `, ${esc(coat.type.toLowerCase())}` : ''}. Perte de poils ${word('perte_poils')}, entretien ${word('entretien_pelage')}.${(coat.colors || []).length ? ` Robes : ${coat.colors.map(esc).join(', ')}.` : ''}</p>
                    </section>

                    <section aria-labelledby="notes" class="scroll-mt-24">
                        <h2 id="notes" class="text-2xl font-bold text-slate-900">Toutes ses notes</h2>
                        <p class="mt-2 text-sm text-slate-600">De 1 à 5, comparables d’une race à l’autre. En vert ce qui est un atout pour la plupart des foyers, en orange ce qu’il faut prévoir.</p>
                        <div class="mt-5 gap-4 sm:columns-2">
                            ${SCORE_GROUPS.map(([g, keys]) => `<div class="mb-4 break-inside-avoid rounded-2xl border border-slate-200 bg-white p-4">
                                <h3 class="text-sm font-bold text-slate-900">${g}</h3>
                                <dl class="mt-3 space-y-3">
                                    ${keys.map(k => `<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1.5 text-sm">
                                        <dt class="text-slate-600">${SCORE_META[k].label}</dt>
                                        <dd class="text-right font-semibold ${TONE[tone(k, s[k])].text}">${SCORE_META[k].words[s[k] - 1]}<span class="sr-only">, ${s[k]} sur 5</span></dd>
                                        <dd class="col-span-2">${gauge(k, s[k])}</dd>
                                    </div>`).join('')}
                                </dl>
                            </div>`).join('')}
                        </div>
                    </section>
                </div>

                <aside class="order-first min-w-0 lg:order-none" aria-labelledby="bref">
                    <div class="rounded-3xl border border-slate-200 bg-white p-5 lg:sticky lg:top-[88px]">
                        <h2 id="bref" class="text-lg font-bold text-slate-900">En bref</h2>
                        <p class="mt-1 text-xs text-slate-500"><span class="font-semibold text-emerald-700">En vert</span> un atout, <span class="font-semibold text-amber-700">en orange</span> ce qu’il faut prévoir.</p>
                        <dl class="mt-4 grid grid-cols-2 gap-2">
                            ${KEY_SCORES.map(([k, icon, label]) => `<div class="rounded-2xl bg-slate-50 p-3">
                                <dt class="flex items-center gap-1.5 text-xs font-medium text-slate-500"><span aria-hidden="true">${icon}</span>${label}</dt>
                                <dd class="mt-1 text-[15px] font-bold leading-tight ${TONE[tone(k, s[k])].text}">${SCORE_META[k].words[s[k] - 1]}<span class="sr-only">, ${s[k]} sur 5</span></dd>
                                <dd class="mt-2">${gauge(k, s[k])}</dd>
                            </div>`).join('')}
                        </dl>
                        <a href="#notes" class="mt-4 flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:text-primary-700">Toutes ses notes <span aria-hidden="true">↓</span></a>
                    </div>
                </aside>
            </div>
        </article>

        <section class="mt-14" aria-labelledby="similaires">
            <h2 id="similaires" class="text-2xl font-bold text-slate-900">Races proches</h2>
            <p class="mt-1 text-sm text-slate-600">Même gabarit et notes voisines.</p>
            <ul class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            ${sims.map(o => staticCard(o)).join('')}
            </ul>
        </section>

        <section class="mt-14 grid gap-4 sm:grid-cols-2">
            <a href="/quel-chien-choisir" class="rounded-3xl bg-slate-900 p-6 text-white hover:bg-slate-800"><p class="text-lg font-bold">🧭 Quel chien est fait pour moi ?</p><p class="mt-1 text-sm text-slate-300">8 questions sur votre vie, votre classement personnalisé en 45 secondes.</p></a>
            <a href="/tel-maitre-tel-chien" class="rounded-3xl border border-slate-200 bg-white p-6 hover:border-primary-300"><p class="text-lg font-bold text-slate-900">📸 À quelle race je ressemble ?</p><p class="mt-1 text-sm text-slate-600">Un selfie, et l’IA vous trouve votre sosie canin.</p></a>
        </section>
    </main>`;

    const script = `    <script>
    (function () {
        var KEY = 'rdc-compare', btn = document.querySelector('[data-compare-one]');
        if (!btn) return;
        var slug = btn.getAttribute('data-compare-one');
        function list() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
        function paint() { var on = list().indexOf(slug) >= 0; btn.textContent = on ? '✓ Dans la comparaison' : '+ Comparer'; btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
        btn.addEventListener('click', function () {
            var l = list(), i = l.indexOf(slug);
            if (i >= 0) l.splice(i, 1); else { if (l.length >= 3) l.shift(); l.push(slug); }
            try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {}
            paint();
            if (l.indexOf(slug) >= 0 && l.length >= 2) location.href = '/compare?races=' + l.join(',');
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
    const q = S.toQuery(state);
    const description = `${sel.intro.split('. ')[0]}. Notre classement de ${top.length} races, avec les raisons pour chacune.`.slice(0, 300);
    const ld = {
        '@context': 'https://schema.org', '@type': 'ItemList', name: sel.title,
        itemListElement: top.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/races/${r.breed.slug}`, name: r.breed.name_fr }))
    };
    const others = SELECTIONS.filter(x => x.slug !== sel.slug);
    const body = `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <nav class="pt-6 pb-4 text-sm text-slate-500" aria-label="Fil d'Ariane"><a href="/" class="hover:text-primary-600">Races de chiens</a><span class="mx-1.5" aria-hidden="true">›</span><span class="text-slate-800" aria-current="page">${esc(sel.short)}</span></nav>
        <header class="max-w-3xl">
            <p class="text-4xl" aria-hidden="true">${sel.icon}</p>
            <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">${esc(sel.title)}</h1>
            <p class="mt-3 leading-relaxed text-slate-700">${esc(sel.intro)}</p>
            <p class="mt-3 text-sm text-slate-500">Classement établi à partir de nos notes de 1 à 5 sur 20 critères, à jour du ${TODAY.split('-').reverse().join('/')}.</p>
            <a href="/?${q}" class="mt-5 inline-flex rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-700">Affiner avec vos propres critères</a>
        </header>
        <ul class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${top.map((r, i) => staticCard(r.breed, { pct: r.pct, reasons: r.reasons, h: 'h2', eager: i === 0, soon: i > 0 && i < 4 })).join('')}
        </ul>
        ${avoid.length ? `
        <section class="mt-14" aria-labelledby="eviter">
            <h2 id="eviter" class="text-2xl font-bold text-slate-900">${esc(sel.avoid)}</h2>
            <ul class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            ${avoid.map(r => staticCard(r.breed, { pct: r.pct, reasons: r.reasons })).join('')}
            </ul>
        </section>` : ''}
        <section class="mt-14 rounded-3xl border border-slate-200 bg-white p-6" aria-labelledby="autres">
            <h2 id="autres" class="text-lg font-bold text-slate-900">Autres sélections</h2>
            <ul class="mt-3 flex flex-wrap gap-2">${others.map(o => `<li><a href="/selections/${o.slug}" class="opt">${o.icon} ${esc(o.short)}</a></li>`).join('')}</ul>
        </section>
    </main>`;
    return page({ head: headMeta({ title: `${sel.title} | Race de Chien`, description, url }) + `\n    <script type="application/ld+json">${JSON.stringify(ld)}</script>`, body });
}

// ============================================
// SITEMAP & ROBOTS
// ============================================

function sitemap() {
    const urls = [
        ['/', '1.0', 'weekly'], ['/quel-chien-choisir', '0.9', 'monthly'], ['/compare', '0.6', 'monthly'], ['/tel-maitre-tel-chien', '0.8', 'monthly'],
        ...SELECTIONS.map(s => [`/selections/${s.slug}`, '0.8', 'monthly']),
        ...breeds.map(b => [`/races/${b.slug}`, '0.7', 'monthly']),
        ['/mentions-legales', '0.2', 'yearly'], ['/confidentialite', '0.2', 'yearly']
    ];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, pr, f]) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${TODAY}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`;
}

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

// 2. Fiches
fs.rmSync(path.join(ROOT, 'races'), { recursive: true, force: true });
for (const b of breeds) write(`races/${b.slug}.html`, breedPage(b));

// 3. Sélections
fs.rmSync(path.join(ROOT, 'selections'), { recursive: true, force: true });
for (const sel of SELECTIONS) write(`selections/${sel.slug}.html`, selectionPage(sel));

// 4. Pages à partir des modèles
const selectionCards = SELECTIONS.map(s => {
    const { top } = selectionResults(s);
    return `                        <li><a href="/selections/${s.slug}" class="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 hover:border-primary-300 hover:bg-primary-50"><span class="text-2xl" aria-hidden="true">${s.icon}</span><span><span class="block text-sm font-semibold text-slate-900">${esc(s.short)}</span><span class="block text-xs text-slate-500">${top.length} races</span></span></a></li>`;
}).join('\n');
const noscript = breeds.map(b => `                            <li><a href="/races/${b.slug}">${esc(b.name_fr)}</a></li>`).join('\n');
for (const f of fs.readdirSync(path.join(ROOT, 'templates/pages'))) {
    if (!f.endsWith('.html')) continue;
    const html = fill(read(`templates/pages/${f}`), { ...commonVars, SELECTION_CARDS: selectionCards, NOSCRIPT_LIST: noscript });
    write(f, html);
}

// 5. Sitemap et robots
write('sitemap.xml', sitemap());
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// 6. CSS compilé (après les pages : Tailwind lit les classes utilisées), puis numéro de version
execFileSync(path.join(ROOT, 'node_modules/.bin/tailwindcss'), ['-c', 'tailwind.config.cjs', '-i', 'css/tailwind.src.css', '-o', 'css/site.css', '--minify'], { cwd: ROOT, stdio: 'pipe' });
const vCss = hash('css/site.css');
for (const p of written.filter(p => p.endsWith('.html'))) {
    const full = path.join(ROOT, p);
    fs.writeFileSync(full, fs.readFileSync(full, 'utf8').split('__V_CSS__').join(vCss), 'utf8');
}

console.log(`✅ ${breeds.length} fiches, ${SELECTIONS.length} sélections, ${written.filter(p => !p.includes('/')).length} pages, CSS ${(fs.statSync(path.join(ROOT, 'css/site.css')).size / 1024).toFixed(0)} Ko`);
