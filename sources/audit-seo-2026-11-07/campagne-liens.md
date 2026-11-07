# Campagne de liens race-de-chien.com (préparée le 07/11/2026)

Statut : **à envoyer par Quentin**. Rien n'a été envoyé ni publié. Pourquoi : voir [site-audit.md](site-audit.md) § 2.5 et § 3 ; sans liens venus d'autres sites, Google n'explore pas les nouvelles pages.

## Règles

- Des liens **mérités**, jamais achetés ni échangés en masse : Google repère les réseaux de liens et les pénalise.
- Un message personnalisé par cible (citer leur site, leur race), pas d'envoi groupé.
- Viser la **pertinence** plutôt que le nombre : un lien d'un club de race ou d'un refuge vaut plus que dix annuaires.
- Ne promettre que ce que le site fait vraiment : 231 races notées sur 20 critères, le test en 8 questions, le comparateur, Tel Maître Tel Chien (un selfie, et l'IA trouve le sosie canin), gratuit, sans inscription, sans publicité.

## Les accroches

| Accroche | Pour qui | Page à donner |
|---|---|---|
| Le test « Quel chien choisir » : un classement personnalisé selon le logement, les enfants, le temps disponible | refuges, éducateurs, vétérinaires, futurs propriétaires | `/quel-chien-choisir` |
| Tel Maître Tel Chien : le sosie canin par selfie | presse, blogs, réseaux sociaux (c'est ce qui a fait le pic de mars) | `/tel-maitre-tel-chien` |
| Les fiches enrichies (éducation, activité, soins, avant d'adopter) | éleveurs, clubs de race | `/races/<race>` |
| Les sélections (appartement, premier chien, perd peu de poils…) | blogs, forums, groupes Facebook | `/selections/…` |
| La page chiens catégorisés (obligations légales) | associations, éducateurs, forums | `/chiens-categorises` |

## Les cibles, par ordre d'intérêt

1. **Refuges et associations de protection animale** (SPA locales, associations de sauvetage d'une race). Argument : choisir une race adaptée à son mode de vie évite des abandons. Beaucoup ont une page « conseils avant d'adopter » ou « liens utiles ».
2. **Éducateurs et comportementalistes canins**, **vétérinaires**, **pensions et toiletteurs** : pages ressources pour leurs clients, articles de blog.
3. **Éleveurs** des 26 races enrichies : leur fiche est maintenant complète, ils peuvent la citer sur leur page « la race ». Commencer par les éleveurs qui ont déjà une page de liens.
4. **Clubs de race** affiliés à la Société Centrale Canine : rubrique liens ou documentation. Taux de réponse plus faible, mais liens très pertinents.
5. **Presse et blogs animaliers** : angle Tel Maître Tel Chien (une IA qui trouve votre sosie canin), sujet léger et partageable.
6. **Communautés** : Reddit (r/france, sous-forums chiens), groupes Facebook de futurs propriétaires ou de races, forums animaliers. Répondre à une vraie question avec le test ou une sélection, jamais de message promotionnel collé partout.
7. **Votre réseau** : aurorastudio.fr lie déjà le site (vitrine des projets) ; ajouter le lien à LinkedIn (page Aurora, profil), Malt (portfolio) et GitHub si le dépôt devient public.

À éviter : annuaires généralistes, échanges de liens, commentaires de blogs, sites de communiqués payants.

## Messages prêts à coller

### Refuge ou association

> Bonjour,
>
> Je m'appelle Quentin, je suis développeur web en Gironde et j'ai créé race-de-chien.com, un site gratuit et sans publicité qui aide à choisir une race de chien adaptée à sa vie : logement, enfants, temps disponible, absences, autres animaux.
>
> Le test en 8 questions donne un classement personnalisé parmi 231 races : https://race-de-chien.com/quel-chien-choisir
>
> Je vous écris parce que beaucoup d'abandons viennent d'un chien choisi sur un coup de cœur, sans savoir s'il convenait au foyer. Si l'outil vous semble utile, vous pouvez le citer dans vos conseils avant adoption. Et si vous voyez une erreur ou un manque, je suis preneur de vos retours.
>
> Bonne journée,
> Quentin

### Éleveur ou club de race

> Bonjour,
>
> Je m'appelle Quentin, j'ai créé race-de-chien.com, un guide gratuit des races de chiens. Je viens de compléter la fiche du [RACE] : caractère au quotidien, éducation, activité, soins et ce qu'il faut savoir avant d'adopter, avec les dépistages à demander aux éleveurs.
>
> https://race-de-chien.com/races/[slug]
>
> Votre avis de connaisseur m'intéresse : si quelque chose vous semble inexact ou incomplet, dites-le moi, je corrige. Et si la fiche vous paraît juste, vous pouvez la proposer à vos futurs adoptants.
>
> Merci d'avance,
> Quentin

### Presse ou blog (angle Tel Maître Tel Chien)

> Bonjour,
>
> Petite idée de sujet léger : sur race-de-chien.com, on envoie un selfie et une IA cherche à quelle race de chien on ressemble, parmi 231 races. C'est gratuit, sans inscription, et le site ne garde pas la photo.
>
> https://race-de-chien.com/tel-maitre-tel-chien
>
> Le site propose aussi un test pour trouver la race faite pour soi et des fiches détaillées. Je peux vous envoyer des captures ou répondre à vos questions.
>
> Quentin

Vérifié : l'API Tel Maître n'enregistre pas la photo et la page confidentialité le dit (« Nous ne la conservons pas »), en précisant qu'Anthropic peut la garder un temps limité pour la sécurité de son service. Ne pas écrire « la photo n'est conservée nulle part ».

### Réponse dans une communauté

> Si ça peut aider, j'ai fait un petit test gratuit qui classe les races selon ton logement, tes horaires, les enfants, etc. : https://race-de-chien.com/quel-chien-choisir. Ça ne remplace pas une rencontre avec la race, mais ça évite de tomber amoureux d'un Malinois quand on vit en appartement et qu'on part 10 heures par jour.

## Suivi

Noter chaque contact (date, cible, réponse, lien obtenu) dans un tableau. Mesurer dans Search Console > Liens (domaines référents) et dans GA4 > Acquisition > Référents. Premiers effets sur l'exploration attendus quelques semaines après les premiers liens.
