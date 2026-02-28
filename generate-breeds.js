#!/usr/bin/env node
/**
 * generate-breeds.js
 * Génère une page HTML statique pour chaque race de chien.
 * Crée aussi sitemap.xml et robots.txt.
 * 
 * Usage : node generate-breeds.js
 */

const fs = require('fs');
const path = require('path');

// Config
const SITE_URL = 'https://race-de-chien.com';
const DATA_FILE = path.join(__dirname, 'data', 'breeds.json');
const OUTPUT_DIR = path.join(__dirname, 'races');

// Charger les données
const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const breeds = data.breeds;

// Helper: formater une plage min-max intelligemment
function formatRange(min, max, unit) {
    if (!min && !max) return `? ${unit}`;
    if (!min || !max || min === max) return `${min || max} ${unit}`;
    return `${min} à ${max} ${unit}`;
}
function formatRangeDash(min, max, unit) {
    if (!min && !max) return `? ${unit}`;
    if (!min || !max || min === max) return `${min || max} ${unit}`;
    return `${min} - ${max} ${unit}`;
}
// Helper: phrase naturelle pour une plage (ex: "de 55 à 65 cm" ou "d'environ 40 cm")
function formatRangePhrase(min, max, unit) {
    if (!min && !max) return `non renseigné`;
    if (!min || !max || min === max) return `d'environ ${min || max} ${unit}`;
    return `de ${min} à ${max} ${unit}`;
}
// Helper: phrase pour espérance de vie
function formatLifePhrase(min, max) {
    if (!min && !max) return `non renseignée`;
    if (!min || !max || min === max) return `d'environ ${min || max} ans`;
    return `de ${min} à ${max} ans`;
}

// Créer le dossier /races/
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ============================================
// UTILS
// ============================================

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlever accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================
// TRADUCTIONS (miroir de breed.js)
// ============================================

const sizeLabels = { toy: 'Très petite', small: 'Petite', medium: 'Moyenne', large: 'Grande', giant: 'Géante' };
const sizeLabelsMini = { toy: 'très petite', small: 'petite', medium: 'moyenne', large: 'grande', giant: 'géante' };
const energyLabels = { low: 'Calme', moderate: 'Modéré', high: 'Énergique', very_high: 'Très énergique' };
const groupLabels = {
    'Toy': 'Chien de compagnie', 'Hound': 'Chien de chasse', 'Working': 'Chien de travail',
    'Sporting': 'Chien de sport', 'Herding': 'Chien de berger', 'Terrier': 'Terrier',
    'Non-Sporting': 'Chien de compagnie', 'Mixed': 'Race mixte',
    'Chien de compagnie': 'Chien de compagnie', 'Chien de chasse': 'Chien de chasse',
    'Chien de travail': 'Chien de travail', 'Chien de sport': 'Chien de sport',
    'Chien de berger': 'Chien de berger', 'Garde et protection': 'Garde et protection'
};
const coatTypeLabels = {
    'Lisse': 'Poil lisse et brillant', 'Dur': 'Poil dur et rêche', 'Bouclé': 'Poil bouclé ou frisé',
    'Ondulé': 'Poil ondulé', 'Soyeux': 'Poil soyeux et doux', 'Double': 'Double pelage protecteur'
};

