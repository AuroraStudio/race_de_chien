// Tel Maître, Tel Chien sur Netlify : photo → race la plus ressemblante, à la même adresse qu'avant (/api/match-breed).
// La consigne, le catalogue des races, le schéma de réponse et les messages restent dans api/match-breed.js
// (une seule source) ; ce fichier ne fait que l'accueil de la requête façon Netlify.
import Anthropic from '@anthropic-ai/sdk';
import { buildRequest, normalizeResult, MSG, MAX_IMAGE_SIZE, RATE_LIMIT_WINDOW } from '../../api/match-breed.js';

const SITE = ['https://race-de-chien.com', 'https://www.race-de-chien.com'];

// Limite par IP gardée en mémoire (remise à zéro quand Netlify recycle la fonction), comme sur Vercel
const essais = new Map();
let client = null;

function json(status, body, headers = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
            'X-Content-Type-Options': 'nosniff',
            ...headers
        }
    });
}

// Le site lui-même : le domaine, l'adresse principale Netlify (avant la bascule du domaine)
// et les adresses de chaque déploiement de ce site (<id>--<nom>.netlify.app)
function originePermise(origin, context) {
    if (!origin) return false;
    if (SITE.includes(origin)) return true;
    if (context.site?.url && origin === context.site.url) return true;
    const nom = String(context.site?.name || '').replace(/[^a-z0-9-]/g, '');
    return Boolean(nom) && new RegExp(`^https://[a-z0-9-]+--${nom}\\.netlify\\.app$`).test(origin);
}

export default async (req, context) => {
    const origin = req.headers.get('origin') || '';
    const permise = originePermise(origin, context);
    const cors = {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        ...(permise ? { 'Access-Control-Allow-Origin': origin } : {})
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: { ...cors, 'X-Robots-Tag': 'noindex, nofollow' } });
    }
    if (req.method !== 'POST') {
        return json(405, { error: 'Method not allowed' }, cors);
    }

    let body = {};
    try { body = (await req.json()) || {}; } catch { body = {}; }

    // Les navigateurs envoient toujours Origin sur un POST : un appel sans Origin ou depuis un autre site n'est pas notre page.
    // Ce n'est pas une barrière absolue (un script peut l'imiter), mais ça écarte les robots qui viendraient consommer le quota.
    const enProduction = context.deploy?.context === 'production';
    const lang = ['en', 'es', 'de', 'pt'].includes(body.lang) ? body.lang : 'fr';
    const msg = MSG[lang];
    if (enProduction && !permise) {
        return json(403, { error: 'forbidden', message: msg.forbidden }, cors);
    }

    // 5 essais par IP et par jour en production ; marge plus large sur les déploiements de test
    const max = enProduction ? 5 : 50;
    const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown';
    const maintenant = Date.now();
    let entree = essais.get(ip);
    if (!entree || maintenant - entree.debut > RATE_LIMIT_WINDOW * 1000) {
        entree = { debut: maintenant, nombre: 0 };
        essais.set(ip, entree);
    }
    const restants = Math.max(0, max - entree.nombre);
    const limite = { ...cors, 'X-RateLimit-Limit': String(max), 'X-RateLimit-Remaining': String(restants) };

    if (entree.nombre >= max) {
        return json(429, { error: 'rate_limit', message: msg.limit, remaining: 0 }, limite);
    }

    // Nom propre au projet : la passerelle IA de Netlify remplace ANTHROPIC_API_KEY et ANTHROPIC_BASE_URL dans les fonctions
    const apiKey = globalThis.Netlify?.env.get('RDC_ANTHROPIC_KEY') ?? process.env.RDC_ANTHROPIC_KEY;
    if (!apiKey) {
        return json(500, { error: 'API key not configured' }, limite);
    }

    const { image_base64, mime_type } = body;
    if (!image_base64 || !mime_type) {
        return json(400, { error: msg.missing }, limite);
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mime_type)) {
        return json(400, { error: msg.type }, limite);
    }
    if (typeof image_base64 !== 'string' || image_base64.length > MAX_IMAGE_SIZE) {
        return json(400, { error: msg.size }, limite);
    }

    client ??= new Anthropic({ apiKey, baseURL: 'https://api.anthropic.com' });

    let response;
    try {
        response = await client.messages.create(buildRequest(image_base64, mime_type, lang));
    } catch (error) {
        console.error('Erreur API Claude:', error.status, error.message);
        if (error instanceof Anthropic.RateLimitError || error.status === 529) {
            return json(503, { error: msg.busy }, limite);
        }
        if (error instanceof Anthropic.BadRequestError) {
            return json(400, { error: msg.photo }, limite);
        }
        return json(502, { error: msg.failed }, limite);
    }

    // Suivi du coût : tokens lus en cache, écrits en cache, image + consigne, sortie
    const u = response.usage || {};
    console.log(`usage cache_read=${u.cache_read_input_tokens} cache_write=${u.cache_creation_input_tokens} input=${u.input_tokens} output=${u.output_tokens}`);

    if (response.stop_reason === 'refusal') {
        return json(422, { error: msg.photo }, limite);
    }

    const textBlock = response.content.find(block => block.type === 'text');
    let result;
    try {
        result = normalizeResult(JSON.parse(textBlock?.text ?? ''));
    } catch (error) {
        console.error('Réponse illisible:', response.stop_reason, textBlock?.text?.slice(0, 200));
        return json(502, { error: msg.odd }, limite);
    }

    entree.nombre++;

    return json(200, { result, remaining: Math.max(0, restants - 1) }, limite);
};

export const config = { path: '/api/match-breed' };
