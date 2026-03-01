// Rate limiting — Vercel KV si disponible, sinon mémoire (reset au redéploiement)
const RATE_LIMIT_MAX = 5; // 5 essais max par IP
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

    // API key check
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { image_base64, mime_type, slug_list } = req.body;

        // Validation
        if (!image_base64 || !mime_type || !slug_list) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(mime_type)) {
            return res.status(400).json({ error: 'Type d\'image non supporté' });
        }

        if (image_base64.length > MAX_IMAGE_SIZE) {
            return res.status(400).json({ error: 'Image trop volumineuse (2MB max)' });
        }

        const systemPrompt = `Tu es un expert en morphologie canine et humaine comparée. Ta mission : trouver la race de chien qui ressemble MORPHOLOGIQUEMENT le plus à la personne sur la photo.

IMPORTANT : Tu disposes de 169 races classées en 10 catégories morphologiques. Tu DOIS explorer toute la diversité. Les races rares et atypiques sont aussi valables que les populaires.

${BREED_CATALOG}`;

        const userPrompt = `Analyse cette photo en suivant ces étapes OBLIGATOIRES :

ÉTAPE 1 — ANALYSE BIOMÉTRIQUE DU VISAGE HUMAIN
Évalue ces critères morphologiques :
• FORME DU VISAGE : rond, ovale, allongé, carré, triangulaire, en cœur, rectangulaire
• PROPORTIONS : rapport largeur/hauteur du visage
• FRONT : haut ou bas, large ou étroit
• YEUX : taille, écartement (distance inter-oculaire), forme (ronds, en amande, tombants), couleur
• NEZ : longueur, largeur, forme — et surtout la DISTANCE NEZ-YEUX (courte → brachycéphale / longue → dolichocéphale)
• MÂCHOIRE & MENTON : proéminent ou en retrait, carré ou pointu, largeur
• POMMETTES : hautes ou basses, saillantes ou discrètes
• EXPRESSION : douce, intense, joyeuse, noble, espiègle, mélancolique, déterminée
• CHEVEUX — critère majeur :
  - COULEUR : blond clair/doré → races crème/doré ; roux → races roux/acajou ; châtain → races fauve/marron ; brun foncé → races noir et feu ; noir → races noires ; gris/blanc → races grises/blanches
  - TEXTURE : lisses → pelage lisse ; bouclés/frisés → Caniche, Lagotto, Barbet ; ondulés → Setter, Épagneul ; crépus → Bichon, Komondor
  - LONGUEUR : courts → races à poil court ; mi-longs → races à poil moyen ; longs → Lévrier Afghan, Shih Tzu, Yorkshire
• PILOSITÉ FACIALE : barbe/moustache → Schnauzer, Fox Terrier, Griffon, Bouvier des Flandres
• CORPULENCE visible : fine → lévriers ; athlétique → bergers/sportifs ; robuste → bouviers ; massive → molosses

ÉTAPE 2 — MATCHING PAR CATÉGORIE
Identifie les 2-3 catégories morphologiques les plus proches parmi les 10, puis compare avec chaque race de ces catégories.

ÉTAPE 3 — SÉLECTION FINALE (pondération)
• Forme du visage et proportions : 35%
• Couleur et texture des cheveux vs pelage : 25%
• Expression et regard : 20%
• Corpulence : 10%
• Impression générale / "feeling" de ressemblance : 10%

RÈGLES ANTI-BIAIS (TRÈS IMPORTANT) :
- INTERDIT de choisir par défaut : Golden Retriever, Labrador, Husky, Berger Allemand ou Berger Australien. Ces races ne doivent être choisies QUE si l'analyse morphologique détaillée y mène clairement.
- Blonde ≠ Golden/Labrador. Pense aussi à : Braque de Weimar, Saluki, Vizsla, Samoyède, Kuvasz, Spitz, Whippet...
- Brun(e) ≠ Berger Allemand. Pense aussi à : Setter, Beauceron, Épagneul, Dobermann, Kelpie, Boykin...
- Cheveux bouclés ≠ Caniche. Pense aussi à : Lagotto, Barbet, Chien d'Eau Espagnol, Bedlington Terrier...
- Barbu ≠ Schnauzer. Pense aussi à : Briard, Bouvier des Flandres, Griffon, Spinone, Fox Terrier à poil dur...
- Visage rond ≠ Bouledogue. Pense aussi à : Carlin, Chow-Chow, Shar-Pei, Épagneul Japonais, King Charles...
- EXPLORE les races rares : Azawakh, Schipperke, Vallhund, Chinook, Pumi, Kooikerhondje, Chien du Pharaon, etc.

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks :
{
  "breed_slug": "slug-exact-du-catalogue",
  "match_percentage": 84,
  "reason": "Explication drôle et bienveillante en 2-3 phrases, personnalisée selon les traits physiques observés",
  "traits_communs": ["Trait 1", "Trait 2", "Trait 3", "Trait 4"],
  "morpho_analysis": "Résumé des critères morphologiques clés ayant guidé le choix"
}

Règles pour la réponse :
- Toujours positif, drôle et bienveillant — jamais moqueur
- Le breed_slug DOIT correspondre EXACTEMENT à un slug du catalogue
- Pourcentage entre 75 et 95
- 4 à 5 traits communs positifs
- Si pas de visage humain clair, base-toi sur ce que tu vois quand même`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 800,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: mime_type,
                                data: image_base64
                            }
                        },
                        {
                            type: 'text',
                            text: userPrompt
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json({ error: errData.error?.message || 'API error' });
        }

        await incrementRateLimit(ip);

        const data = await response.json();
        return res.status(200).json({ 
            ...data, 
            remaining: Math.max(0, rateInfo.remaining - 1) 
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
