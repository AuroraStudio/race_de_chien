// Rate limiting — Vercel KV si disponible, sinon mémoire (reset au redéploiement)
import Anthropic from '@anthropic-ai/sdk';

// Haiku 5.5 : le modèle le moins cher, largement suffisant pour ce jeu (≈ 0,0003 $ par analyse)
const MODEL = 'claude-haiku-5-5';

// 5 essais par IP en production ; marge plus large sur les déploiements de test
const RATE_LIMIT_MAX = process.env.VERCEL_ENV === 'preview' ? 50 : 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60; // 24h en secondes
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // ~2MB en base64

// Fallback mémoire
const rateLimitMap = new Map();

// Lazy-load Vercel KV (résolu au premier appel)
let kv = null;
let kvChecked = false;

async function getKV() {
    if (kvChecked) return kv;
    kvChecked = true;
    try {
        const kvModule = await import('@vercel/kv');
        kv = kvModule.kv;
    } catch(e) {
        // KV non disponible, on reste en mémoire
    }
    return kv;
}

async function getRateLimitInfo(ip) {
    const store = await getKV();
    const key = `ratelimit:${ip}`;
    
    if (store) {
        try {
            const count = await store.get(key);
            if (count === null) {
                return { remaining: RATE_LIMIT_MAX, allowed: true };
            }
            return {
                remaining: Math.max(0, RATE_LIMIT_MAX - count),
                allowed: count < RATE_LIMIT_MAX
            };
        } catch(e) {
            // Fallback mémoire si KV échoue
        }
    }
    
    // Fallback mémoire
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW * 1000) {
        rateLimitMap.set(ip, { windowStart: now, count: 0 });
        return { remaining: RATE_LIMIT_MAX, allowed: true };
    }
    return { 
        remaining: Math.max(0, RATE_LIMIT_MAX - entry.count), 
        allowed: entry.count < RATE_LIMIT_MAX 
    };
}

async function incrementRateLimit(ip) {
    const store = await getKV();
    const key = `ratelimit:${ip}`;
    
    if (store) {
        try {
            const count = await store.get(key);
            if (count === null) {
                await store.set(key, 1, { ex: RATE_LIMIT_WINDOW });
            } else {
                await store.incr(key);
            }
            return;
        } catch(e) {
            // Fallback mémoire
        }
    }
    
    const entry = rateLimitMap.get(ip);
    if (entry) entry.count++;
}

