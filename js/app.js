// ============================================
// RACE DE CHIEN - APPLICATION PRINCIPALE v2.0
// Framework: Tailwind CSS + Vanilla JS
// ============================================

let allBreeds = [];
let filteredBreeds = [];
let compareList = [];

// Générer un slug URL-friendly à partir du nom français
function breedSlug(name) {
    return name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// URL vers la page statique d'une race
function breedUrl(breed) {
    return `races/${breedSlug(breed.name_fr || breed.name)}.html`;
}

// Traductions complètes
const translations = {
    size: {
        toy: { label: 'Très petite', desc: 'Moins de 28 cm', icon: '🐕' },
        small: { label: 'Petite', desc: '28 - 40 cm', icon: '🐕' },
        medium: { label: 'Moyenne', desc: '40 - 60 cm', icon: '🐕' },
        large: { label: 'Grande', desc: '60 - 70 cm', icon: '🐕' },
        giant: { label: 'Géante', desc: 'Plus de 70 cm', icon: '🐕' }
    },
    energy: {
        low: { label: 'Calme', color: 'green' },
        moderate: { label: 'Modéré', color: 'yellow' },
        high: { label: 'Énergique', color: 'orange' },
        very_high: { label: 'Très énergique', color: 'red' }
    },
    coatLength: {
        'Sans poil': 'Sans poil',
        'Court': 'Court',
        'Moyen': 'Moyen',
        'Long': 'Long'
    },
    shedding: {
        'Minimal': 'Minimal',
        'Léger': 'Léger',
        'Modéré': 'Modéré',
        'Abondant': 'Abondant'
    },
    experience: {
        'Débutant': { label: 'Débutant', color: 'green' },
        'Intermédiaire': { label: 'Intermédiaire', color: 'yellow' },
        'Confirmé': { label: 'Confirmé', color: 'orange' },
        'Expert': { label: 'Expert', color: 'red' }
    }
};

// Dictionnaire complet de traduction des traits
const traitTranslations = {
    'Confident': 'Confiant',
    'Friendly': 'Amical et sociable',
    'Alert': 'Vigilant et attentif',
    'Intelligent': 'Intelligent et vif',
    'Courageous': 'Courageux et brave',
    'Loyal': 'Loyal et fidèle',
    'Brave': 'Intrépide',
    'Playful': 'Joueur et enjoué',
    'Active': 'Actif et dynamique',
    'Gentle': 'Doux et tendre',
    'Affectionate': 'Affectueux et câlin',
    'Protective': 'Protecteur et gardien',
    'Cheerful': 'Joyeux et optimiste',
    'Quiet': 'Calme et posé',
    'Energetic': 'Énergique et sportif',
    'Trainable': 'Facile à éduquer',
    'Independent': 'Indépendant et autonome',
    'Stubborn': 'Têtu et volontaire',
    'Curious': 'Curieux et explorateur',
    'Obedient': 'Obéissant et docile',
    'Fearless': 'Sans peur et audacieux',
    'Devoted': 'Dévoué à sa famille',
    'Responsive': 'Réceptif à l\'éducation',
    'Self-confidence': 'Sûr de lui',
    'Spirited': 'Enjoué et plein de vie',
    'Good-natured': 'De bonne nature',
    'Keen': 'Vif et alerte',
    'Trusting': 'Confiant envers les humains',
    'Kind': 'Gentil et bienveillant',
    'Sweet-Tempered': 'Au tempérament doux',
    'Tenacious': 'Tenace et persévérant',
    'Attentive': 'Attentif et à l\'écoute',
    'Faithful': 'Fidèle en toutes circonstances',
    'Bold': 'Audacieux et déterminé',
    'Proud': 'Fier et digne',
    'Reliable': 'Fiable et stable',
    'Watchful': 'Surveillant et méfiant',
    'Even Tempered': 'D\'humeur égale',
    'Reserved': 'Réservé avec les étrangers',
    'Sensitive': 'Sensible et réactif',
    'Adaptable': 'Adaptable à tous les environnements',
    'Outgoing': 'Extraverti et sociable',
    'Charming': 'Charmant et attachant',
    'Docile': 'Docile et obéissant',
    'Patient': 'Patient avec les enfants',
    'Steady': 'Stable et équilibré',
    'Determined': 'Déterminé et focus',
    'Hardworking': 'Travailleur et assidu',
    'Dignified': 'Digne et majestueux',
    'Composed': 'Posé et calme',
    'Joyful': 'Joyeux et heureux',
    'Agile': 'Agile et rapide',
    'Excitable': 'Excitable et réactif',
    'Dominant': 'Dominant et leader',
    'Strong': 'Fort et puissant',
    'Powerful': 'Puissant et musclé',
    'Suspicious': 'Méfiant avec les inconnus',
    'Vocal': 'Vocal et expressif',
    'Adventurous': 'Aventureux et explorateur',
    'Happy': 'Heureux et satisfait',
    'Noisy': 'Bruyant et aboyeur',
    'Companionable': 'Excellent compagnon',
    'Lively': 'Vivant et plein d\'entrain',
    'Clever': 'Malin et rusé',
    'Assertive': 'Assuré et confiant',
    'Feisty': 'Piquant et combatif',
    'Wild': 'Sauvage et primitif',
    'Hardy': 'Robuste et résistant',
    'Cooperative': 'Coopératif et collaboratif',
    'Lovable': 'Adorable et attachant',
    'Bright': 'Brillant et intelligent',
    'Quick': 'Rapide et vif',
    'Refined': 'Raffiné et élégant',
    'Willful': 'Volontaire et déterminé',
    'Instinctual': 'Guidé par l\'instinct',
    'Inquisitive': 'Curieux et investigateur',
    'Rational': 'Rationnel et logique',
    'Fast': 'Rapide et véloce',
    'Merry': 'Jovial et enjoué',
    'Bossy': 'Autoritaire et dirigeant',
    'Clownish': 'Bouffon et comique',
    'Loving': 'Aimant et démonstratif',
    'Familial': 'Attaché à la famille',
    'Great-hearted': 'Au grand cœur',
    'Opinionated': 'Opiniâtre et affirmé',
    'Unflappable': 'Imperturbable',
    'People-Oriented': "Centré sur l'humain",
    'Athletic': 'Athlétique et sportif',
    'Boisterous': 'Tapageur et turbulent',
    'Generous': 'Généreux et donnant'
};

// Chargement initial
document.addEventListener('DOMContentLoaded', async () => {
    await loadBreeds();
    setupFilters();
    setupSliders();
    setupAutocomplete();
    setupComparison();
    displayBreeds(allBreeds);
});

async function loadBreeds() {
    try {
        const response = await fetch('data/breeds.json');
        const data = await response.json();
        allBreeds = data.breeds;
        filteredBreeds = [...allBreeds];
        updateCount(allBreeds.length);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('breeds-container').innerHTML = `
            <div class="col-span-full text-center py-20">
                <div class="text-6xl mb-4">😕</div>
                <h3 class="text-xl font-bold text-slate-700 mb-2">Erreur de chargement</h3>
                <p class="text-slate-500">Impossible de charger les données des races</p>
            </div>
        `;
    }
}

function setupFilters() {
    // Checkboxes
    document.querySelectorAll('input[data-filter]').forEach(cb => {
        cb.addEventListener('change', () => {
            applyFilters();
            updateActiveFilters();
        });
    });
    
    // Toggles
    ['filter-children', 'filter-apartment', 'filter-dogs', 'filter-cats', 'filter-protective'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            applyFilters();
            updateActiveFilters();
        });
    });
    
    // Trait checkboxes
    document.querySelectorAll('input[data-filter="trait"]').forEach(cb => {
        cb.addEventListener('change', () => {
            applyFilters();
            updateActiveFilters();
        });
    });
    
    // Search
    document.getElementById('filter-search')?.addEventListener('input', debounce((e) => {
        applyFilters();
        updateAutocomplete(e.target.value);
    }, 300));
    
    // Sort
    document.getElementById('sort-by')?.addEventListener('change', () => {
        sortBreeds();
        displayBreeds(filteredBreeds);
    });
    
    // Reset
    document.getElementById('reset-filters')?.addEventListener('click', resetFilters);
}

