// Rate limiting en mémoire (reset au redéploiement, suffisant pour limiter l'abus)
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 5; // 5 essais max par IP
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24h en ms
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // ~2MB en base64

function getRateLimitInfo(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { windowStart: now, count: 0 });
        return { remaining: RATE_LIMIT_MAX, allowed: true };
    }
    
    return { 
        remaining: Math.max(0, RATE_LIMIT_MAX - entry.count), 
        allowed: entry.count < RATE_LIMIT_MAX 
    };
}

function incrementRateLimit(ip) {
    const entry = rateLimitMap.get(ip);
    if (entry) entry.count++;
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const rateInfo = getRateLimitInfo(ip);
    
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
    res.setHeader('X-RateLimit-Remaining', rateInfo.remaining);

    if (!rateInfo.allowed) {
        return res.status(429).json({ 
            error: 'rate_limit',
            message: 'Vous avez atteint la limite de 5 essais par jour. Revenez demain !',
            remaining: 0
        });
    }

    // API key check
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { image_base64, mime_type, slug_list } = req.body;

        // Validation
        if (!image_base64 || !mime_type || !slug_list) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(mime_type)) {
            return res.status(400).json({ error: 'Type d\'image non supporté' });
        }

        if (image_base64.length > MAX_IMAGE_SIZE) {
            return res.status(400).json({ error: 'Image trop volumineuse (2MB max)' });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 500,
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: mime_type,
                                data: image_base64
                            }
                        },
                        {
                            type: 'text',
                            text: `Tu es un expert canin humoristique français. Analyse cette photo d'une personne et détermine à quelle race de chien elle ressemble le plus.

Voici la liste EXACTE des slugs de races disponibles : ${slug_list}

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après :
{
  "breed_slug": "slug-exact-de-la-liste-ci-dessus",
  "match_percentage": 82,
  "reason": "Explication drôle et bienveillante en 2-3 phrases",
  "traits_communs": ["Trait 1", "Trait 2", "Trait 3"]
}

Règles :
- Sois toujours positif, drôle et bienveillant — jamais moqueur
- Le breed_slug DOIT correspondre EXACTEMENT à un slug de la liste
- Le pourcentage doit être entre 75 et 95 (toujours flatteur)
- Les traits communs doivent être des qualités positives (3 à 5 traits)
- L'explication doit être personnalisée basée sur l'apparence physique de la personne
- Utilise un ton fun, comme si un expert canin faisait une blague bienveillante
- Si la photo ne montre pas clairement un visage humain, utilise le slug "golden-retriever" et adapte la raison`
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json({ error: errData.error?.message || 'API error' });
        }

        incrementRateLimit(ip);

        const data = await response.json();
        return res.status(200).json({ 
            ...data, 
            remaining: Math.max(0, rateInfo.remaining - 1) 
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
