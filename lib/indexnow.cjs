#!/usr/bin/env node
/**
 * IndexNow : prévient Bing (et Yandex, Seznam, Naver…) des pages modifiées, sans attendre leur passage.
 * Google n'utilise pas IndexNow : pour lui, Search Console et le sitemap.
 *
 *   node lib/indexnow.cjs            pages du sitemap modifiées ces 2 derniers jours
 *   node lib/indexnow.cjs --jours 7  … ces 7 derniers jours
 *   node lib/indexnow.cjs --tout     toutes les pages du sitemap
 *   node lib/indexnow.cjs --essai    affiche la liste sans rien envoyer
 *
 * La clé est le nom du fichier <32 caractères hexadécimaux>.txt à la racine (servi tel quel).
 * Lancé après chaque déploiement de production Netlify par plugins/indexnow (netlify.toml).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HOST = 'race-de-chien.com';
const args = process.argv.slice(2);
const tout = args.includes('--tout');
const essai = args.includes('--essai');
const jours = Number(args[args.indexOf('--jours') + 1]) || 2;

const keyFile = fs.readdirSync(ROOT).find(f => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error('Clé IndexNow introuvable (fichier <clé>.txt à la racine)'); process.exit(1); }
const key = keyFile.slice(0, 32);

const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const since = new Date(Date.now() - jours * 86400000).toISOString().slice(0, 10);
const urls = [...xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)]
    .filter(([, , d]) => tout || d >= since)
    .map(([, u]) => u);

console.log(`IndexNow : ${urls.length} adresse(s) ${tout ? '(tout le sitemap)' : `modifiée(s) depuis le ${since}`}`);
if (!urls.length || essai) { if (essai) urls.forEach(u => console.log('  ' + u)); process.exit(0); }

fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList: urls })
}).then(async r => {
    // 200 et 202 : reçu ; 403 : clé non trouvée en ligne ; 422 : adresses hors du domaine ; 429 : trop d'envois
    console.log(`Réponse ${r.status} ${r.statusText}`, (await r.text()).slice(0, 200));
    if (r.status >= 300) process.exit(1);
}).catch(e => { console.error(e.message); process.exit(1); });