function setupSliders() {
    // Weight sliders
    const weightMin = document.getElementById('weight-min');
    const weightMax = document.getElementById('weight-max');
    
    if (weightMin && weightMax) {
        weightMin.addEventListener('input', (e) => {
            const min = parseInt(e.target.value);
            const max = parseInt(weightMax.value);
            if (min > max) {
                weightMax.value = min;
                document.getElementById('weight-max-display').textContent = min + ' kg';
            }
            document.getElementById('weight-min-display').textContent = min + ' kg';
            applyFilters();
            updateActiveFilters();
        });
        
        weightMax.addEventListener('input', (e) => {
            const max = parseInt(e.target.value);
            const min = parseInt(weightMin.value);
            if (max < min) {
                weightMin.value = max;
                document.getElementById('weight-min-display').textContent = max + ' kg';
            }
            document.getElementById('weight-max-display').textContent = max + ' kg';
            applyFilters();
            updateActiveFilters();
        });
    }
    
    // Life expectancy sliders
    const lifeMin = document.getElementById('life-min');
    const lifeMax = document.getElementById('life-max');
    
    if (lifeMin && lifeMax) {
        lifeMin.addEventListener('input', (e) => {
            const min = parseInt(e.target.value);
            const max = parseInt(lifeMax.value);
            if (min > max) {
                lifeMax.value = min;
                document.getElementById('life-max-display').textContent = min + ' ans';
            }
            document.getElementById('life-min-display').textContent = min + ' ans';
            applyFilters();
            updateActiveFilters();
        });
        
        lifeMax.addEventListener('input', (e) => {
            const max = parseInt(e.target.value);
            const min = parseInt(lifeMin.value);
            if (max < min) {
                lifeMin.value = max;
                document.getElementById('life-min-display').textContent = max + ' ans';
            }
            document.getElementById('life-max-display').textContent = max + ' ans';
            applyFilters();
            updateActiveFilters();
        });
    }
    
    // Exercise sliders
    const exerciseMin = document.getElementById('exercise-min');
    const exerciseMax = document.getElementById('exercise-max');
    
    if (exerciseMin && exerciseMax) {
        exerciseMin.addEventListener('input', (e) => {
            const min = parseInt(e.target.value);
            const max = parseInt(exerciseMax.value);
            if (min > max) {
                exerciseMax.value = min;
                document.getElementById('exercise-max-display').textContent = min + ' min';
            }
            document.getElementById('exercise-min-display').textContent = min + ' min';
            applyFilters();
            updateActiveFilters();
        });
        
        exerciseMax.addEventListener('input', (e) => {
            const max = parseInt(e.target.value);
            const min = parseInt(exerciseMin.value);
            if (max < min) {
                exerciseMin.value = max;
                document.getElementById('exercise-min-display').textContent = max + ' min';
            }
            document.getElementById('exercise-max-display').textContent = max + ' min';
            applyFilters();
            updateActiveFilters();
        });
    }
}

