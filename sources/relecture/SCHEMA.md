# Vérification des fiches race-de-chien.com

Source : /Users/quentin/Desktop/Claude/race-de-chien/data/breeds.json (clé "breeds"), slugs dans data/breed-slugs.json (id -> slug).
Les données viennent de TheDogAPI (base américaine) traduites et complétées automatiquement : beaucoup de champs sont faux ou remplis par défaut.
Public : propriétaires et futurs propriétaires de chiens en FRANCE. Référentiels attendus : FCI / SCC (LOF), pas l'AKC.

Pour CHAQUE race du lot, produis un objet JSON :

{
  "slug": "...",
  "name_fr_ok": true | "nom français correct si différent (usage SCC/FCI)",
  "reconnue_fci": true|false,
  "groupe_fci": 1..10 | null,           // groupe FCI réel (null si non reconnue)
  "origine_ok": true | "pays correct",
  "categorie_loi_fr": null | "1" | "2",  // loi française du 6 janvier 1999 (chiens dits dangereux), null si non concerné
  "erreurs": [                            // champs ACTUELS du fichier qui sont faux
    {"champ": "temperament.good_with_children", "actuel": false, "correct": true, "gravite": "haute|moyenne|faible", "note": "courte justification"}
  ],
  "erreurs_texte": ["erreur factuelle repérée dans description ou history, en une phrase"],
  "scores": {                             // NOUVELLES notes 1 à 5, consensus des sources sérieuses
    "energie": 1-5,          // 1 = pantouflard, 5 = sportif infatigable
    "exercice_min_jour": entier,  // minutes d'activité réellement nécessaires par jour
    "enfants": 1-5,
    "chiens": 1-5,
    "chats": 1-5,
    "inconnus": 1-5,         // ouverture aux inconnus
    "appartement": 1-5,      // adaptation à la vie en appartement (avec sorties correctes)
    "solitude": 1-5,         // tolérance à rester seul quelques heures
    "aboiements": 1-5,       // 1 = discret, 5 = très bavard
    "education": 1-5,        // 1 = difficile, 5 = très facile
    "premier_chien": 1-5,    // 5 = idéal pour un premier chien
    "entretien_pelage": 1-5,
    "perte_poils": 1-5,
    "bave": 1-5,
    "chaleur": 1-5,          // tolérance à la chaleur (brachycéphales = 1)
    "froid": 1-5,
    "garde": 1-5,            // instinct de garde / protection
    "instinct_chasse": 1-5,  // propension à poursuivre chats, oiseaux, gibier
    "fugue": 1-5,            // tendance à fuguer / rappel difficile
    "robustesse": 1-5        // santé générale de la race
  },
  "hypoallergenique": true|false,   // perd très peu de poils, mieux toléré (jamais garanti)
  "sante_problemes": ["3 à 5 problèmes de santé fréquents de la race, en français"],
  "esperance_vie_ok": true | {"min": x, "max": y},
  "taille_poids_ok": true | {"height_cm": [min,max], "weight_kg": [min,max]},
  "confiance": "haute|moyenne|faible"
}

Champs actuels à contrôler en priorité : temperament.energy_level (low/moderate/high/very_high), good_with_children, good_with_dogs, good_with_cats, protective, living.apartment_friendly, living.ideal_environment, living.exercise_needs.daily_minutes, training.trainability, training.experience_required, coat.length/type/shedding/maintenance, physical.size_category/height_cm/weight_kg/life_span_years, breed_group, origin, temperament.traits.
Ne signale une erreur que si tu en es sûr (sources sérieuses, consensus). Pas d'invention. Si un doute : confiance "moyenne" et pas d'erreur.
Écris le résultat (tableau JSON valide, une entrée par race du lot, dans l'ordre) dans le fichier indiqué. Vérifie avec python3 -c "import json;json.load(open(...))" que le JSON est valide.
Réponse finale (courte, < 200 mots) : nombre de races traitées, nombre d'erreurs par gravité, les 5 erreurs les plus graves, et les races dont tu n'es pas sûr.
