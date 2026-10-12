# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Futurs propriétaires de chien, en France, qui hésitent entre plusieurs races avant d'adopter ou d'acheter un chiot. Ils arrivent souvent depuis Google sur une fiche de race ou une question (« chien pour appartement », « chien qui ne perd pas ses poils »), beaucoup sur mobile. Leur tâche : trouver les races compatibles avec leur logement, leur famille, leur temps et leur rythme, puis vérifier une race précise avant de se décider. Les propriétaires actuels qui consultent la fiche de leur chien sont un public secondaire.

## Product Purpose

Aider à choisir une race de chien qui va avec sa vie, plutôt qu'avec une photo ou une mode. Réussir, c'est qu'un visiteur reparte avec deux ou trois races vraiment compatibles et les raisons, et qu'il sache ce qu'il doit prévoir (temps, entretien, budget santé, loi).

## Positioning

Chaque race est notée de 1 à 5 sur les mêmes 20 critères, relus et harmonisés pour être comparables d'une race à l'autre. Un moteur de compatibilité classe les 231 races selon la vie du visiteur et dit pourquoi, sur l'accueil, le test et les sélections. Les sites concurrents publient des fiches éditoriales sans notes comparables ni classement personnalisé.

## Operating Context

- Accueil : questions « Ma vie » et filtres, liste classée par compatibilité avec chargement automatique au défilement, comparaison de 2 à 3 races.
- Test « Quel chien pour moi ? » en 8 questions.
- Fiches de race : En bref, Pour qui, présentation, histoire, santé, entretien, toutes les notes, questions fréquentes.
- Sélections thématiques, pages de groupes FCI, liste de A à Z, page sur les chiens catégorisés.
- Tel Maître, Tel Chien : un selfie, l'IA trouve la race qui vous ressemble (Claude Haiku, 5 essais par jour).

## Capabilities and Constraints

- Site statique généré par `npm run generate` depuis `data/breeds.json` et `templates/` ; Tailwind 3.4 compilé ; hébergé sur Vercel, déployé à chaque push sur `main`.
- Adresses des pages (`/races/<slug>`, `/selections/<slug>`, `/groupes/<slug>`) stables : le référencement en dépend.
- Mesure d'audience (Google Analytics) seulement après consentement.
- Les photos des races sont générées par IA dans un même style studio, fond gris uni, chien entier de trois quarts.

## Brand Commitments

- Nom : Race de Chien. Logo : le chien emoji dans un carré à bord dégradé, à garder.
- Ton léger et chaleureux : citations humoristiques dans l'en-tête, Tel Maître Tel Chien, vouvoiement.
- Signature du créateur : « Créé par Aurora » dans le pied de page, lien aurorastudio.fr.

## Evidence on Hand

- 231 fiches avec notes, mesures, santé et photos (`data/breeds.json`, `images/breeds/`).
- Statistiques LOF 2025 de la Société Centrale Canine (popularité en France).
- Aucun témoignage, avis client ou chiffre d'audience publiable : ne pas en inventer.

## Product Principles

1. La compatibilité avant la photo : chaque écran aide à décider, pas seulement à admirer.
2. Dire pourquoi : un classement sans raisons ne sert à rien.
3. Honnête sur les contraintes : temps, poils, santé, loi, sans dramatiser.
4. Rapide et lisible sur mobile : la plupart des visites arrivent d'une recherche sur téléphone.

## Accessibility & Inclusion

Niveau visé : WCAG 2.2 AA (contrastes, clavier, lecteurs d'écran, mouvement réduit respecté).