function setupAutocomplete() {
    const searchInput = document.getElementById('filter-search');
    const dropdown = document.getElementById('search-autocomplete');
    
    if (!searchInput || !dropdown) return;
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function updateAutocomplete(query) {
    const dropdown = document.getElementById('search-autocomplete');
    if (!dropdown) return;
    
    if (!query || query.length < 2) {
        dropdown.classList.add('hidden');
        return;
    }
    
    const matches = allBreeds
        .filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
    
    if (matches.length === 0) {
        dropdown.classList.add('hidden');
        return;
    }
    
    dropdown.innerHTML = matches.map(breed => `
        <div class="autocomplete-item px-4 py-3 cursor-pointer flex items-center gap-3 border-b border-slate-100 last:border-0"
             onclick="selectBreed('${breed.id}')">
            <img src="${breed.image?.url || ''}" alt="" class="w-10 h-10 rounded-lg object-cover bg-slate-200">
            <div>
                <div class="font-medium text-slate-900">${breed.name}</div>
                <div class="text-xs text-slate-500">${breed.origin || 'Origine inconnue'}</div>
            </div>
        </div>
    `).join('');
    
    dropdown.classList.remove('hidden');
}

function selectBreed(breedId) {
    window.location.href = breedUrl(allBreeds.find(b => b.id === breedId) || { name: breedId });
}

function applyFilters() {
    const sizeFilters = Array.from(document.querySelectorAll('input[data-filter="size"]:checked')).map(cb => cb.value);
    const energyFilters = Array.from(document.querySelectorAll('input[data-filter="energy"]:checked')).map(cb => cb.value);
    const coatFilters = Array.from(document.querySelectorAll('input[data-filter="coat"]:checked')).map(cb => cb.value);
    const sheddingFilters = Array.from(document.querySelectorAll('input[data-filter="shedding"]:checked')).map(cb => cb.value);
    const experienceFilters = Array.from(document.querySelectorAll('input[data-filter="experience"]:checked')).map(cb => cb.value);
    const traitFilters = Array.from(document.querySelectorAll('input[data-filter="trait"]:checked')).map(cb => cb.value);
    
    const childrenFilter = document.getElementById('filter-children')?.checked || false;
    const apartmentFilter = document.getElementById('filter-apartment')?.checked || false;
    const dogsFilter = document.getElementById('filter-dogs')?.checked || false;
    const catsFilter = document.getElementById('filter-cats')?.checked || false;
    const protectiveFilter = document.getElementById('filter-protective')?.checked || false;
    
    const searchQuery = document.getElementById('filter-search')?.value.toLowerCase().trim() || '';
    
    // Slider values
    const weightMin = parseInt(document.getElementById('weight-min')?.value || 1);
    const weightMax = parseInt(document.getElementById('weight-max')?.value || 100);
    const lifeMin = parseInt(document.getElementById('life-min')?.value || 6);
    const lifeMax = parseInt(document.getElementById('life-max')?.value || 20);
    const exerciseMin = parseInt(document.getElementById('exercise-min')?.value || 0);
    const exerciseMax = parseInt(document.getElementById('exercise-max')?.value || 180);
    
    filteredBreeds = allBreeds.filter(breed => {
        if (sizeFilters.length > 0 && !sizeFilters.includes(breed.physical?.size_category)) return false;
        if (energyFilters.length > 0 && !energyFilters.includes(breed.temperament?.energy_level)) return false;
        if (coatFilters.length > 0 && !coatFilters.includes(breed.coat?.length)) return false;
        if (sheddingFilters.length > 0 && !sheddingFilters.includes(breed.coat?.shedding)) return false;
        if (experienceFilters.length > 0 && !experienceFilters.includes(breed.training?.experience_required)) return false;
        if (childrenFilter && breed.temperament?.good_with_children !== true) return false;
        if (apartmentFilter && breed.living?.apartment_friendly !== true) return false;
        if (dogsFilter && breed.temperament?.good_with_dogs !== true) return false;
        if (catsFilter && breed.temperament?.good_with_cats !== true) return false;
        if (protectiveFilter && breed.temperament?.protective !== true) return false;
        if (searchQuery && !breed.name.toLowerCase().includes(searchQuery)) return false;
        
        // Trait filter - must have ALL selected traits
        if (traitFilters.length > 0) {
            const breedTraits = breed.temperament?.traits || [];
            const hasAllTraits = traitFilters.every(trait => breedTraits.includes(trait));
            if (!hasAllTraits) return false;
        }
        
        // Weight filter
        const weight = breed.physical?.weight_kg?.average || breed.physical?.weight_kg?.max || 20;
        if (weight < weightMin || weight > weightMax) return false;
        
        // Life expectancy filter
        const lifeSpan = breed.physical?.life_span_years?.average || breed.physical?.life_span_years?.max || 12;
        if (lifeSpan < lifeMin || lifeSpan > lifeMax) return false;
        
        // Exercise filter
        const exercise = breed.living?.exercise_needs?.daily_minutes || 60;
        if (exercise < exerciseMin || exercise > exerciseMax) return false;
        
        return true;
    });
    
    sortBreeds();
    displayBreeds(filteredBreeds);
    updateCount(filteredBreeds.length);
}

function updateActiveFilters() {
    const container = document.getElementById('active-filters');
    if (!container) return;
    
    const chips = [];
    
    // Size filters
    document.querySelectorAll('input[data-filter="size"]:checked').forEach(cb => {
        const sizeInfo = translations.size[cb.value];
        chips.push({ type: 'size', value: cb.value, label: sizeInfo?.label || cb.value });
    });
    
    // Energy filters
    document.querySelectorAll('input[data-filter="energy"]:checked').forEach(cb => {
        const energyInfo = translations.energy[cb.value];
        chips.push({ type: 'energy', value: cb.value, label: energyInfo?.label || cb.value });
    });
    
    // Coat filters
    document.querySelectorAll('input[data-filter="coat"]:checked').forEach(cb => {
        chips.push({ type: 'coat', value: cb.value, label: cb.value });
    });
    
    // Shedding filters
    document.querySelectorAll('input[data-filter="shedding"]:checked').forEach(cb => {
        chips.push({ type: 'shedding', value: cb.value, label: cb.value });
    });
    
    // Experience filters
    document.querySelectorAll('input[data-filter="experience"]:checked').forEach(cb => {
        const expInfo = translations.experience[cb.value];
        chips.push({ type: 'experience', value: cb.value, label: expInfo?.label || cb.value });
    });
    
    // Trait filters
    document.querySelectorAll('input[data-filter="trait"]:checked').forEach(cb => {
        chips.push({ type: 'trait', value: cb.value, label: cb.value });
    });
    
    // Toggles
    if (document.getElementById('filter-children')?.checked) {
        chips.push({ type: 'toggle', id: 'filter-children', label: 'Compatible enfants' });
    }
    if (document.getElementById('filter-apartment')?.checked) {
        chips.push({ type: 'toggle', id: 'filter-apartment', label: 'Adapté appartement' });
    }
    if (document.getElementById('filter-dogs')?.checked) {
        chips.push({ type: 'toggle', id: 'filter-dogs', label: 'Compatible chiens' });
    }
    if (document.getElementById('filter-cats')?.checked) {
        chips.push({ type: 'toggle', id: 'filter-cats', label: 'Compatible chats' });
    }
    if (document.getElementById('filter-protective')?.checked) {
        chips.push({ type: 'toggle', id: 'filter-protective', label: 'Chien de garde' });
    }
    
    // Sliders
    const weightMin = document.getElementById('weight-min')?.value;
    const weightMax = document.getElementById('weight-max')?.value;
    if (weightMin > 1 || weightMax < 100) {
        chips.push({ type: 'slider', label: `Poids: ${weightMin}-${weightMax} kg` });
    }
    
    const lifeMin = document.getElementById('life-min')?.value;
    const lifeMax = document.getElementById('life-max')?.value;
    if (lifeMin > 6 || lifeMax < 20) {
        chips.push({ type: 'slider', label: `Durée de vie: ${lifeMin}-${lifeMax} ans` });
    }
    
    const exerciseMin = document.getElementById('exercise-min')?.value;
    const exerciseMax = document.getElementById('exercise-max')?.value;
    if (exerciseMin > 0 || exerciseMax < 180) {
        chips.push({ type: 'slider', label: `Exercice: ${exerciseMin}-${exerciseMax} min/j` });
    }
    
    if (chips.length === 0) {
        container.classList.add('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    container.innerHTML = chips.map(chip => `
        <span class="filter-chip inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
            ${chip.label}
            <button onclick="removeFilter('${chip.type}', '${chip.value || chip.id || ''}')" 
                    class="hover:bg-primary-200 rounded-full p-0.5 transition-colors">
                <i class="fas fa-times text-xs"></i>
            </button>
        </span>
    `).join('');
}

function removeFilter(type, value) {
    if (type === 'size' || type === 'energy' || type === 'coat' || type === 'shedding' || type === 'experience' || type === 'trait') {
        const checkbox = document.querySelector(`input[data-filter="${type}"][value="${value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (type === 'toggle') {
        const toggle = document.getElementById(value);
        if (toggle) toggle.checked = false;
    }
    applyFilters();
    updateActiveFilters();
}

function sortBreeds() {
    const sortBy = document.getElementById('sort-by')?.value || 'name';
    
    filteredBreeds.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'size':
                const sizeOrder = { toy: 1, small: 2, medium: 3, large: 4, giant: 5 };
                return (sizeOrder[a.physical?.size_category] || 3) - (sizeOrder[b.physical?.size_category] || 3);
            case 'weight':
                const weightA = a.physical?.weight_kg?.average || a.physical?.weight_kg?.max || 20;
                const weightB = b.physical?.weight_kg?.average || b.physical?.weight_kg?.max || 20;
                return weightA - weightB;
            case 'life':
                const lifeA = a.physical?.life_span_years?.average || a.physical?.life_span_years?.max || 12;
                const lifeB = b.physical?.life_span_years?.average || b.physical?.life_span_years?.max || 12;
                return lifeB - lifeA;
            case 'energy':
                const energyOrder = { low: 1, moderate: 2, high: 3, very_high: 4 };
                return (energyOrder[a.temperament?.energy_level] || 2) - (energyOrder[b.temperament?.energy_level] || 2);
            default:
                return 0;
        }
    });
}