const traitTranslations = {
    'Confident': 'Confiant', 'Friendly': 'Amical', 'Alert': 'Vigilant', 'Intelligent': 'Intelligent',
    'Courageous': 'Courageux', 'Loyal': 'Loyal', 'Brave': 'Brave', 'Playful': 'Joueur',
    'Active': 'Actif', 'Gentle': 'Doux', 'Affectionate': 'Affectueux', 'Protective': 'Protecteur',
    'Cheerful': 'Joyeux', 'Quiet': 'Calme', 'Energetic': 'Énergique', 'Trainable': 'Éduquable',
    'Independent': 'Indépendant', 'Stubborn': 'Têtu', 'Curious': 'Curieux', 'Obedient': 'Obéissant',
    'Fearless': 'Intrépide', 'Devoted': 'Dévoué', 'Responsive': 'Réceptif', 'Spirited': 'Enjoué',
    'Good-natured': 'Bon caractère', 'Keen': 'Vif', 'Trusting': 'Confiant', 'Kind': 'Gentil',
    'Sweet-Tempered': 'Doux', 'Tenacious': 'Tenace', 'Attentive': 'Attentif', 'Faithful': 'Fidèle',
    'Bold': 'Audacieux', 'Proud': 'Fier', 'Reliable': 'Fiable', 'Watchful': 'Surveillant',
    'Even Tempered': 'Équilibré', 'Reserved': 'Réservé', 'Sensitive': 'Sensible',
    'Adaptable': 'Adaptable', 'Outgoing': 'Sociable', 'Charming': 'Charmant', 'Docile': 'Docile',
    'Patient': 'Patient', 'Steady': 'Stable', 'Determined': 'Déterminé', 'Hardworking': 'Travailleur',
    'Dignified': 'Digne', 'Composed': 'Posé', 'Joyful': 'Joyeux', 'Agile': 'Agile',
    'Excitable': 'Excitable', 'Dominant': 'Dominant', 'Strong': 'Fort', 'Powerful': 'Puissant',
    'Suspicious': 'Méfiant', 'Vocal': 'Vocal', 'Adventurous': 'Aventureux', 'Happy': 'Heureux',
    'Noisy': 'Bruyant', 'Companionable': 'Sociable', 'Lively': 'Vivant', 'Clever': 'Malin',
    'Assertive': 'Assuré', 'Feisty': 'Piquant', 'Wild': 'Sauvage', 'Hardy': 'Robuste',
    'Cooperative': 'Coopératif', 'Lovable': 'Adorable', 'Bright': 'Brillant', 'Quick': 'Rapide',
    'Refined': 'Raffiné', 'Willful': 'Volontaire', 'Instinctual': 'Instinctif',
    'Inquisitive': 'Curieux', 'Rational': 'Rationnel', 'Fast': 'Rapide', 'Merry': 'Jovial',
    'Bossy': 'Autoritaire', 'Clownish': 'Bouffon', 'Loving': 'Aimant', 'Familial': 'Familial'
};

// ============================================
// FONCTIONS DE CONTENU (miroir de breed.js)
// ============================================

