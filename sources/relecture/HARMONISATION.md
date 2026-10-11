# Harmonisation des notes 1 à 5 (race-de-chien.com)

Fichier source : /private/tmp/claude-501/-Users-quentin-Desktop-Claude/b29437b6-3ed8-44f0-95ed-06304fc2325d/scratchpad/rdc/review/all-reviews.json
(169 objets ; chaque objet a "slug" et "scores" = 20 notes, plus "hypoallergenique", "sante_problemes").
Les noms des races : /Users/quentin/Desktop/Claude/race-de-chien/data/breeds.json (clé breeds, champ name_fr) + data/breed-slugs.json (id -> slug).

Les notes ont été attribuées par quatre relecteurs différents, chacun sur un quart des races : l'échelle a pu dériver d'un lot à l'autre.
Ta mission : pour CHAQUE critère de ton lot, regarde les 169 races ENSEMBLE, triées par note, et corrige les incohérences relatives
(ex. un Carlin noté 3 en énergie alors que d'autres petits chiens calmes sont à 2 ; un Malinois et un Border à 5 mais un Kelpie à 3).

Définition des échelles (1 à 5) :
- energie : 1 = grand pantouflard, 5 = sportif infatigable. exercice_min_jour : minutes d'activité réellement nécessaires (entier).
- enfants / chiens / chats / inconnus : 1 = à éviter, 5 = excellent.
- appartement : 5 = parfait en appartement (avec sorties normales), 1 = impossible.
- solitude : 5 = supporte bien quelques heures seul, 1 = très mal.
- aboiements : 1 = très discret, 5 = très bavard.
- education : 1 = difficile, 5 = très facile. premier_chien : 5 = idéal pour un débutant.
- entretien_pelage, perte_poils, bave : 1 = minimal, 5 = très important.
- chaleur / froid : tolérance, 1 = très faible (brachycéphales à la chaleur), 5 = excellente.
- garde : instinct de garde/protection. instinct_chasse : propension à poursuivre. fugue : tendance à fuguer, rappel difficile.
- robustesse : santé générale de la race (5 = très robuste).
Utilise toute l'échelle : chaque note doit avoir un sens comparatif sur l'ensemble des races. Base-toi sur le consensus des sources sérieuses (standards FCI, clubs de race, vétérinaires, sites de référence).

Sortie : un fichier JSON { "<critère>": { "<slug>": <nouvelle note>, ... }, ... } avec UNIQUEMENT les notes modifiées,
plus une clé "_notes" : { "<critère>": "2 à 4 phrases sur les corrections faites" }.
Vérifie la validité avec python3 -c "import json;json.load(open(...))".
Ne modifie aucun autre fichier. Réponse finale courte (< 150 mots) : nombre de notes modifiées par critère, et les corrections les plus marquantes.
