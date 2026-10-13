# Guide de traduction : portugais (Brésil)

Pour toute personne (ou agent) qui traduit les phrases du site race-de-chien.com en portugais du Brésil.
Les lots se trouvent dans `i18n/pt/_lots/lot-XX.json` : `[{ "id", "fr", "page", "en" }]`.
La traduction s'écrit dans `lot-XX.pt.json` : `{ "<id>": "<português>" }`, une entrée par id, rien d'autre.

## Who reads it

Future dog owners in Brazil (the text must also read well in Portugal), often on a phone, arriving from Google on a
breed page or a question ("cachorro para apartamento", "cachorro que não solta pelo", "qual cachorro escolher").
The site helps them pick a breed that fits their life. Tone: warm, light, plain and honest, never salesy.

## Language rules (mandatory)

1. **Brazilian Portuguese**. Address the reader with **"você"** ("escolha", "seu cachorro"). Prefer "cachorro" in everyday
   text ("cão" is fine in breed names and formal contexts), "filhote" for puppy, "quintal" for yard, "apartamento".
2. Keep every placeholder exactly: `<g1>…</g1>` (an inline tag around words), `<x1/>` (an icon or image),
   `{0}` `{1}` (values filled in by code), `__LASTMOD_FR__` (a date filled in later). You may move them in the
   sentence, never drop, add, rename or duplicate them. Keep real HTML tags (`<strong>`, `<span class="…">`) as they are.
3. Keep `&amp;` `&lt;` `&gt;` as written. Never write a bare `<` or `&`.
4. Quotes “so”. Sentence case for headings and buttons, as in the French. No em dash and no en dash: use commas, colons,
   parentheses or two sentences.
5. Numbers: decimal comma (`2,5`), thousands point (`12.345`), `87%` with no space, ranges `58 a 70 cm`
   (in a sentence: `de 58 a 70 cm`). Units cm, kg, anos, minutos.
6. Translate the meaning, naturally. Do not add facts, do not drop any. Generated French sentences can be clumsy:
   write natural Portuguese.
7. Breed names: always the Portuguese name from the list below. Breeds are masculine: "o Golden Retriever",
   "do Pastor Alemão", "no Beagle".
8. A segment that is only a name, a number or a code that is the same in Portuguese: give it back unchanged.
9. Page titles (`<title>`, segments ending with `| Race de Chien`): keep under 60 characters when you can.
   Meta descriptions: under 155 characters. Keep "Race de Chien" as is: it is the brand name.

## France stays visible

The site is French and its data is French. Say so instead of hiding it:
- "LOF" is the French Kennel Club stud book: "inscrit au LOF" → "registrado no LOF (o livro de origens francês)" the first
  time on a page, then "LOF".
- "Société Centrale Canine" / "SCC" → "a Société Centrale Canine (o clube cinófilo francês)" the first time on a page.
- "chiens catégorisés", "1re / 2e catégorie": French law on dangerous dogs → "cães considerados perigosos na França",
  "1ª categoria", "2ª categoria". "permis de détention" → "licença de posse"; "mairie" → "prefeitura".
- "races françaises" → "raças francesas". Keep French names of institutions.

## Vocabulary (use these exact words)

Site: Race de Chien (brand, unchanged) · Tel Maître, Tel Chien → Tal Dono, Tal Cachorro · Quel chien pour moi ? →
Qual cachorro é para mim? · le test → o teste · Comparer → Comparar · fiche (de race) → ficha da raça ·
Ma vie → Sua vida · Votre profil en un clic → Seu perfil em um clique · compatibilité → compatibilidade
(`87 % de compatibilité` → `87% de compatibilidade`) · sélections → seleções · Groupe FCI → Grupo FCI ·
au garrot → na cernelha · robe(s) → cor(es) da pelagem · poil → pelo · toilettage → banho e tosa ·
éleveur → criador · dépistage → exame de triagem · Pour qui ? → Para quem? · Idéal pour → Ideal para ·
Moins adapté pour → Menos indicado para · En bref → Em resumo · Toutes ses notes → Todas as notas ·
À prévoir → Leve em conta · Pourquoi → Por quê · Races proches → Raças parecidas · Questions fréquentes →
Perguntas frequentes · Histoire et origines → História e origens · Présentation → Apresentação · Santé → Saúde ·
Poil et entretien → Pelo e cuidados · Pantouflard → Caseiro · Sportif → Esportista · Je travaille la journée →
Trabalho durante o dia · Discret → Discreto · chiot → filhote.

