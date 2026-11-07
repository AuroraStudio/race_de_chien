# Audit SEO de race-de-chien.com (7 novembre 2026)

Statut : **provisoire** (pas de paquet `seo-findings.json` validé : aucune passation à une autre équipe n'est prévue). Propriétaire des décisions : Quentin.

Question posée : « un annuaire super complet mais pas de visite, pourquoi ? »

## 1. Cadrage

| Élément | Valeur |
|---|---|
| Objectif | Comprendre l'absence de trafic venu des moteurs, surtout Google |
| Propriété | `https://race-de-chien.com/` (Search Console, `siteOwner`) ; GA4 propriété 526331408 |
| Périmètre | Les 795 adresses du sitemap (265 FR, 264 EN, 264 ES, plus 2 accueils de langue) |
| Période | Search Console : 15/07/2025 au 07/11/2026 (le site démarre le 01/03/2026) ; GA4 : 90 derniers jours |
| Sources | API Search Console (performances + inspection d'URL des 795 adresses), API GA4, HTML en ligne, dépôt git local |
| Manques | Ahrefs refuse les données de liens (forfait insuffisant) ; outils GSC Wizard non branchés (compte à part) ; pas d'accès Bing Webmaster Tools ; pas de journaux serveur |
| Couloirs retenus | indexation et exploration, historique de performance, qualité des fiches (contenu programmatique), autorité, international (EN/ES), mesure |
| Couloirs écartés | commerce, local, vidéo, actualités/Discover : sans objet pour ce site |

## 2. Constats

### 2.1 Google n'envoie presque personne, Bing oui (confirmé)

- Search Console, 90 jours (09/08 au 07/11/2026) : **12 clics, 229 impressions, position moyenne 50,9**.
- GA4, 90 jours, sessions par source : Bing 65, Ecosia 35, Yahoo (référent) 23, DuckDuckGo 13, Qwant 11, Yahoo 5 ; **Google 32 sessions pour 6 utilisateurs**. Les moteurs adossés à Bing envoient environ 150 sessions, cinq fois Google.
- ChatGPT : 36 sessions. Direct : 172.
- GA4 ne compte que les visiteurs qui acceptent les cookies depuis le 11/10 : les chiffres réels sont plus élevés, mais Search Console (qui ne dépend pas du consentement) confirme que Google est quasi absent.

### 2.2 Le site a été rétrogradé par Google autour du 22 juillet 2026 (confirmé pour la chute, cause supposée)

Search Console, impressions par jour :

| Période | Impressions par jour | Position moyenne |
|---|---|---|
| 01 au 08/03/2026 (lancement) | 12 à 157 | 18 à 46 |
| avril à juin | 10 à 50 | 20 à 50 |
| 24/06 au 21/07 | 40 à 86 (pics) | 20 à 45 |
| **depuis le 22/07** | **0 à 12** | **50 à 95** |

- Le dépôt git n'a **aucun commit entre le 02/03 et le 11/10/2026** : la chute ne vient pas d'une modification du site.
- Aucune mise à jour de Google confirmée à cette date n'a été trouvée (mise à jour de base de mai terminée le 02/06 ; secousses non confirmées vers le 11/07). Hypothèse la plus probable : fin de la période d'essai qu'un site neuf reçoit, puis réévaluation de sa qualité globale par Google.
- La refonte du 11/10 n'a pas encore produit d'effet visible : quelques positions remontent (accueil 59,5 → 25,4 sur 28 jours) mais sur 1 à 7 impressions par jour, c'est du bruit.

### 2.3 La majorité des pages ne sont pas dans l'index (confirmé, inventaire complet)

Inspection d'URL Search Console des 795 adresses du sitemap, le 07/11/2026 (fichier brut : `raw/inspection-2026-11-07.csv`) :

| État dans Google | FR | EN | ES | Total |
|---|---|---|---|---|
| Indexée | 152 | 3 | 3 | **158 (20 %)** |
| Explorée, actuellement non indexée | 14 | 0 | 0 | 14 |
| Découverte, actuellement non indexée | 35 | 99 | 106 | 240 |
| Inconnue de Google | 64 | 163 | 156 | 383 |
| Total | 265 | 265 | 265 | 795 |

- **623 adresses sur 795 n'ont jamais été explorées.** Les 172 explorées l'ont été entre juin et le 07/11.
- Le partage est net entre l'ancien site et la refonte. Anciennes fiches (sitemap de mars, 169 fiches) : 149 indexées. **Tout ce qui a été créé depuis le 11/10 n'a jamais été exploré** : 62 nouvelles fiches, le test `/quel-chien-choisir`, `/liste-des-races`, `/groupes-de-races`, les 9 pages de groupes, les 16 sélections, `/chiens-categorises`, et 526 pages EN/ES (seuls `/en`, `/es` et 4 fiches traduites sont indexés).
- Ces pages sont pourtant toutes liées en HTML depuis l'accueil, que Google a relu le 04/11. Ce n'est donc pas un problème de découverte : Google les voit et **choisit de ne pas les explorer**. Pour un site de cette taille, ce n'est pas une question de budget d'exploration mais de demande : Google n'attend rien de neuf d'intéressant de ce domaine.
- 14 anciennes fiches ont été explorées puis **refusées** (« explorée, non indexée ») : Affenpinscher, Bouvier bernois, Braque de Weimar, Chien chinois à crête, Chien finnois de Laponie, Clumber spaniel, Coonhound bleuté, Berger anglais, Épagneul d'eau américain, Fox-terrier à poil lisse, Lévrier afghan, Retriever de Nouvelle-Écosse, Schnauzer nain, Setter anglais. C'est le signal de qualité le plus direct : Google a lu ces pages et les a jugées inutiles à garder.
- Aucun écart de canonique entre Google et le site, aucune erreur d'exploration.

### 2.4 Les fiches sont surtout un gabarit (confirmé sur 2 fiches, à généraliser avec prudence)

- Fiche Chihuahua : environ 930 mots visibles, mais **la prose propre à la race tient en deux paragraphes** (présentation, histoire, environ 170 mots) plus une liste de maladies. Le reste, ce sont des étiquettes de notes (« Énergie Modérée, 3 sur 5 ») et des réponses de FAQ fabriquées à partir des mêmes notes.
- Comparaison Chihuahua / Labrador, une fois noms et chiffres masqués : **28 phrases sur 53 sont identiques**.
- Le titre promet « caractère, éducation, santé et entretien » ; l'éducation n'a pas de section, et ce que cherchent les gens sur une race (prix d'un chiot, alimentation, poids adulte selon le sexe, éducation, défauts) est absent ou réduit à une ligne.
- Photos générées par IA (mention en pied de page). Google ne pénalise pas l'IA en soi, mais 231 fiches au même moule, plus 528 traductions automatiques, sur un domaine sans liens, ressemblent à du contenu produit à grande échelle. **Hypothèse** sur la réévaluation de juillet : ce signal de qualité globale, pas un défaut technique.

### 2.5 Aucune autorité (supposé, preuve indirecte)

- Ahrefs indisponible (forfait). Preuves indirectes : GA4 ne montre presque aucun site qui envoie des visiteurs par un lien (Reddit 13 sessions, LinkedIn 3, Medium 3) ; l'inspection d'URL de l'accueil cite comme pages référentes deux sites de recopie automatique (`shini-diski.com.ua`, `dzj.me`).
- Face à Wamiz, Woopets, Royal Canin, la Centrale Canine ou Wikipédia sur « labrador », « chihuahua », « terre-neuve », un domaine sans liens ne passe pas la page 5 : c'est exactement ce que montre Search Console (Terre-Neuve 23 impressions en position 71,5 ; Saint-Hubert 14 en position 79,6).

### 2.6 Technique : sain (confirmé)

- `robots.txt` correct (seul `/api/` bloqué), sitemap lu par Google le 01/11, 795 URL, 0 erreur.
- HTTPS, redirections 308 de `http://` et `www.` vers le domaine nu, `X-Robots-Tag: index, follow`, canonique propre, hreflang FR/EN/ES/x-default cohérent, fil d'Ariane reconnu par Google, Lighthouse mobile 98 à 100 (relevé du 12/10).
- L'accueil et `/liste-des-races` ont les 231 liens de fiches en HTML (pas seulement en JavaScript).
- Rien de technique n'explique l'absence de trafic.

### 2.7 Version Markdown pour les IA (couloir demandé par la compétence, sans effet sur Google)

- `/llms.txt` et `/sitemap.md` : 404. Aucune version `.md` des pages.
- C'est une exigence propre à la compétence `seo-aeo-geo-ultimate`, pas un facteur de classement Google ni une cause du manque de visites. À garder pour plus tard, quand le site aura du trafic à faire citer par les IA (ChatGPT envoie déjà 36 sessions sur 90 jours).

## 3. Synthèse

Le site n'a pas de problème technique. Il a un problème de **confiance** : Google l'a testé de mars à juillet (positions 20 à 50, jamais assez haut pour être cliqué), puis l'a mis de côté vers le 22 juillet. Depuis, il ne montre presque plus le site et **n'a exploré aucune des 620 pages créées par la refonte**, test et sélections compris : les meilleures pages du site sont invisibles parce qu'elles n'ont jamais été lues. Rien ne dit à Google que ce domaine vaut mieux que Wamiz ou la Centrale Canine : pas de liens, et des fiches dont la moitié du texte est commun à toutes les races. Bing, plus indulgent, envoie déjà cinq fois plus de visiteurs.

Ce qui ne marchera pas : retoucher les titres, les balises ou la vitesse (déjà bons), ou ajouter encore des pages (Google n'explore déjà pas celles qui existent).

## 4. Plan d'action (en attente de validation)

| # | Action | Effet attendu | Effort |
|---|---|---|---|
| 1 | Obtenir des liens : faire connaître le test « Quel chien choisir » et Tel Maître Tel Chien (presse animalière, blogs, éleveurs, refuges, forums, Reddit, Facebook) | Seul levier qui débloque l'exploration et le classement | Moyen, régulier |
| 2 | Écrire de la vraie matière sur les 20 à 30 races les plus recherchées (éducation, prix du chiot, alimentation, défauts, vécu) et enrichir les sélections | Pages qui méritent d'être indexées | Élevé |
| 3 | Demander l'indexation à la main dans Search Console (Inspection de l'URL > Demander une indexation, une dizaine par jour, l'API ne le permet pas) : `/quel-chien-choisir`, `/liste-des-races`, `/selections/premier-chien`, `/selections/chiens-pour-appartement`, `/selections/chiens-qui-perdent-peu-de-poils`, `/selections/chiens-pour-enfants`, `/groupes-de-races`, puis les fiches populaires jamais lues (Teckel, Jack Russell, Chihuahua, Bull terrier) | Force une première lecture, sans garantie d'indexation | Faible |
| 4 | Brancher Bing Webmaster Tools et IndexNow au déploiement | Consolider la seule source de trafic qui marche | Faible |
| 5 | Retirer EN et ES de l'index (noindex + sortie du sitemap) tant que le français n'est pas indexé | Concentrer l'effort d'exploration de Google sur le français | Faible, réversible |
| 6 | Suivre l'effet sur 8 à 12 semaines dans Search Console (impressions, pages indexées) | Savoir si ça repart | Faible |

Pages à pousser en priorité sont listées dans l'inventaire (section 2.3).

## 5. Actions réalisées le 07/11/2026 (validées par Quentin)

| # | Action | Détail | État |
|---|---|---|---|
| 3 | Demandes d'indexation dans Search Console | `/quel-chien-choisir`, `/liste-des-races`, `/selections/premier-chien`, `/selections/chiens-pour-appartement`, `/selections/chiens-qui-perdent-peu-de-poils`, `/selections/chiens-pour-enfants`, `/groupes-de-races` : « Indexation demandée » confirmé pour chacune | fait |
| 4 | IndexNow | clé `a0ea3e26d0970313b2a7aa226dc5e8d8.txt` à la racine, script `lib/indexnow.cjs` (`npm run indexnow`), envoi automatique après chaque déploiement de production (`.github/workflows/indexnow.yml`, événement `deployment_status` de Vercel) | fait |
| 5 | EN et ES hors de l'index | `"indexer": false` dans `i18n/en|es/config.json` : pages et sélecteur de langue gardés, `noindex, follow`, hors du sitemap (795 → 265 URL), plus de hreflang ; en-tête global `X-Robots-Tag: index, follow` retiré de `vercel.json` (comportement par défaut). Pour revenir en arrière : supprimer la ligne `indexer` et régénérer | fait |
| 2 | Fiches enrichies | section « Vivre avec un… » (au quotidien, éducation, activité, alimentation et soins, avant d'adopter) sur les 25 races les plus inscrites au LOF + Jack Russell, dans `data/guides.json` (≈ 200 mots propres par race), en français seulement | fait (1er lot) |
| 1 | Campagne de liens | cibles, accroches et messages prêts à coller dans [campagne-liens.md](campagne-liens.md) | à envoyer par Quentin |
| 4 bis | Bing Webmaster Tools | demande un compte Microsoft : import possible depuis Search Console en quelques clics | à faire par Quentin |

Suite prévue : demander l'indexation des fiches enrichies jamais explorées (Teckel, Jack Russell, Chihuahua, Berger Américain Miniature…) dès le prochain quota quotidien de Search Console, puis relever les pages indexées toutes les deux semaines.
