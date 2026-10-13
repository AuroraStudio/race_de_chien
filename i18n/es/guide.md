# Guide de traduction : espagnol

Pour toute personne (ou agent) qui traduit les phrases du site race-de-chien.com en espagnol.
Les lots se trouvent dans `i18n/es/_lots/lot-XX.json` : `[{ "id", "fr", "page" }]`.
La traduction s'écrit dans `lot-XX.es.json` : `{ "<id>": "<español>" }`, une entrée par id, rien d'autre.

## Who reads it

Future dog owners in Spain and Latin America (Mexico, Argentina, Colombia, Chile…), often on a phone, arriving
from Google on a breed page or a question ("perros para apartamento", "perros que no sueltan pelo").
The site helps them pick a breed that fits their life. Tone: warm, light, plain and honest, never salesy.

## Language rules (mandatory)

1. **Neutral Spanish**, understood everywhere: avoid words that only Spain or only one Latin American country uses.
   Use "apartamento" (not piso / departamento), "cachorro", "perro", "jardín", "auto" is not needed. No "vosotros",
   no voseo. Address the reader with **"tú"** ("elige", "tu perro"), never "usted".
2. Keep every placeholder exactly: `<g1>…</g1>` (an inline tag around words), `<x1/>` (an icon or image),
   `{0}` `{1}` (values filled in by code), `__LASTMOD_FR__` (a date filled in later). You may move them in the
   sentence, never drop, add, rename or duplicate them. Keep real HTML tags (`<strong>`, `<span class="…">`) as they are.
3. Keep `&amp;` `&lt;` `&gt;` as written. Never write a bare `<` or `&`.
4. Spanish punctuation: opening `¿` and `¡` always. Quotes « » (no space inside: «así»). Sentence case for headings
   and buttons, as in the French. No em dash and no en dash: use commas, colons, parentheses or two sentences.
5. Numbers: decimal comma (`2,5`), thousands with a point from 10 000 up (`12.345`, but `1234`), `87 %` with a space,
   ranges `58 a 70 cm` (in a sentence: `de 58 a 70 cm`). Units cm, kg, años, minutos.
6. Translate the meaning, naturally. Do not add facts, do not drop any. Generated French sentences can be clumsy:
   write natural Spanish.
7. Breed names: always the Spanish name from the list below. Breeds are masculine: "el Golden Retriever",
   "el Pastor Alemán", "del Beagle".
8. A segment that is only a name, a number or a code that is the same in Spanish: give it back unchanged.
9. Page titles (`<title>`, segments ending with `| Race de Chien`): keep under 60 characters when you can.
   Meta descriptions: under 155 characters. Keep "Race de Chien" as is: it is the brand name.

## France stays visible

The site is French and its data is French. Say so instead of hiding it:
- "LOF" is the French Kennel Club stud book: "inscrit au LOF" → "inscrito en el LOF (libro de orígenes francés)"
  the first time on a page, then "LOF".
- "Société Centrale Canine" / "SCC" → "la Société Centrale Canine (el club canino francés)" the first time on a page.
- "chiens catégorisés", "1re / 2e catégorie": French law on dangerous dogs → "perros catalogados como peligrosos
  en Francia", "1.ª categoría", "2.ª categoría". "permis de détention" → "licencia de tenencia"; "mairie" → "ayuntamiento".
- "races françaises" → "razas francesas". Keep French names of institutions.

## Vocabulary (use these exact words)

