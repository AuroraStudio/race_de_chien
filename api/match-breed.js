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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { image_base64, mime_type, slug_list } = req.body;

        if (!image_base64 || !mime_type || !slug_list) {
            return res.status(400).json({ error: 'Missing required fields: image_base64, mime_type, slug_list' });
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
- L'explication doit être personnalisée basée sur l'apparence physique de la personne (forme du visage, expression, cheveux, regard...)
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

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