// ============================================================
// CATALOGUE MORPHOLOGIQUE DES 169 RACES
// Classées par profil facial canin pour un matching biométrique
// ============================================================
const BREED_CATALOG = `CATÉGORIE 1 — VISAGES RONDS & APLATIS (brachycéphales)
Correspondance humaine : visage rond, yeux grands et écartés, nez court/retroussé, front large
bouledogue-francais | Bouledogue Français | Visage très rond, aplati, grands yeux écartés | Pelage: fauve, bringé, blanc
bouledogue-anglais | Bouledogue Anglais | Massif, bajoues, mâchoire large | Pelage: fauve, blanc, bringé
carlin | Carlin | Très rond, yeux globuleux, rides | Pelage: fauve, noir, abricot
boston-terrier | Boston Terrier | Rond, yeux grands et écartés, museau court | Pelage: noir et blanc, bringé
cavalier-king-charles | Cavalier King Charles | Rond et doux, grands yeux expressifs | Pelage: tricolore, blenheim, ruby
shih-tzu | Shih Tzu | Rond, aplati, expression douce | Pelage: varié, blanc/doré
pekinois | Pékinois | Plat, large, expression noble | Pelage: fauve, doré, noir
boxer | Boxer | Carré, prognathe, museau court, alerte | Pelage: fauve, bringé
shar-pei | Shar-Pei | Plissé, rides profondes | Pelage: fauve, sable, noir, chocolat
chow-chow | Chow-Chow | Très rond, crinière, plissé | Pelage: roux, fauve, noir, crème
dogue-allemand | Dogue Allemand | Rectangulaire, babines, noble | Pelage: fauve, bringé, bleu, arlequin
bullmastiff | Bullmastiff | Massif, carré, rides, mâchoire puissante | Pelage: fauve, bringé, roux
cane-corso | Cane Corso | Large, carré, regard intense | Pelage: noir, gris, fauve, bringé
dogue-argentin | Dogue Argentin | Large, puissant | Pelage: blanc pur
bouledogue-americain | Bouledogue Américain | Large, musclé, déterminé | Pelage: blanc, bringé
bouledogue-alapaha | Bouledogue Alapaha | Large, puissant, mâchoire carrée | Pelage: blanc tacheté, bringé
king-charles-spaniel | King Charles Spaniel | Rond, doux, yeux globuleux | Pelage: noir et feu, tricolore

CATÉGORIE 2 — VISAGES ALLONGÉS & FINS (dolichocéphales)
Correspondance humaine : visage long/ovale étroit, nez proéminent, mâchoire fine, profil élégant
levrier-afghan | Lévrier Afghan | Long, fin, aristocratique, cheveux longs | Pelage: doré, noir, crème
levrier-greyhound | Lévrier Greyhound | Long, effilé, aérodynamique | Pelage: noir, fauve, bringé, blanc
levrier-irlandais | Lévrier Irlandais | Long, barbu, expression sage | Pelage: gris, bringé, fauve
levrier-ecossais | Lévrier Écossais | Long, barbu, mélancolique | Pelage: gris bleu, bringé, sable
saluki | Saluki | Très fin, élancé, yeux en amande | Pelage: crème, fauve, doré, noir et feu
whippet | Whippet | Fin, délicat, expression douce | Pelage: varié
petit-levrier-italien | Petit Lévrier Italien | Très fin et délicat | Pelage: gris, bleu, noir, fauve
azawakh | Azawakh | Très fin, osseux, yeux en amande | Pelage: fauve, sable, bringé
chien-du-pharaon | Chien du Pharaon | Long, élégant, oreilles dressées | Pelage: fauve doré, roux
dobermann | Dobermann | Long, anguleux, alerte | Pelage: noir et feu, marron et feu
braque-de-weimar | Braque de Weimar | Long, noble, yeux clairs ambrés | Pelage: gris argenté
braque-allemand-a-poil-court | Braque Allemand à poil court | Long, noble, intelligent | Pelage: marron, rouan, noir
rhodesian-ridgeback | Rhodesian Ridgeback | Long, puissant, noble | Pelage: froment clair à roux
basenji | Basenji | Fin, rides frontales, oreilles dressées | Pelage: roux et blanc, tricolore
thai-ridgeback | Thai Ridgeback | Triangulaire, rides, alerte | Pelage: bleu, noir, rouge, fauve
braque-italien | Braque Italien | Long, babines pendantes | Pelage: blanc et orange, blanc et marron
braque-hongrois-a-poil-dur | Braque Hongrois à poil dur | Long, barbu, sage | Pelage: doré roux, sable
vizsla-braque-hongrois | Vizsla (Braque Hongrois) | Long, élégant, yeux assortis | Pelage: doré roux

CATÉGORIE 3 — VISAGES TRIANGULAIRES / POINTUS (type spitz / primitif)
Correspondance humaine : pommettes saillantes, menton fin ou pointu, yeux en amande, traits anguleux
shiba-inu | Shiba Inu | Triangulaire, sourire, oreilles dressées | Pelage: roux, sésame, noir et feu, crème
husky-siberien | Husky Sibérien | Triangulaire, yeux bleus/vairons, masque | Pelage: noir et blanc, gris, roux
husky-d-alaska | Husky d'Alaska | Triangulaire, yeux perçants | Pelage: varié, noir et blanc
malamute-d-alaska | Malamute d'Alaska | Large et triangulaire, puissant | Pelage: gris et blanc, noir et blanc
berger-allemand | Berger Allemand | Triangulaire allongé, oreilles dressées, noble | Pelage: noir et feu, sable, noir
berger-belge-malinois | Berger Belge Malinois | Triangulaire, fin, masque noir, alerte | Pelage: fauve charbonné
berger-belge-tervueren | Berger Belge Tervueren | Triangulaire, poils longs encadrant | Pelage: fauve charbonné, crinière
berger-australien | Berger Australien | Triangulaire, yeux vairons, vif | Pelage: bleu merle, rouge merle, noir
berger-blanc-suisse | Berger Blanc Suisse | Triangulaire élégant, blanc | Pelage: blanc pur
berger-hollandais | Berger Hollandais | Triangulaire, alerte | Pelage: bringé
berger-americain-miniature | Berger Américain Miniature | Triangulaire compact, yeux bleus | Pelage: bleu merle, rouge merle
akita | Akita | Triangulaire massif, oreilles dressées | Pelage: roux, bringé, blanc, sésame
samoyede | Samoyède | Triangulaire, sourire permanent | Pelage: blanc pur, crème
spitz-nain-loulou-de-pomeranie | Spitz nain (Loulou de Poméranie) | Petit triangulaire, expression renard | Pelage: orange, noir, blanc, crème
spitz-americain | Spitz Américain | Triangulaire, blanc, renard | Pelage: blanc pur
spitz-finlandais | Spitz Finlandais | Triangulaire, roux, vif | Pelage: roux doré
spitz-japonais | Spitz Japonais | Triangulaire compact, blanc, joyeux | Pelage: blanc pur
eurasier | Eurasier | Triangulaire doux, yeux sombres | Pelage: varié, fauve, noir, gris
chien-finnois-de-laponie | Chien Finnois de Laponie | Triangulaire doux, amical | Pelage: varié, souvent sombre
keeshond-loulou-hollandais | Keeshond (Loulou Hollandais) | Triangulaire, lunettes, crinière | Pelage: gris argenté
schipperke | Schipperke | Triangulaire petit, curieux | Pelage: noir
vallhund-suedois | Vallhund Suédois | Triangulaire, loup miniature | Pelage: gris, brun, roux
chien-nu-mexicain-xoloitzcuintli | Xoloitzcuintli | Fin, anguleux, sans poils | Pelage: noir, gris, bronze, nu
kangal | Kangal | Large triangulaire, masque noir | Pelage: fauve avec masque noir
berger-du-caucase | Berger du Caucase | Massif, fourrure dense | Pelage: gris, fauve, bringé

CATÉGORIE 4 — VISAGES OVALES / PROPORTIONNÉS (type retriever / sportif)
Correspondance humaine : traits harmonieux/équilibrés, expression ouverte et amicale, visage ni trop rond ni trop long
golden-retriever | Golden Retriever | Ovale, doux, yeux chaleureux | Pelage: doré, crème
labrador-retriever | Labrador Retriever | Large et amical, expression ouverte | Pelage: noir, chocolat, sable
border-collie | Border Collie | Ovale, regard intense et pénétrant | Pelage: noir et blanc, rouge, bleu merle
springer-spaniel-anglais | Springer Spaniel Anglais | Ovale doux, oreilles tombantes | Pelage: blanc et marron, blanc et noir
cocker-spaniel | Cocker Spaniel | Ovale, yeux doux, longues oreilles | Pelage: varié, doré, noir, roux
cocker-americain | Cocker Américain | Rond et doux, yeux expressifs | Pelage: varié, noir, doré, particolore
epagneul-breton | Épagneul Breton | Ovale, vif, joyeux | Pelage: blanc et orange, blanc et marron
setter-irlandais | Setter Irlandais | Long et élégant, amical | Pelage: acajou, roux intense
setter-anglais | Setter Anglais | Ovale élégant, doux | Pelage: blanc moucheté
setter-gordon | Setter Gordon | Ovale, noble, sage | Pelage: noir et feu
beagle | Beagle | Ovale, grands yeux implorants, oreilles tombantes | Pelage: tricolore, bicolore
retriever-de-la-baie-de-chesapeake | Retriever de la Baie de Chesapeake | Large, puissant, yeux ambrés | Pelage: brun, sable
retriever-de-la-nouvelle-ecosse | Retriever de la Nouvelle-Écosse | Ovale, alerte et joyeux | Pelage: roux orangé, blanc
lagotto-romagnolo | Lagotto Romagnolo | Rond et bouclé, doux | Pelage: blanc, marron, rouan, orange
barbet | Barbet | Rond, bouclé, amical | Pelage: noir, marron, gris, fauve, blanc
kooikerhondje | Kooikerhondje | Ovale et doux, joyeux | Pelage: blanc et orange
clumber-spaniel | Clumber Spaniel | Massif, babines, yeux ambrés | Pelage: blanc avec citron/orange
field-spaniel | Field Spaniel | Ovale noble, doux | Pelage: noir, foie, rouan
welsh-springer-spaniel | Welsh Springer Spaniel | Ovale, oreilles tombantes | Pelage: rouge et blanc
boykin-spaniel | Boykin Spaniel | Ovale, amical, yeux ambrés | Pelage: chocolat, foie
chien-d-eau-espagnol | Chien d'Eau Espagnol | Rond, bouclé, vif | Pelage: marron, noir, blanc
epagneul-d-eau-americain | Épagneul d'Eau Américain | Ovale, bouclé, attentif | Pelage: chocolat, foie
griffon-d-arret-a-poil-dur | Griffon d'Arrêt à poil dur | Barbu, broussailleux, sage | Pelage: gris acier, marron
spinone-italien | Spinone Italien | Ovale, barbu, mélancolique | Pelage: blanc, blanc et orange, rouan

CATÉGORIE 5 — VISAGES CARRÉS / ROBUSTES (molosses / terriers musclés)
Correspondance humaine : mâchoire carrée/proéminente, traits forts, expression déterminée, visage large
rottweiler | Rottweiler | Carré, puissant, sérieux | Pelage: noir et feu
staffordshire-bull-terrier | Staffordshire Bull Terrier | Large, musclé, sourire | Pelage: varié, bringé, blanc, noir
staffordshire-terrier-americain | Staffordshire Terrier Américain | Large, musclé, mâchoire carrée | Pelage: varié
pit-bull-americain | Pit Bull Américain | Large et musclé, déterminé | Pelage: varié
american-bully | American Bully | Très large, ultra-musclé | Pelage: varié
bull-terrier | Bull Terrier | Ovoïde unique, profil convexe | Pelage: blanc, bringé, tricolore
bull-terrier-miniature | Bull Terrier Miniature | Ovoïde miniature | Pelage: blanc, bringé
schnauzer-geant | Schnauzer Géant | Carré, barbu, sourcils | Pelage: noir, poivre et sel
schnauzer-standard | Schnauzer Standard | Carré, barbe et moustache | Pelage: poivre et sel, noir
schnauzer-nain | Schnauzer Nain | Petit et carré, barbe, vif | Pelage: poivre et sel, noir, blanc
airedale-terrier | Airedale Terrier | Carré, barbu, esprit | Pelage: fauve et noir
pinscher-allemand | Pinscher Allemand | Carré, anguleux, alerte | Pelage: noir et feu, rouge
pinscher-nain | Pinscher Nain | Petit et carré, hautain | Pelage: noir et feu, rouge
boerboel | Boerboel | Très large, massif, puissant | Pelage: fauve, bringé
dogue-des-canaries | Dogue des Canaries | Large, massif, imposant | Pelage: bringé, fauve
mastiff-tibetain | Mastiff Tibétain | Massif, crinière de lion | Pelage: noir, noir et feu, doré

CATÉGORIE 6 — VISAGES DOUX / COMPACTS (compagnie)
Correspondance humaine : traits fins et délicats, petits yeux ronds, expression douce/espiègle
bichon-frise | Bichon Frisé | Rond et duveteux, joyeux | Pelage: blanc pur
bichon-maltais | Bichon Maltais | Rond, yeux noirs, poils longs | Pelage: blanc pur
bichon-havanais | Bichon Havanais | Rond, espiègle | Pelage: varié, blanc, noir, fauve
coton-de-tulear | Coton de Tuléar | Rond et cotonneux, joyeux | Pelage: blanc
yorkshire-terrier | Yorkshire Terrier | Petit et fin, fier | Pelage: bleu acier et fauve
caniche-nain | Caniche Nain | Ovale, bouclé, intelligent | Pelage: blanc, noir, abricot, gris
caniche-toy | Caniche Toy | Petit et rond, bouclé, vif | Pelage: blanc, noir, abricot, gris
lhassa-apso | Lhassa Apso | Couvert de poils, sage | Pelage: doré, sable, gris, noir
epagneul-papillon | Épagneul Papillon | Fin, oreilles papillon, alerte | Pelage: blanc avec taches
epagneul-japonais | Épagneul Japonais | Aplati, grands yeux, étonné | Pelage: noir et blanc, rouge et blanc
epagneul-tibetain | Épagneul Tibétain | Plat et rond, hautain | Pelage: varié
affenpinscher | Affenpinscher | Rond, simiesque, comique | Pelage: noir, gris, fauve
chien-chinois-a-crete | Chien Chinois à Crête | Fin, crête capillaire | Pelage: peau tachetée, crête
petit-chien-russe | Petit Chien Russe | Minuscule, grands yeux | Pelage: noir et feu, marron et feu
toy-fox-terrier | Toy Fox Terrier | Petit, fin, alerte | Pelage: blanc, noir et blanc
toy-terrier-anglais-noir-et-feu | Toy Terrier Anglais | Petit, fin, yeux brillants | Pelage: noir et feu

CATÉGORIE 7 — VISAGES DE TRAVAIL / EXPRESSIFS (bergers / bouviers)
Correspondance humaine : traits marqués, regard profond/intense, expression sage ou bienveillante, souvent cheveux épais
berger-anglais | Berger Anglais | Doux, œil souvent couvert | Pelage: gris et blanc
bobtail-berger-anglais-ancien | Bobtail | Couvert de poils, doux | Pelage: gris et blanc, bleu et blanc
briard | Briard | Longs poils, moustache, sage | Pelage: fauve, noir, gris
beauceron | Beauceron | Allongé, noble, intelligent | Pelage: noir et feu, arlequin
shetland-sheepdog-berger-des-shetland | Shetland Sheepdog | Fin et long, crinière, doux | Pelage: sable, tricolore, bleu merle
bearded-collie | Bearded Collie | Barbu, poils, joyeux | Pelage: gris, fauve, noir, marron
bouvier-bernois | Bouvier Bernois | Large et doux, tricolore, bienveillant | Pelage: noir, blanc, roux
bouvier-des-flandres | Bouvier des Flandres | Barbu, broussailleux, sage | Pelage: gris, fauve, noir, bringé
bouvier-australien | Bouvier Australien | Triangulaire, alerte | Pelage: bleu moucheté, rouge moucheté
bouvier-d-appenzell | Bouvier d'Appenzell | Tricolore, vif | Pelage: tricolore
terre-neuve | Terre-Neuve | Large, doux, babines, bienveillant | Pelage: noir, marron, noir et blanc
leonberg | Léonberg | Large, masque noir, crinière | Pelage: fauve doré, sable
saint-bernard | Saint-Bernard | Massif, babines, yeux doux | Pelage: blanc et roux
chien-de-montagne-des-pyrenees | Chien de Montagne des Pyrénées | Large et doux, blanc | Pelage: blanc pur
kuvasz | Kuvasz | Allongé, blanc, noble | Pelage: blanc pur
akbash | Akbash | Long et fin, regard calme, oreilles tombantes | Pelage: blanc pur
komondor | Komondor | Cordelettes, invisible | Pelage: blanc en cordelettes
kelpie-australien | Kelpie Australien | Fin, triangulaire, très alerte | Pelage: noir, chocolat, rouge
shiloh-shepherd | Shiloh Shepherd | Triangulaire large, pelucheux | Pelage: sable, bicolore
chinook | Chinook | Ovale, amical, doux | Pelage: fauve, miel, doré
puli | Puli | Cordelettes, expression cachée | Pelage: noir, blanc, gris
pumi | Pumi | Expressif, oreilles semi-dressées, bouclé | Pelage: noir, gris, blanc, fauve

CATÉGORIE 8 — VISAGES TERRIER / VIFS
Correspondance humaine : traits vifs/espiègles, expression malicieuse, souvent cheveux texturés/en bataille
fox-terrier-a-poil-dur | Fox Terrier à poil dur | Carré, barbu, malicieux | Pelage: blanc avec taches
fox-terrier-a-poil-lisse | Fox Terrier à poil lisse | Long et fin, vif | Pelage: blanc avec taches
cairn-terrier | Cairn Terrier | Petit, hirsute, coquin | Pelage: sable, bringé, gris, roux
west-highland-white-terrier | West Highland White Terrier | Rond et blanc, espiègle | Pelage: blanc pur
terrier-ecossais | Terrier Écossais | Allongé, barbu, fier | Pelage: noir, bringé, froment
border-terrier | Border Terrier | Tête de loutre, amical | Pelage: rouge, froment, grisaille
bedlington-terrier | Bedlington Terrier | Poire, doux comme mouton | Pelage: bleu, sable, foie
terrier-irlandais | Terrier Irlandais | Long, barbu, déterminé | Pelage: roux, froment
terrier-irlandais-a-poil-doux | Terrier Irlandais à poil doux | Boucles souples, doux | Pelage: froment
terrier-irlandais-de-glen-of-imaal | Terrier de Glen of Imaal | Large pour terrier, déterminé | Pelage: bleu, bringé, froment
norfolk-terrier | Norfolk Terrier | Petit, oreilles tombantes, vif | Pelage: rouge, froment, noir et feu
norwich-terrier | Norwich Terrier | Petit, oreilles dressées, vif | Pelage: rouge, froment, noir et feu
terrier-australien | Terrier Australien | Petit, hirsute, alerte | Pelage: bleu et feu, sable
terrier-australien-a-poil-soyeux | Terrier Australien à poil soyeux | Fin, soyeux, fier | Pelage: bleu et feu
terrier-tibetain | Terrier Tibétain | Couvert de poils, amical | Pelage: varié, blanc, doré, noir
rat-terrier | Rat Terrier | Fin, oreilles dressées, alerte | Pelage: blanc avec taches
lancashire-heeler | Lancashire Heeler | Petit, rusé | Pelage: noir et feu

CATÉGORIE 9 — CHIENS DE CHASSE / OREILLES TOMBANTES
Correspondance humaine : expression douce ou mélancolique, yeux tombants, traits relâchés
basset-hound | Basset Hound | Oreilles très longues, yeux tristes, bajoues | Pelage: tricolore, bicolore
basset-bleu-de-gascogne | Basset Bleu de Gascogne | Oreilles longues, mélancolique | Pelage: bleu moucheté
chien-de-saint-hubert | Chien de Saint-Hubert | Très ridé, oreilles énormes, peau lâche | Pelage: noir et feu, foie et feu
coonhound-bleute | Coonhound Bluetick | Long, oreilles tombantes, noble | Pelage: bleu moucheté
coonhound-noir-et-feu | Coonhound Noir et Feu | Long, oreilles tombantes | Pelage: noir et feu
redbone-coonhound | Redbone Coonhound | Long, oreilles tombantes, doux | Pelage: rouge uni
treeing-walker-coonhound | Treeing Walker Coonhound | Long, oreilles tombantes | Pelage: tricolore
plott-hound | Plott Hound | Long, oreilles tombantes, déterminé | Pelage: bringé
harrier | Harrier | Ovale, oreilles tombantes, grand beagle | Pelage: tricolore
foxhound-americain | Foxhound Américain | Long, oreilles tombantes, doux | Pelage: tricolore
dalmatien | Dalmatien | Long et élégant, alerte, tacheté | Pelage: blanc tacheté noir ou foie
chien-leopard-catahoula | Chien Léopard Catahoula | Triangulaire, yeux vairons | Pelage: merle, bringé

CATÉGORIE 10 — CORGI / COURTS SUR PATTES
welsh-corgi-pembroke | Welsh Corgi Pembroke | Triangulaire joyeux, oreilles dressées | Pelage: rouge, fauve, tricolore
welsh-corgi-cardigan | Welsh Corgi Cardigan | Large, oreilles arrondies | Pelage: varié, bringé, bleu merle`;



