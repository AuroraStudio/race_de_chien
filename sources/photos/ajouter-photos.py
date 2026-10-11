"""Intègre de nouvelles photos de races.

1. Déposer les PNG générés dans sources/photos/raw/<slug>.png
   (prompts dans photos-a-generer.tsv, gabarit : studio, fond gris uni, chien entier de trois quarts).
2. python3 sources/photos/ajouter-photos.py
3. npm run generate, puis commit et push.

Le script convertit en JPEG (qualité 82) et WebP (qualité 72) dans images/breeds/
et renseigne le champ image de data/breeds.json pour les races qui n'en ont pas.
Le Bouledogue anglais prend le nom -v2 (l'ancienne photo, un Olde English Bulldogge, reste en cache chez certains visiteurs).
"""
import json, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, 'sources/photos/raw')
data_path = os.path.join(ROOT, 'data/breeds.json')
data = json.load(open(data_path, encoding='utf-8'))
by_slug = {b['slug']: b for b in data['breeds']}
added = []
for f in sorted(os.listdir(RAW)) if os.path.isdir(RAW) else []:
    if not f.endswith('.png'):
        continue
    slug = f[:-4]
    b = by_slug.get(slug)
    if not b:
        print('slug inconnu :', slug)
        continue
    name = f'{slug}-v2' if slug == 'bouledogue-anglais' else slug
    jpg = os.path.join(ROOT, 'images/breeds', name + '.jpg')
    webp = os.path.join(ROOT, 'images/breeds', name + '.webp')
    src = os.path.join(RAW, f)
    subprocess.run(['magick', src, '-strip', '-interlace', 'Plane', '-quality', '82', jpg], check=True)
    subprocess.run(['cwebp', '-quiet', '-q', '72', src, '-o', webp], check=True)
    w, h = subprocess.run(['magick', 'identify', '-format', '%w %h', jpg], capture_output=True, text=True).stdout.split()
    b['image'] = {'url': f'images/breeds/{name}.jpg', 'width': int(w), 'height': int(h)}
    added.append(slug)
json.dump(data, open(data_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(added), 'photos intégrées :', ', '.join(added))