Site: Race de Chien (brand, unchanged) · Tel Maître, Tel Chien → Tal Dueño, Tal Perro · Quel chien pour moi ? →
¿Qué perro es para mí? · le test → el test · Comparer → Comparar · fiche (de race) → ficha de la raza ·
Ma vie → Tu vida · Votre profil en un clic → Tu perfil en un clic · compatibilité → compatibilidad
(`87 % de compatibilité` → `87 % de compatibilidad`) · sélections → selecciones · Groupe FCI → Grupo FCI ·
au garrot → a la cruz · robe(s) → color(es) del pelaje · poil → pelo · toilettage → aseo / peluquería canina ·
éleveur → criador · dépistage → prueba de detección · Pour qui ? → ¿Para quién? · Idéal pour → Ideal para ·
Moins adapté pour → Menos adecuado para · En bref → En resumen · Toutes ses notes → Todas sus notas ·
À prévoir → A tener en cuenta · Pourquoi → Por qué · Races proches → Razas parecidas · Questions fréquentes →
Preguntas frecuentes · Histoire et origines → Historia y orígenes · Présentation → Presentación · Santé → Salud ·
Poil et entretien → Pelo y cuidados · Pantouflard → Casero · Sportif → Deportista · Je travaille la journée →
Trabajo durante el día · Discret → Discreto · chiot → cachorro.

Ratings (label: levels 1 to 5). Keep these exact words, also lowercased inside sentences:
- Énergie / Energía: Muy baja, Baja, Moderada, Alta, Desbordante
- En appartement / En apartamento: Imposible, Difícil, Posible, Bien, Perfecto
- Seul à la maison / Solo en casa: Muy mal, Mal, Unas horas, Bien, Muy bien
- Avec les enfants / Con niños, Avec les autres chiens / Con otros perros, Avec les chats / Con gatos:
  Evitar, Precaución, Correcto, Bueno, Excelente
- Avec les inconnus / Con extraños: Muy desconfiado, Reservado, Educado, Abierto, Muy abierto
- Facilité d'éducation / Facilidad de adiestramiento: Muy difícil, Difícil, Media, Fácil, Muy fácil
- Pour un premier chien / Para un primer perro: Desaconsejado, Poco adecuado, Posible, Adecuado, Ideal
- Instinct de garde / Instinto de guardia: Nulo, Bajo, Moderado, Marcado, Muy marcado
- Instinct de chasse / Instinto de caza: Muy bajo, Bajo, Moderado, Fuerte, Muy fuerte
- Tendance à fuguer / Tendencia a escaparse: Muy baja, Baja, Moderada, Alta, Muy alta
- Entretien du poil / Cuidado del pelo: Mínimo, Bajo, Medio, Alto, Muy alto
- Perte de poils / Muda de pelo: Casi nula, Baja, Moderada, Alta, Muy alta
- Bave / Babeo: Nunca, Rara vez, Un poco, A menudo, Mucho
- Aboiements / Ladridos: Muy discreto, Discreto, Moderados, Frecuentes, Muy ladrador
- Tolérance à la chaleur / Tolerancia al calor, Tolérance au froid / Tolerancia al frío: Muy baja, Baja, Media, Buena, Excelente
- Robustesse / Robustez: Frágil, Algo frágil, Media, Buena, Excelente
Rating groups: Mode de vie Estilo de vida · Famille et sociabilité Familia y sociabilidad · Éducation et caractère
Adiestramiento y carácter · Entretien et voisinage Cuidados y vecinos · Climat et santé Clima y salud.
Sizes: Très petit Muy pequeño · Petit Pequeño · Moyen Mediano · Grand Grande · Géant Gigante.

FCI groups (short labels): Bergers et bouviers → Perros pastores y boyeros · Molosses, pinschers et bouviers suisses →
Pinscher y schnauzer, molosos y boyeros suizos · Terriers → Terriers · Teckels → Teckels · Spitz et chiens primitifs →
Spitz y perros de tipo primitivo · Chiens courants → Sabuesos y perros de rastro · Chiens d'arrêt → Perros de muestra ·
Rapporteurs, leveurs et chiens d'eau → Cobradores, levantadores y perros de agua · Chiens de compagnie → Perros de compañía ·
Lévriers → Lebreles.

## Breed names (French → Spanish)

