/**
 * lib/i18n.cjs
 * Les autres langues du site, produites à partir des pages françaises finies.
 *
 * Le site s'écrit en français. Pour chaque langue (dossier i18n/<langue>/), le générateur reprend
 * chaque page française terminée, remplace ses phrases par leur traduction (dictionnaire.json),
 * réécrit les liens internes vers les adresses de la langue et l'enregistre sous /<langue>/.
 * Les scripts du navigateur passent leurs textes par T`…` : le fichier js/i18n.<langue>.js
 * leur fournit les traductions, rien ne change en français.
 *
 * Une phrase sans traduction reste en français et part dans i18n/<langue>/_a-traduire.json.
 */

const fs = require('fs');
const path = require('path');
const parse5 = require('parse5');
const A = parse5.defaultTreeAdapter;

// Balises qui restent dans la phrase (la traduction peut les déplacer) et balises recopiées telles quelles
const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var']);
const OPAQUE = new Set(['br', 'wbr', 'img', 'svg', 'picture', 'input', 'select', 'textarea', 'video', 'canvas']);
const SKIP = new Set(['script', 'style', 'svg', 'math']);
const ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
const META_TEXT = new Set(['description', 'twitter:title', 'twitter:description', 'og:title', 'og:description', 'og:image:alt']);
const LD_TEXT = new Set(['name', 'headline', 'description', 'text', 'alternateName', 'caption']);
// Marqueurs posés par le générateur (dates, versions, sélecteur de langue) : jamais traduits
const TOKEN = /__[A-Z_]+__/g;
const LETTER = /\p{L}/u;