function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Reset sliders
    const weightMin = document.getElementById('weight-min');
    const weightMax = document.getElementById('weight-max');
    if (weightMin) { weightMin.value = 1; document.getElementById('weight-min-display').textContent = '1 kg'; }
    if (weightMax) { weightMax.value = 100; document.getElementById('weight-max-display').textContent = '100 kg'; }
    
    const lifeMin = document.getElementById('life-min');
    const lifeMax = document.getElementById('life-max');
    if (lifeMin) { lifeMin.value = 6; document.getElementById('life-min-display').textContent = '6 ans'; }
    if (lifeMax) { lifeMax.value = 20; document.getElementById('life-max-display').textContent = '20 ans'; }
    
    const exerciseMin = document.getElementById('exercise-min');
    const exerciseMax = document.getElementById('exercise-max');
    if (exerciseMin) { exerciseMin.value = 0; document.getElementById('exercise-min-display').textContent = '0 min'; }
    if (exerciseMax) { exerciseMax.value = 180; document.getElementById('exercise-max-display').textContent = '180 min'; }
    
    const searchInput = document.getElementById('filter-search');
    if (searchInput) searchInput.value = '';
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) sortSelect.value = 'name';
    
    filteredBreeds = [...allBreeds];
    sortBreeds();
    displayBreeds(filteredBreeds);
    updateCount(filteredBreeds.length);
    updateActiveFilters();
}

