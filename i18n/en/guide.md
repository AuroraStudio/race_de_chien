# Guide de traduction : anglais

Pour toute personne (ou agent) qui traduit les phrases du site race-de-chien.com en anglais.
Les lots se trouvent dans `i18n/en/_lots/lot-XX.json` : `[{ "id", "fr", "page" }]`.
La traduction s'écrit dans `lot-XX.en.json` : `{ "<id>": "<English>" }`, une entrée par id, rien d'autre.

## Who reads it

Future dog owners, mostly in the US and UK, often on a phone, arriving from Google on a breed page or a question
("best dogs for apartments", "dogs that don't shed"). The site helps them pick a breed that fits their life.
Tone: warm, light, plain and honest, never salesy. Address the reader as "you".

## Form rules (mandatory)

1. Keep every placeholder exactly: `<g1>…</g1>` (an inline tag around words), `<x1/>` (an icon or image),
   `{0}` `{1}` (values filled in by code), `__LASTMOD_FR__` (a date filled in later). You may move them in the
   sentence, never drop, add, rename or duplicate them. Keep real HTML tags (`<strong>`, `<span class="…">`) as they are.
2. Keep `&amp;` `&lt;` `&gt;` as written. Never write a bare `<` or `&`.
3. American English spelling (color, behavior, center). Sentence case for headings and buttons, as in the French.
4. No em dash and no en dash. Use commas, colons, parentheses or two sentences.
5. Numbers: decimal point (`2.5`), thousands comma (`12,345`), `87%` with no space, ranges `55 to 61 cm`.
   Keep metric units (cm, kg). Ages: `10 to 12 years`. Times: `1 h 30` → `1.5 hours`.
6. French typography goes away: no space before `: ; ! ?`, `« »` become `“ ”`.
7. Translate the meaning, naturally. Do not add facts, do not drop any. Generated sentences can be clumsy in French
   ("Le Akita perd-il beaucoup de poils ?"): write the natural English ("Does the Akita shed a lot?").
8. Breed names: always the English name from the list below, with "the" in running text where English uses it
   ("The Golden Retriever is…").
9. A segment that is only a name, a number or a code that is the same in English: give it back unchanged.
10. Page titles (`<title>`, segments ending with `| Race de Chien`): keep under 60 characters when you can.
    Meta descriptions: under 155 characters. Keep "Race de Chien" as is: it is the brand name.

## France stays visible

The site is French and its data is French. Say so instead of hiding it:
- "LOF" is the French Kennel Club stud book: "1re race en France · 12 345 chiots LOF en 2025" →
  "3rd most popular breed in France · 12,345 puppies registered in 2025 (LOF)". "inscrite au LOF" → "registered with the French Kennel Club (LOF)".
- "Société Centrale Canine" / "SCC" → "the Société Centrale Canine (French Kennel Club)" the first time on a page.
- "chiens catégorisés", "1re / 2e catégorie": French law on dangerous dogs → "restricted dogs in France",
  "Category 1", "Category 2". "permis de détention" → "dog ownership permit"; "mairie" → "town hall".
- "races françaises" → "French breeds". Keep French names of places and institutions.

## Vocabulary (use these exact words)

Site: Race de Chien (brand, unchanged) · Tel Maître, Tel Chien → Like Owner, Like Dog · Quel chien pour moi ? →
Which dog is right for me? · le test → the quiz · Comparer → Compare · fiche (de race) → breed profile ·
Ma vie → Your life · Votre profil en un clic → Your profile in one click · compatibilité → match (`87 % de compatibilité` → `87% match`) ·
sélections → lists · Groupe FCI → FCI group · au garrot → at the withers · robe(s) → coat color(s) · poil → coat ·
toilettage → grooming · éleveur → breeder · dépistage → health screening · Pour qui ? → Who is it for? ·
Idéal pour → Ideal for · Moins adapté pour → Less suited to · En bref → At a glance · Toutes ses notes → All ratings ·
À prévoir → Things to plan for · Pourquoi → Why · Races proches → Similar breeds · Questions fréquentes → FAQ ·
Histoire et origines → History and origins · Présentation → Overview · Santé → Health · Poil et entretien → Coat and care ·
Pantouflard → Couch potato · Sportif → Sporty · Je travaille la journée → I work during the day · Discret → Quiet.

