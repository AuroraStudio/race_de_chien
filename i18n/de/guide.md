# Guide de traduction : allemand

Pour toute personne (ou agent) qui traduit les phrases du site race-de-chien.com en allemand.
Les lots se trouvent dans `i18n/de/_lots/lot-XX.json` : `[{ "id", "fr", "page", "en" }]`.
La traduction s'écrit dans `lot-XX.de.json` : `{ "<id>": "<Deutsch>" }`, une entrée par id, rien d'autre.

## Who reads it

Future dog owners in Germany, Austria and Switzerland, often on a phone, arriving from Google on a breed page or a
question ("Wohnungshunde", "Hunde die nicht haaren", "welcher Hund passt zu mir"). The site helps them pick a breed
that fits their life. Tone: warm, light, plain and honest, never salesy.

## Language rules (mandatory)

1. Standard German (Hochdeutsch), no Austrian or Swiss-only words. Address the reader with **"du"** ("wähle", "dein Hund"),
   never "Sie". Capitalise nouns, as German requires.
2. Keep every placeholder exactly: `<g1>…</g1>` (an inline tag around words), `<x1/>` (an icon or image),
   `{0}` `{1}` (values filled in by code), `__LASTMOD_FR__` (a date filled in later). You may move them in the
   sentence, never drop, add, rename or duplicate them. Keep real HTML tags (`<strong>`, `<span class="…">`) as they are.
3. Keep `&amp;` `&lt;` `&gt;` as written. Never write a bare `<` or `&`.
4. German punctuation: quotes „so“. Sentence case for headings and buttons, as in the French (only nouns capitalised).
   No em dash and no en dash: use commas, colons, parentheses or two sentences.
5. Numbers: decimal comma (`2,5`), thousands point (`12.345`), `87 %` with a space, ranges `58 bis 70 cm`.
   Units cm, kg, Jahre, Minuten.
6. Translate the meaning, naturally. Do not add facts, do not drop any. Generated French sentences can be clumsy:
   write natural German. Avoid long noun chains when a verb reads better.
7. Breed names: always the German name from the list below, with its article (m = der, f = die, n = das):
   "der Golden Retriever", "die Französische Bulldogge", "das Löwchen".
8. A segment that is only a name, a number or a code that is the same in German: give it back unchanged.
9. Page titles (`<title>`, segments ending with `| Race de Chien`): keep under 60 characters when you can.
   Meta descriptions: under 155 characters. Keep "Race de Chien" as is: it is the brand name.

## France stays visible

The site is French and its data is French. Say so instead of hiding it:
- "LOF" is the French Kennel Club stud book: "inscrit au LOF" → "im LOF (französisches Zuchtbuch) eingetragen" the first
  time on a page, then "LOF".
- "Société Centrale Canine" / "SCC" → "die Société Centrale Canine (der französische Hundezuchtverband)" the first time on a page.
- "chiens catégorisés", "1re / 2e catégorie": French law on dangerous dogs → "Listenhunde in Frankreich", "Kategorie 1",
  "Kategorie 2". "permis de détention" → "Halteerlaubnis"; "mairie" → "Rathaus".
- "races françaises" → "französische Rassen". Keep French names of institutions.

## Vocabulary (use these exact words)

Site: Race de Chien (brand, unchanged) · Tel Maître, Tel Chien → Wie der Herr, so's Gescherr · Quel chien pour moi ? →
Welcher Hund passt zu mir? · le test → der Test · Comparer → Vergleichen · fiche (de race) → Rasseporträt ·
Ma vie → Dein Leben · Votre profil en un clic → Dein Profil mit einem Klick · compatibilité → Übereinstimmung
(`87 % de compatibilité` → `87 % Übereinstimmung`) · sélections → Auswahl / Listen · Groupe FCI → FCI-Gruppe ·
au garrot → Schulterhöhe · robe(s) → Fellfarbe(n) · poil → Fell · toilettage → Fellpflege / Hundefriseur ·
éleveur → Züchter · dépistage → Vorsorgeuntersuchung · Pour qui ? → Für wen? · Idéal pour → Ideal für ·
Moins adapté pour → Weniger geeignet für · En bref → Auf einen Blick · Toutes ses notes → Alle Bewertungen ·
À prévoir → Darauf solltest du achten · Pourquoi → Warum · Races proches → Ähnliche Rassen · Questions fréquentes →
Häufige Fragen · Histoire et origines → Geschichte und Herkunft · Présentation → Vorstellung · Santé → Gesundheit ·
Poil et entretien → Fell und Pflege · Pantouflard → Couch-Potato · Sportif → Sportlich · Je travaille la journée →
Ich arbeite tagsüber · Discret → Leise · chiot → Welpe.