function displayBreeds(breeds) {
    const container = document.getElementById('breeds-container');
    if (!container) return;
    
    if (breeds.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-bold text-slate-700 mb-2">Aucune race trouvée</h3>
                <p class="text-slate-500">Essayez d'ajuster vos critères de recherche</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = breeds.map((breed, index) => createBreedCard(breed, index)).join('');
}

function createBreedCard(breed, index) {
    const imageUrl = breed.image?.url || '';
    const sizeKey = breed.physical?.size_category || 'medium';
    const energyKey = breed.temperament?.energy_level || 'moderate';
    
    const sizeInfo = translations.size[sizeKey] || { label: 'Moyenne', desc: '' };
    const energyInfo = translations.energy[energyKey] || { label: 'Modéré', color: 'yellow' };
    
    const energyColors = {
        green: 'bg-green-100 text-green-700 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        orange: 'bg-orange-100 text-orange-700 border-orange-200',
        red: 'bg-red-100 text-red-700 border-red-200'
    };
    
    const traits = (breed.temperament?.traits || [])
        .slice(0, 3)
        .map(t => traitTranslations[t.trim()] || t.trim());
    
    const delay = index * 50;
    
    // Experience badge
    const experience = breed.training?.experience_required;
    const expInfo = experience ? translations.experience[experience] : null;
    
    const isSelected = compareList.includes(breed.id);
    
    return `
        <div class="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 block animate-fade-in relative group"
             style="animation-delay: ${delay}ms">
            <!-- Compare Checkbox -->
            <label class="absolute top-3 left-3 z-10 cursor-pointer">
                <input type="checkbox" class="compare-checkbox hidden" 
                       ${isSelected ? 'checked' : ''} 
                       onchange="toggleCompare('${breed.id}', this)">
                <div class="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary-400 transition-all">
                    <i class="fas fa-check text-xs"></i>
                </div>
            </label>
            
            <a href="${breedUrl(breed)}" class="block">
                <div class="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    ${imageUrl ? 
                        `<img src="${imageUrl}" alt="${breed.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">` :
                        `<div class="w-full h-full flex items-center justify-center text-6xl">🐕</div>`
                    }
                    <div class="absolute top-3 right-3 flex flex-col gap-2">
                        ${expInfo ? `
                            <span class="px-2 py-0.5 bg-${expInfo.color}-100 text-${expInfo.color}-700 rounded-full text-[10px] font-medium">
                                ${expInfo.label}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="text-lg font-bold text-slate-900 mb-1">${breed.name}</h3>
                    <p class="text-sm text-slate-500 mb-3 flex items-center gap-1">
                        <i class="fas fa-map-marker-alt text-primary-400"></i>
                        ${breed.origin || 'Origine inconnue'}
                    </p>
                    
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-medium border ${energyColors[energyInfo.color]}">
                            ${energyInfo.label}
                        </span>
                        ${breed.temperament?.good_with_children ? 
                            `<span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                                <i class="fas fa-child mr-1"></i>Enfants OK
                            </span>` : ''}
                        ${breed.living?.apartment_friendly ? 
                            `<span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                                <i class="fas fa-building mr-1"></i>Appartement
                            </span>` : ''}
                        ${breed.temperament?.good_with_dogs ? 
                            `<span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
                                <i class="fas fa-dog mr-1"></i>Chiens OK
                            </span>` : ''}
                        ${breed.temperament?.good_with_cats ? 
                            `<span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                                <i class="fas fa-cat mr-1"></i>Chats OK
                            </span>` : ''}
                        ${breed.temperament?.protective ? 
                            `<span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                                <i class="fas fa-shield-alt mr-1"></i>Gardien
                            </span>` : ''}
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        ${traits.map(trait => `<span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">${trait}</span>`).join('')}
                    </div>
                </div>
            </a>
        </div>
    `;
}

function setupComparison() {
    const viewBtn = document.getElementById('view-comparison');
    const clearBtn = document.getElementById('clear-comparison');
    
    viewBtn?.addEventListener('click', () => {
        if (compareList.length < 2) {
            alert('Sélectionnez au moins 2 races à comparer');
            return;
        }
        window.location.href = `compare.html?ids=${compareList.join(',')}`;
    });
    
    clearBtn?.addEventListener('click', () => {
        compareList = [];
        updateComparisonBar();
        displayBreeds(filteredBreeds);
    });
}

function toggleCompare(breedId, checkbox) {
    if (checkbox.checked) {
        if (compareList.length >= 3) {
            alert('Vous pouvez comparer maximum 3 races');
            checkbox.checked = false;
            return;
        }
        compareList.push(breedId);
    } else {
        compareList = compareList.filter(id => id !== breedId);
    }
    updateComparisonBar();
}

function updateComparisonBar() {
    const bar = document.getElementById('comparison-bar');
    const countEl = document.getElementById('compare-count');
    const thumbnailsEl = document.getElementById('compare-thumbnails');
    
    if (!bar || !countEl) return;
    
    countEl.textContent = compareList.length;
    
    if (compareList.length === 0) {
        bar.classList.add('translate-y-full');
        return;
    }
    
    bar.classList.remove('translate-y-full');
    
    if (thumbnailsEl) {
        thumbnailsEl.innerHTML = compareList.map(id => {
            const breed = allBreeds.find(b => b.id === id);
            return breed ? `
                <img src="${breed.image?.url || ''}" alt="${breed.name}" 
                     class="w-8 h-8 rounded-full border-2 border-white object-cover bg-slate-200"
                     title="${breed.name}">
            ` : '';
        }).join('');
    }
}

function updateCount(count) {
    const counter = document.getElementById('breed-count');
    if (counter) counter.textContent = count;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