function generateRichContent(breed, physical, temperament, coat, living, training) {
    const size = sizeLabelsMini[physical.size_category] || 'moyenne';
    const height = formatRange(physical.height_cm?.min, physical.height_cm?.max, 'cm');
    const weight = formatRange(physical.weight_kg?.min, physical.weight_kg?.max, 'kg');
    const lifespan = formatRange(physical.life_span_years?.min, physical.life_span_years?.max, 'ans');

    return {
        intro: `Le ${breed.name} est une race de chien de taille ${size}, originaire ${breed.origin ? `de ${breed.origin}` : "d'Europe"}. ` +
               `Cette race se caractérise par son caractère ${(temperament.traits || []).slice(0, 2).join(' et ').toLowerCase() || 'équilibré et affectueux'}. ` +
               `Avec une taille au garrot ${formatRangePhrase(physical.height_cm?.min, physical.height_cm?.max, 'cm')} pour un poids ${formatRangePhrase(physical.weight_kg?.min, physical.weight_kg?.max, 'kg')}, ` +
               `c'est un compagnon ${physical.size_category === 'toy' || physical.size_category === 'small' ? 'idéal pour la vie en appartement' : 'parfait pour les familles actives'}. ` +
               `Son espérance de vie est ${formatLifePhrase(physical.life_span_years?.min, physical.life_span_years?.max)}.`,

        caractere: `Le tempérament du ${breed.name} est globalement ${(temperament.sociability || 'équilibré').toLowerCase()}. ` +
                   `${temperament.good_with_children ? "C'est un excellent chien de famille qui s'entend parfaitement avec les enfants, offrant patience et affection." : "Cette race demande une socialisation précoce et une supervision lors des interactions avec les jeunes enfants."} ` +
                   `${temperament.energy_level === 'low' ? 'Relativement calme, il se contente de courtes promenades quotidiennes.' : temperament.energy_level === 'high' || temperament.energy_level === 'very_high' ? "Très énergique, il nécessite beaucoup d'exercice quotidien pour son équilibre." : "D'énergie modérée, il a besoin d'activité régulière sans excès."}`,

        entretien: `L'entretien du ${breed.name} est ${(coat.maintenance || 'moyen').toLowerCase()}. ` +
                   `${coat.length === 'Long' ? 'Son pelage long nécessite un brossage quotidien pour éviter les nœuds et maintenir sa beauté.' : coat.length === 'Court' ? 'Son pelage court est facile à entretenir avec un simple brossage hebdomadaire.' : 'Son pelage demande un entretien régulier pour rester en bonne santé.'} ` +
                   `${coat.shedding === 'Minimal' ? "Cette race perd très peu de poils, ce qui la rend adaptée aux personnes souffrant d'allergies légères." : coat.shedding === 'Abondant' ? 'Attention, cette race mue abondamment, particulièrement lors des changements de saison.' : 'La perte de poils est modérée et gérable avec un entretien régulier.'}`,

        activite: `${temperament.energy_level === 'low' ? "Cette race calme se contente de 30 minutes d'exercice quotidien." : temperament.energy_level === 'moderate' ? "Cette race nécessite environ une heure d'activité physique par jour." : "Cette race énergique a besoin d'au moins 90 minutes d'exercice quotidien."} ` +
                  `Des promenades, des jeux et ${temperament.energy_level === 'high' || temperament.energy_level === 'very_high' ? 'des activités sportives' : 'des moments de détente'} contribueront à son bien-être physique et mental.`,

        education: `${training.trainability === 'Facile' || training.trainability === 'Très facile' ? "Cette race intelligente et réceptive s'éduque facilement. Elle répond bien aux méthodes positives et au renforcement." : training.trainability === 'Difficile' ? "L'éducation demande patience et constance. Cette race indépendante nécessite un maître expérimenté." : "L'éducation se fait avec patience et méthodes adaptées. Une socialisation précoce est essentielle."} ` +
                   `${training.experience_required === 'Débutant' ? "C'est une race idéale pour les propriétaires de premier chien." : "Cette race convient mieux à des maîtres ayant déjà une expérience canine."}`,

        sante: `Le ${breed.name} est généralement une race ${(physical.life_span_years?.average || 0) > 12 ? 'robuste et longévive' : 'solide'}. ` +
               `Comme toutes les races, il peut être prédisposé à certaines affections spécifiques. ` +
               `Un suivi vétérinaire régulier, une alimentation équilibrée et un exercice adapté contribueront à maintenir sa santé optimale.`
    };
}

