# Les autres langues du site

Le site s'écrit en français. Les autres langues sont des copies traduites, produites par `npm run generate`.
Le français reste la version par défaut, aux mêmes adresses. L'anglais vit sous `/en/`.

## Comment ça marche

1. Le générateur fabrique chaque page française comme d'habitude.
2. Pour chaque langue (`i18n/<langue>/config.json`), il reprend la page finie, remplace chaque phrase par sa
   traduction (`dictionnaire.json`), réécrit les liens internes vers les adresses de la langue et l'enregistre
   sous `/<langue>/`. Le code est dans `lib/i18n.cjs`.
3. Les deux versions d'une page se citent l'une l'autre (balises `hreflang`, plan du site), et le pied de page
   et l'en-tête proposent l'autre langue. Aucune redirection automatique.
4. Les scripts du navigateur (`js/`) passent leurs textes par ``T`…` `` et leurs adresses par `P(…)`. Sur une page
   anglaise, `js/i18n.en.js` (généré) leur donne les traductions. Sur une page française, rien ne change.

Une phrase sans traduction reste en français sur la page anglaise et part dans `i18n/<langue>/_a-traduire.json`.
Le générateur affiche le compte à chaque passage : `🌐 en : 7278 phrases traduites, 0 à traduire`.

## Les fichiers d'une langue

- `config.json` : adresses des pages, des sélections et des groupes dans la langue, libellé du lien, ordinaux.
- `races.json` : le nom de chaque race dans la langue (il donne aussi l'adresse de sa fiche).
- `dictionnaire.json` : phrase française → traduction. La clé est la phrase telle qu'elle sort du générateur :
  `<g1>…</g1>` pour une balise dans la phrase (lien, gras), `<x1/>` pour une icône, `{0}` pour une valeur
  des scripts, `__LASTMOD_FR__` pour la date.
- `guide.md` : règles de traduction, vocabulaire et noms des races. À donner à qui traduit.

## Après une modification du contenu français

Les phrases modifiées ou nouvelles n'ont pas encore de traduction :

```bash
npm run generate                     # liste les phrases à traduire dans i18n/en/_a-traduire.json
npm run i18n:decouper -- en          # les répartit en lots dans i18n/en/_lots/
# traduire chaque lot-XX.json en lot-XX.en.json en suivant guide.md, puis :
node lib/i18n-lots.cjs verifier en 01
npm run i18n:fusionner -- en         # ajoute les traductions vérifiées au dictionnaire
npm run generate
```

Un texte de script se balise avec ``T`…` ``, sans gabarit imbriqué dans le `${…}` (sortir l'expression dans une
variable), et une adresse interne passe par `P('/races/' + slug)`.

## Ajouter une langue

Copier `i18n/en/` en `i18n/<langue>/`, adapter `config.json` (adresses, `locale`, libellé), traduire
`races.json`, puis suivre la marche ci-dessus. Ajouter le format de date de la langue dans `FMT_DATE`
(generate-breeds.cjs) et les messages de l'API Tel Maître (`api/match-breed.js`).