Ratings (label: levels 1 to 5). Keep these exact words, also lowercased inside sentences:
- Énergie / Energy: Très calme Very calm, Calme Calm, Modérée Moderate, Élevée High, Débordante Boundless
- En appartement / Apartment living: Impossible, Difficile Difficult, Possible, Bien Good, Parfait Perfect
- Seul à la maison / Home alone: Très mal Very poorly, Mal Poorly, Quelques heures A few hours, Bien Well, Très bien Very well
- Avec les enfants / With children, Avec les autres chiens / With other dogs, Avec les chats / With cats:
  À éviter Avoid, Prudence Caution, Correct Fair, Bon Good, Excellent Excellent
- Avec les inconnus / With strangers: Très méfiant Very wary, Réservé Reserved, Poli Polite, Ouvert Open, Très ouvert Very open
- Facilité d'éducation / Ease of training: Très difficile Very hard, Difficile Hard, Moyenne Average, Facile Easy, Très facile Very easy
- Pour un premier chien / For a first-time owner: Déconseillé Not advised, Peu adapté Poor fit, Possible, Bien adapté Good fit, Idéal Ideal
- Instinct de garde / Guarding instinct: Nul None, Faible Low, Modéré Moderate, Marqué Strong, Très marqué Very strong
- Instinct de chasse / Prey drive: Très faible Very low, Faible Low, Modéré Moderate, Fort Strong, Très fort Very strong
- Tendance à fuguer / Tendency to roam: Très faible Very low, Faible Low, Modérée Moderate, Forte High, Très forte Very high
- Entretien du poil / Coat care: Minimal, Faible Low, Moyen Average, Important High, Très important Very high
- Perte de poils / Shedding: Quasi nulle Almost none, Faible Low, Modérée Moderate, Forte Heavy, Très forte Very heavy
- Bave / Drooling: Jamais Never, Rarement Rarely, Un peu A little, Souvent Often, Beaucoup A lot
- Aboiements / Barking: Très discret Very quiet, Discret Quiet, Modérés Moderate, Fréquents Frequent, Très bavard Very vocal
- Tolérance à la chaleur / Heat tolerance, Tolérance au froid / Cold tolerance: Très faible Very low, Faible Low, Moyenne Average, Bonne Good, Excellente Excellent
- Robustesse / Hardiness: Fragile, Plutôt fragile Rather fragile, Moyenne Average, Bonne Good, Excellente Excellent
Rating groups: Mode de vie Lifestyle · Famille et sociabilité Family and sociability · Éducation et caractère Training and temperament ·
Entretien et voisinage Care and neighbors · Climat et santé Climate and health.
Sizes: Très petit Very small · Petit Small · Moyen Medium · Grand Large · Géant Giant.

FCI groups (short labels): Bergers et bouviers → Sheepdogs and cattle dogs · Molosses, pinschers et bouviers suisses →
Pinschers, molossers and Swiss mountain dogs · Terriers → Terriers · Teckels → Dachshunds · Spitz et chiens primitifs →
Spitz and primitive types · Chiens courants → Scent hounds · Chiens d'arrêt → Pointing dogs · Rapporteurs, leveurs et
chiens d'eau → Retrievers, flushing dogs and water dogs · Chiens de compagnie → Companion and toy dogs · Lévriers → Sighthounds.

## Breed names (French → English)

