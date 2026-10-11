# Rédaction de fiches pour de nouvelles races (race-de-chien.com, public français)

Tu rédiges des fiches COMPLÈTES pour les races de ton lot (fichier JSON indiqué : nom_fr, slug, groupe_fci, origine, lof_inscriptions 2025, statut_fci, note).
Référentiel : standards FCI / SCC, clubs de race français, sources vétérinaires. Ton : encyclopédique, chaleureux, précis, français soigné, sans tirets longs.
Exemple de fiche existante (structure et ton) : python3 -c "import json;b=json.load(open('/Users/quentin/Desktop/Claude/race-de-chien/data/breeds.json'))['breeds'];print(json.dumps(b[30],ensure_ascii=False,indent=1))"

Pour chaque race, un objet :
{
  "slug": "<slug du lot>",
  "name_fr": "nom français d'usage (SCC)", "name": "nom international/anglais courant", "name_alt": ["autres noms courants en France"],
  "origin": "pays d'origine FCI en français", "country_code": "FR",
  "groupe_fci": 1-10, "numero_fci": int|null, "reconnue_fci": true|false, "fci_provisoire": true|false,
  "categorie_loi_fr": null | "1" | "2",
  "description": "2 à 3 phrases : allure, caractère, usage",
  "history": "3 à 5 phrases : origine, développement, reconnaissance (SCC/FCI), situation en France",
  "physical": {"size_category": "toy|small|medium|large|giant", "height_cm": {"min":..,"max":..,"average":..}, "weight_kg": {...}, "life_span_years": {...}},
  "coat": {"length": "Sans poil|Court|Moyen|Long", "type": "Lisse|Ondulé|Bouclé|Dur|Soyeux|Double|Cordé", "shedding": "Minimal|Léger|Modéré|Abondant", "maintenance": "Faible|Moyen|Élevé|Très élevé", "colors": ["robes admises, en français"]},
  "temperament": {"traits": ["5 traits en français, un ou deux mots"], "sociability": "Réservé|Équilibré|Sociable|Très sociable"},
  "scores": { "energie":1-5, "exercice_min_jour": int, "enfants":1-5, "chiens":1-5, "chats":1-5, "inconnus":1-5, "appartement":1-5, "solitude":1-5, "aboiements":1-5, "education":1-5, "premier_chien":1-5, "entretien_pelage":1-5, "perte_poils":1-5, "bave":1-5, "chaleur":1-5, "froid":1-5, "garde":1-5, "instinct_chasse":1-5, "fugue":1-5, "robustesse":1-5 },
  "hypoallergenique": true|false,
  "sante_problemes": ["3 à 5 problèmes de santé fréquents, en français"],
  "confiance": "haute|moyenne|faible"
}
Échelles des notes : voir /private/tmp/claude-501/-Users-quentin-Desktop-Claude/b29437b6-3ed8-44f0-95ed-06304fc2325d/scratchpad/rdc/review/HARMONISATION.md.
Pour rester cohérent avec les 169 races déjà notées, compare tes notes à celles de races proches dans /private/tmp/claude-501/-Users-quentin-Desktop-Claude/b29437b6-3ed8-44f0-95ed-06304fc2325d/scratchpad/rdc/review/all-reviews.json (ex. un chien courant français vs beagle/harrier/basset-bleu-de-gascogne ; un braque vs braque-allemand-a-poil-court/epagneul-breton).
Pour les chiens courants de meute (Français tricolore, Grand anglo-français…), sois honnête : chiens de meute, rarement des chiens de compagnie, appartement 1, solitude basse, aboiements (récris) élevés.
Le Spitz allemand est une fiche chapeau qui couvre petit, moyen, grand (le nain et le loup ont déjà leur fiche) : précise-le dans la description.
Fais quelques recherches web ciblées si tu as un doute sur une race rare (tailles du standard FCI notamment), sans plus.
Écris un tableau JSON valide (une entrée par race du lot, même ordre) dans le fichier de sortie indiqué, vérifie-le avec python3 -c "import json;json.load(open(...))". Ne modifie aucun fichier du dépôt.
Réponse finale courte (< 120 mots) : nombre de fiches, races où ta confiance est moyenne ou faible.
