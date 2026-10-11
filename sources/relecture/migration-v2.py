"""Fusionne la relecture, l'harmonisation, la popularité LOF, les textes et les nouvelles races
dans un breeds.json v2. Usage : python3 -I build_v2.py <repo> <review_dir> <newimg_dir>"""
import json, os, sys, copy, datetime, glob

REPO, REV, NEWIMG = sys.argv[1:4]
load = lambda p: json.load(open(p, encoding='utf-8'))

old = load(os.path.join(REPO, 'data/breeds.json'))
slugs = load(os.path.join(REPO, 'data/breed-slugs.json'))
dims = load(os.path.join(REPO, 'data/image-dimensions.json'))
reviews = {r['slug']: r for r in load(os.path.join(REV, 'all-reviews.json'))}
lof = load(os.path.join(REV, 'lof-presentes.json'))
harmo = {}
for f in sorted(glob.glob(os.path.join(REV, 'harmo-*.json'))):
    for crit, vals in load(f).items():
        if crit.startswith('_'):
            continue
        harmo.setdefault(crit, {}).update(vals)
textes = load(os.path.join(REV, 'textes.json')) if os.path.exists(os.path.join(REV, 'textes.json')) else {'patches': {}, 'full': {}, 'name_alt': {}}
new_data = []
for f in sorted(glob.glob(os.path.join(REV, 'nouvelles-data-*.json'))):
    new_data += load(f)
new_meta = {x['slug']: x for x in load(os.path.join(REV, 'nouvelles-races.json'))}
new_imgs = {os.path.splitext(os.path.basename(p))[0] for p in glob.glob(os.path.join(NEWIMG, 'out', '*.jpg'))}
new_dims = load(os.path.join(NEWIMG, 'out', 'dims.json')) if os.path.exists(os.path.join(NEWIMG, 'out', 'dims.json')) else {}

KEYS = ['energie', 'exercice_min_jour', 'enfants', 'chiens', 'chats', 'inconnus', 'appartement', 'solitude', 'aboiements',
        'education', 'premier_chien', 'entretien_pelage', 'perte_poils', 'bave', 'chaleur', 'froid', 'garde',
        'instinct_chasse', 'fugue', 'robustesse']
FCI_LABELS = {1: 'Bergers et bouviers', 2: 'Molosses, pinschers et bouviers suisses', 3: 'Terriers', 4: 'Teckels',
              5: 'Spitz et chiens primitifs', 6: 'Chiens courants', 7: "Chiens d'arrêt",
              8: "Rapporteurs, leveurs et chiens d'eau", 9: 'Chiens de compagnie', 10: 'Lévriers'}
COUNTRY = {'France': 'FR', 'Allemagne': 'DE', 'Grande-Bretagne': 'GB', 'Royaume-Uni': 'GB', 'Suisse': 'CH', 'Belgique': 'BE',
           'Mexique': 'MX', 'Japon': 'JP', 'États-Unis': 'US', 'Russie': 'RU', 'Italie': 'IT', 'Hongrie': 'HU'}

def size_from_height(avg):
    return 'toy' if avg < 28 else 'small' if avg < 40 else 'medium' if avg < 60 else 'large' if avg < 70 else 'giant'

def rng(v):
    """[min,max] ou {min,max} -> {min,max,average}"""
    if isinstance(v, dict):
        lo, hi = v.get('min'), v.get('max')
    else:
        lo, hi = v[0], v[1]
    return {'min': lo, 'max': hi, 'average': round((lo + hi) / 2, 1)}

def derive_legacy(b):
    """Champs historiques recalculés depuis les notes, pour rester cohérents avec les filtres."""
    s = b['scores']
    t = b.setdefault('temperament', {})
    t['energy_level'] = ['low', 'low', 'moderate', 'high', 'very_high'][s['energie'] - 1]
    t['good_with_children'] = s['enfants'] >= 4
    t['good_with_dogs'] = s['chiens'] >= 4
    t['good_with_cats'] = s['chats'] >= 4
    t['protective'] = s['garde'] >= 4
    tr = b.setdefault('training', {})
    tr['trainability'] = ['Très difficile', 'Difficile', 'Moyen', 'Facile', 'Très facile'][s['education'] - 1]
    tr['experience_required'] = ['Expert', 'Confirmé', 'Intermédiaire', 'Débutant', 'Débutant'][s['premier_chien'] - 1]
    tr['intelligence_level'] = None
    lv = b.setdefault('living', {})
    lv['apartment_friendly'] = s['appartement'] >= 4
    lv['ideal_environment'] = ('Appartement ou maison' if s['appartement'] >= 4 else
                               'Maison, petit jardin' if s['appartement'] == 3 else
                               'Campagne' if (s['appartement'] == 1 and s['energie'] >= 5) else 'Maison avec grand jardin')
    lv['exercise_needs'] = {'daily_minutes': s['exercice_min_jour'], 'activity_types': lv.get('exercise_needs', {}).get('activity_types', [])}
    c = b.setdefault('coat', {})
    c['shedding'] = ['Minimal', 'Léger', 'Modéré', 'Abondant', 'Abondant'][s['perte_poils'] - 1]
    c['maintenance'] = ['Faible', 'Faible', 'Moyen', 'Élevé', 'Très élevé'][s['entretien_pelage'] - 1]
    h = b.setdefault('health', {})
    h['general_health'] = ['Fragile', 'Fragile', 'Moyenne', 'Bonne', 'Excellente'][s['robustesse'] - 1]
    h['vet_visits_frequency'] = 'Annuelle'