- Affenpinscher → Affenpinscher
- Airedale Terrier → Airedale Terrier
- Akbash → Akbash
- Akita → Akita
- Akita américain → American Akita
- Alapaha Blue Blood Bulldog → Alapaha Blue Blood Bulldog
- American Bully → American Bully
- American Eskimo Dog (Chien esquimau américain) → American Eskimo Dog
- American Pit Bull Terrier → American Pit Bull Terrier
- American Staffordshire Terrier → American Staffordshire Terrier
- Anglo-français de petite vénerie → Anglo-Français de Petite Vénerie
- Ariégeois → Ariégeois
- Azawakh → Azawakh
- Barbet → Barbet
- Basenji → Basenji
- Basset artésien normand → Basset Artésien Normand
- Basset Bleu de Gascogne → Basset Bleu de Gascogne
- Basset fauve de Bretagne → Basset Fauve de Bretagne
- Basset Hound → Basset Hound
- Beagle → Beagle
- Beagle-harrier → Beagle-Harrier
- Bearded Collie → Bearded Collie
- Beauceron → Beauceron
- Bedlington Terrier → Bedlington Terrier
- Berger Allemand → German Shepherd
- Berger Américain Miniature → Miniature American Shepherd
- Berger Australien → Australian Shepherd
- Berger belge Groenendael → Belgian Groenendael
- Berger belge Laekenois → Belgian Laekenois
- Berger Belge Malinois → Belgian Malinois
- Berger Belge Tervueren → Belgian Tervuren
- Berger Blanc Suisse → White Swiss Shepherd Dog
- Berger de Brie (Briard) → Briard
- Berger de Picardie (Berger picard) → Berger Picard
- Berger des Pyrénées à face rase → Pyrenean Sheepdog (Smooth-faced)
- Berger des Pyrénées à poil long → Pyrenean Sheepdog (Long-haired)
- Berger du Caucase → Caucasian Shepherd Dog
- Berger Hollandais → Dutch Shepherd
- Bichon Frisé → Bichon Frise
- Bichon Havanais → Havanese
- Bichon Maltais → Maltese
- Billy → Billy
- Bobtail → Old English Sheepdog
- Boerboel → Boerboel
- Border Collie → Border Collie
- Border Terrier → Border Terrier
- Boston Terrier → Boston Terrier
- Bouledogue Américain → American Bulldog
- Bouledogue Français → French Bulldog
- Bouvier Australien → Australian Cattle Dog
- Bouvier Bernois → Bernese Mountain Dog
- Bouvier d'Appenzell → Appenzeller Sennenhund
- Bouvier des Flandres → Bouvier des Flandres
- Boxer → Boxer
- Boykin Spaniel → Boykin Spaniel
- Braque Allemand à Poil Court → German Shorthaired Pointer
- Braque d'Auvergne → Braque d'Auvergne
- Braque de l'Ariège → Ariege Pointing Dog
- Braque de Weimar → Weimaraner
- Braque du Bourbonnais → Braque du Bourbonnais
- Braque français, type Gascogne → Braque Français (Gascogne Type)
- Braque français, type Pyrénées → Braque Français (Pyrenean Type)
- Braque hongrois à poil court (Vizsla) → Vizsla
- Braque Hongrois à Poil Dur → Wirehaired Vizsla
- Braque Italien → Bracco Italiano
- Braque Saint-Germain → Braque Saint-Germain
- Briquet griffon vendéen → Briquet Griffon Vendéen
- Bruno Saint-Hubert français → Bruno Saint-Hubert Français
- Bull Terrier → Bull Terrier
- Bull Terrier Miniature → Miniature Bull Terrier
- Bulldog Anglais → English Bulldog
- Bulldog continental → Continental Bulldog
- Bullmastiff → Bullmastiff
- Cairn Terrier → Cairn Terrier
- Cane Corso → Cane Corso
- Caniche moyen → Medium Poodle
- Caniche Nain → Miniature Poodle
- Caniche Toy → Toy Poodle
- Carlin → Pug
- Cavalier King Charles Spaniel → Cavalier King Charles Spaniel
- Chien Chinois à Crête → Chinese Crested
- Chien courant suisse → Swiss Hound
- Chien d'arrêt allemand à poil dur (Drahthaar) → German Wirehaired Pointer
- Chien d'Artois → Artois Hound
- Chien d'Eau Espagnol → Spanish Water Dog
- Chien d'oysel allemand (Wachtelhund) → German Spaniel
- Chien de berger kangal → Kangal Shepherd Dog
- Chien de Montagne des Pyrénées → Great Pyrenees
- Chien de Saint-Hubert → Bloodhound
- Chien du Pharaon → Pharaoh Hound
- Chien Finnois de Laponie → Finnish Lapphund
- Chien Léopard Catahoula → Catahoula Leopard Dog
- Chien nu du Mexique (Xoloitzcuintle) → Xoloitzcuintli
- Chihuahua → Chihuahua
- Chinook → Chinook
- Chow-Chow → Chow Chow
- Clumber Spaniel → Clumber Spaniel
- Cocker Américain → American Cocker Spaniel
- Cocker Anglais → English Cocker Spaniel
- Colley à poil long → Rough Collie
- Coonhound Bleuté → Bluetick Coonhound
- Coonhound Noir et Feu → Black and Tan Coonhound
- Coton de Tuléar → Coton de Tulear
- Cursinu → Cursinu
- Dalmatien → Dalmatian
- Dobermann → Doberman Pinscher
- Dogue Allemand → Great Dane
- Dogue Argentin → Dogo Argentino
- Dogue de Bordeaux → Dogue de Bordeaux
- Dogue des Canaries → Presa Canario
- Dogue du Tibet → Tibetan Mastiff
- English Shepherd → English Shepherd
- Épagneul bleu de Picardie → Blue Picardy Spaniel
- Épagneul Breton → Brittany
- Épagneul d'Eau Américain → American Water Spaniel
- Épagneul de Pont-Audemer → Pont-Audemer Spaniel
- Épagneul français → French Spaniel
- Épagneul Japonais → Japanese Chin
- Épagneul nain continental (Papillon) → Papillon
- Épagneul picard → Picardy Spaniel
- Épagneul Tibétain → Tibetan Spaniel
- Eurasier → Eurasier
- Field Spaniel → Field Spaniel
- Fox Terrier à Poil Dur → Wire Fox Terrier
- Fox Terrier à Poil Lisse → Smooth Fox Terrier
- Foxhound Américain → American Foxhound
- Français blanc et noir → French White and Black Hound
- Français blanc et orange → French White and Orange Hound
- Français tricolore → French Tricolour Hound
- Gascon saintongeois → Gascon Saintongeois
- Golden Retriever → Golden Retriever
- Grand anglo-français blanc et noir → Great Anglo-French White and Black Hound
- Grand anglo-français blanc et orange → Great Anglo-French White and Orange Hound
- Grand anglo-français tricolore → Great Anglo-French Tricolour Hound
- Grand basset griffon vendéen → Grand Basset Griffon Vendéen
- Grand bleu de Gascogne → Grand Bleu de Gascogne
- Grand caniche → Standard Poodle
- Grand griffon vendéen → Grand Griffon Vendéen
- Greyhound → Greyhound
- Griffon bleu de Gascogne → Griffon Bleu de Gascogne
- Griffon d'arrêt à poil dur Korthals → Wirehaired Pointing Griffon
- Griffon fauve de Bretagne → Griffon Fauve de Bretagne
- Griffon nivernais → Griffon Nivernais
- Harrier → Harrier
- Husky d'Alaska → Alaskan Husky
- Husky Sibérien → Siberian Husky
- Irish Terrier → Irish Terrier
- Jack Russell Terrier → Jack Russell Terrier
- Kelpie Australien → Australian Kelpie
- King Charles Spaniel → King Charles Spaniel
- Komondor → Komondor
- Kooikerhondje → Nederlandse Kooikerhondje
- Kuvasz → Kuvasz
- Labrador Retriever → Labrador Retriever
- Lagotto Romagnolo → Lagotto Romagnolo
- Laïka de Iakoutie → Yakutian Laika
- Lancashire Heeler → Lancashire Heeler
- Leonberg → Leonberger
- Lévrier Afghan → Afghan Hound
- Lévrier écossais (Deerhound) → Scottish Deerhound
- Lévrier Irlandais → Irish Wolfhound
- Lhassa Apso → Lhasa Apso
- Malamute de l'Alaska → Alaskan Malamute
- Norfolk Terrier → Norfolk Terrier
- Norwich Terrier → Norwich Terrier
- Parson Russell terrier → Parson Russell Terrier
- Pékinois → Pekingese
- Petit basset griffon vendéen → Petit Basset Griffon Vendéen
- Petit bleu de Gascogne → Petit Bleu de Gascogne
- Petit chien lion → Löwchen
- Petit chien russe (Russkiy Toy) → Russian Toy
- Petit épagneul de Münster → Small Münsterländer
- Petit Lévrier Italien → Italian Greyhound
- Pinscher Allemand → German Pinscher
- Pinscher Nain → Miniature Pinscher
- Plott → Plott Hound
- Pointer anglais → English Pointer
- Poitevin → Poitevin
- Porcelaine → Porcelaine
- Puli → Puli
- Pumi → Pumi
- Rat Terrier → Rat Terrier
- Redbone Coonhound → Redbone Coonhound
- Retriever à poil plat → Flat-Coated Retriever
- Retriever de la Baie de Chesapeake → Chesapeake Bay Retriever
- Retriever de la Nouvelle-Écosse → Nova Scotia Duck Tolling Retriever
- Rhodesian Ridgeback → Rhodesian Ridgeback
- Rottweiler → Rottweiler
- Saint-Bernard → Saint Bernard
- Saluki → Saluki
- Samoyède → Samoyed
- Schipperke → Schipperke
- Schnauzer Géant → Giant Schnauzer
- Schnauzer Moyen → Standard Schnauzer
- Schnauzer Nain → Miniature Schnauzer
- Scottish Terrier → Scottish Terrier
- Setter Anglais → English Setter
- Setter Gordon → Gordon Setter
- Setter irlandais rouge → Irish Setter
- Shar-Peï → Shar Pei
- Shetland Sheepdog (Berger des Shetland) → Shetland Sheepdog
- Shiba Inu → Shiba Inu
- Shih Tzu → Shih Tzu
- Shiloh Shepherd → Shiloh Shepherd
- Silky Terrier australien → Australian Silky Terrier
- Spinone Italien → Spinone Italiano
- Spitz allemand → German Spitz
- Spitz des Wisigoths (Vallhund suédois) → Swedish Vallhund
- Spitz Finlandais → Finnish Spitz
- Spitz Japonais → Japanese Spitz
- Spitz Nain (Loulou de Poméranie) → Pomeranian
- Spitz-loup (Keeshond) → Keeshond
- Springer Spaniel Anglais → English Springer Spaniel
- Staffordshire Bull Terrier → Staffordshire Bull Terrier
- Teckel → Dachshund
- Terre-Neuve → Newfoundland
- Terrier Australien → Australian Terrier
- Terrier de chasse allemand (Jagdterrier) → German Hunting Terrier
- Terrier Irlandais à Poil Doux → Soft Coated Wheaten Terrier
- Terrier Irlandais de Glen of Imaal → Glen of Imaal Terrier
- Terrier Tibétain → Tibetan Terrier
- Thai Ridgeback → Thai Ridgeback
- Toy Fox Terrier → Toy Fox Terrier
- Toy Terrier Anglais (Noir et Feu) → English Toy Terrier
- Treeing Walker Coonhound → Treeing Walker Coonhound
- Welsh Corgi Cardigan → Cardigan Welsh Corgi
- Welsh Corgi Pembroke → Pembroke Welsh Corgi
- Welsh Springer Spaniel → Welsh Springer Spaniel
- West Highland White Terrier → West Highland White Terrier
- Whippet → Whippet
- Yorkshire Terrier → Yorkshire Terrier