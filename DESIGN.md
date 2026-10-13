---
name: Race de Chien
description: Trouver la race de chien faite pour sa vie, notes comparables et raisons à l'appui.
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-wash: "#eff6ff"
  primary-selection: "#dbeafe"
  primary-ring: "#bfdbfe"
  primary-hover-border: "#93c5fd"
  primary-deep: "#1e3a8a"
  ink: "#0f172a"
  ink-hover: "#1e293b"
  text-body: "#334155"
  text-secondary: "#475569"
  text-muted: "#64748b"
  border: "#e2e8f0"
  border-strong: "#cbd5e1"
  surface-sunken: "#f1f5f9"
  page: "#f8fafc"
  surface: "#ffffff"
  gauge-on: "#64748b"
  gauge-off: "#e2e8f0"
  verdict-good: "#047857"
  verdict-good-text: "#065f46"
  verdict-good-wash: "#ecfdf5"
  verdict-good-ring: "#a7f3d0"
  verdict-plan: "#b45309"
  verdict-plan-text: "#92400e"
  verdict-plan-wash: "#fffbeb"
  verdict-plan-ring: "#fde68a"
  verdict-law: "#b91c1c"
  verdict-law-wash: "#fef2f2"
  verdict-law-ring: "#fecaca"
  text-on-ink: "#cbd5e1"
  text-on-ink-muted: "#94a3b8"
  share-facebook: "#1464cc"
  share-whatsapp: "#075e54"
  share-instagram: "#b7307a"
  logo-ring-start: "#3b82f6"
  logo-ring-end: "#9333ea"
typography:
  hero:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "34px"
    fontWeight: "500 puis 800"
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  hero-large:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "48px"
    fontWeight: "500 puis 800"
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "32px (44px dès 640px)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
  title:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.375
  body:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
  lead:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
  ui:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.375
  small:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
  label:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.25
  chip:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
  score:
    fontFamily: "Bricolage Grotesque, Bricolage Grotesque Fallback, system-ui, sans-serif"
    fontSize: "13px (14px dès 640px)"
    fontWeight: 800
    lineHeight: "20px"
    fontFeature: "tnum"
rounded:
  badge: "6px"
  check: "5px"
  capture-inner: "21px"
  segment: "8px"
  button: "12px"
  card: "16px"
  panel: "24px"
  pill: "9999px"
spacing:
  chip-gap: "6px"
  control-gap: "8px"
  card-padding: "16px"
  card-gap: "20px"
  panel-padding: "24px"
  section: "56px"
  gutter: "16px (24px dès 640px)"
  container-app: "1600px"
  container-read: "1152px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
    padding: "12px 16px"
  button-ink-hover:
    backgroundColor: "{colors.ink-hover}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-hover}"
    rounded: "{rounded.button}"
    padding: "12px 16px"
  toggle-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    height: "40px"
  toggle-pill-pressed:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  segment:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.segment}"
    padding: "8px"
  segment-pressed:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-hover}"
  chip-good:
    backgroundColor: "{colors.verdict-good-wash}"
    textColor: "{colors.verdict-good-text}"
    typography: "{typography.chip}"
    rounded: "{rounded.badge}"
    padding: "2px 8px"
  chip-plan:
    backgroundColor: "{colors.verdict-plan-wash}"
    textColor: "{colors.verdict-plan-text}"
    typography: "{typography.chip}"
    rounded: "{rounded.badge}"
    padding: "2px 8px"
  chip-law:
    backgroundColor: "{colors.verdict-law-wash}"
    textColor: "{colors.verdict-law}"
    typography: "{typography.chip}"
    rounded: "{rounded.badge}"
    padding: "2px 8px"
  score-high:
    backgroundColor: "{colors.verdict-good-wash}"
    textColor: "{colors.verdict-good}"
    typography: "{typography.score}"
    rounded: "{rounded.segment}"
    padding: "4px 10px"
  score-mid:
    backgroundColor: "{colors.verdict-plan-wash}"
    textColor: "{colors.verdict-plan-text}"
    rounded: "{rounded.segment}"
    padding: "4px 10px"
  score-low:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.segment}"
    padding: "4px 10px"
  breed-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-padding}"
  panel-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-padding}"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-hover}"
    rounded: "{rounded.button}"
    padding: "12px 16px 12px 44px"
---

# Design System: Race de Chien

## Overview

**Creative North Star : « Le chien d'abord, la décision ensuite »**