def set_path(obj, path, value):
    parts = path.split('.')
    for p in parts[:-1]:
        obj = obj.setdefault(p, {})
    obj[parts[-1]] = value

ALLOWED = {'physical.size_category', 'physical.height_cm', 'physical.weight_kg', 'physical.life_span_years',
           'coat.length', 'coat.type', 'origin', 'country_code', 'temperament.traits', 'temperament.sociability'}

out = []
inv = {v: k for k, v in slugs.items()}
for b in old['breeds']:
    slug = slugs[b['id']]
    r = reviews[slug]
    nb = copy.deepcopy(b)
    if slug in textes.get('full', {}):  # fiche réécrite entièrement (Cocker anglais, Bulldog anglais)
        f = textes['full'][slug]
        keep_id = nb['id']
        nb = {k: v for k, v in f.items() if k not in ('scores', 'hypoallergenique', 'sante_problemes', 'groupe_fci', 'categorie_loi_fr')}
        nb['id'] = keep_id
        r = dict(r, scores=f['scores'], hypoallergenique=f.get('hypoallergenique', False), sante_problemes=f.get('sante_problemes', []),
                 groupe_fci=f.get('groupe_fci'), categorie_loi_fr=f.get('categorie_loi_fr'), erreurs=[], name_fr_ok=True, reconnue_fci=True,
                 origine_ok=True, taille_poids_ok=True, esperance_vie_ok=True)
    else:
        for e in r.get('erreurs', []):
            if e['champ'] in ALLOWED and e.get('correct') not in (None, ''):
                val = e['correct']
                if e['champ'].endswith(('_cm', '_kg', '_years')):
                    try:
                        val = rng(val)
                    except Exception:
                        continue
                set_path(nb, e['champ'], val)
        if isinstance(r.get('taille_poids_ok'), dict):
            tp = r['taille_poids_ok']
            if tp.get('height_cm'): nb['physical']['height_cm'] = rng(tp['height_cm'])
            if tp.get('weight_kg'): nb['physical']['weight_kg'] = rng(tp['weight_kg'])
        if isinstance(r.get('esperance_vie_ok'), dict):
            nb['physical']['life_span_years'] = rng(r['esperance_vie_ok'])
        if isinstance(r.get('name_fr_ok'), str):
            nb['name_fr'] = r['name_fr_ok']
        if isinstance(r.get('origine_ok'), str):
            nb['origin'] = r['origine_ok'].split(' (')[0]
    p = textes.get('patches', {}).get(slug, {})
    for k in ('description', 'history', 'name_fr'):
        if p.get(k): nb[k] = p[k]
    if p.get('traits'): nb.setdefault('temperament', {})['traits'] = p['traits']
    # Notes : relecture puis harmonisation
    sc = dict(r['scores'])
    for crit, vals in harmo.items():
        if crit in KEYS and slug in vals and slug not in textes.get('full', {}):
            sc[crit] = vals[slug]
    hypo = r.get('hypoallergenique', False)
    if slug in harmo.get('hypoallergenique', {}) and slug not in textes.get('full', {}):
        hypo = harmo['hypoallergenique'][slug]
    nb['slug'] = slug
    nb['scores'] = sc
    nb['hypoallergenic'] = bool(hypo)
    nb['name_alt'] = textes.get('name_alt', {}).get(slug, nb.get('name_alt', []))
    grp = r.get('groupe_fci')
    # Reconnues à titre provisoire par la FCI (inscrites au LOF)
    recognized = r.get('reconnue_fci') is not False or slug in ('berger-americain-miniature', 'lancashire-heeler')
    nb['fci'] = {'group': grp if recognized else None, 'recognized': recognized,
                 'provisional': slug in ('berger-americain-miniature', 'lancashire-heeler')}
    nb['breed_group'] = FCI_LABELS.get(grp, 'Race non reconnue en France')
    nb['legal_category'] = r.get('categorie_loi_fr') or None
    L = lof.get(slug, {})
    nb['lof'] = {'2025': L.get('lof_2025'), '2024': L.get('lof_2024')}
    nb.setdefault('health', {})['common_issues'] = r.get('sante_problemes', [])
    hc = nb['physical']['height_cm']
    if any('size_category' in e['champ'] for e in r.get('erreurs', [])) is False and isinstance(r.get('taille_poids_ok'), dict):
        nb['physical']['size_category'] = size_from_height(hc['average'])
    nb['review_confidence'] = r.get('confiance')
    derive_legacy(nb)
    out.append(nb)