Ratings (label: levels 1 to 5). Keep these exact words, also lowercased inside sentences:
- Énergie / Energia: Muito baixa, Baixa, Moderada, Alta, Inesgotável
- En appartement / Em apartamento: Impossível, Difícil, Possível, Bom, Perfeito
- Seul à la maison / Sozinho em casa: Muito mal, Mal, Algumas horas, Bem, Muito bem
- Avec les enfants / Com crianças, Avec les autres chiens / Com outros cachorros, Avec les chats / Com gatos:
  Evitar, Cautela, Razoável, Bom, Excelente
- Avec les inconnus / Com estranhos: Muito desconfiado, Reservado, Educado, Aberto, Muito aberto
- Facilité d'éducation / Facilidade de adestramento: Muito difícil, Difícil, Média, Fácil, Muito fácil
- Pour un premier chien / Para um primeiro cachorro: Desaconselhado, Pouco adequado, Possível, Adequado, Ideal
- Instinct de garde / Instinto de guarda: Nulo, Baixo, Moderado, Marcado, Muito marcado
- Instinct de chasse / Instinto de caça: Muito baixo, Baixo, Moderado, Forte, Muito forte
- Tendance à fuguer / Tendência a fugir: Muito baixa, Baixa, Moderada, Alta, Muito alta
- Entretien du poil / Cuidados com o pelo: Mínimo, Baixo, Médio, Alto, Muito alto
- Perte de poils / Queda de pelo: Quase nenhuma, Baixa, Moderada, Alta, Muito alta
- Bave / Baba: Nunca, Raramente, Um pouco, Com frequência, Muito
- Aboiements / Latidos: Muito discreto, Discreto, Moderados, Frequentes, Late muito
- Tolérance à la chaleur / Tolerância ao calor, Tolérance au froid / Tolerância ao frio: Muito baixa, Baixa, Média, Boa, Excelente
- Robustesse / Robustez: Frágil, Um pouco frágil, Média, Boa, Excelente
Rating groups: Mode de vie Estilo de vida · Famille et sociabilité Família e sociabilidade · Éducation et caractère
Adestramento e temperamento · Entretien et voisinage Cuidados e vizinhança · Climat et santé Clima e saúde.
Sizes: Très petit Muito pequeno · Petit Pequeno · Moyen Médio · Grand Grande · Géant Gigante.

FCI groups (short labels): Bergers et bouviers → Cães pastores e boiadeiros · Molosses, pinschers et bouviers suisses →
Pinschers e schnauzers, molossos e boiadeiros suíços · Terriers → Terriers · Teckels → Dachshunds ·
Spitz et chiens primitifs → Spitz e cães do tipo primitivo · Chiens courants → Sabujos e cães de busca ·
Chiens d'arrêt → Cães de aponte · Rapporteurs, leveurs et chiens d'eau → Retrievers, levantadores e cães d’água ·
Chiens de compagnie → Cães de companhia · Lévriers → Lebréis.

## Breed names (French → Portuguese)

