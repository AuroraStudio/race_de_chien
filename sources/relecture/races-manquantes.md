# Races manquantes sur race-de-chien.com, vues depuis la France

_Rapport du 11/10/2026. Aucun fichier du dépôt n'a été modifié. Données brutes : `races-manquantes.json` (même dossier)._

## 1. Sources

| Donnée | Source | Année |
|---|---|---|
| Inscriptions LOF par race (2024, 2025) et confirmations 2025, par groupe | Société Centrale Canine, « Statistiques LOF 2025 » : https://www.centrale-canine.fr/sites/default/files/2026-01/Statistiques%20LOF%202025.pdf | 2025 (publié en janvier 2026) |
| Top 20 et chiffres clés | Communiqué SCC « Top 20 des chiens préférés des Français 2025 » : https://www.centrale-canine.fr/sites/default/files/2026-01/CP%20-%20Centrale%20Canine_Chiens%20pr%C3%A9f%C3%A9r%C3%A9s%20des%20fran%C3%A7ais%202025_val.pdf | 2025 |
| Groupe FCI, pays d'origine, statut (définitif ou provisoire) | Nomenclature FCI, pages des 10 groupes + races provisoires : https://www.fci.be/fr/nomenclature/ et https://www.fci.be/fr/nomenclature/provisoire.aspx (consultées le 11/10/2026 : 344 races définitives, 19 provisoires) | 2026 |
| Races françaises reconnues par la SCC mais pas par la FCI | SCC, « 5 races françaises NON FCI à découvrir » : https://www.centrale-canine.fr/articles/5-races-francaises-non-fci-decouvrir (page protégée, contenu confirmé par recherche) | 2025-2026 |
| Chiens catégorisés | Service-public.gouv.fr, fiche F1839 (vérifiée le 07/11/2025) : https://www.service-public.gouv.fr/particuliers/vosdroits/F1839 ; arrêté du 27 avril 1999 ; Code rural art. L211-11 à L211-16 | 2025 |