# Nouvelles races
next_id = 1000
for d in new_data:
    slug = d['slug']
    meta = new_meta.get(slug, {})
    b = {
        'id': f'n{next_id}', 'slug': slug, 'name': d.get('name') or d['name_fr'], 'name_fr': d['name_fr'],
        'name_alt': d.get('name_alt', []), 'origin': d.get('origin') or meta.get('origine', ''),
        'country_code': d.get('country_code') or COUNTRY.get(d.get('origin', ''), ''),
        'description': d['description'], 'history': d['history'], 'bred_for': None,
        'physical': {
            'size_category': d['physical'].get('size_category') or size_from_height(rng(d['physical']['height_cm'])['average']),
            'height_cm': rng(d['physical']['height_cm']), 'weight_kg': rng(d['physical']['weight_kg']),
            'life_span_years': rng(d['physical']['life_span_years'])},
        'coat': {'length': d['coat']['length'], 'type': d['coat']['type'], 'colors': d['coat'].get('colors', [])},
        'temperament': {'traits': d['temperament']['traits'][:5], 'sociability': d['temperament'].get('sociability', 'Équilibré')},
        'scores': {k: d['scores'][k] for k in KEYS}, 'hypoallergenic': bool(d.get('hypoallergenique')),
        'fci': {'group': d.get('groupe_fci'), 'number': d.get('numero_fci'), 'recognized': bool(d.get('reconnue_fci', True)),
                'provisional': bool(d.get('fci_provisoire'))},
        'legal_category': d.get('categorie_loi_fr') or None,
        'lof': {'2025': meta.get('lof_inscriptions'), '2024': meta.get('lof_2024')},
        'health': {'common_issues': d.get('sante_problemes', [])},
        'review_confidence': d.get('confiance'), 'is_new': True,
    }
    b['breed_group'] = FCI_LABELS.get(b['fci']['group'], 'Race non reconnue par la FCI')
    if not b['fci']['recognized']:
        b['breed_group'] = 'Race reconnue en France (SCC)'
    derive_legacy(b)
    next_id += 1
    out.append(b)

# Statuts vérifiés à la main (SCC / FCI)
OVR = {'berger-americain-miniature': {'group': 1, 'recognized': True, 'provisional': True},
       'lancashire-heeler': {'group': 1, 'recognized': True, 'provisional': True},
       'epagneul-d-eau-americain': {'group': 8, 'recognized': True, 'provisional': False}}
for b in out:
    if b['slug'] in OVR:
        b['fci'].update(OVR[b['slug']])
        b['breed_group'] = FCI_LABELS[b['fci']['group']]
    if b.get('is_new') and not b['fci']['recognized']:
        # Races françaises reconnues par la seule SCC : inscrites au LOF, donc proposées par défaut
        src = next(d for d in new_data if d['slug'] == b['slug'])
        b['fci'] = {'group': src.get('groupe_fci'), 'recognized': True, 'provisional': False, 'scc_only': True}
        b['breed_group'] = FCI_LABELS.get(src.get('groupe_fci'), b['breed_group'])

# Images : existantes + nouvelles générées
for b in out:
    slug = b['slug']
    if slug == 'bouledogue-anglais':
        # L'ancienne photo montre l'Olde English Bulldogge : on attend la nouvelle (fichier -v2)
        b['image'] = ({'url': 'images/breeds/bouledogue-anglais-v2.jpg', 'width': new_dims[slug][0], 'height': new_dims[slug][1]}
                      if slug in new_imgs else None)
    elif slug in new_imgs:
        w, h = new_dims.get(slug, [1200, 896])
        b['image'] = {'url': f'images/breeds/{slug}.jpg', 'width': w, 'height': h}
    elif slug in dims and not b.get('is_new'):
        b['image'] = {'url': f'images/breeds/{slug}.jpg', 'width': dims[slug]['w'], 'height': dims[slug]['h']}
    else:
        b['image'] = None
    b.pop('images', None)

TRAIT_FIX = {'Désireux de plaire': 'Coopératif', 'Travail concentré': 'Travailleur'}
for b in out:
    t = b.get('temperament', {})
    t['traits'] = list(dict.fromkeys(TRAIT_FIX.get(x.strip(), x.strip()) for x in t.get('traits', []) if x.strip()))

out.sort(key=lambda b: b['name_fr'])
data = {
    'metadata': {'version': '2.0', 'totalBreeds': len(out), 'lastUpdated': datetime.date.today().isoformat(),
                 'sources': ['Standards FCI', 'Société Centrale Canine (statistiques LOF 2025)', 'Relecture race par race du 11/10/2026']},
    'criteria': {'scores': {k: None for k in KEYS}},
    'breeds': out,
}
json.dump(data, open(os.path.join(REPO, 'data/breeds.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({b['id']: b['slug'] for b in out}, open(os.path.join(REPO, 'data/breed-slugs.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('races', len(out), 'nouvelles', sum(1 for b in out if b.get('is_new')), 'avec image', sum(1 for b in out if b['image']))