- Affenpinscher → Affenpinscher
- Airedale Terrier → Airedale Terrier
- Akbash → Akbash
- Akita → Akita Inu
- Akita américain → Akita Americano
- Alapaha Blue Blood Bulldog → Alapaha Blue Blood Bulldog
- American Bully → American Bully
- American Eskimo Dog (Chien esquimau américain) → Cão Esquimó Americano
- American Pit Bull Terrier → American Pit Bull Terrier
- American Staffordshire Terrier → American Staffordshire Terrier
- Anglo-français de petite vénerie → Anglo-Francês de Pequena Venaria
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
- Beauceron → Pastor de Beauce
- Bedlington Terrier → Bedlington Terrier
- Berger Allemand → Pastor Alemão
- Berger Américain Miniature → Pastor Americano Miniatura
- Berger Australien → Pastor Australiano
- Berger belge Groenendael → Pastor Belga Groenendael
- Berger belge Laekenois → Pastor Belga Laekenois
- Berger Belge Malinois → Pastor Belga Malinois
- Berger Belge Tervueren → Pastor Belga Tervueren
- Berger Blanc Suisse → Pastor Branco Suíço
- Berger de Brie (Briard) → Pastor de Brie
- Berger de Picardie (Berger picard) → Pastor de Picardia
- Berger des Pyrénées à face rase → Pastor dos Pirineus de Face Rasa
- Berger des Pyrénées à poil long → Pastor dos Pirineus de Pelo Longo
- Berger du Caucase → Pastor do Cáucaso
- Berger Hollandais → Pastor Holandês
- Bichon Frisé → Bichon Frisé
- Bichon Havanais → Bichon Havanês
- Bichon Maltais → Maltês
- Billy → Billy
- Bobtail → Old English Sheepdog
- Boerboel → Boerboel
- Border Collie → Border Collie
- Border Terrier → Border Terrier
- Boston Terrier → Boston Terrier
- Bouledogue Américain → Buldogue Americano
- Bouledogue Français → Buldogue Francês
- Bouvier Australien → Boiadeiro Australiano
- Bouvier Bernois → Boiadeiro Bernês
- Bouvier d'Appenzell → Boiadeiro de Appenzell
- Bouvier des Flandres → Boiadeiro de Flandres
- Boxer → Boxer
- Boykin Spaniel → Boykin Spaniel
- Braque Allemand à Poil Court → Braco Alemão de Pelo Curto
- Braque d'Auvergne → Braco de Auvergne
- Braque de l'Ariège → Braco de Ariège
- Braque de Weimar → Weimaraner
- Braque du Bourbonnais → Braco de Bourbonnais
- Braque français, type Gascogne → Braco Francês (Tipo Gasconha)
- Braque français, type Pyrénées → Braco Francês (Tipo Pirineus)
- Braque hongrois à poil court (Vizsla) → Vizsla
- Braque Hongrois à Poil Dur → Vizsla de Pelo Duro
- Braque Italien → Braco Italiano
- Braque Saint-Germain → Braco Saint-Germain
- Briquet griffon vendéen → Briquet Griffon Vendéen
- Bruno Saint-Hubert français → Bruno Saint-Hubert Français
- Bull Terrier → Bull Terrier
- Bull Terrier Miniature → Bull Terrier Miniatura
- Bulldog Anglais → Buldogue Inglês
- Bulldog continental → Buldogue Continental
- Bullmastiff → Bullmastiff
- Cairn Terrier → Cairn Terrier
- Cane Corso → Cane Corso
- Caniche moyen → Poodle Médio
- Caniche Nain → Poodle Miniatura
- Caniche Toy → Poodle Toy
- Carlin → Pug
- Cavalier King Charles Spaniel → Cavalier King Charles Spaniel
- Chien Chinois à Crête → Cão de Crista Chinês
- Chien courant suisse → Sabujo Suíço
- Chien d'arrêt allemand à poil dur (Drahthaar) → Braco Alemão de Pelo Duro
- Chien d'Artois → Cão de Artois
- Chien d'Eau Espagnol → Cão d'Água Espanhol
- Chien d'oysel allemand (Wachtelhund) → Spaniel Alemão
- Chien de berger kangal → Kangal
- Chien de Montagne des Pyrénées → Cão de Montanha dos Pirineus
- Chien de Saint-Hubert → Bloodhound
- Chien du Pharaon → Cão do Faraó
- Chien Finnois de Laponie → Lapphund Finlandês
- Chien Léopard Catahoula → Cão Leopardo de Catahoula
- Chien nu du Mexique (Xoloitzcuintle) → Xoloitzcuintle
- Chihuahua → Chihuahua
- Chinook → Chinook
- Chow-Chow → Chow Chow
- Clumber Spaniel → Clumber Spaniel
- Cocker Américain → Cocker Spaniel Americano
- Cocker Anglais → Cocker Spaniel Inglês
- Colley à poil long → Collie de Pelo Longo
- Coonhound Bleuté → Bluetick Coonhound
- Coonhound Noir et Feu → Black and Tan Coonhound
- Coton de Tuléar → Coton de Tuléar
- Cursinu → Cursinu
- Dalmatien → Dálmata
- Dobermann → Dobermann
- Dogue Allemand → Dogue Alemão
- Dogue Argentin → Dogo Argentino
- Dogue de Bordeaux → Dogue de Bordeaux
- Dogue des Canaries → Presa Canário
- Dogue du Tibet → Mastim Tibetano
- English Shepherd → English Shepherd
- Épagneul bleu de Picardie → Épagneul Azul da Picardia
- Épagneul Breton → Épagneul Bretão
- Épagneul d'Eau Américain → Spaniel d'Água Americano
- Épagneul de Pont-Audemer → Épagneul de Pont-Audemer
- Épagneul français → Épagneul Francês
- Épagneul Japonais → Chin Japonês
- Épagneul nain continental (Papillon) → Papillon
- Épagneul picard → Épagneul Picardo
- Épagneul Tibétain → Spaniel Tibetano
- Eurasier → Eurasier
- Field Spaniel → Field Spaniel
- Fox Terrier à Poil Dur → Fox Terrier de Pelo Duro
- Fox Terrier à Poil Lisse → Fox Terrier de Pelo Liso
- Foxhound Américain → Foxhound Americano
- Français blanc et noir → Francês Branco e Preto
- Français blanc et orange → Francês Branco e Laranja
- Français tricolore → Francês Tricolor
- Gascon saintongeois → Gascon Saintongeois
- Golden Retriever → Golden Retriever
- Grand anglo-français blanc et noir → Grande Anglo-Francês Branco e Preto
- Grand anglo-français blanc et orange → Grande Anglo-Francês Branco e Laranja
- Grand anglo-français tricolore → Grande Anglo-Francês Tricolor
- Grand basset griffon vendéen → Grand Basset Griffon Vendéen
- Grand bleu de Gascogne → Grand Bleu de Gascogne
- Grand caniche → Poodle Standard
- Grand griffon vendéen → Grand Griffon Vendéen
- Greyhound → Greyhound
- Griffon bleu de Gascogne → Griffon Bleu de Gascogne
- Griffon d'arrêt à poil dur Korthals → Griffon Korthals
- Griffon fauve de Bretagne → Griffon Fauve de Bretagne
- Griffon nivernais → Griffon Nivernais
- Harrier → Harrier
- Husky d'Alaska → Husky do Alasca
- Husky Sibérien → Husky Siberiano
- Irish Terrier → Terrier Irlandês
- Jack Russell Terrier → Jack Russell Terrier
- Kelpie Australien → Kelpie Australiano
- King Charles Spaniel → King Charles Spaniel
- Komondor → Komondor
- Kooikerhondje → Kooikerhondje
- Kuvasz → Kuvasz
- Labrador Retriever → Labrador Retriever
- Lagotto Romagnolo → Lagotto Romagnolo
- Laïka de Iakoutie → Laika da Iacútia
- Lancashire Heeler → Lancashire Heeler
- Leonberg → Leonberger
- Lévrier Afghan → Galgo Afegão
- Lévrier écossais (Deerhound) → Deerhound
- Lévrier Irlandais → Irish Wolfhound
- Lhassa Apso → Lhasa Apso
- Malamute de l'Alaska → Malamute do Alasca
- Norfolk Terrier → Norfolk Terrier
- Norwich Terrier → Norwich Terrier
- Parson Russell terrier → Parson Russell Terrier
- Pékinois → Pequinês
- Petit basset griffon vendéen → Petit Basset Griffon Vendéen
- Petit bleu de Gascogne → Petit Bleu de Gascogne
- Petit chien lion → Pequeno Cão Leão
- Petit chien russe (Russkiy Toy) → Toy Russo
- Petit épagneul de Münster → Pequeno Münsterländer
- Petit Lévrier Italien → Galgo Italiano
- Pinscher Allemand → Pinscher Alemão
- Pinscher Nain → Pinscher Miniatura
- Plott → Plott Hound
- Pointer anglais → Pointer Inglês
- Poitevin → Poitevin
- Porcelaine → Porcelaine
- Puli → Puli
- Pumi → Pumi
- Rat Terrier → Rat Terrier
- Redbone Coonhound → Redbone Coonhound
- Retriever à poil plat → Flat-Coated Retriever
- Retriever de la Baie de Chesapeake → Chesapeake Bay Retriever
- Retriever de la Nouvelle-Écosse → Retriever da Nova Escócia
- Rhodesian Ridgeback → Rhodesian Ridgeback
- Rottweiler → Rottweiler
- Saint-Bernard → São Bernardo
- Saluki → Saluki
- Samoyède → Samoieda
- Schipperke → Schipperke
- Schnauzer Géant → Schnauzer Gigante
- Schnauzer Moyen → Schnauzer Standard
- Schnauzer Nain → Schnauzer Miniatura
- Scottish Terrier → Scottish Terrier
- Setter Anglais → Setter Inglês
- Setter Gordon → Setter Gordon
- Setter irlandais rouge → Setter Irlandês Vermelho
- Shar-Peï → Shar-Pei
- Shetland Sheepdog (Berger des Shetland) → Pastor de Shetland
- Shiba Inu → Shiba Inu
- Shih Tzu → Shih Tzu
- Shiloh Shepherd → Shiloh Shepherd
- Silky Terrier australien → Silky Terrier Australiano
- Spinone Italien → Spinone Italiano
- Spitz allemand → Spitz Alemão
- Spitz des Wisigoths (Vallhund suédois) → Vallhund Sueco
- Spitz Finlandais → Spitz Finlandês
- Spitz Japonais → Spitz Japonês
- Spitz Nain (Loulou de Poméranie) → Lulu da Pomerânia
- Spitz-loup (Keeshond) → Keeshond
- Springer Spaniel Anglais → Springer Spaniel Inglês
- Staffordshire Bull Terrier → Staffordshire Bull Terrier
- Teckel → Dachshund
- Terre-Neuve → Terra-Nova
- Terrier Australien → Terrier Australiano
- Terrier de chasse allemand (Jagdterrier) → Terrier Alemão de Caça
- Terrier Irlandais à Poil Doux → Soft Coated Wheaten Terrier
- Terrier Irlandais de Glen of Imaal → Glen of Imaal Terrier
- Terrier Tibétain → Terrier Tibetano
- Thai Ridgeback → Thai Ridgeback
- Toy Fox Terrier → Toy Fox Terrier
- Toy Terrier Anglais (Noir et Feu) → Toy Terrier Inglês
- Treeing Walker Coonhound → Treeing Walker Coonhound
- Welsh Corgi Cardigan → Welsh Corgi Cardigan
- Welsh Corgi Pembroke → Welsh Corgi Pembroke
- Welsh Springer Spaniel → Springer Spaniel Galês
- West Highland White Terrier → West Highland White Terrier
- Whippet → Whippet
- Yorkshire Terrier → Yorkshire Terrier