const escText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const unesc = s => s.replace(/&(lt|gt|quot|#39|nbsp|amp);/g, (m, e) => ({ lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ', amp: '&' }[e]));
const norm = s => s.replace(/[ \t\r\n]+/g, ' ').trim();
const hasWords = s => { const t = s.replace(TOKEN, '').replace(/<\/?[gx]\d+\/?>/g, ''); return LETTER.test(t) && t.trim().length > 1; };
const attr = (el, name) => el.attrs?.find(a => a.name === name);
const noTranslate = el => attr(el, 'translate')?.value === 'no';

// Adresse sans accents ni ponctuation : « Chien d'eau portugais » → chien-d-eau-portugais
function slugify(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function readJson(file, fallback) {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

// Langues disponibles : un dossier i18n/<langue>/ avec son config.json
function languages(root) {
    const dir = path.join(root, 'i18n');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(l => fs.existsSync(path.join(dir, l, 'config.json'))).sort();
}

/**
 * Charge une langue : dictionnaire, noms des races, adresses.
 * site = { root, siteUrl, breeds, selections, groups }
 */
function load(site, lang) {
    const dir = path.join(site.root, 'i18n', lang);
    const cfg = readJson(path.join(dir, 'config.json'));
    const dict = readJson(path.join(dir, 'dictionnaire.json'), {});
    const names = readJson(path.join(dir, 'races.json'), {});
    const missing = new Map();
    const used = new Set();
    const warnings = new Set();

    // Nom de chaque race dans la langue, et son adresse
    const breedName = {}, breedSlug = {};
    const taken = new Set();
    for (const b of site.breeds) {
        const n = names[b.slug]?.name;
        breedName[b.slug] = n || b.name_fr;
        let s = n ? slugify(n) : b.slug;
        if (taken.has(s)) s = `${s}-${b.slug}`;
        taken.add(s);
        breedSlug[b.slug] = s;
        if (!n) missing.set(`race:${b.slug}`, { where: 'races.json', fr: b.name_fr });
    }
    // Phrases types des fiches traduites par modèle (i18n/<langue>/modeles.cjs), avant le dictionnaire
    const modFile = path.join(dir, 'modeles.cjs');
    const model = fs.existsSync(modFile)
        ? require(modFile)({ breeds: site.breeds, names: Object.fromEntries(Object.entries(names).map(([k, v]) => [k, v.name])), dict })
        : () => null;
    const modelCache = new Map();
    const byModel = key => { if (!modelCache.has(key)) modelCache.set(key, model(key)); return modelCache.get(key); };
    // Un nom de race seul (titre de carte, fil d'Ariane, liste) se traduit toujours par le nom retenu
    const names2 = {};
    for (const b of site.breeds) if (names[b.slug]?.name) names2[escText(b.name_fr)] = names[b.slug].name;

    // Adresses françaises → adresses de la langue
    const routes = { ...cfg.pages };
    for (const b of site.breeds) routes[`/races/${b.slug}`] = cfg.breedsPrefix + breedSlug[b.slug];
    for (const s of site.selections) routes[`/selections/${s.slug}`] = cfg.selectionsPrefix + (cfg.selections[s.slug] || s.slug);
    for (const G of Object.values(site.groups)) routes[`/groupes/${G.slug}`] = cfg.groupsPrefix + (cfg.groups[G.slug] || G.slug);

    function mapPath(href) {
        if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return href;
        const m = href.match(/^([^?#]*)(.*)$/s);
        let p = m[1];
        if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
        if (p === '') return href;
        if (routes[p] !== undefined) return routes[p] + m[2];
        // Fichiers (images, styles, scripts, données) : mêmes adresses dans toutes les langues
        if (/^\/(images|css|js|fonts|data|api)\//.test(p) || /\.[a-z0-9]+$/i.test(p)) return href;
        warnings.add(`adresse sans équivalent : ${p}`);
        return href;
    }
    function mapUrl(u) {
        if (typeof u !== 'string') return u;
        if (u === site.siteUrl) return site.siteUrl + routes['/'];
        if (u.startsWith(site.siteUrl + '/')) {
            const mapped = mapPath(u.slice(site.siteUrl.length));
            // {search_term_string} et consorts : on ne touche qu'au chemin
            return site.siteUrl + mapped;
        }
        return u;
    }

    // Traduction d'une phrase (forme avec balises <g1>…</g1> et <x1/>)
    function lookup(key, where) {
        if (!hasWords(key)) return null;
        const t = names2[key] ?? byModel(key) ?? dict[key];
        if (t != null) { used.add(key); return t; }
        const m = missing.get(key);
        if (m) m.n++;
        else missing.set(key, { where, n: 1 });
        return null;
    }
    // Texte simple (attributs, données structurées, index des races)
    function plain(text, where = 'texte') {
        if (text == null || text === '') return text;
        const key = escText(norm(String(text)));
        const t = lookup(key, where);
        return t == null ? text : unesc(t.replace(/<\/?[gx]\d+\/?>/g, ''));
    }

    // ---------- Pages ----------
    function allInline(el) {
        for (const c of el.childNodes || []) {
            if (c.nodeName === '#text' || c.nodeName === '#comment') continue;
            if (!c.tagName) return false;
            if (OPAQUE.has(c.tagName) || noTranslate(c)) continue;
            if (!INLINE.has(c.tagName) || !allInline(c)) return false;
        }
        return true;
    }
    function encode(el) {
        const parts = [];
        const enc = node => {
            let out = '';
            for (const c of node.childNodes || []) {
                if (c.nodeName === '#text') out += escText(c.value);
                else if (c.nodeName === '#comment') continue;
                else if (OPAQUE.has(c.tagName) || noTranslate(c)) { parts.push({ node: c, opaque: true }); out += `<x${parts.length}/>`; }
                else { parts.push({ node: c }); const i = parts.length; out += `<g${i}>${enc(c)}</g${i}>`; }
            }
            return out;
        };
        const raw = enc(el);
        return { raw, parts, key: norm(raw), lead: raw.match(/^[ \t\r\n]*/)[0], trail: raw.match(/[ \t\r\n]*$/)[0] };
    }
    const startTag = n => `<${n.tagName}${n.attrs.map(a => ` ${a.name}="${escAttr(a.value)}"`).join('')}>`;
    function decode(t, parts) {
        return t.replace(/<g(\d+)>|<\/g(\d+)>|<x(\d+)\/>/g, (m, o, c, x) => {
            const p = parts[Number(o || c || x) - 1];
            if (!p) throw new Error(`balise inconnue ${m}`);
            if (x) return parse5.serializeOuter(p.node);
            return o ? startTag(p.node) : `</${p.node.tagName}>`;
        });
    }
    function replaceChildren(el, html) {
        const frag = parse5.parseFragment(el, html);
        for (const c of [...el.childNodes]) A.detachNode(c);
        for (const c of [...frag.childNodes]) A.appendChild(el, c);
    }
    // data-ctx (posé par le générateur) : le critère d'une note, pour traduire « Bien » par « Good » ou « Well »
    function segment(el, where) {
        const e = encode(el);
        const ctx = attr(el, 'data-ctx')?.value;
        const t = (ctx && byModel(`${ctx}§${e.key}`)) || lookup(e.key, where);
        if (t == null) return;
        try { replaceChildren(el, e.lead + decode(t, e.parts) + e.trail); } catch (err) { warnings.add(`${where} : ${err.message} dans « ${e.key.slice(0, 60)} »`); }
    }
    function walk(node, where) {
        if (node.tagName === 'template' && node.content) return walk(node.content, where);
        for (const c of [...(node.childNodes || [])]) {
            if (c.nodeName === '#text') {
                if (!hasWords(c.value)) continue;
                const raw = escText(c.value);
                const t = lookup(norm(raw), where);
                if (t == null) continue;
                const lead = raw.match(/^[ \t\r\n]*/)[0], trail = raw.match(/[ \t\r\n]*$/)[0];
                const frag = parse5.parseFragment(node.tagName ? node : undefined, lead + t.replace(/<\/?[gx]\d+\/?>/g, '') + trail);
                const at = node.childNodes.indexOf(c);
                A.detachNode(c);
                frag.childNodes.slice().reverse().forEach(n => { node.childNodes.splice(at, 0, n); n.parentNode = node; });
                continue;
            }
            if (!c.tagName || SKIP.has(c.tagName) || noTranslate(c)) continue;
            if (c.tagName === 'template') { walk(c.content, where); continue; }
            if (allInline(c) && hasWords(encode(c).key)) segment(c, where);
            else walk(c, where);
        }
    }
    // Attributs, liens et métadonnées : un passage sur tout le document une fois les phrases traduites
    function attrs(node, where) {
        if (node.tagName === 'template' && node.content) attrs(node.content, where);
        for (const c of node.childNodes || []) {
            if (!c.tagName) continue;
            if (c.tagName === 'template') { attrs(c.content, where); continue; }
            const skip = noTranslate(c);
            for (const a of c.attrs) {
                if (!skip && ATTRS.includes(a.name) && hasWords(a.value)) a.value = plain(a.value, where);
                if (a.name === 'href' && (c.tagName === 'a' || (c.tagName === 'link' && attr(c, 'rel')?.value === 'canonical'))) a.value = /^https?:/.test(a.value) ? mapUrl(a.value) : mapPath(a.value);
            }
            if (c.tagName === 'html') { const l = attr(c, 'lang'); if (l) l.value = lang; }
            if (c.tagName === 'meta') {
                const key = attr(c, 'name')?.value || attr(c, 'property')?.value;
                const content = attr(c, 'content');
                if (content && META_TEXT.has(key)) content.value = plain(content.value, where);
                if (content && key === 'og:url') content.value = mapUrl(content.value);
                if (content && key === 'og:locale') content.value = cfg.locale;
            }
            if (c.tagName === 'script' && attr(c, 'type')?.value === 'application/ld+json') {
                const text = c.childNodes[0];
                if (text) text.value = JSON.stringify(ld(JSON.parse(text.value), where));
                continue;
            }
            if (!SKIP.has(c.tagName)) attrs(c, where);
        }
    }
    function ld(v, where, key) {
        if (Array.isArray(v)) return v.map(x => ld(x, where, key));
        if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, ld(x, where, k)]));
        if (typeof v !== 'string') return v;
        if (v.startsWith(site.siteUrl)) return mapUrl(v);
        if (LD_TEXT.has(key)) return plain(v, where);
        return v;
    }

    function localize(html, where) {
        const doc = parse5.parse(html, { scriptingEnabled: false });
        walk(doc, where);
        attrs(doc, where);
        return parse5.serialize(doc);
    }

    return {
        lang, cfg, routes, breedName, breedSlug, mapPath, mapUrl, plain, localize, missing, used, warnings, dict,
        // Fichier qui reçoit une adresse : /en → en/index.html, /en/breeds/x → en/breeds/x.html
        fileOf: u => (u === routes['/'] ? `${u.slice(1)}/index.html` : `${u.slice(1)}.html`),
        lookupUi: key => { const t = dict[key]; if (t != null) { used.add(key); return t; } if (!missing.has(key)) missing.set(key, { where: 'scripts', n: 1 }); return null; },
        // Rapport et liste des phrases à traduire
        report() {
            const out = {};
            for (const [k, v] of missing) out[k] = v;
            fs.writeFileSync(path.join(dir, '_a-traduire.json'), JSON.stringify(out, null, 1) + '\n', 'utf8');
            return { missing: missing.size, used: used.size, total: Object.keys(dict).length, warnings: [...warnings] };
        }
    };
}

// Textes des scripts : chaque T`…` du code, avec ${…} remplacés par {0}, {1}…
function scanT(src, file) {
    const keys = [];
    const re = /(^|[^\w$.])T`/g;
    let m;
    while ((m = re.exec(src))) {
        let i = m.index + m[0].length;
        const quasis = [];
        let cur = '';
        for (;;) {
            const ch = src[i];
            if (ch === undefined) throw new Error(`T\` non fermé dans ${file}`);
            if (ch === '\\') { cur += ch + src[i + 1]; i += 2; continue; }
            if (ch === '`') { i++; break; }
            if (ch === '$' && src[i + 1] === '{') {
                quasis.push(cur);
                cur = '';
                let depth = 1;
                i += 2;
                while (depth) {
                    const c = src[i];
                    if (c === undefined) throw new Error(`\${ non fermé dans ${file}`);
                    if (c === '`') throw new Error(`gabarit imbriqué dans un T\` de ${file} : sortez-le dans une variable`);
                    if (c === "'" || c === '"') { const q = c; i++; while (src[i] !== q) { if (src[i] === '\\') i++; i++; } }
                    else if (c === '{') depth++;
                    else if (c === '}') depth--;
                    i++;
                }
                continue;
            }
            cur += ch;
            i++;
        }
        quasis.push(cur);
        const cooked = quasis.map(q => new Function('return `' + q + '`')());
        keys.push(cooked.reduce((a, x, k) => a + x + (k < cooked.length - 1 ? `{${k}}` : ''), ''));
        re.lastIndex = i;
    }
    return keys;
}

// Fichier du navigateur pour une langue : traductions des scripts, adresses, ordinaux
function clientFile(L, keys) {
    const D = {};
    for (const k of [...new Set(keys)].sort()) { const t = L.lookupUi(k); if (t != null) D[k] = t; }
    const routes = Object.fromEntries(Object.entries(L.routes).sort());
    return `// Généré par generate-breeds.cjs (lib/i18n.cjs) : textes des scripts et adresses en version « ${L.lang} »
window.RDCLang = ${JSON.stringify(L.lang)};
(function () {
    var D = ${JSON.stringify(D)};
    var R = ${JSON.stringify(routes)};
    var cache = new WeakMap();
    function join(s, v) { var o = ''; for (var i = 0; i < s.length; i++) o += s[i] + (i < v.length ? v[i] : ''); return o; }
    window.RDCT = function (s) {
        var v = Array.prototype.slice.call(arguments, 1), k = cache.get(s);
        if (k === undefined) { k = ''; for (var i = 0; i < s.length; i++) k += s[i] + (i < v.length ? '{' + i + '}' : ''); cache.set(s, k); }
        var t = D[k];
        return t == null ? join(s, v) : t.replace(/\\{(\\d+)\\}/g, function (m, n) { return v[n]; });
    };
    window.RDCPath = function (h) {
        var m = /^([^?#]*)(.*)$/.exec(h), p = m[1];
        if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
        return R[p] !== undefined ? R[p] + m[2] : h;
    };
    window.RDCOrd = ${L.cfg.ordinal || 'null'};
})();
`;
}

module.exports = { languages, load, scanT, clientFile, slugify };
