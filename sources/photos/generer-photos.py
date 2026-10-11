"""Génère les photos de races manquantes avec l'API Gemini (Nano Banana 2), même style que les autres photos.

Clé : ~/.config/race-de-chien/gemini.key (jamais dans le dépôt).
Usage : python3 -I sources/photos/generer-photos.py [slug ...]   (sans argument : toutes les lignes de photos-a-generer.tsv)
Les PNG arrivent dans sources/photos/raw/ ; ensuite : python3 sources/photos/ajouter-photos.py puis npm run generate.
"""
import base64, json, os, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = 'gemini-3.1-flash-image'
KEY = open(os.path.expanduser('~/.config/race-de-chien/gemini.key')).read().strip()
TEMPLATE = ('Professional studio photograph of a purebred {desc}, full body visible from nose to tail, standing in a '
            'three-quarter side view, on a seamless medium-grey studio backdrop with a soft shadow on the floor, soft '
            'diffused studio lighting, photorealistic, sharp focus, natural colors, no collar, no text, no watermark')

rows = [l.rstrip('\n').split('\t', 1) for l in open(os.path.join(HERE, 'photos-a-generer.tsv'), encoding='utf-8') if l.strip()]
wanted = set(sys.argv[1:])
todo = [(s, d) for s, d in rows if (not wanted or s in wanted) and (wanted or not os.path.exists(os.path.join(HERE, 'raw', s + '.png')))]

def generate(item):
    slug, desc = item
    body = json.dumps({
        'contents': [{'parts': [{'text': TEMPLATE.format(desc=desc)}]}],
        'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '4:3', 'imageSize': '1K'}}
    }).encode()
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent'
    for attempt in range(3):
        req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                data = json.load(r)
            parts = data['candidates'][0]['content']['parts']
            img = next(p['inlineData'] for p in parts if 'inlineData' in p)
            with open(os.path.join(HERE, 'raw', slug + '.png'), 'wb') as f:
                f.write(base64.b64decode(img['data']))
            usage = data.get('usageMetadata', {})
            return f'OK   {slug} ({usage.get("candidatesTokenCount")} jetons)'
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:200]
            if e.code in (429, 500, 503) and attempt < 2:
                time.sleep(8 * (attempt + 1)); continue
            return f'ERR  {slug} HTTP {e.code} {msg}'
        except Exception as e:
            if attempt < 2:
                time.sleep(5); continue
            return f'ERR  {slug} {type(e).__name__} {str(e)[:150]}'

with ThreadPoolExecutor(max_workers=4) as pool:
    for line in pool.map(generate, todo):
        print(line, flush=True)
print(len(todo), 'demandées')