Ratings (label: levels 1 to 5). Keep these exact words:
- Énergie / Energie: Sehr niedrig, Niedrig, Mittel, Hoch, Überschäumend
- En appartement / In der Wohnung: Unmöglich, Schwierig, Möglich, Gut, Perfekt
- Seul à la maison / Allein zu Hause: Sehr schlecht, Schlecht, Ein paar Stunden, Gut, Sehr gut
- Avec les enfants / Mit Kindern, Avec les autres chiens / Mit anderen Hunden, Avec les chats / Mit Katzen:
  Meiden, Vorsicht, Ordentlich, Gut, Ausgezeichnet
- Avec les inconnus / Mit Fremden: Sehr misstrauisch, Zurückhaltend, Höflich, Offen, Sehr offen
- Facilité d'éducation / Erziehbarkeit: Sehr schwer, Schwer, Mittel, Leicht, Sehr leicht
- Pour un premier chien / Für Ersthundehalter: Nicht empfohlen, Wenig geeignet, Möglich, Gut geeignet, Ideal
- Instinct de garde / Wachinstinkt: Keiner, Gering, Mäßig, Ausgeprägt, Sehr ausgeprägt
- Instinct de chasse / Jagdtrieb: Sehr gering, Gering, Mäßig, Stark, Sehr stark
- Tendance à fuguer / Neigung zum Streunen: Sehr gering, Gering, Mäßig, Hoch, Sehr hoch
- Entretien du poil / Fellpflege: Minimal, Gering, Mittel, Hoch, Sehr hoch
- Perte de poils / Haaren: Kaum, Gering, Mäßig, Stark, Sehr stark
- Bave / Sabbern: Nie, Selten, Etwas, Oft, Viel
- Aboiements / Bellen: Sehr leise, Leise, Mäßig, Häufig, Sehr gesprächig
- Tolérance à la chaleur / Hitzeverträglichkeit, Tolérance au froid / Kälteverträglichkeit: Sehr gering, Gering, Mittel, Gut, Ausgezeichnet
- Robustesse / Robustheit: Empfindlich, Eher empfindlich, Mittel, Gut, Ausgezeichnet
Rating groups: Mode de vie Lebensstil · Famille et sociabilité Familie und Sozialverhalten · Éducation et caractère
Erziehung und Charakter · Entretien et voisinage Pflege und Nachbarschaft · Climat et santé Klima und Gesundheit.
Sizes: Très petit Sehr klein · Petit Klein · Moyen Mittelgroß · Grand Groß · Géant Sehr groß.

FCI groups (short labels): Bergers et bouviers → Hüte- und Treibhunde · Molosses, pinschers et bouviers suisses →
Pinscher und Schnauzer, Molosser und Schweizer Sennenhunde · Terriers → Terrier · Teckels → Dachshunde ·
Spitz et chiens primitifs → Spitze und Hunde vom Urtyp · Chiens courants → Laufhunde und Schweißhunde ·
Chiens d'arrêt → Vorstehhunde · Rapporteurs, leveurs et chiens d'eau → Apportier-, Stöber- und Wasserhunde ·
Chiens de compagnie → Gesellschafts- und Begleithunde · Lévriers → Windhunde.

## Breed names (French → German, with article)

