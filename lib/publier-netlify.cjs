#!/usr/bin/env node
/**
 * Netlify : prépare le dossier publié `_site/` (commande de build de netlify.toml).
 *
 * Le site est déjà généré et commité (`npm run generate`, ou l'action GitHub « Générer le site statique ») :
 * on copie seulement ce qui doit être servi, puis on écrit
 * `_site/_redirects` (adresses sans .html ; www et l'adresse Netlify vers le domaine).
 *
 *   node lib/publier-netlify.cjs          prépare _site/
 *   node lib/publier-netlify.cjs --essai  affiche le bilan sans rien écrire
 *
 * Le build échoue (et Netlify garde le déploiement précédent en ligne) si un fichier indispensable manque.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '_site');
const DOMAINE = 'https://race-de-chien.com';
const essai = process.argv.includes('--essai');

// Jamais servis : outils, sources privées (audits, lots, photos brutes), configuration, documents de travail
const EXCLUS_RACINE = new Set([
    'node_modules', '_site', 'netlify', 'netlify.toml', 'plugins',
    'templates', 'sources', 'lib', 'i18n', 'generate-breeds.cjs', 'tailwind.config.cjs',
    'package.json', 'package-lock.json', 'PRODUCT.md', 'DESIGN.md', 'README.md'
]);
const EXCLUS_CHEMINS = new Set(['css/tailwind.src.css']);
// Fichiers cachés (.git, .github, .claude, .impeccable, .netlify, .gitignore, .DS_Store…) : jamais servis
const cache = nom => nom.startsWith('.') && nom !== '.well-known';

// Indispensables : sans eux, on ne publie pas
const OBLIGATOIRES = [
    'index.html', '404.html', 'robots.txt', 'sitemap.xml', 'favicon.svg',
    'google5b700cba99ea779a.html', // validation Search Console : ne jamais le supprimer
    'css/site.css', 'data/breeds-index.json', 'data/breed-slugs.json', 'tel-maitre-tel-chien.html'
];

function lister(dossier, rel = '') {
    const fichiers = [];
    for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (cache(e.name) || (!rel && EXCLUS_RACINE.has(e.name)) || EXCLUS_CHEMINS.has(r)) continue;
        if (e.isDirectory()) fichiers.push(...lister(path.join(dossier, e.name), r));
        else if (e.isFile()) fichiers.push(r);
    }
    return fichiers;
}

const fichiers = lister(ROOT).sort();
const manquants = OBLIGATOIRES.filter(f => !fichiers.includes(f));
const cleIndexNow = fichiers.find(f => /^[0-9a-f]{32}\.txt$/.test(f));
if (!cleIndexNow) manquants.push('<clé IndexNow>.txt');
if (manquants.length) {
    console.error(`Publication refusée, fichier(s) manquant(s) : ${manquants.join(', ')}`);
    process.exit(1);
}

// Pages .html → adresse propre. 404.html et le fichier Google restent servis tels quels.
const pages = fichiers.filter(f => f.endsWith('.html') && f !== '404.html' && !/^google[0-9a-f]+\.html$/.test(f));
const regles = [];
const regle = (de, vers, statut = '301!') => regles.push(`${de.padEnd(70)} ${vers.padEnd(60)} ${statut}`);

regles.push('# Généré par lib/publier-netlify.cjs à chaque build : ne pas modifier ici.');
regles.push('# Une seule version du site pour les moteurs : www et l\'adresse technique Netlify renvoient vers le domaine.');
regle('https://www.race-de-chien.com/*', `${DOMAINE}/:splat`);
if (process.env.SITE_NAME) {
    regle(`https://${process.env.SITE_NAME}.netlify.app/*`, `${DOMAINE}/:splat`);
    regle(`https://main--${process.env.SITE_NAME}.netlify.app/*`, `${DOMAINE}/:splat`);
}
regles.push('', '# Adresses en .html (et /index) vers l\'adresse propre');
for (const p of pages) {
    const propre = p === 'index.html' ? '/' : p.endsWith('/index.html') ? '/' + p.slice(0, -'/index.html'.length) : '/' + p.slice(0, -5);
    regle('/' + p, propre);
    if (p.endsWith('index.html')) regle('/' + p.slice(0, -5), propre);
}
regles.push('', '# Accueils des langues : servis sans barre finale (adresse canonique)');
for (const p of pages.filter(f => f.endsWith('/index.html'))) {
    regle('/' + p.slice(0, -'/index.html'.length), '/' + p, '200!');
}

const bilan = `${fichiers.length} fichiers publiés, ${pages.length} pages, ${regles.filter(r => r && !r.startsWith('#')).length} règles de redirection, clé IndexNow ${cleIndexNow}`;
if (essai) { console.log(bilan); process.exit(0); }

fs.rmSync(OUT, { recursive: true, force: true });
for (const f of fichiers) {
    fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true });
    fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
}
fs.writeFileSync(path.join(OUT, '_redirects'), regles.join('\n') + '\n');
console.log(bilan);