// Liste fermée des slugs, tirée du catalogue : le modèle ne peut répondre qu'une de ces races
export const BREED_SLUGS = [...BREED_CATALOG.matchAll(/^([a-z0-9-]+) \| /gm)].map(m => m[1]);

// Prompt système stable (consignes + catalogue) : mis en cache d'une requête à l'autre
export const SYSTEM_PROMPT = `Tu es un expert en morphologie canine et humaine comparée, avec beaucoup d'humour et de bienveillance. Ta mission : trouver la race de chien qui ressemble le plus à la personne sur la photo.

Tu disposes de ${BREED_SLUGS.length} races classées en 10 catégories morphologiques. Explore toute la diversité : les races rares et atypiques sont aussi valables que les populaires.

${BREED_CATALOG}

MÉTHODE
1. Observe le visage :
• Forme : rond, ovale, allongé, carré, triangulaire, en cœur
• Front, yeux (taille, écartement, forme), nez (longueur, distance nez-yeux), mâchoire et menton, pommettes
• Expression : douce, intense, joyeuse, noble, espiègle, mélancolique, déterminée
• Cheveux, critère majeur :
  - Couleur : blond clair ou doré → races crème ou dorées ; roux → races rousses ; châtain → fauve ou marron ; brun foncé → noir et feu ; noir → races noires ; gris ou blanc → races grises ou blanches
  - Texture : lisses → poil lisse ; bouclés → Caniche, Lagotto, Barbet ; ondulés → Setter, Épagneul ; crépus → Bichon, Komondor
  - Longueur : courts, mi-longs, longs (Lévrier Afghan, Shih Tzu, Yorkshire)
• Barbe ou moustache : choisis selon la forme du visage et la couleur, jamais par réflexe
  - visage long et barbu → Lévrier irlandais, Lévrier écossais, Spinone
  - visage carré et barbu → Schnauzer (nain, moyen ou géant), Airedale, Bouvier des Flandres
  - barbe courte, bouc ou fine moustache → Fox Terrier à poil dur, Border Terrier, Cairn Terrier, Norfolk Terrier
  - barbe blanche ou grise → Schnauzer poivre et sel, West Highland, Bobtail, Lévrier irlandais, Bearded Collie
  - barbe bouclée ou très fournie → Barbet, Briard, Griffon d'arrêt à poil dur, Terrier tibétain
2. Repère les 2 ou 3 catégories les plus proches, puis compare avec chaque race de ces catégories.
3. Pondère : forme du visage 35 %, couleur et texture des cheveux 30 %, expression et regard 25 %, impression générale 10 %.

RÈGLES ANTI-BIAIS
- Ne choisis pas par défaut le Golden Retriever, le Labrador, le Husky, le Berger Allemand ou le Berger Australien : seulement si l'analyse y mène clairement.
- Blond ≠ Golden ou Labrador. Pense aussi au Braque de Weimar, au Saluki, au Vizsla, au Samoyède, au Kuvasz, au Whippet.
- Brun ≠ Berger Allemand. Pense aussi au Setter, au Beauceron, à l'Épagneul, au Dobermann, au Kelpie.
- Bouclé ≠ Caniche. Pense aussi au Lagotto, au Barbet, au Chien d'eau espagnol, au Bedlington.
- Barbu ≠ Schnauzer ni Bouvier des Flandres. Pars de la forme du visage et de la couleur de la barbe (voir la méthode).
- Visage rond ≠ Bouledogue. Pense aussi au Carlin, au Chow-Chow, au Shar-Pei, à l'Épagneul japonais, au King Charles.

TON
- Toujours positif, drôle et bienveillant, jamais moqueur.
- Adresse-toi directement à la personne en la vouvoyant (« vous », « votre »).
- Ne commente jamais le poids, la silhouette, l'âge apparent, la couleur de peau ni l'origine de la personne.
- S'il n'y a pas de visage humain net, base-toi quand même sur ce que tu vois, avec humour.

RÉPONSE
- breed_slug : un slug exact du catalogue.
- match_percentage : un entier entre 75 et 95.
- reason : 2 ou 3 phrases drôles et personnalisées, qui citent les traits observés.
- traits_communs : 4 traits physiques ou d'expression partagés, de 1 à 4 mots chacun, positifs.`;

