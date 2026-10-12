---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["templates/pages/index.html","generate-breeds.cjs","js/app.js"]
---

# Passe design « moderniser l'existant » (12/10/2026)

Scope : tout le site (accueil, fiches, sélections, groupes, A à Z, test, comparateur, Tel Maître). Modes : accueil et test = Operate, fiches et pages éditoriales = Read, Tel Maître = Experience.
Audience et tâche : futurs propriétaires qui choisissent une race (voir PRODUCT.md).
Contraintes : nom et logo 🐕 conservés, ton léger (citations de l'en-tête, Tel Maître), chargement automatique de la liste, adresses des pages inchangées.
Moment mémorable : la révélation du résultat du test (la race n°1 en grand, ses raisons et ce qu'il faut prévoir).

## Direction contract
THESIS: le chien d'abord, la décision ensuite. Les 231 portraits studio et les raisons de compatibilité portent chaque écran ; l'habillage s'efface. Refuse la peau SaaS Tailwind par défaut : texte en dégradé, emojis en guise d'icônes, violet IA, sept rayons sans règle.
OWN-WORLD: fond slate-50, titres encre slate-900, un seul accent bleu (primary-600) pour l'action et la sélection ; vert, orange et rouge réservés aux verdicts (atout, à prévoir, loi), sur les mots plutôt que sur les barres. Bricolage Grotesque partout, chiffres tabulaires. Icônes Phosphor Regular, une seule famille. Rayons : interactif en pilule, boutons 12 px, cartes 16 px, panneaux 24 px, badges 6 px. Surfaces plates, ombre teintée au survol.
STORY: le visiteur dit comment il vit, voit les races classées avec photo entière et raisons, ouvre une fiche, lit « En bref » et ce qu'il faut prévoir, compare deux ou trois races.
FIRST VIEWPORT: accueil aligné à gauche, titre encre sur deux lignes (« Trouvez la race de chien » en graisse moyenne, « faite pour vous » en extra-grasse), une phrase, recherche et deux portes (test, Tel Maître) avec icônes, profils en un clic ; les premières cartes visibles dès le premier écran sur ordinateur.
FORM: extension d'un monde établi, sans tirage : new-work §3 « Extend an existing surface: Inherit its world and composition (...) No concept tournament » et « Never run the script for a local extension or a precisely specified narrow request ». Donc pas de clé de seed. Construction code-led (aucune génération d'image dans ce harnais). Interaction signature : la révélation du résultat du test.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
