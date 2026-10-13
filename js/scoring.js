// Moteur de compatibilité partagé : page d'accueil, test, pages thématiques (générées côté Node)
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.RDCScoring = factory();
})(typeof self !== 'undefined' ? self : this, function () {

    // Textes traduits sur les pages d'une autre langue (js/i18n.<langue>.js) ; en Node, le français
    const T = (typeof self !== 'undefined' && self.RDCT) || ((s, ...v) => s.reduce((a, x, i) => a + x + (i < v.length ? v[i] : ''), ''));
    const LOCALE = (typeof document !== 'undefined' && document.documentElement.lang) || 'fr';

    // Note 1 à 5 ramenée entre 0 et 1
    const u = (b, k) => ((b.scores?.[k] ?? 3) - 1) / 4;
    const clamp = x => Math.max(0, Math.min(1, x));

    const SIZES = [
        { id: 1, key: 'toy', label: T`Très petit`, hint: T`moins de 28 cm` },
        { id: 2, key: 'small', label: T`Petit`, hint: T`28 à 40 cm` },
        { id: 3, key: 'medium', label: T`Moyen`, hint: T`40 à 60 cm` },
        { id: 4, key: 'large', label: T`Grand`, hint: T`60 à 70 cm` },
        { id: 5, key: 'giant', label: T`Géant`, hint: T`plus de 70 cm` }
    ];
    const SIZE_ID = { toy: 1, small: 2, medium: 3, large: 4, giant: 5 };

    const FCI_GROUPS = {
        1: T`Bergers et bouviers`,
        2: T`Molosses, pinschers et bouviers suisses`,
        3: T`Terriers`,
        4: T`Teckels`,
        5: T`Spitz et chiens primitifs`,
        6: T`Chiens courants`,
        7: T`Chiens d'arrêt`,
        8: T`Rapporteurs, leveurs et chiens d'eau`,
        9: T`Chiens de compagnie`,
        10: T`Lévriers`
    };

    const RYTHME = [T`Peu importe`, T`Grand pantouflard`, T`Plutôt calme`, T`Équilibré`, T`Actif`, T`Sportif infatigable`];

    // Questions « Ma vie » : chaque réponse donne une fonction d'adéquation 0..1 et deux libellés
    const QUESTIONS = {
        logement: {
            label: T`Logement`,
            options: [
                { id: 'appart', label: T`Appartement`, fit: b => u(b, 'appartement'), yes: T`Appartement`, no: T`Besoin d’espace` },
                { id: 'maison', label: T`Maison sans jardin`, fit: b => clamp((b.scores.appartement) / 4), yes: T`Maison`, no: T`Besoin d’un jardin` },
                { id: 'jardin', label: T`Maison avec jardin`, fit: null },
                { id: 'campagne', label: T`Campagne`, fit: null }
            ]
        },
        enfants: {
            label: T`Enfants`,
            weight: 2,
            options: [
                { id: 'aucun', label: T`Aucun`, fit: null },
                { id: 'grands', label: T`Plus de 8\u00a0ans`, fit: b => clamp(b.scores.enfants / 4), yes: T`Enfants`, no: T`Prudence enfants` },
                { id: 'jeunes', label: T`Jeunes enfants`, fit: b => u(b, 'enfants'), yes: T`Jeunes enfants`, no: T`Prudence enfants` }
            ]
        },
        seul: {
            label: T`Seul dans la journée`,
            options: [
                { id: 'court', label: T`Moins de 2\u00a0h`, fit: null },
                { id: 'moyen', label: T`2 à 4\u00a0h`, fit: b => clamp(b.scores.solitude / 4), yes: T`Supporte la solitude`, no: T`N’aime pas rester seul` },
                { id: 'long', label: T`4\u00a0h et plus`, fit: b => u(b, 'solitude'), yes: T`Supporte la solitude`, no: T`N’aime pas rester seul` }
            ]
        },
        experience: {
            label: T`Expérience`,
            weight: 1.5,
            options: [
                { id: 'premier', label: T`Premier chien`, fit: b => u(b, 'premier_chien'), yes: T`Premier chien`, no: T`Maître expérimenté` },
                { id: 'deja', label: T`J’ai déjà eu des chiens`, fit: b => clamp((b.scores.premier_chien + 1) / 4), yes: T`Facile à vivre`, no: T`Exigeant` },
                { id: 'expert', label: T`Expérimenté`, fit: null }
            ]
        }
    };

    // Préférences « oui/non » notées (n'éliminent pas)
    const SOFT = {
        chat: { label: T`Vit avec un chat`, fit: b => u(b, 'chats'), yes: T`Chat`, no: T`Chasse les chats` },
        chien: { label: T`Vit avec un chien`, fit: b => u(b, 'chiens'), yes: T`Autres chiens`, no: T`Préfère être seul chien` },
        discret: { label: T`Plutôt discret`, fit: b => 1 - u(b, 'aboiements'), yes: T`Discret`, no: T`Aboie souvent` },
        chaleur: { label: T`Supporte la chaleur`, fit: b => u(b, 'chaleur'), yes: T`Chaleur`, no: T`Craint la chaleur` },
        bave: { label: T`Bave peu`, weight: 0.5, fit: b => 1 - u(b, 'bave'), yes: T`Bave peu`, no: T`Bave` }
    };

    // Profils en un clic : raccourcis qui positionnent l'état
    const PROFILES = [
        { id: 'pantouflard', label: T`Pantouflard`, icon: 'couch', set: { rythme: 1 }, is: s => s.rythme === 1 || s.rythme === 2 },
        { id: 'sportif', label: T`Sportif`, icon: 'person-simple-run', set: { rythme: 5 }, is: s => s.rythme >= 4 },
        { id: 'appartement', label: T`Appartement`, icon: 'buildings', set: { logement: 'appart' }, is: s => s.logement === 'appart' },
        { id: 'enfants', label: T`Jeunes enfants`, icon: 'baby', set: { enfants: 'jeunes' }, is: s => s.enfants === 'jeunes' },
        { id: 'premier', label: T`Premier chien`, icon: 'plant', set: { experience: 'premier' }, is: s => s.experience === 'premier' },
        { id: 'allergies', label: T`Allergies`, icon: 'broom', set: { hypo: true }, is: s => s.hypo },
        { id: 'discret', label: T`Discret`, icon: 'speaker-simple-slash', set: { discret: true }, is: s => s.discret },
        { id: 'travail', label: T`Je travaille la journée`, icon: 'clock', set: { seul: 'long' }, is: s => s.seul === 'long' },
        { id: 'chat', label: T`Vit avec un chat`, icon: 'cat', set: { chat: true }, is: s => s.chat },
        { id: 'senior', label: T`Senior, vie calme`, icon: 'armchair', set: { rythme: 2, experience: 'premier', sizes: [1, 2, 3] }, is: s => s.rythme === 2 && s.experience === 'premier' },
        { id: 'chaleur', label: T`Supporte la chaleur`, icon: 'sun', set: { chaleur: true }, is: s => s.chaleur },
        { id: 'francaises', label: T`Races françaises`, icon: 'flag', set: { france: true }, is: s => s.france }
    ];

    function emptyState() {
        return {
            q: '', logement: null, enfants: null, seul: null, experience: null, rythme: 0,
            chat: false, chien: false, discret: false, chaleur: false, bave: false,
            sizes: [], coats: [], hypo: false, entretien: 0, france: false, groups: [],
            nocat: false, sort: 'auto'
        };
    }

    function applyProfile(state, id, on) {
        const p = PROFILES.find(x => x.id === id);
        if (!p) return state;
        const s = { ...state };
        for (const [k, v] of Object.entries(p.set)) {
            if (on) s[k] = Array.isArray(v) ? [...v] : v;
            else s[k] = Array.isArray(v) ? [] : (typeof v === 'boolean' ? false : (typeof v === 'number' ? 0 : null));
        }
        return s;
    }

    // Critères notés actifs pour un état donné
    function activeCriteria(state) {
        const list = [];
        for (const [key, q] of Object.entries(QUESTIONS)) {
            const opt = q.options.find(o => o.id === state[key]);
            if (opt?.fit) list.push({ key, weight: q.weight || 1, fit: opt.fit, yes: opt.yes, no: opt.no });
        }
        if (state.rythme > 0) {
            const r = state.rythme;
            list.push({
                key: 'rythme', weight: 1.5,
                fit: b => 1 - Math.abs(b.scores.energie - r) / 4,
                yes: T`Rythme ${RYTHME[r].toLowerCase()}`,
                noFn: b => (b.scores.energie > r ? T`Plus énergique` : T`Plus calme`)
            });
        }
        for (const [key, c] of Object.entries(SOFT)) {
            if (state[key]) list.push({ key, weight: c.weight || 1, fit: c.fit, yes: c.yes, no: c.no });
        }
        return list;
    }

    function normalize(s) {
        return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    }

    // Critères éliminatoires
    function passesHard(b, state) {
        if (state.q) {
            const q = normalize(state.q);
            const hay = normalize([b.name_fr, b.name, ...(b.name_alt || [])].join(' '));
            if (!hay.includes(q)) return false;
        }
        if (state.sizes.length && !state.sizes.includes(SIZE_ID[b.physical?.size_category])) return false;
        if (state.coats.length && !state.coats.includes(b.coat?.length)) return false;
        if (state.hypo && !b.hypoallergenic) return false;
        if (state.entretien && b.scores.entretien_pelage > state.entretien) return false;
        if (state.france && b.country_code !== 'FR') return false;
        if (state.groups.length && !state.groups.includes(b.fci?.group || 0)) return false;
        if (state.nocat && b.legal_category) return false;
        return true;
    }

    // Score de compatibilité + raisons lisibles
    function score(b, criteria) {
        if (!criteria.length) return { pct: null, reasons: [] };
        let sum = 0, wsum = 0;
        const reasons = [];
        for (const c of criteria) {
            const f = clamp(c.fit(b));
            sum += f * c.weight;
            wsum += c.weight;
            if (f >= 0.75) reasons.push({ ok: true, text: c.yes });
            else if (f <= 0.35) reasons.push({ ok: false, text: c.noFn ? c.noFn(b) : c.no });
        }
        return { pct: Math.round((sum / wsum) * 100), reasons };
    }

    function rank(breeds, state) {
        const criteria = activeCriteria(state);
        const scored = breeds.filter(b => passesHard(b, state)).map(b => ({ breed: b, ...score(b, criteria) }));
        const sort = state.sort === 'auto' ? (criteria.length ? 'compat' : 'popularite') : state.sort;
        const byName = (a, b) => a.breed.name_fr.localeCompare(b.breed.name_fr, LOCALE);
        const sorters = {
            compat: (a, b) => (b.pct ?? 0) - (a.pct ?? 0) || (b.breed.lof?.['2025'] ?? 0) - (a.breed.lof?.['2025'] ?? 0) || byName(a, b),
            popularite: (a, b) => (b.breed.lof?.['2025'] ?? -1) - (a.breed.lof?.['2025'] ?? -1) || byName(a, b),
            nom: byName,
            taille: (a, b) => (a.breed.physical?.height_cm?.average ?? 0) - (b.breed.physical?.height_cm?.average ?? 0) || byName(a, b),
            vie: (a, b) => (b.breed.physical?.life_span_years?.average ?? 0) - (a.breed.physical?.life_span_years?.average ?? 0) || byName(a, b)
        };
        scored.sort(sorters[sort] || sorters.nom);
        return { results: scored, criteria, sort };
    }

    // État <-> paramètres d'adresse (partageable, indexable)
    const LISTS = ['sizes', 'groups'];
    function toQuery(state) {
        const p = new URLSearchParams();
        if (state.q) p.set('q', state.q);
        for (const k of ['logement', 'enfants', 'seul', 'experience']) if (state[k]) p.set(k, state[k]);
        if (state.rythme) p.set('rythme', state.rythme);
        for (const k of ['chat', 'chien', 'discret', 'chaleur', 'bave', 'hypo', 'france', 'nocat']) if (state[k]) p.set(k, '1');
        if (state.entretien) p.set('entretien', state.entretien);
        for (const k of LISTS) if (state[k].length) p.set(k, state[k].join(','));
        if (state.coats.length) p.set('poil', state.coats.join(','));
        if (state.sort !== 'auto') p.set('tri', state.sort);
        return p.toString();
    }
    function fromQuery(search) {
        const p = new URLSearchParams(search);
        const s = emptyState();
        s.q = p.get('q') || '';
        for (const k of ['logement', 'enfants', 'seul', 'experience']) {
            const v = p.get(k);
            if (v && QUESTIONS[k].options.some(o => o.id === v)) s[k] = v;
        }
        s.rythme = Math.max(0, Math.min(5, parseInt(p.get('rythme') || '0', 10) || 0));
        for (const k of ['chat', 'chien', 'discret', 'chaleur', 'bave', 'hypo', 'france', 'nocat']) s[k] = p.get(k) === '1';
        s.entretien = Math.max(0, Math.min(5, parseInt(p.get('entretien') || '0', 10) || 0));
        for (const k of LISTS) s[k] = (p.get(k) || '').split(',').filter(Boolean).map(Number).filter(n => Number.isFinite(n) && n >= 0);
        s.coats = (p.get('poil') || '').split(',').filter(Boolean);
        const tri = p.get('tri');
        if (['compat', 'popularite', 'nom', 'taille', 'vie'].includes(tri)) s.sort = tri;
        // Raccourcis lisibles : /?profil=appartement,enfants
        for (const id of (p.get('profil') || '').split(',').filter(Boolean)) Object.assign(s, applyProfile(s, id, true));
        return s;
    }

    return { SIZES, SIZE_ID, FCI_GROUPS, RYTHME, QUESTIONS, SOFT, PROFILES, emptyState, applyProfile, activeCriteria, passesHard, score, rank, toQuery, fromQuery, normalize };
});