function findSimilarBreeds(currentBreed, allBreeds, limit = 4) {
    return allBreeds
        .filter(b => b.id !== currentBreed.id)
        .map(breed => {
            let score = 0;
            if (breed.physical?.size_category === currentBreed.physical?.size_category) score += 3;
            if (breed.temperament?.energy_level === currentBreed.temperament?.energy_level) score += 2;
            if (breed.breed_group === currentBreed.breed_group) score += 2;
            if (breed.temperament?.good_with_children === currentBreed.temperament?.good_with_children) score += 1;
            if (breed.living?.apartment_friendly === currentBreed.living?.apartment_friendly) score += 1;
            if (breed.coat?.length === currentBreed.coat?.length) score += 1;
            return { breed, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.breed);
}

function translateBredFor(purpose) {
    if (!purpose) return 'Compagnie et famille';
    const translations = {
        'Small rodent hunting, lapdog': 'Chasse aux petits rongeurs, chien de compagnie',
        'Badger, otter hunting': 'Chasse au blaireau et à la loutre',
        'Fox hunting': 'Chasse au renard',
        'Hunting': 'Chasse',
        'Herding': 'Bergage',
        'Guarding': 'Garde et protection',
        'Companion': 'Compagnie',
        'Ratting': 'Chasse aux rats',
    };
    if (translations[purpose]) return translations[purpose];
    return purpose
        .replace(/hunting/gi, 'chasse').replace(/herding/gi, 'bergage')
        .replace(/guarding/gi, 'garde').replace(/companion/gi, 'compagnie')
        .replace(/ratting/gi, 'chasse aux rats').replace(/draft/gi, 'traction');
}

// ============================================
// GÉNÉRATION HTML
// ============================================

function generateBreedPage(breed) {
    const slug = slugify(breed.name_fr || breed.name);
    const physical = breed.physical || {};
    const coat = breed.coat || {};
    const temperament = breed.temperament || {};
    const training = breed.training || {};
    const living = breed.living || {};
    const imageUrl = breed.image?.url ? `/${breed.image.url}` : '';
    const richContent = generateRichContent(breed, physical, temperament, coat, living, training);
    const translatedTraits = (temperament.traits || []).map(t => traitTranslations[t.trim()] || t.trim());
    const translatedPurpose = translateBredFor(breed.bred_for);
    const similarBreeds = findSimilarBreeds(breed, breeds, 4);
    const pageUrl = `${SITE_URL}/races/${slug}.html`;
    
    const metaTitle = `${breed.name} : Caractère, Éducation, Santé | Race de Chien`;
    const metaDescription = `Tout savoir sur le ${breed.name} : caractère ${translatedTraits.slice(0, 3).join(', ').toLowerCase()}, taille ${formatRangeDash(physical.height_cm?.min, physical.height_cm?.max, 'cm')}, poids ${formatRangeDash(physical.weight_kg?.min, physical.weight_kg?.max, 'kg')}. Guide complet.`;

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${breed.name} : Guide Complet de la Race`,
        "description": metaDescription,
        "image": breed.image?.url ? `${SITE_URL}/${breed.image.url}` : undefined,
        "author": { "@type": "Organization", "name": "Race de Chien" },
        "publisher": { "@type": "Organization", "name": "Race de Chien", "url": SITE_URL },
        "mainEntityOfPage": pageUrl,
        "datePublished": "2026-02-28",
        "dateModified": new Date().toISOString().split('T')[0]
    };

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-WFNTS7FRZP"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-WFNTS7FRZP");</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    <title>${escapeHtml(metaTitle)}</title>
    <meta name="description" content="${escapeHtml(metaDescription)}">
    <link rel="canonical" href="${pageUrl}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(metaTitle)}">
    <meta property="og:description" content="${escapeHtml(metaDescription)}">
    <meta property="og:url" content="${pageUrl}">
    ${imageUrl ? `<meta property="og:image" content="${SITE_URL}/${breed.image.url}">` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(metaTitle)}">
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
    ${imageUrl ? `<meta name="twitter:image" content="${SITE_URL}/${breed.image.url}">` : ''}
    
    <!-- Schema.org -->
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
                    colors: {
                        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
                        secondary: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75' },
                        accent: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 font-sans antialiased">
    <div class="site-header"></div>

    <main class="max-w-7xl mx-auto px-6 py-8 pt-24">
        <!-- Retour -->
        <div class="mb-6">
            <a href="/" class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-md transition-all">
                <i class="fas fa-arrow-left"></i>
                <span class="font-medium">Retour</span>
            </a>
        </div>

        <!-- Hero -->
        <article class="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 mb-8">
            <div class="relative h-[500px] lg:h-[600px]">
                ${imageUrl ? 
                    `<img src="${imageUrl}" alt="" class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60" aria-hidden="true">
                     <img src="${imageUrl}" alt="${escapeHtml(breed.name)} - chien de race ${sizeLabels[physical.size_category] || 'moyenne'}" class="relative w-full h-full object-contain drop-shadow-2xl" style="z-index:1">` :
                    `<div class="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center"><span class="text-9xl">🐕</span></div>`
                }
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" style="z-index:2"></div>
                <div class="absolute bottom-0 left-0 right-0 p-8 lg:p-12" style="z-index:3">
                    <nav class="text-white/70 text-sm mb-4">
                        <a href="/" class="hover:text-white transition-colors">Accueil</a>
                        <span class="mx-2">/</span>
                        <span>${groupLabels[breed.breed_group] || 'Races'}</span>
                        <span class="mx-2">/</span>
                        <span class="text-white">${escapeHtml(breed.name)}</span>
                    </nav>
                    <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4">${escapeHtml(breed.name)}</h1>
                    <div class="flex flex-wrap gap-4 text-white/90">
                        ${breed.origin ? `<span class="flex items-center gap-2"><i class="fas fa-map-marker-alt"></i>${escapeHtml(breed.origin)}</span>` : ''}
                        <span class="flex items-center gap-2"><i class="fas fa-ruler-vertical"></i>${formatRangeDash(physical.height_cm?.min, physical.height_cm?.max, 'cm')}</span>
                        <span class="flex items-center gap-2"><i class="fas fa-weight"></i>${formatRangeDash(physical.weight_kg?.min, physical.weight_kg?.max, 'kg')}</span>
                        <span class="flex items-center gap-2"><i class="fas fa-heart"></i>${formatRangeDash(physical.life_span_years?.min, physical.life_span_years?.max, 'ans')}</span>
                    </div>
                </div>
            </div>
        </article>

        <div class="grid lg:grid-cols-3 gap-8">
            <!-- Sidebar -->
            <aside class="space-y-6 order-first">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
                    <h3 class="text-lg font-bold text-slate-900 mb-4">En résumé</h3>
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center"><i class="fas fa-ruler-vertical"></i></div>
                            <div><div class="text-xs text-slate-500">Taille</div><div class="font-semibold text-slate-900">${formatRangeDash(physical.height_cm?.min, physical.height_cm?.max, 'cm')}</div></div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center"><i class="fas fa-weight"></i></div>
                            <div><div class="text-xs text-slate-500">Poids</div><div class="font-semibold text-slate-900">${formatRangeDash(physical.weight_kg?.min, physical.weight_kg?.max, 'kg')}</div></div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center"><i class="fas fa-heart"></i></div>
                            <div><div class="text-xs text-slate-500">Espérance de vie</div><div class="font-semibold text-slate-900">${formatRangeDash(physical.life_span_years?.min, physical.life_span_years?.max, 'ans')}</div></div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center"><i class="fas fa-tag"></i></div>
                            <div><div class="text-xs text-slate-500">Groupe</div><div class="font-semibold text-slate-900">${groupLabels[breed.breed_group] || breed.breed_group || 'Non classé'}</div></div>
                        </div>
                        ${breed.origin ? `
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><i class="fas fa-globe"></i></div>
                            <div><div class="text-xs text-slate-500">Origine</div><div class="font-semibold text-slate-900">${escapeHtml(breed.origin)}</div></div>
                        </div>` : ''}
                    </div>
                    <div class="mt-6 pt-6 border-t border-slate-100">
                        <a href="/" class="block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white text-center font-medium rounded-xl transition-colors">Voir toutes les races</a>
                    </div>
                </div>
            </aside>

            <!-- Contenu principal -->
            <div class="lg:col-span-2 space-y-8">
                
                <!-- Introduction -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center"><i class="fas fa-info-circle"></i></span>
                        Présentation du ${escapeHtml(breed.name)}
                    </h2>
                    <div class="prose prose-slate max-w-none">
                        <p class="text-lg text-slate-600 leading-relaxed mb-4">${richContent.intro}</p>
                        ${breed.description ? `<p class="text-slate-600 leading-relaxed">${escapeHtml(breed.description)}</p>` : ''}
                    </div>
                </section>

                <!-- Caractère -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center"><i class="fas fa-brain"></i></span>
                        Caractère et Tempérament
                    </h2>
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-800 mb-3">Traits de personnalité</h3>
                        <div class="flex flex-wrap gap-2">
                            ${translatedTraits.map(t => `<span class="px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">${escapeHtml(t)}</span>`).join('')}
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="p-4 bg-green-50 rounded-xl border border-green-100">
                            <h4 class="font-semibold text-green-800 mb-2 flex items-center gap-2"><i class="fas fa-thumbs-up"></i>Qualités</h4>
                            <ul class="space-y-2 text-sm text-green-700">
                                ${temperament.good_with_children ? '<li>✓ Excellent avec les enfants</li>' : ''}
                                <li>✓ Niveau d'énergie ${(energyLabels[temperament.energy_level] || 'adaptable').toLowerCase()}</li>
                                ${training.trainability === 'Facile' ? '<li>✓ Facile à éduquer</li>' : ''}
                                ${coat.shedding === 'Minimal' ? '<li>✓ Perd peu de poils</li>' : ''}
                                ${living.apartment_friendly ? '<li>✓ Adapté à la vie en appartement</li>' : ''}
                            </ul>
                        </div>
                        <div class="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <h4 class="font-semibold text-amber-800 mb-2 flex items-center gap-2"><i class="fas fa-exclamation-triangle"></i>Points d'attention</h4>
                            <ul class="space-y-2 text-sm text-amber-700">
                                ${!temperament.good_with_children ? '<li>⚠ À surveiller avec les jeunes enfants</li>' : ''}
                                ${temperament.energy_level === 'high' || temperament.energy_level === 'very_high' ? "<li>⚠ Besoin d'exercice quotidien important</li>" : ''}
                                ${coat.maintenance === 'Élevé' || coat.maintenance === 'Très élevé' ? '<li>⚠ Entretien du pelage régulier nécessaire</li>' : ''}
                                ${!living.apartment_friendly ? '<li>⚠ Espace extérieur recommandé</li>' : ''}
                            </ul>
                        </div>
                    </div>
                    <p class="text-slate-600 leading-relaxed mt-6">${richContent.caractere}</p>
                </section>

                <!-- Entretien -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center"><i class="fas fa-cut"></i></span>
                        Entretien et Soins du Pelage
                    </h2>
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><span class="text-slate-600">Longueur du poil</span><span class="font-semibold text-slate-900">${coat.length || 'Moyen'}</span></div>
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><span class="text-slate-600">Type de poil</span><span class="font-semibold text-slate-900">${coatTypeLabels[coat.type] || coat.type || 'Standard'}</span></div>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><span class="text-slate-600">Perte de poils</span><span class="font-semibold ${coat.shedding === 'Minimal' ? 'text-green-600' : coat.shedding === 'Abondant' ? 'text-red-600' : 'text-slate-900'}">${coat.shedding || 'Modéré'}</span></div>
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><span class="text-slate-600">Entretien nécessaire</span><span class="font-semibold ${coat.maintenance === 'Faible' ? 'text-green-600' : coat.maintenance === 'Élevé' ? 'text-amber-600' : 'text-slate-900'}">${coat.maintenance || 'Moyen'}</span></div>
                        </div>
                    </div>
                    <p class="text-slate-600 leading-relaxed">${richContent.entretien}</p>
                </section>

                <!-- Activité -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center"><i class="fas fa-running"></i></span>
                        Besoins en Activité Physique
                    </h2>
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-2"><span class="text-slate-600">Niveau d'énergie</span><span class="font-semibold text-slate-900">${energyLabels[temperament.energy_level] || 'Modéré'}</span></div>
                        <div class="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full rounded-full ${temperament.energy_level === 'low' ? 'w-1/4 bg-green-500' : temperament.energy_level === 'moderate' ? 'w-2/4 bg-yellow-500' : temperament.energy_level === 'high' ? 'w-3/4 bg-orange-500' : 'w-full bg-red-500'}"></div>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-3 gap-4 mb-6">
                        <div class="text-center p-4 bg-slate-50 rounded-xl"><div class="text-3xl font-bold text-primary-600 mb-1">${living.exercise_needs?.daily_minutes || 60}</div><div class="text-sm text-slate-500">minutes/jour</div></div>
                        <div class="text-center p-4 bg-slate-50 rounded-xl"><div class="text-3xl font-bold text-primary-600 mb-1">${living.exercise_needs?.walks_per_day || 2}</div><div class="text-sm text-slate-500">promenades/jour</div></div>
                        <div class="text-center p-4 bg-slate-50 rounded-xl"><div class="text-3xl font-bold text-primary-600 mb-1">${living.exercise_needs?.mental_stimulation || 'Moyenne'}</div><div class="text-sm text-slate-500">stimulation mentale</div></div>
                    </div>
                    <p class="text-slate-600 leading-relaxed">${richContent.activite}</p>
                </section>

                <!-- Éducation -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><i class="fas fa-graduation-cap"></i></span>
                        Éducation et Dressage
                    </h2>
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div class="p-4 bg-slate-50 rounded-xl"><div class="text-sm text-slate-500 mb-1">Facilité d'éducation</div><div class="text-lg font-semibold text-slate-900">${training.trainability || 'Moyenne'}</div></div>
                        <div class="p-4 bg-slate-50 rounded-xl"><div class="text-sm text-slate-500 mb-1">Expérience requise</div><div class="text-lg font-semibold ${training.experience_required === 'Débutant' ? 'text-green-600' : training.experience_required === 'Expert' ? 'text-red-600' : 'text-slate-900'}">${training.experience_required || 'Intermédiaire'}</div></div>
                    </div>
                    <p class="text-slate-600 leading-relaxed">${richContent.education}</p>
                </section>

                <!-- Compatibilité -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center"><i class="fas fa-home"></i></span>
                        Compatibilité et Mode de Vie
                    </h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="text-center p-4 rounded-xl ${temperament.good_with_children ? 'bg-green-50 border border-green-100' : 'bg-slate-50'}">
                            <div class="text-3xl mb-2">👶</div>
                            <div class="text-sm font-medium ${temperament.good_with_children ? 'text-green-700' : 'text-slate-600'}">${temperament.good_with_children ? 'Excellent' : 'À surveiller'}</div>
                            <div class="text-xs text-slate-500 mt-1">Avec enfants</div>
                        </div>
                        <div class="text-center p-4 rounded-xl ${temperament.good_with_dogs ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}">
                            <div class="text-3xl mb-2">🐕</div>
                            <div class="text-sm font-medium ${temperament.good_with_dogs ? 'text-green-700' : 'text-amber-700'}">${temperament.good_with_dogs ? 'Bonne' : 'Variable'}</div>
                            <div class="text-xs text-slate-500 mt-1">Avec chiens</div>
                        </div>
                        <div class="text-center p-4 rounded-xl ${temperament.good_with_cats ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}">
                            <div class="text-3xl mb-2">🐱</div>
                            <div class="text-sm font-medium ${temperament.good_with_cats ? 'text-green-700' : 'text-amber-700'}">${temperament.good_with_cats ? 'Bonne' : 'Variable'}</div>
                            <div class="text-xs text-slate-500 mt-1">Avec chats</div>
                        </div>
                        <div class="text-center p-4 rounded-xl ${living.apartment_friendly ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}">
                            <div class="text-3xl mb-2">🏢</div>
                            <div class="text-sm font-medium ${living.apartment_friendly ? 'text-green-700' : 'text-red-700'}">${living.apartment_friendly ? 'Adapté' : 'Déconseillé'}</div>
                            <div class="text-xs text-slate-500 mt-1">Appartement</div>
                        </div>
                    </div>
                    <p class="text-slate-600 leading-relaxed">
                        Le ${escapeHtml(breed.name)} est ${living.apartment_friendly ? "un chien adaptable qui peut vivre en appartement si ses besoins en exercice sont satisfaits" : "un chien qui préfère avoir accès à un jardin ou un espace extérieur"}. 
                        ${temperament.good_with_children ? "Il s'intègre parfaitement dans les familles avec enfants, apportant joie et compagnie." : "Il convient mieux aux foyers sans jeunes enfants ou avec des enfants habitués aux chiens."}
                    </p>
                </section>

                <!-- Santé -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center"><i class="fas fa-heartbeat"></i></span>
                        Santé et Longévité
                    </h2>
                    <p class="text-slate-600 leading-relaxed">${richContent.sante}</p>
                </section>

                ${breed.history ? `
                <!-- Histoire -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center"><i class="fas fa-history"></i></span>
                        Histoire et Origines
                    </h2>
                    <p class="text-slate-600 leading-relaxed">${escapeHtml(breed.history)}</p>
                </section>` : ''}

                ${breed.bred_for ? `
                <!-- Utilisation -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><i class="fas fa-bullseye"></i></span>
                        Utilisation Originelle
                    </h2>
                    <p class="text-slate-600 leading-relaxed">
                        Le ${escapeHtml(breed.name)} a été sélectionné et développé initialement pour : <strong>${escapeHtml(translatedPurpose)}</strong>. 
                        Ces aptitudes naturelles influencent encore aujourd'hui son comportement et ses besoins.
                    </p>
                </section>` : ''}

                ${similarBreeds.length > 0 ? `
                <!-- Races similaires -->
                <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center"><i class="fas fa-paw"></i></span>
                        Autres races qui pourraient vous intéresser
                    </h2>
                    <p class="text-slate-600 mb-6">Basé sur la taille, le caractère et les critères de compatibilité similaires :</p>
                    <div class="grid sm:grid-cols-2 gap-4">
                        ${similarBreeds.map(similar => {
                            const similarSlug = slugify(similar.name_fr || similar.name);
                            const similarImg = similar.image?.url ? `/${similar.image.url}` : '';
                            return `
                            <a href="/races/${similarSlug}.html" class="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all group">
                                ${similarImg ? 
                                    `<img src="${similarImg}" alt="${escapeHtml(similar.name)}" class="w-16 h-16 rounded-lg object-cover">` :
                                    `<div class="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">🐕</div>`
                                }
                                <div>
                                    <h4 class="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">${escapeHtml(similar.name)}</h4>
                                    <p class="text-sm text-slate-500">${escapeHtml(similar.origin || 'Origine inconnue')}</p>
                                </div>
                                <i class="fas fa-chevron-right ml-auto text-slate-400 group-hover:text-primary-500"></i>
                            </a>`;
                        }).join('')}
                    </div>
                </section>` : ''}
            </div>
        </div>
    </main>

    <footer class="bg-slate-900 text-slate-400 py-16 mt-16">
        <div class="max-w-5xl mx-auto px-8">
            <div class="text-center mb-12">
                <div class="text-4xl mb-3">🐕</div>
                <h3 class="text-white font-bold text-2xl mb-2">Race de Chien</h3>
                <p class="text-slate-400 text-sm max-w-md mx-auto">L'encyclopédie complète des 169 races canines. Trouvez votre compagnon idéal grâce à nos filtres intelligents.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12 text-center sm:text-left">
                <div>
                    <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="/" class="hover:text-white transition-colors">Accueil</a></li>
                        <li><a href="/compare.html" class="hover:text-white transition-colors">Comparer les races</a></li>
                        <li><a href="/sitemap.xml" class="hover:text-white transition-colors">Plan du site</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">Races populaires</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="/races/berger-allemand.html" class="hover:text-white transition-colors">Berger Allemand</a></li>
                        <li><a href="/races/golden-retriever.html" class="hover:text-white transition-colors">Golden Retriever</a></li>
                        <li><a href="/races/labrador-retriever.html" class="hover:text-white transition-colors">Labrador Retriever</a></li>
                        <li><a href="/races/bouledogue-francais.html" class="hover:text-white transition-colors">Bouledogue Français</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">Autres races</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="/races/cavalier-king-charles.html" class="hover:text-white transition-colors">Cavalier King Charles</a></li>
                        <li><a href="/races/shiba-inu.html" class="hover:text-white transition-colors">Shiba Inu</a></li>
                        <li><a href="/races/border-collie.html" class="hover:text-white transition-colors">Border Collie</a></li>
                        <li><a href="/races/beagle.html" class="hover:text-white transition-colors">Beagle</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-700/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <p>© 2026 <a href="https://race-de-chien.com" class="hover:text-white transition-colors">Race de Chien</a> — Encyclopédie canine complète</p>
                <p>Créé par <a href="https://aurorastudio.fr" target="_blank" rel="noopener" class="text-slate-300 hover:text-white transition-colors font-medium">Aurora Studio</a></p>
            </div>
        </div>
    </footer>

    <script src="/js/header.js"></script>
</body>
</html>`;

    return { slug, html };
}

// ============================================
// SITEMAP & ROBOTS
// ============================================

function generateSitemap(slugs) {
    const today = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/compare.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
`;
    for (const slug of slugs) {
        xml += `    <url>
        <loc>${SITE_URL}/races/${slug}.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`;
    }
    xml += `</urlset>`;
    return xml;
}

function generateRobots() {
    return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ============================================
// MAIN
// ============================================

console.log(`🐕 Génération des pages statiques pour ${breeds.length} races...`);

const slugs = [];
let count = 0;

for (const breed of breeds) {
    const { slug, html } = generateBreedPage(breed);
    const filepath = path.join(OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(filepath, html, 'utf8');
    slugs.push(slug);
    count++;
}

// Sitemap
const sitemapPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(sitemapPath, generateSitemap(slugs), 'utf8');

// Robots.txt
const robotsPath = path.join(__dirname, 'robots.txt');
fs.writeFileSync(robotsPath, generateRobots(), 'utf8');

console.log(`✅ ${count} pages générées dans /races/`);
console.log(`✅ sitemap.xml créé (${slugs.length + 2} URLs)`);
console.log(`✅ robots.txt créé`);