- Affenpinscher → Affenpinscher
- Airedale Terrier → Airedale Terrier
- Akbash → Akbash
- Akita → Akita Inu
- Akita américain → Akita Americano
- Alapaha Blue Blood Bulldog → Alapaha Blue Blood Bulldog
- American Bully → American Bully
- American Eskimo Dog (Chien esquimau américain) → Perro Esquimal Americano
- American Pit Bull Terrier → American Pit Bull Terrier
- American Staffordshire Terrier → American Staffordshire Terrier
- Anglo-français de petite vénerie → Anglo-Francés de Pequeña Venería
- Ariégeois → Ariégeois
- Azawakh → Azawakh
- Barbet → Barbet
- Basenji → Basenji
- Basset artésien normand → Basset Artesiano Normando
- Basset Bleu de Gascogne → Basset Azul de Gascuña
- Basset fauve de Bretagne → Basset Leonado de Bretaña
- Basset Hound → Basset Hound
- Beagle → Beagle
- Beagle-harrier → Beagle-Harrier
- Bearded Collie → Bearded Collie
- Beauceron → Pastor de Beauce
- Bedlington Terrier → Bedlington Terrier
- Berger Allemand → Pastor Alemán
- Berger Américain Miniature → Pastor Americano Miniatura
- Berger Australien → Pastor Australiano
- Berger belge Groenendael → Pastor Belga Groenendael
- Berger belge Laekenois → Pastor Belga Laekenois
- Berger Belge Malinois → Pastor Belga Malinois
- Berger Belge Tervueren → Pastor Belga Tervueren
- Berger Blanc Suisse → Pastor Blanco Suizo
- Berger de Brie (Briard) → Pastor de Brie
- Berger de Picardie (Berger picard) → Pastor de Picardía
- Berger des Pyrénées à face rase → Pastor de los Pirineos de Cara Rasa
- Berger des Pyrénées à poil long → Pastor de los Pirineos de Pelo Largo
- Berger du Caucase → Pastor del Cáucaso
- Berger Hollandais → Pastor Holandés
- Bichon Frisé → Bichón Frisé
- Bichon Havanais → Bichón Habanero
- Bichon Maltais → Bichón Maltés
- Billy → Billy
- Bobtail → Bobtail
- Boerboel → Boerboel
- Border Collie → Border Collie
- Border Terrier → Border Terrier
- Boston Terrier → Boston Terrier
- Bouledogue Américain → Bulldog Americano
- Bouledogue Français → Bulldog Francés
- Bouvier Australien → Pastor Ganadero Australiano
- Bouvier Bernois → Boyero de Berna
- Bouvier d'Appenzell → Boyero de Appenzell
- Bouvier des Flandres → Boyero de Flandes
- Boxer → Boxer
- Boykin Spaniel → Boykin Spaniel
- Braque Allemand à Poil Court → Braco Alemán de Pelo Corto
- Braque d'Auvergne → Braco de Auvergne
- Braque de l'Ariège → Braco del Ariège
- Braque de Weimar → Braco de Weimar
- Braque du Bourbonnais → Braco del Borbonés
- Braque français, type Gascogne → Braco Francés (Tipo Gascuña)
- Braque français, type Pyrénées → Braco Francés (Tipo Pirineos)
- Braque hongrois à poil court (Vizsla) → Vizsla
- Braque Hongrois à Poil Dur → Braco Húngaro de Pelo Duro
- Braque Italien → Braco Italiano
- Braque Saint-Germain → Braco Saint-Germain
- Briquet griffon vendéen → Briquet Grifón Vendeano
- Bruno Saint-Hubert français → Bruno Saint-Hubert Français
- Bull Terrier → Bull Terrier
- Bull Terrier Miniature → Bull Terrier Miniatura
- Bulldog Anglais → Bulldog Inglés
- Bulldog continental → Bulldog Continental
- Bullmastiff → Bullmastiff
- Cairn Terrier → Cairn Terrier
- Cane Corso → Cane Corso
- Caniche moyen → Caniche Mediano
- Caniche Nain → Caniche Enano
- Caniche Toy → Caniche Toy
- Carlin → Pug
- Cavalier King Charles Spaniel → Cavalier King Charles Spaniel
- Chien Chinois à Crête → Perro Crestado Chino
- Chien courant suisse → Sabueso Suizo
- Chien d'arrêt allemand à poil dur (Drahthaar) → Braco Alemán de Pelo Duro
- Chien d'Artois → Perro de Artois
- Chien d'Eau Espagnol → Perro de Agua Español
- Chien d'oysel allemand (Wachtelhund) → Spaniel Alemán
- Chien de berger kangal → Kangal
- Chien de Montagne des Pyrénées → Perro de Montaña de los Pirineos
- Chien de Saint-Hubert → Sabueso de San Huberto
- Chien du Pharaon → Perro del Faraón
- Chien Finnois de Laponie → Perro Finlandés de Laponia
- Chien Léopard Catahoula → Perro Leopardo de Catahoula
- Chien nu du Mexique (Xoloitzcuintle) → Xoloitzcuintle
- Chihuahua → Chihuahua
- Chinook → Chinook
- Chow-Chow → Chow Chow
- Clumber Spaniel → Clumber Spaniel
- Cocker Américain → Cocker Spaniel Americano
- Cocker Anglais → Cocker Spaniel Inglés
- Colley à poil long → Collie de Pelo Largo
- Coonhound Bleuté → Bluetick Coonhound
- Coonhound Noir et Feu → Coonhound Negro y Fuego
- Coton de Tuléar → Coton de Tuléar
- Cursinu → Cursinu
- Dalmatien → Dálmata
- Dobermann → Dóberman
- Dogue Allemand → Gran Danés
- Dogue Argentin → Dogo Argentino
- Dogue de Bordeaux → Dogo de Burdeos
- Dogue des Canaries → Presa Canario
- Dogue du Tibet → Mastín Tibetano
- English Shepherd → English Shepherd
- Épagneul bleu de Picardie → Epagneul Azul de Picardía
- Épagneul Breton → Epagneul Bretón
- Épagneul d'Eau Américain → Spaniel de Agua Americano
- Épagneul de Pont-Audemer → Spaniel de Pont-Audemer
- Épagneul français → Epagneul Francés
- Épagneul Japonais → Chin Japonés
- Épagneul nain continental (Papillon) → Papillón
- Épagneul picard → Epagneul Picardo
- Épagneul Tibétain → Spaniel Tibetano
- Eurasier → Eurasier
- Field Spaniel → Field Spaniel
- Fox Terrier à Poil Dur → Fox Terrier de Pelo Duro
- Fox Terrier à Poil Lisse → Fox Terrier de Pelo Liso
- Foxhound Américain → Foxhound Americano
- Français blanc et noir → Francés Blanco y Negro
- Français blanc et orange → Francés Blanco y Naranja
- Français tricolore → Francés Tricolor
- Gascon saintongeois → Gascón Saintongeois
- Golden Retriever → Golden Retriever
- Grand anglo-français blanc et noir → Gran Anglo-Francés Blanco y Negro
- Grand anglo-français blanc et orange → Gran Anglo-Francés Blanco y Naranja
- Grand anglo-français tricolore → Gran Anglo-Francés Tricolor
- Grand basset griffon vendéen → Gran Basset Grifón Vendeano
- Grand bleu de Gascogne → Gran Azul de Gascuña
- Grand caniche → Caniche Grande
- Grand griffon vendéen → Gran Grifón Vendeano
- Greyhound → Greyhound
- Griffon bleu de Gascogne → Grifón Azul de Gascuña
- Griffon d'arrêt à poil dur Korthals → Grifón Korthals
- Griffon fauve de Bretagne → Grifón Leonado de Bretaña
- Griffon nivernais → Grifón Nivernais
- Harrier → Harrier
- Husky d'Alaska → Husky de Alaska
- Husky Sibérien → Husky Siberiano
- Irish Terrier → Terrier Irlandés
- Jack Russell Terrier → Jack Russell Terrier
- Kelpie Australien → Kelpie Australiano
- King Charles Spaniel → King Charles Spaniel
- Komondor → Komondor
- Kooikerhondje → Kooikerhondje
- Kuvasz → Kuvasz
- Labrador Retriever → Labrador Retriever
- Lagotto Romagnolo → Lagotto Romagnolo
- Laïka de Iakoutie → Laika de Yakutia
- Lancashire Heeler → Lancashire Heeler
- Leonberg → Leonberger
- Lévrier Afghan → Galgo Afgano
- Lévrier écossais (Deerhound) → Lebrel Escocés
- Lévrier Irlandais → Lobero Irlandés
- Lhassa Apso → Lhasa Apso
- Malamute de l'Alaska → Malamute de Alaska
- Norfolk Terrier → Norfolk Terrier
- Norwich Terrier → Norwich Terrier
- Parson Russell terrier → Parson Russell Terrier
- Pékinois → Pequinés
- Petit basset griffon vendéen → Pequeño Basset Grifón Vendeano
- Petit bleu de Gascogne → Pequeño Azul de Gascuña
- Petit chien lion → Pequeño Perro León
- Petit chien russe (Russkiy Toy) → Toy Ruso
- Petit épagneul de Münster → Pequeño Münsterländer
- Petit Lévrier Italien → Galgo Italiano
- Pinscher Allemand → Pinscher Alemán
- Pinscher Nain → Pinscher Miniatura
- Plott → Plott Hound
- Pointer anglais → Pointer Inglés
- Poitevin → Poitevin
- Porcelaine → Porcelana
- Puli → Puli
- Pumi → Pumi
- Rat Terrier → Rat Terrier
- Redbone Coonhound → Redbone Coonhound
- Retriever à poil plat → Retriever de Pelo Liso
- Retriever de la Baie de Chesapeake → Retriever de la Bahía de Chesapeake
- Retriever de la Nouvelle-Écosse → Retriever de Nueva Escocia
- Rhodesian Ridgeback → Rhodesian Ridgeback
- Rottweiler → Rottweiler
- Saint-Bernard → San Bernardo
- Saluki → Saluki
- Samoyède → Samoyedo
- Schipperke → Schipperke
- Schnauzer Géant → Schnauzer Gigante
- Schnauzer Moyen → Schnauzer Mediano
- Schnauzer Nain → Schnauzer Miniatura
- Scottish Terrier → Terrier Escocés
- Setter Anglais → Setter Inglés
- Setter Gordon → Setter Gordon
- Setter irlandais rouge → Setter Irlandés Rojo
- Shar-Peï → Shar Pei
- Shetland Sheepdog (Berger des Shetland) → Pastor de Shetland
- Shiba Inu → Shiba Inu
- Shih Tzu → Shih Tzu
- Shiloh Shepherd → Shiloh Shepherd
- Silky Terrier australien → Silky Terrier Australiano
- Spinone Italien → Spinone Italiano
- Spitz allemand → Spitz Alemán
- Spitz des Wisigoths (Vallhund suédois) → Vallhund Sueco
- Spitz Finlandais → Spitz Finlandés
- Spitz Japonais → Spitz Japonés
- Spitz Nain (Loulou de Poméranie) → Pomerania
- Spitz-loup (Keeshond) → Keeshond
- Springer Spaniel Anglais → Springer Spaniel Inglés
- Staffordshire Bull Terrier → Staffordshire Bull Terrier
- Teckel → Teckel
- Terre-Neuve → Terranova
- Terrier Australien → Terrier Australiano
- Terrier de chasse allemand (Jagdterrier) → Terrier de Caza Alemán
- Terrier Irlandais à Poil Doux → Terrier Irlandés de Pelo Suave
- Terrier Irlandais de Glen of Imaal → Terrier Irlandés de Glen of Imaal
- Terrier Tibétain → Terrier Tibetano
- Thai Ridgeback → Thai Ridgeback
- Toy Fox Terrier → Toy Fox Terrier
- Toy Terrier Anglais (Noir et Feu) → Toy Terrier Inglés
- Treeing Walker Coonhound → Treeing Walker Coonhound
- Welsh Corgi Cardigan → Welsh Corgi Cardigan
- Welsh Corgi Pembroke → Welsh Corgi Pembroke
- Welsh Springer Spaniel → Springer Spaniel Galés
- West Highland White Terrier → West Highland White Terrier
- Whippet → Whippet
- Yorkshire Terrier → Yorkshire Terrier