Chiffres clés 2025 : **199 699 chiens inscrits au LOF** (total recalculé à l'unité sur les 10 groupes du PDF), 312 lignes de races dans le tableau SCC, dont 286 avec au moins une inscription (le communiqué SCC parle de « 286 races différentes »). Une « inscription » = un chiot né en France et inscrit au LOF dans l'année : c'est le meilleur indicateur disponible de la popularité réelle d'une race chez les éleveurs français.

## 2. Méthode et équivalences retenues

Chaque ligne SCC (et les variétés que la SCC compte à part) a été rapprochée d'un slug du site. Équivalences non évidentes :

- `beauceron` = Berger de Beauce ; `briard` = Berger de Brie ; `bobtail-berger-anglais-ancien` = Chien de berger anglais ancestral ; `cane-corso` = Chien de cour italien ; `dogue-des-canaries` = Presa canario ; `mastiff-tibetain` = Dogue du Tibet ; `schnauzer-standard` = Schnauzer moyen ; `kangal` = Chien de berger Kangal ; `leonberg` = Chien de Leonberg.
- `vallhund-suedois` = Spitz des Visigoths ; `thai-ridgeback` = Chien thaïlandais à crête dorsale ; `chien-nu-mexicain-xoloitzcuintli` = Chien nu du Mexique ; `kooikerhondje` = Petit chien hollandais de chasse au gibier d'eau ; `lagotto-romagnolo` = Chien d'eau romagnol ; `epagneul-d-eau-americain` = Chien d'eau américain.
- `griffon-d-arret-a-poil-dur` = Griffon à poil dur Korthals (race **française** pour la FCI) ; `vizsla-braque-hongrois` = Braque hongrois à poil court ; `coonhound-noir-et-feu` = Chien noir et feu pour la chasse au raton laveur ; `toy-terrier-anglais-noir-et-feu` = Terrier d'agrément anglais noir et feu.
- `epagneul-papillon` = Épagneul nain continental (la SCC compte Papillon et Phalène ensemble : 616).
- `spitz-nain-loulou-de-pomeranie` et `keeshond-loulou-hollandais` sont deux tailles du **Spitz allemand** (FCI n° 97). La SCC ne sépare pas les tailles : seulement « autres couleurs » (2 320) et « loup » (346, = Keeshond). Moyen, grand et petit ne sont donc pas des entrées SCC distinctes : une page chapeau `spitz-allemand` suffit.
- **Berger belge** : la SCC compte les 4 variétés à part (Malinois 6 094, Tervueren 927, Groenendael 380, Laekenois 4). Le site a Malinois et Tervueren : Groenendael et Laekenois sont listés comme manquants.
- **Caniche** : la SCC compte 1 429 caniches (nain 949, toy 280, grand 173, moyen 27, toutes couleurs). Le site a nain et toy : grand et moyen sont listés comme manquants.
- `berger-anglais` = English Shepherd américain (non FCI), sans rapport avec le Bobtail.

## 3. À corriger avant d'ajouter quoi que ce soit

Deux fiches existantes portent le nom d'une race très inscrite au LOF mais décrivent **une autre race** (héritage de TheDogAPI) :

| Slug existant | Ce que dit la fiche | Race attendue par un lecteur français | LOF 2025 | Action |
|---|---|---|---|---|
| `cocker-spaniel` | Origine « États-Unis », « reconnu par l'AKC en 1946 » : c'est le **Cocker américain**, doublon de `cocker-americain` | Cocker spaniel anglais, **4e race de France** | 7 585 | Réécrire la fiche en Cocker anglais (origine Grande-Bretagne, groupe 8) |
| `bouledogue-anglais` | « Développé dans les années 1970 par David Leavitt » : c'est l'**Olde English Bulldogge** (non FCI) | Bulldog (FCI n° 149, Grande-Bretagne) | 1 156 | Réécrire en Bulldog ; l'Olde English Bulldogge peut partir sur un autre slug ou disparaître |

Origines à rectifier pour coller au référentiel FCI (que les lecteurs français retrouvent sur les pedigrees) :

- `caniche-nain`, `caniche-toy` : le site dit « Allemagne », la FCI dit **France** (le Caniche est une race française, standard n° 172). C'est la correction la plus visible.
- `basset-hound` : le site dit « France », la FCI dit Grande-Bretagne (ancêtres français, race fixée en Angleterre).
- `griffon-d-arret-a-poil-dur` (Korthals) : FCI = France. `levrier-greyhound` : FCI = Grande-Bretagne. `husky-siberien` : FCI = États-Unis (pays de patronage). `labrador-retriever` : FCI = Grande-Bretagne.
- `akita` : la fiche décrit l'Akita japonais, mais la base TheDogAPI suit le standard AKC, qui correspond morphologiquement à l'**Akita américain**. En France les deux races sont distinctes au LOF (Akita 795, Akita américain 549) : vérifier photos et gabarits.

## 4. Races manquantes classées par inscriptions LOF 2025

**174 entrées manquantes** au total dans le JSON : 155 ont au moins une inscription LOF en 2025, 54 en ont au moins 100. S'y ajoutent les 2 fiches à réécrire de la section 3. Le tableau ci-dessous liste toutes celles qui ont au moins 20 inscriptions (+ le Spitz allemand chapeau) ; le reste est dans le JSON.

Priorité : **haute** = 300 inscriptions ou plus, ou race française à 150 ou plus ; **moyenne** = 50 ou plus, ou toute race française, ou intérêt légal (Tosa) ; **basse** = le reste.

| # | Nom français officiel | Gr. FCI | Statut FCI | Origine | LOF 2025 | LOF 2024 | Slug proposé | Priorité | FR |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Teckel | 4 | définitive | Allemagne | 5 582 | 5 065 | `teckel` | haute |  |
| 2 | Chihuahua | 9 | définitive | Mexique | 2 898 | 2 914 | `chihuahua` | haute |  |
| 3 | Spitz allemand (petit, moyen, grand) | 5 | définitive | Allemagne | voir note* |  | `spitz-allemand` | moyenne |  |
| 4 | Petit épagneul de Münster | 7 | définitive | Allemagne | 1 823 | 1 892 | `petit-epagneul-de-munster` | haute |  |
| 5 | Terrier Jack Russell | 3 | définitive | Grande-Bretagne (développé en Australie) | 1 641 | 1 763 | `jack-russell-terrier` | haute |  |
| 6 | Bulldog continental | 2 | provisoire | Suisse | 773 | 721 | `bulldog-continental` | haute |  |
| 7 | Chien d'arrêt allemand à poil dur (Drahthaar) | 7 | définitive | Allemagne | 706 | 812 | `drahthaar` | haute |  |
| 8 | Basset fauve de Bretagne | 6 | définitive | France | 690 | 800 | `basset-fauve-de-bretagne` | haute | oui |
| 9 | Pointer anglais | 7 | définitive | Grande-Bretagne | 671 | 637 | `pointer-anglais` | haute |  |
| 10 | Gascon saintongeois | 6 | définitive | France | 664 | 602 | `gascon-saintongeois` | haute | oui |
| 11 | Braque français, type Pyrénées | 7 | définitive | France | 623 | 606 | `braque-francais-type-pyrenees` | haute | oui |
| 12 | Colley à poil long (Collie rough) | 1 | définitive | Grande-Bretagne | 592 | 580 | `colley-a-poil-long` | haute |  |
| 13 | Terrier de chasse allemand (Jagdterrier) | 3 | définitive | Allemagne | 591 | 540 | `terrier-de-chasse-allemand` | haute |  |
| 14 | Griffon nivernais | 6 | définitive | France | 571 | 583 | `griffon-nivernais` | haute | oui |
| 15 | Akita américain | 5 | définitive | Japon (développé aux États-Unis) | 549 | 585 | `akita-americain` | haute |  |
| 16 | Griffon bleu de Gascogne | 6 | définitive | France | 529 | 453 | `griffon-bleu-de-gascogne` | haute | oui |
| 17 | Dogue de Bordeaux | 2 | définitive | France | 517 | 649 | `dogue-de-bordeaux` | haute | oui |
| 18 | Laïka de Iakoutie | 5 | provisoire | Russie | 481 | 406 | `laika-de-iakoutie` | haute |  |
| 19 | Chien d'oysel allemand (Wachtelhund) | 8 | définitive | Allemagne | 461 | 426 | `chien-d-oysel-allemand` | haute |  |
| 20 | Beagle-harrier | 6 | définitive | France | 440 | 478 | `beagle-harrier` | haute | oui |
| 21 | Porcelaine | 6 | définitive | France | 384 | 326 | `porcelaine` | haute | oui |
| 22 | Berger belge Groenendael | 1 | définitive | Belgique | 380 | 360 | `berger-belge-groenendael` | haute |  |
| 23 | Retriever à poil plat (Flat-coated retriever) | 8 | définitive | Grande-Bretagne | 370 | 257 | `flat-coated-retriever` | haute |  |
| 24 | Terrier du révérend Russell (Parson Russell terrier) | 3 | définitive | Grande-Bretagne | 360 | 399 | `parson-russell-terrier` | haute |  |
| 25 | Chien courant suisse | 6 | définitive | Suisse | 358 | 376 | `chien-courant-suisse` | haute |  |
| 26 | Berger des Pyrénées à poil long | 1 | définitive | France | 345 | 387 | `berger-des-pyrenees-a-poil-long` | haute | oui |
| 27 | Griffon fauve de Bretagne | 6 | définitive | France | 308 | 372 | `griffon-fauve-de-bretagne` | haute | oui |
| 28 | Chien courant slovaque | 6 | définitive | Slovaquie | 292 | 314 | `chien-courant-slovaque` | moyenne |  |
| 29 | Chien-loup tchécoslovaque | 1 | définitive | Slovaquie / République tchèque | 262 | 271 | `chien-loup-tchecoslovaque` | moyenne |  |
| 30 | Berger de Picardie (Berger picard) | 1 | définitive | France | 240 | 136 | `berger-de-picardie` | haute | oui |
| 31 | Basset des Alpes | 6 | définitive | Autriche | 238 | 208 | `basset-des-alpes` | moyenne |  |
| 32 | Épagneul français | 7 | définitive | France | 236 | 344 | `epagneul-francais` | haute | oui |
| 33 | Petit bleu de Gascogne | 6 | définitive | France | 234 | 250 | `petit-bleu-de-gascogne` | haute | oui |
| 34 | Ariégeois | 6 | définitive | France | 227 | 242 | `ariegeois` | haute | oui |
| 35 | Briquet griffon vendéen | 6 | définitive | France | 174 | 132 | `briquet-griffon-vendeen` | haute | oui |
| 36 | Grand caniche | 9 | définitive | France | 173 | 203 | `grand-caniche` | haute | oui |
| 37 | Épagneul picard | 7 | définitive | France | 168 | 145 | `epagneul-picard` | haute | oui |
| 38 | Hovawart | 2 | définitive | Allemagne | 159 | 209 | `hovawart` | moyenne |  |
| 39 | Bruno Saint-Hubert français | 6 | non FCI | France | 159 | 197 | `bruno-saint-hubert-francais` | haute | oui |
| 40 | Braque d'Auvergne | 7 | définitive | France | 159 | 203 | `braque-d-auvergne` | haute | oui |
| 41 | Basset artésien normand | 6 | définitive | France | 158 | 79 | `basset-artesien-normand` | haute | oui |
| 42 | Mastiff | 2 | définitive | Grande-Bretagne | 157 | 146 | `mastiff` | moyenne |  |
| 43 | Cursinu (Chien corse) | 5 | non FCI | France (Corse) | 153 | 168 | `cursinu` | haute | oui |
| 44 | Grand bouvier suisse | 2 | définitive | Suisse | 148 | 167 | `grand-bouvier-suisse` | moyenne |  |
| 45 | Anglo-français de petite vénerie | 6 | définitive | France | 147 | 125 | `anglo-francais-de-petite-venerie` | moyenne | oui |
| 46 | Barzoï (Lévrier russe) | 10 | définitive | Russie | 143 | 102 | `barzoi` | moyenne |  |
| 47 | Petit basset griffon vendéen | 6 | définitive | France | 127 | 134 | `petit-basset-griffon-vendeen` | moyenne | oui |
| 48 | Bouvier de l'Entlebuch | 2 | définitive | Suisse | 121 | 134 | `bouvier-de-l-entlebuch` | moyenne |  |
| 49 | Chien de rouge de Bavière | 6 | définitive | Allemagne | 118 | 128 | `chien-de-rouge-de-baviere` | moyenne |  |
| 50 | Berger de Bohême (Chodský pes) | 1 | provisoire | République tchèque | 112 | 30 | `berger-de-boheme` | moyenne |  |
| 51 | Welsh terrier | 3 | définitive | Grande-Bretagne | 110 | 63 | `welsh-terrier` | moyenne |  |
| 52 | Grand griffon vendéen | 6 | définitive | France | 107 | 82 | `grand-griffon-vendeen` | moyenne | oui |
| 53 | Petit brabançon | 9 | définitive | Belgique | 104 | 126 | `petit-brabancon` | moyenne |  |
| 54 | Grand bleu de Gascogne | 6 | définitive | France | 103 | 122 | `grand-bleu-de-gascogne` | moyenne | oui |
| 55 | Chien de berger islandais | 5 | définitive | Islande | 102 | 90 | `berger-islandais` | moyenne |  |
| 56 | Chien courant polonais | 6 | définitive | Pologne | 96 | 127 | `chien-courant-polonais` | moyenne |  |
| 57 | Landseer (type continental européen) | 2 | définitive | Allemagne / Suisse | 91 | 87 | `landseer` | moyenne |  |
| 58 | Alano espagnol | 2 | non FCI | Espagne | 88 | 72 | `alano-espagnol` | moyenne |  |
| 59 | Chien de berger des Tatras | 1 | définitive | Pologne | 84 | 72 | `berger-des-tatras` | moyenne |  |
| 60 | Épagneul bleu de Picardie | 7 | définitive | France | 84 | 142 | `epagneul-bleu-de-picardie` | moyenne | oui |
| 61 | Terrier brésilien | 3 | définitive | Brésil | 83 | 95 | `terrier-bresilien` | moyenne |  |
| 62 | Chien de berger yougoslave de Charplanina | 2 | définitive | Macédoine du Nord / Serbie | 78 | 24 | `berger-de-charplanina` | moyenne |  |
| 63 | Chien d'ours de Carélie | 5 | définitive | Finlande | 77 | 98 | `chien-d-ours-de-carelie` | moyenne |  |
| 64 | Berger des Pyrénées à face rase | 1 | définitive | France | 75 | 73 | `berger-des-pyrenees-a-face-rase` | moyenne | oui |
| 65 | Shikoku | 5 | définitive | Japon | 73 | 69 | `shikoku` | moyenne |  |
| 66 | Chien courant de la vallée de la Save | 6 | définitive | Croatie | 70 | 73 | `chien-courant-de-la-vallee-de-la-save` | moyenne |  |
| 67 | Chien d'eau portugais | 8 | définitive | Portugal | 67 | 40 | `chien-d-eau-portugais` | moyenne |  |
| 68 | Braque du Bourbonnais | 7 | définitive | France | 61 | 51 | `braque-du-bourbonnais` | moyenne | oui |
| 69 | Épagneul de Saint-Usuge | 7 | non FCI | France | 58 | 117 | `epagneul-de-saint-usuge` | moyenne | oui |
| 70 | Chien d'Artois | 6 | définitive | France | 57 | 51 | `chien-d-artois` | moyenne | oui |
| 71 | Dogue de Majorque (Ca de bou) | 2 | définitive | Espagne | 56 | 36 | `dogue-de-majorque` | moyenne |  |
| 72 | Chien de berger catalan | 1 | définitive | Espagne | 53 | 48 | `berger-catalan` | moyenne |  |
| 73 | Briquet de Provence | 6 | non FCI | France | 53 | 57 | `briquet-de-provence` | moyenne | oui |
| 74 | Biewer terrier | 3 | non FCI | Allemagne | 50 | 46 | `biewer-terrier` | moyenne |  |
| 75 | Chien-loup de Saarloos | 1 | définitive | Pays-Bas | 49 | 45 | `chien-loup-de-saarloos` | basse |  |
| 76 | Grand basset griffon vendéen | 6 | définitive | France | 45 | 50 | `grand-basset-griffon-vendeen` | moyenne | oui |
| 77 | Schapendoes néerlandais | 1 | définitive | Pays-Bas | 44 | 52 | `schapendoes` | basse |  |
| 78 | Chien nu du Pérou | 5 | définitive | Pérou | 41 | 60 | `chien-nu-du-perou` | basse |  |
| 79 | Berger des Alpes et de Savoie | 1 | non FCI | France | 40 | 41 | `berger-des-alpes-et-de-savoie` | moyenne | oui |
| 80 | Mâtin napolitain | 2 | définitive | Italie | 37 | 32 | `matin-napolitain` | basse |  |
| 81 | Griffon bruxellois | 9 | définitive | Belgique | 37 | 38 | `griffon-bruxellois` | basse |  |
| 82 | Chien du Groenland | 5 | définitive | Groenland (Danemark) | 36 | 26 | `chien-du-groenland` | basse |  |
| 83 | Griffon belge | 9 | définitive | Belgique | 36 | 33 | `griffon-belge` | basse |  |
| 84 | Braque français, type Gascogne | 7 | définitive | France | 35 | 14 | `braque-francais-type-gascogne` | moyenne | oui |
| 85 | Terrier nu américain (American hairless terrier) | 3 | non FCI | États-Unis | 31 | 0 | `terrier-nu-americain` | basse |  |
| 86 | Segugio maremmano | 6 | provisoire | Italie | 30 | 41 | `segugio-maremmano` | basse |  |
| 87 | Grand épagneul de Münster | 7 | définitive | Allemagne | 30 | 4 | `grand-epagneul-de-munster` | basse |  |
| 88 | Berger d'Asie centrale | 2 | définitive | Russie / Asie centrale | 28 | 26 | `berger-d-asie-centrale` | basse |  |
| 89 | Chien de rouge de Hanovre | 6 | définitive | Allemagne | 28 | 30 | `chien-de-rouge-de-hanovre` | basse |  |
| 90 | Caniche moyen | 9 | définitive | France | 27 | 65 | `caniche-moyen` | moyenne | oui |
| 91 | Terrier noir russe | 2 | définitive | Russie | 26 | 14 | `terrier-noir-russe` | basse |  |
| 92 | Chien courant tricolore serbe | 6 | définitive | Serbie | 24 | 28 | `chien-courant-tricolore-serbe` | basse |  |
| 93 | Colley à poil court (Collie smooth) | 1 | définitive | Grande-Bretagne | 23 | 22 | `colley-a-poil-court` | basse |  |
| 94 | Bouvier des Ardennes | 1 | définitive | Belgique | 23 | 11 | `bouvier-des-ardennes` | basse |  |
| 95 | Kai | 5 | définitive | Japon | 23 | 22 | `kai` | basse |  |
| 96 | Volpino italien | 5 | définitive | Italie | 23 | 11 | `volpino-italien` | basse |  |
| 97 | Fila de Saint-Miguel | 2 | définitive | Portugal (Açores) | 22 | 16 | `fila-de-saint-miguel` | basse |  |
| 98 | Berger de la Maremme et des Abruzzes | 1 | définitive | Italie | 20 | 2 | `berger-de-la-maremme-et-des-abruzzes` | basse |  |
| 99 | Fila brasileiro | 2 | définitive | Brésil | 20 | 16 | `fila-brasileiro` | basse |  |
| 100 | Lakeland terrier | 3 | définitive | Grande-Bretagne | 20 | 28 | `lakeland-terrier` | basse |  |

\* Spitz allemand : la SCC ne compte pas les tailles séparément (2 666 au total, dont 2 320 « autres couleurs » nain compris et 346 « loup » = Keeshond).

Notes utiles pour la rédaction : Teckel = 3 poils (dur 2 061, ras 1 872, long 1 649) et 3 tailles ; Chihuahua = poil long 1 682, poil court 1 216 ; Bulldog continental = race suisse reconnue à titre provisoire par la FCI en 2022 ; Akita américain = race distincte de l'Akita au LOF.

Les 74 autres manquantes (moins de 20 inscriptions, ou 0) : Chien d'élan norvégien gris (19), Berger polonais de plaine (18), Barbu tchèque (18), Skye terrier (17), Petit chien lion (17), Tosa (16), Braque Saint-Germain (16), Chien de la Serra da Estrela (15), Chien de Canaan (15), Ratier de Prague (15), Chien d'arrêt allemand à poil long (Langhaar) (14), Lévrier espagnol (Galgo) (14), Mâtin transmontano (Cão de gado transmontano) (13), Billy (12), Sloughi (12), Berger de Bosnie-Herzégovine et de Croatie (Tornjak) (11), Cimarron uruguayen (10), Setter irlandais rouge et blanc (10), Kerry blue terrier (9), Hokkaïdo (9), Petit chien courant suisse (9), Chien de berger roumain de Bucovine (8), Terrier tchèque (8), Berger finnois de Laponie (Lapinporokoira) (8), Podenco d'Ibiza (8), Laïka de Sibérie occidentale (8), Chien esquimau canadien (8), Épagneul de Pont-Audemer (8), Braque de l'Ariège (6), Braque slovaque à poil dur (6), Chien d'eau irlandais (Irish water spaniel) (6), Taïgan (6), Chien de garenne portugais (Podengo) (5), Chien norvégien de macareux (Lundehund) (5), Chien d'arrêt frison (Stabyhoun) (5), Kromfohrländer (5), Sealyham terrier (4), Bichon bolonais (4), Berger belge Laekenois (4), Mudi (3), Chien de berger de la Sila (3), Dandie Dinmont terrier (3), Mâtin espagnol (2), Laïka russo-européen (2), Lévrier hongrois (Magyar agár) (2), Chien de berger de la Serra de Aires (1), Chien de berger roumain des Carpathes (1), Pinscher autrichien (1), Berger du Karst (1), Broholmer (1), Terrier japonais (1), Bangkaew de Thaïlande (1), Poitevin (1), Brachet de Styrie à poil dur (1), Chien d'eau frison (Wetterhoun) (1), Lévrier polonais (Chart polski) (1), Chien de berger roumain de Mioritza (0), Barbado da Terceira (0), Mâtin des Pyrénées (0), Ratier valencien (0), Manchester terrier (0), Lapphund suédois (0), Cirneco de l'Etna (0), Chien de garenne des Canaries (Podenco canario) (0), Français tricolore (0), Grand anglo-français tricolore (0), Grand anglo-français blanc et noir (0), Français blanc et orange (0), Brachet polonais (0), Chien à loutre (Otterhound) (0), Français blanc et noir (0), Chien d'arrêt portugais (0), Retriever à poil bouclé (Curly-coated) (0), Grand anglo-français blanc et orange (0).

## 5. Races françaises absentes du site

La FCI attribue **52 races à la France** (dont 3 en co-origine avec la Belgique : Bouvier des Flandres, Bichon à poil frisé, Épagneul nain continental). Le site en a 12 : Beauceron, Briard, Bouvier des Flandres, Chien de montagne des Pyrénées, Basset bleu de Gascogne, Épagneul breton, Griffon Korthals, Barbet, Bichon frisé, Caniche (nain et toy seulement), Épagneul nain continental (Papillon), Bouledogue français. Le Coton de Tuléar (présent) est rattaché à Madagascar par la FCI.

**40 races françaises FCI manquent**, plus 2 tailles de Caniche et 5 races françaises reconnues par la seule SCC :

| Nom | Gr. FCI | LOF 2025 | Slug proposé | Priorité |
|---|---|---|---|---|
| Berger des Pyrénées à poil long | 1 | 345 | `berger-des-pyrenees-a-poil-long` | haute |
| Berger de Picardie (Berger picard) | 1 | 240 | `berger-de-picardie` | haute |
| Berger des Pyrénées à face rase | 1 | 75 | `berger-des-pyrenees-a-face-rase` | moyenne |
| Dogue de Bordeaux | 2 | 517 | `dogue-de-bordeaux` | haute |
| Basset fauve de Bretagne | 6 | 690 | `basset-fauve-de-bretagne` | haute |
| Gascon saintongeois | 6 | 664 | `gascon-saintongeois` | haute |
| Griffon nivernais | 6 | 571 | `griffon-nivernais` | haute |
| Griffon bleu de Gascogne | 6 | 529 | `griffon-bleu-de-gascogne` | haute |
| Beagle-harrier | 6 | 440 | `beagle-harrier` | haute |
| Porcelaine | 6 | 384 | `porcelaine` | haute |
| Griffon fauve de Bretagne | 6 | 308 | `griffon-fauve-de-bretagne` | haute |
| Petit bleu de Gascogne | 6 | 234 | `petit-bleu-de-gascogne` | haute |
| Ariégeois | 6 | 227 | `ariegeois` | haute |
| Briquet griffon vendéen | 6 | 174 | `briquet-griffon-vendeen` | haute |
| Basset artésien normand | 6 | 158 | `basset-artesien-normand` | haute |
| Anglo-français de petite vénerie | 6 | 147 | `anglo-francais-de-petite-venerie` | moyenne |
| Petit basset griffon vendéen | 6 | 127 | `petit-basset-griffon-vendeen` | moyenne |
| Grand griffon vendéen | 6 | 107 | `grand-griffon-vendeen` | moyenne |
| Grand bleu de Gascogne | 6 | 103 | `grand-bleu-de-gascogne` | moyenne |
| Chien d'Artois | 6 | 57 | `chien-d-artois` | moyenne |
| Grand basset griffon vendéen | 6 | 45 | `grand-basset-griffon-vendeen` | moyenne |
| Billy | 6 | 12 | `billy` | moyenne |
| Poitevin | 6 | 1 | `poitevin` | moyenne |
| Français tricolore | 6 | 0 | `francais-tricolore` | moyenne |
| Grand anglo-français tricolore | 6 | 0 | `grand-anglo-francais-tricolore` | moyenne |
| Grand anglo-français blanc et noir | 6 | 0 | `grand-anglo-francais-blanc-et-noir` | moyenne |
| Français blanc et orange | 6 | 0 | `francais-blanc-et-orange` | moyenne |
| Français blanc et noir | 6 | 0 | `francais-blanc-et-noir` | moyenne |
| Grand anglo-français blanc et orange | 6 | 0 | `grand-anglo-francais-blanc-et-orange` | moyenne |
| Braque français, type Pyrénées | 7 | 623 | `braque-francais-type-pyrenees` | haute |
| Épagneul français | 7 | 236 | `epagneul-francais` | haute |
| Épagneul picard | 7 | 168 | `epagneul-picard` | haute |
| Braque d'Auvergne | 7 | 159 | `braque-d-auvergne` | haute |
| Épagneul bleu de Picardie | 7 | 84 | `epagneul-bleu-de-picardie` | moyenne |
| Braque du Bourbonnais | 7 | 61 | `braque-du-bourbonnais` | moyenne |
| Braque français, type Gascogne | 7 | 35 | `braque-francais-type-gascogne` | moyenne |
| Braque Saint-Germain | 7 | 16 | `braque-saint-germain` | moyenne |
| Épagneul de Pont-Audemer | 7 | 8 | `epagneul-de-pont-audemer` | moyenne |
| Braque de l'Ariège | 7 | 6 | `braque-de-l-ariege` | moyenne |
| Petit chien lion | 9 | 17 | `petit-chien-lion` | moyenne |

Tailles de Caniche manquantes : Grand caniche (173, `grand-caniche`), Caniche moyen (27, `caniche-moyen`). Une page chapeau `caniche` serait logique, la FCI ne connaissant qu'une race en 4 tailles.

Races françaises reconnues par la SCC mais **pas par la FCI** (inscrites en annexe du LOF, pas de CACIB) :

| Nom | Groupe SCC | LOF 2025 | Slug proposé |
|---|---|---|---|
| Bruno Saint-Hubert français | 6 | 159 | `bruno-saint-hubert-francais` |
| Cursinu (Chien corse) | 5 | 153 | `cursinu` |
| Épagneul de Saint-Usuge | 7 | 58 | `epagneul-de-saint-usuge` |
| Briquet de Provence | 6 | 53 | `briquet-de-provence` |
| Berger des Alpes et de Savoie | 1 | 40 | `berger-des-alpes-et-de-savoie` |

Remarque : les chiens de meute de vénerie (Français tricolore, blanc et noir, blanc et orange, Grands anglo-français, Poitevin, Billy) ont 0 à 12 inscriptions individuelles car leurs effectifs passent surtout par les meutes ; ils restent des races françaises à part entière, d'où la priorité « moyenne ».

## 6. Races présentes sur le site qui posent question

### 6.1 Non reconnues par la FCI (donc sans LOF ni pedigree possible en France)

| Slug | Race | Remarque pour un public français |
|---|---|---|
| `pit-bull-americain` | American Pit Bull Terrier (UKC) | Pas une race en France. Un chien de ce type relève de la **1re catégorie** (acquisition, cession et importation interdites). La fiche doit le dire en tête. |
| `american-bully` | American Bully (UKC/ABKC) | Non LOF. Selon sa morphologie, un vétérinaire peut le classer en **1re catégorie** (assimilable à l'American Staffordshire terrier). Forte demande en France : garder la fiche, avec un avertissement légal. |
| `boerboel` | Boerboel (Afrique du Sud) | Non LOF. Les « boerbulls » sont cités par la loi : un chien assimilable au Mastiff sans pedigree est en **1re catégorie**. |
| `bouledogue-americain` | American Bulldog | Non LOF, non visé nommément ; la catégorie dépend de la morphologie constatée par un vétérinaire. |
| `bouledogue-alapaha` | Alapaha Blue Blood Bulldog | Quasi inconnu en France, non LOF. |
| `husky-d-alaska` | Alaskan Husky | Type de chien de traîneau, pas une race (aucun standard). |
| `shiloh-shepherd` | Shiloh Shepherd | Inconnu en France, non LOF. |
| `berger-anglais` | English Shepherd | Inconnu en France ; nom trompeur (un lecteur pense au Bobtail). Renommer « English Shepherd » ou retirer. |
| `spitz-americain` | American Eskimo Dog | Non FCI ; proche du Spitz allemand blanc, qui est la race LOF équivalente. |
| `akbash` | Akbash (Turquie) | Non FCI ; en France, le berger turc reconnu est le Kangal (déjà présent). |
| `chien-leopard-catahoula` | Catahoula Leopard Dog | Non FCI, très rare en France. |
| `chinook` | Chinook | Non FCI, absent de France. |
| `coonhound-bleute` | Bluetick Coonhound | Non FCI, absent de France. |
| `redbone-coonhound` | Redbone Coonhound | Non FCI, absent de France. |
| `treeing-walker-coonhound` | Treeing Walker Coonhound | Non FCI, absent de France. |
| `plott-hound` | Plott Hound | Non FCI, absent de France. |
| `boykin-spaniel` | Boykin Spaniel | Non FCI, absent de France. |
| `rat-terrier` | Rat Terrier | Non FCI, absent de France. |
| `toy-fox-terrier` | Toy Fox Terrier | Non FCI, absent de France. |

S'y ajoutent les deux fiches de la section 3, qui décrivent aujourd'hui des races non FCI ou en doublon (`bouledogue-anglais` = Olde English Bulldogge, `cocker-spaniel` = Cocker américain). Suggestion : afficher un bandeau « race non reconnue en France (hors LOF) » sur ces fiches, et passer en `noindex` (ou supprimer) les races américaines sans aucune présence en France (Bluetick, Redbone et Treeing Walker coonhounds, Plott hound, Catahoula, Boykin spaniel, Rat terrier, Toy fox terrier, Chinook, Shiloh shepherd, Alapaha).

Note : le Berger américain miniature (6 197 inscriptions, 7e race de France) **est** reconnu par la FCI, à titre provisoire depuis 2019 (n° 367). Le Lancashire heeler aussi (provisoire, n° 360).

### 6.2 Reconnues par la FCI mais très rares en France (30 inscriptions LOF ou moins en 2025)

| Slug | LOF 2025 | LOF 2024 |
|---|---|---|
| `komondor` | 0 | 1 |
| `epagneul-d-eau-americain` | 0 | 0 |
| `harrier` | 1 | 0 |
| `terrier-australien` | 4 | 12 |
| `spinone-italien` | 7 | 4 |
| `field-spaniel` | 8 | 42 |
| `puli` | 9 | 10 |
| `chien-du-pharaon` | 10 | 22 |
| `berger-du-caucase` | 11 | 28 |
| `bedlington-terrier` | 11 | 9 |
| `toy-terrier-anglais-noir-et-feu` | 13 | 23 |
| `levrier-ecossais` | 13 | 26 |
| `lancashire-heeler` | 14 | 8 |
| `braque-hongrois-a-poil-dur` | 15 | 24 |
| `retriever-de-la-baie-de-chesapeake` | 15 | 3 |
| `pumi` | 16 | 0 |
| `norwich-terrier` | 16 | 25 |
| `thai-ridgeback` | 16 | 8 |
| `coonhound-noir-et-feu` | 16 | 28 |
| `braque-italien` | 16 | 29 |
| `azawakh` | 17 | 26 |
| `terrier-irlandais-a-poil-doux` | 20 | 33 |
| `affenpinscher` | 21 | 16 |
| `spitz-finlandais` | 21 | 27 |
| `chien-nu-mexicain-xoloitzcuintli` | 23 | 36 |
| `king-charles-spaniel` | 25 | 32 |
| `norfolk-terrier` | 27 | 26 |
| `bouvier-d-appenzell` | 29 | 30 |
| `terrier-irlandais` | 29 | 43 |
| `kuvasz` | 0 (absent du tableau SCC) | 0 |
| `terrier-irlandais-de-glen-of-imaal` | 0 (absent du tableau SCC) | 0 |
| `foxhound-americain` | 0 (absent du tableau SCC) | 0 |

Ces fiches peuvent rester (intérêt encyclopédique), mais elles pèsent autant dans la navigation que le Golden retriever (15 062). Un tri ou un badge « rare en France » aiderait.

### 6.3 Variétés à compléter dans des fiches existantes

- `epagneul-papillon` : ajouter la variété **Phalène** (oreilles tombantes), comptée avec le Papillon par la SCC.
- `berger-allemand` : la SCC distingue poil court (3 671) et poil long (1 943).
- `beauceron` : noir et feu (1 978) et arlequin (508).
- `boxer`, `bouledogue-francais`, `cavalier-king-charles`, `epagneul-breton`, Cocker anglais : variétés de couleur comptées par la SCC, utiles pour les fiches.

## 7. Ce que dit la loi française sur les chiens catégorisés

Textes : Code rural et de la pêche maritime, art. L211-11 à L211-16 (issus de la loi du 6 janvier 1999, renforcée par la loi du 20 juin 2008) ; **arrêté du 27 avril 1999** établissant la liste des types de chiens susceptibles d'être dangereux ; circulaire du 17 février 2010.

**1re catégorie, « chiens d'attaque »** : chiens **non inscrits à un livre généalogique reconnu** (pas de LOF) et assimilables, par leurs caractéristiques morphologiques, aux races :
- Staffordshire terrier ou American Staffordshire terrier (chiens dits « pit-bulls ») ;
- Mastiff (chiens dits « boerbulls ») ;
- Tosa.

**2e catégorie, « chiens de garde et de défense »** :
- chiens **inscrits au LOF** (ou livre reconnu) des races Staffordshire terrier / American Staffordshire terrier, Rottweiler, Tosa ;
- chiens non LOF assimilables morphologiquement au Rottweiler.

Seul un vétérinaire peut déterminer le type d'un chien sans pedigree (diagnose de type).

Points à rappeler dans les fiches (confusions fréquentes) :
- Le **Staffordshire bull terrier** (`staffordshire-bull-terrier`, 3e race de France) **n'est pas catégorisé**. Le « Staffordshire terrier » de l'arrêté désigne l'American Staffordshire terrier, son ancien nom.
- Un **Mastiff LOF n'est pas catégorisé** ; seul le chien de type Mastiff sans pedigree l'est (1re catégorie). Idem pour le Tosa : LOF = 2e catégorie, sans LOF = 1re.
- Le Rottweiler LOF est en 2e catégorie. Le Dogue argentin, le Cane corso, le Bullmastiff, le Dogue de Bordeaux, le Bull terrier ne sont **pas** catégorisés (même si des règlements locaux ou des assureurs peuvent être plus stricts).

Obligations pour les deux catégories : identification (puce, au plus tard à 4 mois et avant toute cession pour la 2e catégorie), vaccination antirabique à jour, assurance responsabilité civile, **évaluation comportementale** par un vétérinaire agréé entre 8 mois et 1 an, **attestation d'aptitude** du maître (formation d'une journée), **permis de détention** délivré par le maire (provisoire avant 8 mois). Laisse et muselière obligatoires sur la voie publique et dans les parties communes des immeubles (et, pour la 2e catégorie, dans les lieux publics, locaux ouverts au public et transports).

Spécifique à la 1re catégorie : **acquisition, vente, don et importation interdits** ; **stérilisation obligatoire** ; accès interdit aux transports en commun, aux lieux publics (hors voie publique) et aux locaux ouverts au public ; stationnement interdit dans les parties communes.

Ne peuvent pas détenir un chien catégorisé : les mineurs, les majeurs sous tutelle (sauf autorisation du juge), les personnes condamnées pour crime ou à une peine de prison pour un délit inscrit au bulletin n° 2 du casier judiciaire, les personnes à qui la garde d'un chien a été retirée.

Sanctions principales : détention par une personne interdite, 6 mois de prison et 7 500 € d'amende ; chien de 1re catégorie non stérilisé ou acquis/cédé, 6 mois et 15 000 € ; défaut de permis, mise en demeure puis fourrière et euthanasie possibles, jusqu'à 3 mois et 3 750 €.

Fiches concernées sur le site aujourd'hui : `staffordshire-terrier-americain` (2e cat. si LOF, 1re sinon), `rottweiler` (2e cat.), `pit-bull-americain` (1re cat.), `american-bully` et `boerboel` (1re cat. possible selon morphologie). À ajouter pour l'info légale : `tosa` (16 inscriptions) et `mastiff` (157). Suggestion technique : un champ `categorie_legale` dans `breeds.json` (« 1 », « 2 », « 1 ou 2 selon LOF », « possible selon morphologie », « non catégorisé ») affiché en haut de fiche.