- Affenpinscher → der Affenpinscher
- Airedale Terrier → der Airedale Terrier
- Akbash → der Akbash
- Akita → der Akita Inu
- Akita américain → der Amerikanischer Akita
- Alapaha Blue Blood Bulldog → der Alapaha Blue Blood Bulldog
- American Bully → der American Bully
- American Eskimo Dog (Chien esquimau américain) → der American Eskimo Dog
- American Pit Bull Terrier → der American Pit Bull Terrier
- American Staffordshire Terrier → der American Staffordshire Terrier
- Anglo-français de petite vénerie → der Anglo-Français de Petite Vénerie
- Ariégeois → der Ariégeois
- Azawakh → der Azawakh
- Barbet → der Barbet
- Basenji → der Basenji
- Basset artésien normand → der Basset Artésien Normand
- Basset Bleu de Gascogne → der Basset Bleu de Gascogne
- Basset fauve de Bretagne → der Basset Fauve de Bretagne
- Basset Hound → der Basset Hound
- Beagle → der Beagle
- Beagle-harrier → der Beagle-Harrier
- Bearded Collie → der Bearded Collie
- Beauceron → der Beauceron
- Bedlington Terrier → der Bedlington Terrier
- Berger Allemand → der Deutscher Schäferhund
- Berger Américain Miniature → der Miniature American Shepherd
- Berger Australien → der Australian Shepherd
- Berger belge Groenendael → der Groenendael
- Berger belge Laekenois → der Laekenois
- Berger Belge Malinois → der Malinois
- Berger Belge Tervueren → der Tervueren
- Berger Blanc Suisse → der Weißer Schweizer Schäferhund
- Berger de Brie (Briard) → der Briard
- Berger de Picardie (Berger picard) → der Berger de Picardie
- Berger des Pyrénées à face rase → der Pyrenäen-Schäferhund (kurzhaariges Gesicht)
- Berger des Pyrénées à poil long → der Pyrenäen-Schäferhund (Langhaar)
- Berger du Caucase → der Kaukasischer Owtscharka
- Berger Hollandais → der Holländischer Schäferhund
- Bichon Frisé → der Bichon Frisé
- Bichon Havanais → der Havaneser
- Bichon Maltais → der Malteser
- Billy → der Billy
- Bobtail → der Bobtail
- Boerboel → der Boerboel
- Border Collie → der Border Collie
- Border Terrier → der Border Terrier
- Boston Terrier → der Boston Terrier
- Bouledogue Américain → der American Bulldog
- Bouledogue Français → die Französische Bulldogge
- Bouvier Australien → der Australian Cattle Dog
- Bouvier Bernois → der Berner Sennenhund
- Bouvier d'Appenzell → der Appenzeller Sennenhund
- Bouvier des Flandres → der Bouvier des Flandres
- Boxer → der Boxer
- Boykin Spaniel → der Boykin Spaniel
- Braque Allemand à Poil Court → der Deutsch Kurzhaar
- Braque d'Auvergne → der Braque d'Auvergne
- Braque de l'Ariège → der Braque de l'Ariège
- Braque de Weimar → der Weimaraner
- Braque du Bourbonnais → der Braque du Bourbonnais
- Braque français, type Gascogne → der Braque Français (Typ Gascogne)
- Braque français, type Pyrénées → der Braque Français (Typ Pyrénées)
- Braque hongrois à poil court (Vizsla) → der Magyar Vizsla (Kurzhaar)
- Braque Hongrois à Poil Dur → der Magyar Vizsla (Drahthaar)
- Braque Italien → der Bracco Italiano
- Braque Saint-Germain → der Braque Saint-Germain
- Briquet griffon vendéen → der Briquet Griffon Vendéen
- Bruno Saint-Hubert français → der Bruno Saint-Hubert Français
- Bull Terrier → der Bullterrier
- Bull Terrier Miniature → der Miniatur-Bullterrier
- Bulldog Anglais → die Englische Bulldogge
- Bulldog continental → der Continental Bulldog
- Bullmastiff → der Bullmastiff
- Cairn Terrier → der Cairn Terrier
- Cane Corso → der Cane Corso
- Caniche moyen → der Kleinpudel
- Caniche Nain → der Zwergpudel
- Caniche Toy → der Toypudel
- Carlin → der Mops
- Cavalier King Charles Spaniel → der Cavalier King Charles Spaniel
- Chien Chinois à Crête → der Chinesischer Schopfhund
- Chien courant suisse → der Schweizer Laufhund
- Chien d'arrêt allemand à poil dur (Drahthaar) → der Deutsch Drahthaar
- Chien d'Artois → der Chien d'Artois
- Chien d'Eau Espagnol → der Spanischer Wasserhund
- Chien d'oysel allemand (Wachtelhund) → der Deutscher Wachtelhund
- Chien de berger kangal → der Kangal
- Chien de Montagne des Pyrénées → der Pyrenäen-Berghund
- Chien de Saint-Hubert → der Bloodhound
- Chien du Pharaon → der Pharaonenhund
- Chien Finnois de Laponie → der Finnischer Lapphund
- Chien Léopard Catahoula → der Catahoula Leopard Dog
- Chien nu du Mexique (Xoloitzcuintle) → der Xoloitzcuintle (Mexikanischer Nackthund)
- Chihuahua → der Chihuahua
- Chinook → der Chinook
- Chow-Chow → der Chow-Chow
- Clumber Spaniel → der Clumber Spaniel
- Cocker Américain → der American Cocker Spaniel
- Cocker Anglais → der English Cocker Spaniel
- Colley à poil long → der Collie Langhaar
- Coonhound Bleuté → der Bluetick Coonhound
- Coonhound Noir et Feu → der Black and Tan Coonhound
- Coton de Tuléar → der Coton de Tuléar
- Cursinu → der Cursinu
- Dalmatien → der Dalmatiner
- Dobermann → der Dobermann
- Dogue Allemand → die Deutsche Dogge
- Dogue Argentin → der Dogo Argentino
- Dogue de Bordeaux → die Bordeauxdogge
- Dogue des Canaries → der Dogo Canario
- Dogue du Tibet → die Tibetdogge (Do-Khyi)
- English Shepherd → der English Shepherd
- Épagneul bleu de Picardie → der Epagneul Bleu de Picardie
- Épagneul Breton → der Epagneul Breton
- Épagneul d'Eau Américain → der American Water Spaniel
- Épagneul de Pont-Audemer → der Epagneul de Pont-Audemer
- Épagneul français → der Epagneul Français
- Épagneul Japonais → der Japan-Chin
- Épagneul nain continental (Papillon) → der Papillon
- Épagneul picard → der Epagneul Picard
- Épagneul Tibétain → der Tibet-Spaniel
- Eurasier → der Eurasier
- Field Spaniel → der Field Spaniel
- Fox Terrier à Poil Dur → der Foxterrier (Drahthaar)
- Fox Terrier à Poil Lisse → der Foxterrier (Glatthaar)
- Foxhound Américain → der American Foxhound
- Français blanc et noir → der Français Blanc et Noir
- Français blanc et orange → der Français Blanc et Orange
- Français tricolore → der Français Tricolore
- Gascon saintongeois → der Gascon Saintongeois
- Golden Retriever → der Golden Retriever
- Grand anglo-français blanc et noir → der Grand Anglo-Français Blanc et Noir
- Grand anglo-français blanc et orange → der Grand Anglo-Français Blanc et Orange
- Grand anglo-français tricolore → der Grand Anglo-Français Tricolore
- Grand basset griffon vendéen → der Grand Basset Griffon Vendéen
- Grand bleu de Gascogne → der Grand Bleu de Gascogne
- Grand caniche → der Großpudel
- Grand griffon vendéen → der Grand Griffon Vendéen
- Greyhound → der Greyhound
- Griffon bleu de Gascogne → der Griffon Bleu de Gascogne
- Griffon d'arrêt à poil dur Korthals → der Griffon Korthals
- Griffon fauve de Bretagne → der Griffon Fauve de Bretagne
- Griffon nivernais → der Griffon Nivernais
- Harrier → der Harrier
- Husky d'Alaska → der Alaskan Husky
- Husky Sibérien → der Siberian Husky
- Irish Terrier → der Irish Terrier
- Jack Russell Terrier → der Jack Russell Terrier
- Kelpie Australien → der Australian Kelpie
- King Charles Spaniel → der King Charles Spaniel
- Komondor → der Komondor
- Kooikerhondje → das Kooikerhondje
- Kuvasz → der Kuvasz
- Labrador Retriever → der Labrador Retriever
- Lagotto Romagnolo → der Lagotto Romagnolo
- Laïka de Iakoutie → der Jakutischer Laika
- Lancashire Heeler → der Lancashire Heeler
- Leonberg → der Leonberger
- Lévrier Afghan → der Afghanischer Windhund
- Lévrier écossais (Deerhound) → der Deerhound
- Lévrier Irlandais → der Irischer Wolfshund
- Lhassa Apso → der Lhasa Apso
- Malamute de l'Alaska → der Alaskan Malamute
- Norfolk Terrier → der Norfolk Terrier
- Norwich Terrier → der Norwich Terrier
- Parson Russell terrier → der Parson Russell Terrier
- Pékinois → der Pekinese
- Petit basset griffon vendéen → der Petit Basset Griffon Vendéen
- Petit bleu de Gascogne → der Petit Bleu de Gascogne
- Petit chien lion → das Löwchen
- Petit chien russe (Russkiy Toy) → der Russkiy Toy
- Petit épagneul de Münster → der Kleiner Münsterländer
- Petit Lévrier Italien → das Italienisches Windspiel
- Pinscher Allemand → der Deutscher Pinscher
- Pinscher Nain → der Zwergpinscher
- Plott → der Plott Hound
- Pointer anglais → der English Pointer
- Poitevin → der Poitevin
- Porcelaine → der Porcelaine
- Puli → der Puli
- Pumi → der Pumi
- Rat Terrier → der Rat Terrier
- Redbone Coonhound → der Redbone Coonhound
- Retriever à poil plat → der Flat Coated Retriever
- Retriever de la Baie de Chesapeake → der Chesapeake Bay Retriever
- Retriever de la Nouvelle-Écosse → der Nova Scotia Duck Tolling Retriever
- Rhodesian Ridgeback → der Rhodesian Ridgeback
- Rottweiler → der Rottweiler
- Saint-Bernard → der Bernhardiner
- Saluki → der Saluki
- Samoyède → der Samojede
- Schipperke → der Schipperke
- Schnauzer Géant → der Riesenschnauzer
- Schnauzer Moyen → der Mittelschnauzer
- Schnauzer Nain → der Zwergschnauzer
- Scottish Terrier → der Scottish Terrier
- Setter Anglais → der English Setter
- Setter Gordon → der Gordon Setter
- Setter irlandais rouge → der Irish Red Setter
- Shar-Peï → der Shar-Pei
- Shetland Sheepdog (Berger des Shetland) → der Shetland Sheepdog (Sheltie)
- Shiba Inu → der Shiba Inu
- Shih Tzu → der Shih Tzu
- Shiloh Shepherd → der Shiloh Shepherd
- Silky Terrier australien → der Australian Silky Terrier
- Spinone Italien → der Spinone Italiano
- Spitz allemand → der Deutscher Spitz
- Spitz des Wisigoths (Vallhund suédois) → der Västgötaspets (Schwedischer Vallhund)
- Spitz Finlandais → der Finnenspitz
- Spitz Japonais → der Japan-Spitz
- Spitz Nain (Loulou de Poméranie) → der Zwergspitz (Pomeranian)
- Spitz-loup (Keeshond) → der Wolfsspitz (Keeshond)
- Springer Spaniel Anglais → der English Springer Spaniel
- Staffordshire Bull Terrier → der Staffordshire Bullterrier
- Teckel → der Dackel
- Terre-Neuve → der Neufundländer
- Terrier Australien → der Australian Terrier
- Terrier de chasse allemand (Jagdterrier) → der Deutscher Jagdterrier
- Terrier Irlandais à Poil Doux → der Irish Soft Coated Wheaten Terrier
- Terrier Irlandais de Glen of Imaal → der Irish Glen of Imaal Terrier
- Terrier Tibétain → der Tibet-Terrier
- Thai Ridgeback → der Thai Ridgeback
- Toy Fox Terrier → der Toy Fox Terrier
- Toy Terrier Anglais (Noir et Feu) → der English Toy Terrier
- Treeing Walker Coonhound → der Treeing Walker Coonhound
- Welsh Corgi Cardigan → der Welsh Corgi Cardigan
- Welsh Corgi Pembroke → der Welsh Corgi Pembroke
- Welsh Springer Spaniel → der Welsh Springer Spaniel
- West Highland White Terrier → der West Highland White Terrier
- Whippet → der Whippet
- Yorkshire Terrier → der Yorkshire Terrier