Le site est un outil de choix, pas une vitrine. Les 231 portraits studio (fond gris uni, chien entier de trois quarts) et les raisons de compatibilité portent chaque écran ; l'habillage s'efface derrière eux : fond gris très clair, cartes blanches plates à filet fin, encre bleu nuit pour les titres, un seul bleu pour agir et sélectionner. La densité est celle d'un catalogue qu'on parcourt : grilles de cartes serrées (20 px), filtres en colonne collante sur ordinateur et en feuille plein écran sur téléphone.

La couleur a un rôle de langage, pas de décor. Le bleu dit « vous pouvez agir ici » ou « c'est sélectionné ». Le vert, l'orange et le rouge disent un verdict (atout, à prévoir, loi), toujours portés par un mot, jamais par une barre seule. Tout le reste est en gris ardoise. Le ton léger du produit (citations de l'en-tête, Tel Maître, Tel Chien) vit dans les textes, pas dans les effets.

Cette passe a retiré la peau Tailwind par défaut du site d'origine : texte en dégradé, second accent fuchsia, emojis en guise d'icônes, sept rayons sans règle. Le logo garde son carré à bord dégradé et son chien emoji, engagement de marque.

**Key Characteristics:**
- Photo entière en tête de carte, score à côté du nom, jamais sur la photo.
- Un seul accent bleu pour l'action et la sélection.
- Verdicts en mots colorés, jauges neutres en ardoise.
- Bricolage Grotesque partout, chiffres tabulaires pour les scores.
- Icônes Phosphor Regular, une seule famille, en SVG.
- Surfaces plates, ombre teintée qui n'apparaît qu'au survol.
- Typographie française appliquée par le générateur.

## Colors

Une base ardoise froide, un bleu d'action franc et trois couleurs de verdict réservées aux mots.

### Primary
- **Bleu d'action** (primary, #2563eb) : boutons principaux (« Voir la fiche », « Comparer », « Accepter »), état pressé des pilules à bascule, case « Comparer » cochée, anneau de focus clavier, liens d'action dans le texte (en primary-hover pour le contraste), couleur de thème du navigateur. Survol des boutons pleins en primary-hover (#1d4ed8).
- **Lavis bleu** (primary-wash) : fond des puces de filtres actifs, du bouton Tel Maître dans l'en-tête, du survol des pilules ; primary-selection pour la sélection de texte (texte en primary-deep) ; primary-ring et primary-hover-border pour les anneaux du segment pressé et les bordures au survol.

### Neutral
- **Encre bleu nuit** (ink) : titres, bouton « Quel chien pour moi ? », panneaux sombres (intermède de l'accueil, encart test sur la fiche), pied de page, toast. Survol en ink-hover, qui sert aussi au texte des champs.
- **Ardoise de lecture** (text-body) : texte courant des fiches, libellés des pilules.
- **Ardoise secondaire** (text-secondary) et **ardoise discrète** (text-muted) : sous-titres, origines, aides des filtres, placeholders (text-muted, contraste AA sur blanc).
- **Filet** (border) : bordure de toutes les cartes et panneaux ; border-strong pour les champs, boutons contour et la case à cocher.
- **Gris enfoncé** (surface-sunken) : rails des contrôles segmentés, fond des photos en attente, score faible.
- **Fond de page** (page) et **surface** (surface, blanc) : tout le site repose sur le premier, toutes les cartes sur le second.

### Verdicts
- **Vert atout** (verdict-good, texte verdict-good-text sur verdict-good-wash) : raisons qui vont avec la vie du visiteur, score de 75 % et plus, notes favorables dans « En bref » et « Toutes ses notes », encadré « Idéal pour ».
- **Orange à prévoir** (verdict-plan, texte verdict-plan-text sur verdict-plan-wash) : ce qu'il faut prévoir, score de 55 à 74 %, notes défavorables, encadré « Moins adapté pour », races non reconnues FCI.
- **Rouge loi** (verdict-law sur verdict-law-wash) : chiens de 1re et 2e catégorie, encadré « Ce que dit la loi ». Rien d'autre.

### Named Rules
**La règle de l'accent unique.** Un seul bleu (primary) pour tout ce qui agit ou est sélectionné. Les échelles `secondary` (fuchsia) et `accent` (orange) existent encore dans `tailwind.config.cjs` mais sont retirées : ne pas les utiliser pour un nouveau travail.

**La règle du verdict en mots.** Le vert, l'orange et le rouge colorent un mot (« Très énergique », « Craint la chaleur », « Catégorie 2 »), jamais une jauge. Les jauges restent en ardoise (gauge-on sur gauge-off), quelle que soit la note.

**La règle du dégradé du logo.** Le bord dégradé du logo (logo-ring-start vers logo-ring-end, à 135°) est le seul dégradé du site. Jamais de texte en dégradé, jamais de dégradé ailleurs.

**L'exception des boutons de partage.** Sur Tel Maître, les boutons de partage gardent la couleur de leur réseau, assombrie pour tenir le contraste du texte blanc : Facebook #1464cc, WhatsApp #075e54, Instagram #b7307a, X et TikTok en encre. Cette exception ne s'étend à aucun autre composant.

## Typography

**Display Font:** Bricolage Grotesque, variable (graisses 400 à 800, taille optique 12 à 96), hébergée en local (`/fonts/bricolage-grotesque-latin.woff2`, sous-ensemble latin, préchargée)
**Body Font:** Bricolage Grotesque, avec « Bricolage Grotesque Fallback » (Arial recalée : size-adjust 105.97 %, ascent 87.76 %, descent 25.48 %) puis system-ui

**Character:** Une seule famille, grotesque un peu irrégulière, chaleureuse sans être enfantine ; la taille optique automatique (`font-optical-sizing: auto`) resserre les titres et ouvre le texte courant.

### Hierarchy
- **Hero** (500 puis 800, 34 px puis 48 px, 1.04, -0.03em) : le seul titre de l'accueil, sur deux lignes, première en graisse moyenne, seconde en extra-grasse. Le titre de Tel Maître reprend ce contraste de graisses à l'échelle display.
- **Display** (800, 32 px puis 44 px, 1.06, -0.03em) : tous les titres de page (fiche, sélection, groupe, A à Z, catégorisés) et le nom de la race n°1 au résultat du test. Une seule échelle.
- **Headline** (700, 24 px) : titres de section des fiches et sélections (« Pour qui ? », « Santé », « Races proches »).
- **Title** (700, 17 px sur ordinateur, 15 px sur téléphone, 1.375) : nom de race sur les cartes.
- **Body** (400, 16 px, 1.625) : textes des fiches ; **Lead** (17 px) sous le titre de l'accueil, limité à 60ch.
- **Label** (600, 13 px) : intitulés de filtres, termes des listes de faits, segments.
- **Chip** (600, 12 px) : raisons, à prévoir, catégorie légale.
- **Score** (800, 13 à 14 px, chiffres tabulaires) : pourcentage de compatibilité.

### Named Rules
**La règle de la famille unique.** Bricolage Grotesque partout, aucune deuxième police, aucune police système en titre.

**La règle de la typographie française.** Espace insécable avant « : ; ? ! » et après « « », entre un nombre et son unité (h, min, ans, cm, kg, %). Le générateur l'applique à tout le texte des pages ; les scripts du navigateur l'écrivent eux-mêmes (` `, `&nbsp;`). Les titres h1 à h3 sont équilibrés (`text-wrap: balance`).

## Layout

Deux largeurs. Les pages d'outil (accueil) vont jusqu'à container-app (1600 px), en trois zones : un bandeau d'entrée blanc pleine largeur (titre, recherche, portes, profils en un clic), puis sur le fond page un panneau de filtres blanc de 340 px, arrondi à 24 px et collant à 92 px du haut sur ordinateur et une grille de cartes à 1, 2, 3 puis 4 colonnes (640, 1280, 1536 px), espacées de card-gap. Les pages de lecture (fiche, sélection, groupe) tiennent dans container-read (1152 px) ; la fiche passe en deux colonnes à 1024 px, texte à gauche, « En bref » collant de 340 px à droite (en tête sur téléphone). Marges latérales gutter.

Sur téléphone, les filtres deviennent une feuille plein écran avec barre d'action en bas, la barre de résultats colle sous l'en-tête (68 px) en fond page translucide, les profils défilent horizontalement sans barre, et la carte de race passe en ligne : photo à 40 % à gauche (coins card intérieurs), texte à droite. Les sections d'une page de lecture sont séparées de section (56 px). La liste se charge au défilement ; un panneau sombre (intermède) s'insère dans la grille sur toute la largeur.

## Elevation & Depth

Plat par défaut. La profondeur vient du contraste entre le fond page et les surfaces blanches cernées d'un filet border, et des panneaux encre qui creusent la page. L'ombre n'apparaît qu'en réponse : au survol d'une carte (qui monte de 4 px), sur les éléments flottants (bandeau de consentement, toast, carte de résultat Tel Maître) et en ombre légère sur le segment pressé et le champ de recherche. Les barres collantes (en-tête, barre de comparaison) sont en blanc translucide avec flou d'arrière-plan.

### Shadow Vocabulary
- **Survol de carte** (`box-shadow: 0 20px 40px -14px rgba(15, 23, 42, .18)`, avec `translateY(-4px)`, 0,25 s) : cartes de race, seul relief au repos-survol.
- **Résultat Tel Maître** (`box-shadow: 0 24px 60px -24px rgba(15, 23, 42, .25)`) : la carte du sosie canin.
- **Flottants** (ombres Tailwind `shadow-lg` et `shadow-2xl`) : toast, lien d'évitement, bandeau de consentement.
- **Contrôle** (`shadow-sm`) : segment pressé, champ de recherche, sélecteur de tri.

### Named Rules
**La règle du plat au repos.** Aucune carte n'a d'ombre au repos. L'ombre teintée d'encre arrive au survol, jamais avant.

## Shapes

Le rayon dit la nature de l'objet. Pilule (pill) pour l'interactif qui bascule : profils, options, sélections, puces de filtres actifs, étiquettes de traits, barre de chargement. Boutons et champs à 12 px (button). Cartes de race, encadrés de verdict, blocs de notes et FAQ à 16 px (card). Panneaux à 24 px (panel) : en-tête de fiche, « En bref », intermède, encarts test et Tel Maître, résultat du test, zone de capture. Badges (raisons, catégorie, « Nouveau », rang) à 6 px (badge). Les segments et le score, petits contrôles posés dans un rail, sont à 8 px (segment) ; la case « Comparer » à 5 px (check), avec un trait de 1,5 px.

Les photos sont toujours en 4:3 (16:10 pour le grand résultat du test), recadrées en `object-cover`, coupées par le rayon de leur conteneur. Les bordures font 1 px partout, sauf la case à cocher (1,5 px), les réponses du test (2 px) et la zone de capture Tel Maître (3 px en tirets).

## Components

### Buttons
Francs et compacts, toujours à 12 px.
- **Primaire** (button-primary) : bleu, texte blanc en 700 (14 px), 10 à 12 px sur 16 px. Pour l'action qui conclut : « Voir la fiche », « Comparer », « Affiner avec vos propres critères », « Voir les N races ».
- **Encre** (button-ink) : pour la porte d'entrée principale vers le test (« Quel chien pour moi ? », « Est-il fait pour moi ? »). Survol en ink-hover.
- **Contour** (button-outline) : blanc, filet border-strong ; au survol la bordure passe à primary-hover-border et le texte au bleu. « Tel Maître, Tel Chien », « Comparer » sur la fiche (pressé : bordure bleue, fond lavis).
- **Focus** : anneau bleu de 2 px décalé de 2 px, au clavier seulement (`:focus-visible`).
- Les icônes des boutons sont des Phosphor de 16 à 20 px, à gauche du libellé ; la flèche vers la droite suit le libellé.

### Chips
- **Raison** (chip-good) avec l'icône `check`, **à prévoir** (chip-plan) avec `warning-circle`, **loi** (chip-law) sans icône : 12 px en 600, icône de 14 px, rayon badge. Toujours la catégorie légale en premier, puis les raisons, au plus quatre.
- **Filtre actif** : pilule lavis bleu, texte primary-deep, retrait au clic.

### Pilule à bascule (signature)
Le contrôle de tout le site : profils en un clic, critères « À la maison », longueurs de poil, liens vers les sélections. Blanc, filet border, 40 px de haut, 14 px en 500, icône Phosphor de 18 px en ardoise discrète. Survol : bordure primary-hover-border, fond lavis. Pressé (`aria-pressed="true"`) : plein bleu, texte et icône blancs. Désactivé : 40 % d'opacité. Compteur en 12 px 600 dans la pilule. Variante sur plusieurs lignes à 16 px de rayon.

### Contrôle segmenté
Rail gris enfoncé de 4 px de marge intérieure à 12 px de rayon, segments à 8 px, 13 px en 500. Pressé : segment blanc, texte bleu foncé, anneau primary-ring et ombre légère. Pour les questions « Ma vie » et l'entretien du poil.

### Cards / Containers
- **Carte de race** : surface, filet border, rayon card, photo 4:3 en tête (zoom de 5 % sur 500 ms au survol), nom en title et score à droite, origine et groupe en ardoise discrète, trois jauges (Énergie, Enfants, Entretien), puces de verdict, pied de 48 px au filet border avec le rang en France et la case « Comparer ». Remontée et ombre au survol. Les cartes qui arrivent montent de 10 px en fondu (0,45 s, décalage de 40 ms, au plus 8 pas).
- **Panneau** : surface, filet border, rayon panel, 20 à 24 px de marge intérieure.
- **Panneau encre** : fond ink, titres blancs, texte en ardoise claire, liens blancs soulignés au survol ; filets intérieurs en blanc à 10 %.
- **Encadrés de verdict** : rayon card, fond lavis du verdict, filet de la teinte claire, titre en 700 dans la teinte la plus foncée.

### Jauge
Cinq segments de 6 px de haut en pilule, espacés de 4 px : allumés en gauge-on, éteints en gauge-off. Toujours doublée d'un mot de verdict ou d'un texte pour les lecteurs d'écran (« 4 sur 5 »).

### Score
Pastille à 8 px, chiffres tabulaires en 800, anneau intérieur de la teinte claire : vert à 75 % et plus, orange de 55 à 74 %, gris en dessous. Toujours à côté du nom de la race.

### Case « Comparer »
Une sélection multiple se lit comme une case à cocher : carré de 18 px, rayon check, trait border-strong ; survol en bordure bleue claire ; cochée en plein bleu avec la coche blanche. Zone cliquable de 40 px.

### Inputs / Fields
- **Recherche** (search-field) : blanc, filet border-strong, rayon button, loupe Phosphor à 16 px du bord, ombre légère.
- **Focus** : bordure bleue et halo de 4 px en primary-selection. Le sélecteur de tri suit la même forme avec un halo de 2 px.

### Navigation
En-tête fixe de 68 px, blanc à 90 % avec flou, filet bas. Logo (carré blanc à 16 px de rayon, bord dégradé de 2 px, chien emoji) et nom en 700, sous-titre en ardoise discrète ; citation en italique au centre dès 1280 px ; liens en 14 px 500 ardoise, bleus au survol et sur la page courante (`aria-current`) ; Tel Maître en bouton lavis bleu à droite, plein bleu sur sa page. Sur téléphone, menu dans un bouton de 44 px qui déplie la liste et la citation. Fil d'Ariane en 14 px ardoise discrète. Pied de page encre, quatre colonnes de liens, signature « Créé par Aurora ».

**Langue** : le site est en français par défaut, la version anglaise vit sous `/en/` (voir `i18n/README.md`). Le lien vers l'autre langue est un lien texte, jamais un drapeau : dans l'en-tête dès 1024 px, globe Phosphor de 16 px et code de langue en 14 px 600 ardoise (« EN » ou « FR », nom complet pour les lecteurs d'écran), placé avant Tel Maître ; dans le menu du téléphone et en tête de la colonne « Le site » du pied de page, globe et nom complet (« English version », « Version française »). Il garde les filtres, le test ou la comparaison en cours.

## Do's and Don'ts

### Do:
- **Do** utiliser le bleu primary (#2563eb) pour toute action et toute sélection, et lui seul.
- **Do** poser chaque verdict sur un mot : vert pour un atout, orange pour ce qu'il faut prévoir, rouge pour la loi.
- **Do** garder les jauges en ardoise, quelle que soit la note.
- **Do** suivre la règle des rayons : interactif à bascule en pilule, boutons et champs 12 px, cartes 16 px, panneaux 24 px, badges 6 px.
- **Do** dessiner les icônes avec Phosphor Regular en SVG (`icon()` dans le générateur, `RDCIcon()` dans les scripts), en ajoutant toute nouvelle icône côté navigateur à `CLIENT_ICONS`.
- **Do** placer le score de compatibilité à côté du nom, jamais sur la photo.
- **Do** utiliser la classe d'échelle display pour tout nouveau titre de page.
- **Do** passer tout nouveau texte de page par la typographie française du générateur.
- **Do** écrire tout nouveau texte de script avec ``T`…` `` et toute adresse interne avec `P(…)`, pour que la version anglaise suive.
- **Do** laisser les cartes plates au repos et ne donner du relief qu'au survol.

### Don't:
- **Don't** utiliser les échelles `secondary` (fuchsia) ou `accent` (orange) de `tailwind.config.cjs` : elles sont retirées.
- **Don't** mettre du texte en dégradé, ni un dégradé ailleurs que sur le bord du logo.
- **Don't** utiliser un emoji comme icône ; le chien emoji n'existe que dans le logo.
- **Don't** colorer une jauge en vert, orange ou rouge.
- **Don't** employer le rouge pour autre chose que la loi.
- **Don't** ajouter une deuxième police ou une deuxième famille d'icônes.
- **Don't** étendre les couleurs de marque des boutons de partage hors de Tel Maître.