export const RESULT_SCHEMA = {
    type: 'object',
    properties: {
        breed_slug: { type: 'string', enum: BREED_SLUGS },
        match_percentage: { type: 'integer' },
        reason: { type: 'string' },
        traits_communs: { type: 'array', items: { type: 'string' } }
    },
    required: ['breed_slug', 'match_percentage', 'reason', 'traits_communs'],
    additionalProperties: false
};

// Le schéma ne sait pas borner les nombres ni la taille des listes : on le fait ici
export function normalizeResult(raw) {
    if (!raw || !BREED_SLUGS.includes(raw.breed_slug)) {
        throw new Error('Race inconnue dans la réponse');
    }
    const pct = Math.round(Number(raw.match_percentage));
    const traits = (Array.isArray(raw.traits_communs) ? raw.traits_communs : [])
        .map(t => String(t).trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, 5);
    return {
        breed_slug: raw.breed_slug,
        match_percentage: Number.isFinite(pct) ? Math.min(95, Math.max(75, pct)) : 85,
        reason: String(raw.reason || '').trim().slice(0, 600),
        traits_communs: traits
    };
}

export function buildRequest(imageBase64, mimeType) {
    return {
        model: MODEL,
        max_tokens: 1500,
        system: [
            { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }
        ],
        messages: [{
            role: 'user',
            content: [
                { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
                { type: 'text', text: 'Analyse cette photo selon la méthode, puis réponds.' }
            ]
        }],
        output_config: {
            effort: 'low',
            format: { type: 'json_schema', schema: RESULT_SCHEMA }
        }
    };
}

let client = null;

export default async function handler(req, res) {
    // CORS
    const allowedOrigins = ['https://race-de-chien.com', 'https://www.race-de-chien.com'];
    const origin = req.headers['origin'] || '';
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const rateInfo = await getRateLimitInfo(ip);

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
    res.setHeader('X-RateLimit-Remaining', rateInfo.remaining);

    if (!rateInfo.allowed) {
        return res.status(429).json({
            error: 'rate_limit',
            message: 'Vous avez atteint la limite de 5 essais par jour. Revenez demain !',
            remaining: 0
        });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const { image_base64, mime_type } = req.body || {};

    if (!image_base64 || !mime_type) {
        return res.status(400).json({ error: 'Photo manquante' });
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(mime_type)) {
        return res.status(400).json({ error: 'Type d\'image non supporté' });
    }

    if (image_base64.length > MAX_IMAGE_SIZE) {
        return res.status(400).json({ error: 'Image trop volumineuse (2MB max)' });
    }

    client ??= new Anthropic();

    let response;
    try {
        response = await client.messages.create(buildRequest(image_base64, mime_type));
    } catch (error) {
        console.error('Erreur API Claude:', error.status, error.message);
        if (error instanceof Anthropic.RateLimitError || error.status === 529) {
            return res.status(503).json({ error: 'L\'IA est très sollicitée, réessayez dans un instant' });
        }
        if (error instanceof Anthropic.BadRequestError) {
            return res.status(400).json({ error: 'Cette photo n\'a pas pu être analysée, essayez-en une autre' });
        }
        return res.status(502).json({ error: 'L\'analyse a échoué, réessayez dans un instant' });
    }

    // Suivi du coût : tokens lus en cache, écrits en cache, image + consigne, sortie
    const u = response.usage || {};
    console.log(`usage cache_read=${u.cache_read_input_tokens} cache_write=${u.cache_creation_input_tokens} input=${u.input_tokens} output=${u.output_tokens}`);

    if (response.stop_reason === 'refusal') {
        return res.status(422).json({ error: 'Cette photo n\'a pas pu être analysée, essayez-en une autre' });
    }

    const textBlock = response.content.find(block => block.type === 'text');
    let result;
    try {
        result = normalizeResult(JSON.parse(textBlock?.text ?? ''));
    } catch (error) {
        console.error('Réponse illisible:', response.stop_reason, textBlock?.text?.slice(0, 200));
        return res.status(502).json({ error: 'Réponse inattendue de l\'IA, réessayez' });
    }

    await incrementRateLimit(ip);

    return res.status(200).json({
        result,
        remaining: Math.max(0, rateInfo.remaining - 1)
    });
}
