// Page d'accueil : profils, questions « Ma vie », filtres, classement par compatibilité
(function () {
    const S = window.RDCScoring;
    const PAGE = 24;
    const COMPARE_KEY = 'rdc-compare';
    const COAT_OPTIONS = ['Court', 'Moyen', 'Long', 'Sans poil'];
    const RYTHME_LEVELS = [
        { v: 1, icon: '🛋️', label: 'Canapé', desc: 'Grand pantouflard : de courtes sorties, 30 à 45 minutes par jour.' },
        { v: 2, icon: '🚶', label: 'Calme', desc: 'Plutôt calme : des balades tranquilles, environ 45 minutes par jour.' },
        { v: 3, icon: '🌳', label: 'Modéré', desc: 'Équilibré : une belle promenade et des jeux, environ 1 heure par jour.' },
        { v: 4, icon: '🥾', label: 'Actif', desc: 'Actif : de longues sorties et des randonnées, environ 1 h 30 par jour.' },
        { v: 5, icon: '🏃', label: 'Sportif', desc: 'Sportif : course, canicross, vélo, 2 heures et plus par jour.' }
    ];
    const ENTRETIEN = [{ v: 0, label: 'Peu importe' }, { v: 2, label: 'Faible' }, { v: 3, label: 'Moyen au plus' }];

    let breeds = [];
    let state = S.fromQuery(location.search);
    let shown = PAGE;
    let lastResults = [];
    let compare = readCompare();
    const $ = id => document.getElementById(id);
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function readCompare() {
        try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]').slice(0, 3); } catch (e) { return []; }
    }
    function saveCompare() {
        try { localStorage.setItem(COMPARE_KEY, JSON.stringify(compare)); } catch (e) { /* ignoré */ }
    }

    function toast(msg) {
        const t = $('toast');
        t.textContent = msg;
        t.style.opacity = '1';
        clearTimeout(toast._t);
        toast._t = setTimeout(() => { t.style.opacity = '0'; }, 2600);
    }

    // ---------- Contrôles ----------
    function pressed(on) { return on ? 'true' : 'false'; }

    function renderProfiles() {
        $('profiles').innerHTML = S.PROFILES.map(p =>
            `<button type="button" class="opt" data-profile="${p.id}" aria-pressed="${pressed(p.is(state))}"><span aria-hidden="true">${p.icon}</span>${esc(p.label)}</button>`
        ).join('');
    }

    function renderQuestions() {
        $('questions').innerHTML = Object.entries(S.QUESTIONS).map(([key, q]) => `
            <div>
                <p class="mb-1.5 text-sm font-semibold text-slate-700" id="q-${key}">${esc(q.label)}</p>
                <div class="grid ${q.options.length === 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-labelledby="q-${key}">
                    ${q.options.map(o => `<button type="button" class="seg" data-q="${key}" data-v="${o.id}" aria-pressed="${pressed(state[key] === o.id)}">${esc(o.label)}</button>`).join('')}
                </div>
            </div>`).join('');
        $('rythme').innerHTML = RYTHME_LEVELS.map(l =>
            `<button type="button" class="seg !px-0 flex flex-col items-center gap-0.5" data-rythme="${l.v}" aria-pressed="${pressed(state.rythme === l.v)}" title="${esc(S.RYTHME[l.v])}"><span class="text-lg leading-none" aria-hidden="true">${l.icon}</span><span class="text-[11px]">${l.label}</span></button>`).join('');
        $('rythme-label').textContent = state.rythme ? RYTHME_LEVELS[state.rythme - 1].desc : 'Peu importe. Touchez un niveau pour classer les races selon leur énergie.';
        $('soft').innerHTML = Object.entries(S.SOFT).map(([key, c]) =>
            `<button type="button" class="opt" data-soft="${key}" aria-pressed="${pressed(state[key])}">${esc(c.label)}</button>`).join('');
        $('entretien').innerHTML = ENTRETIEN.map(e =>
            `<button type="button" class="seg" data-entretien="${e.v}" aria-pressed="${pressed(state.entretien === e.v)}">${e.label}</button>`).join('');
    }

    // Compteurs par option : combien de races restent si on ajoute cette option
    // Pour une option d'un groupe (taille, poil, groupe FCI), on remplace la sélection du groupe par cette seule option
    function countWith(patch) {
        const s = { ...state, ...patch };
        let n = 0;
        for (const b of breeds) if (S.passesHard(b, s)) n++;
        return n;
    }

    function renderFacets() {
        $('sizes').innerHTML = S.SIZES.map(z => {
            const on = state.sizes.includes(z.id);
            const n = countWith({ sizes: [z.id] });
            return `<button type="button" class="seg !px-0.5 border border-slate-200 bg-white ${n === 0 && !on ? 'opacity-40' : ''}" data-size="${z.id}" aria-pressed="${pressed(on)}" title="${z.hint}">
                <span class="block">${z.label}</span><span class="block text-[10px] text-slate-400">${n}</span></button>`;
        }).join('');
        $('coats').innerHTML = COAT_OPTIONS.map(c => {
            const on = state.coats.includes(c);
            const n = countWith({ coats: [c] });
            return `<button type="button" class="opt" data-coat="${c}" aria-pressed="${pressed(on)}" ${n === 0 && !on ? 'aria-disabled="true"' : ''}>${c} <span class="count">${n}</span></button>`;
        }).join('');
        const toggles = [
            { key: 'hypo', label: 'Perd très peu de poils', hint: 'utile en cas d’allergie' },
            { key: 'france', label: 'Races françaises' },
            { key: 'nocat', label: 'Exclure les chiens catégorisés' },
            { key: 'nonfci', label: 'Inclure les races non reconnues en France' }
        ];
        $('hard-toggles').innerHTML = toggles.map(t => {
            const n = countWith({ [t.key]: !state[t.key] });
            const label = t.key === 'nonfci' ? t.label : `${t.label} <span class="count">${state[t.key] ? '' : n}</span>`;
            return `<button type="button" class="opt opt-wrap" data-toggle="${t.key}" aria-pressed="${pressed(state[t.key])}" ${t.hint ? `title="${t.hint}"` : ''}>${label}</button>`;
        }).join('');
        const groups = [...Object.entries(S.FCI_GROUPS).map(([g, l]) => [Number(g), l])];
        if (state.nonfci) groups.push([0, 'Races non reconnues']);
        $('groups').innerHTML = groups.map(([g, l]) => {
            const on = state.groups.includes(g);
            const n = countWith({ groups: [g] });
            return `<button type="button" class="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${on ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-primary-50'} border ${on ? 'border-primary-600' : 'border-slate-200'} ${n === 0 && !on ? 'opacity-40' : ''}" data-group="${g}" aria-pressed="${pressed(on)}">
                <span>${g ? `<span class="mr-1.5 font-semibold">${g}</span>` : ''}${esc(l)}</span><span class="text-xs ${on ? 'text-white/80' : 'text-slate-400'}">${n}</span></button>`;
        }).join('');
    }

    function activeChips(criteria) {
        const chips = [];
        if (state.q) chips.push({ label: `« ${state.q} »`, clear: { q: '' } });
        for (const [key, q] of Object.entries(S.QUESTIONS)) {
            const o = q.options.find(x => x.id === state[key]);
            if (o) chips.push({ label: `${q.label} : ${o.label}`, clear: { [key]: null } });
        }
        if (state.rythme) chips.push({ label: `Rythme : ${S.RYTHME[state.rythme]}`, clear: { rythme: 0 } });
        for (const [key, c] of Object.entries(S.SOFT)) if (state[key]) chips.push({ label: c.label, clear: { [key]: false } });
        for (const z of state.sizes) chips.push({ label: `Taille : ${S.SIZES[z - 1].label}`, clear: { sizes: state.sizes.filter(x => x !== z) } });
        for (const c of state.coats) chips.push({ label: `Poil ${c.toLowerCase()}`, clear: { coats: state.coats.filter(x => x !== c) } });
        if (state.entretien) chips.push({ label: `Entretien : ${ENTRETIEN.find(e => e.v === state.entretien)?.label.toLowerCase()}`, clear: { entretien: 0 } });
        if (state.hypo) chips.push({ label: 'Perd très peu de poils', clear: { hypo: false } });
        if (state.france) chips.push({ label: 'Races françaises', clear: { france: false } });
        if (state.nocat) chips.push({ label: 'Sans chiens catégorisés', clear: { nocat: false } });
        if (state.nonfci) chips.push({ label: 'Avec races non reconnues', clear: { nonfci: false } });
        for (const g of state.groups) chips.push({ label: `Groupe ${g || 'non reconnu'}`, clear: { groups: state.groups.filter(x => x !== g) } });
        return chips;
    }

    // ---------- Cartes ----------
    // Versions réduites (480 et 768 px) créées avec chaque photo : une carte charge 9 Ko au lieu de 60
    function srcset(b) {
        const base = '/' + b.image.url.replace(/\.jpg$/, '');
        return `${base}-480.webp 480w, ${base}-768.webp 768w, ${base}.webp ${b.image.width}w`;
    }
    function gauge(v) {
        return `<span class="gauge" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? 'on' : ''}"></i>`).join('')}</span>`;
    }

    function card(r, i) {
        const b = r.breed;
        const img = b.image
            ? `<picture><source srcset="${srcset(b)}" sizes="(min-width: 1024px) 330px, (min-width: 640px) 45vw, 38vw" type="image/webp"><img src="/${b.image.url}" alt="${esc(b.name_fr)}" width="${b.image.width}" height="${b.image.height}" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:static" ${i < 4 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`
            : `<div class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br sm:static sm:h-full from-primary-50 via-white to-secondary-50 text-slate-400"><span class="text-3xl sm:text-5xl" aria-hidden="true">🐾</span><span class="text-[10px] font-semibold uppercase tracking-wider sm:text-xs">Photo à venir</span></div>`;
        const pct = r.pct != null
            ? `<span class="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-xs font-extrabold shadow sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-sm ${r.pct >= 75 ? 'text-emerald-700' : r.pct >= 55 ? 'text-amber-700' : 'text-slate-500'}">${r.pct} %</span>` : '';
        const rank = b.lof?.['2025'] && b.lofRank && b.lofRank <= 30 ? `<span class="text-[11px] font-semibold text-primary-700">${b.lofRank === 1 ? '1re' : b.lofRank + 'e'} race en France</span>` : '';
        const reasons = r.reasons.slice(0, 4).map(x => `<span class="${x.ok ? 'chip-ok' : 'chip-ko'}">${x.ok ? '✓ ' : ''}${esc(x.text)}</span>`).join('');
        const law = b.legal_category ? `<span class="chip-law">Catégorie ${esc(b.legal_category)}</span>` : '';
        const isNew = b.is_new ? '<span class="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-full bg-slate-900/85 px-2 py-0.5 text-[11px] font-semibold text-white">Nouveau</span>' : '';
        const inCmp = compare.includes(b.slug);
        return `<li class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white card-hover">
            <a href="/races/${b.slug}" class="flex sm:block">
                <div class="relative m-2.5 mr-0 aspect-[4/3] w-[40%] shrink-0 self-start overflow-hidden rounded-xl bg-slate-100 sm:m-0 sm:w-auto sm:rounded-none">${img}${pct}${isNew}</div>
                <div class="min-w-0 flex-1 p-3 pb-12 sm:p-4 sm:pb-14">
                    <h3 class="text-[15px] font-bold leading-snug text-slate-900 sm:text-[17px]">${esc(b.name_fr)}</h3>
                    <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">${esc(b.origin || '')}${b.fci?.group ? ` · ${esc(S.FCI_GROUPS[b.fci.group])}` : ''}</p>
                    ${rank ? `<p class="mt-1">${rank}</p>` : ''}
                    <dl class="mt-2.5 grid grid-cols-3 gap-2 text-[10px] text-slate-500 sm:mt-3 sm:gap-3 sm:text-[11px]">
                        <div><dt class="mb-1">Énergie</dt><dd>${gauge(b.scores.energie)}</dd></div>
                        <div><dt class="mb-1">Enfants</dt><dd>${gauge(b.scores.enfants)}</dd></div>
                        <div><dt class="mb-1">Entretien</dt><dd>${gauge(b.scores.entretien_pelage)}</dd></div>
                    </dl>
                    ${reasons || law ? `<div class="mt-3 flex flex-wrap gap-1.5">${law}${reasons}</div>` : ''}
                </div>
            </a>
            <button type="button" class="absolute bottom-3 right-3 flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-bold transition-colors ${inCmp ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-700'}" data-compare="${b.slug}" aria-pressed="${pressed(inCmp)}" aria-label="Comparer ${esc(b.name_fr)}">${inCmp ? '✓ Comparer' : '+ Comparer'}</button>
        </li>`;
    }

    // ---------- Rendu ----------
    // Les contrôles sont redessinés à chaque changement : on garde le focus clavier au même endroit
    function focusKey() {
        const a = document.activeElement;
        if (!a || !a.dataset) return null;
        const k = ['profile', 'q', 'soft', 'rythme', 'entretien', 'size', 'coat', 'toggle', 'group'].find(x => a.dataset[x] !== undefined);
        return k ? `[data-${k}="${a.dataset[k]}"]${a.dataset.v ? `[data-v="${a.dataset.v}"]` : ''}` : null;
    }

    function render(opts = {}) {
        const keep = focusKey();
        const { results, criteria, sort } = S.rank(breeds, state);
        renderProfiles();
        renderQuestions();
        renderFacets();
        if (keep) document.querySelector(keep)?.focus();

        const scored = criteria.length > 0;
        const good = scored ? results.filter(r => r.pct >= 75).length : results.length;
        $('count').textContent = results.length;
        $('apply-count').textContent = results.length;
        const hints = { compat: 'classées par compatibilité avec votre vie', popularite: 'classées par popularité en France (LOF 2025)', nom: 'classées par nom', taille: 'de la plus petite à la plus grande', vie: 'de la plus longue espérance de vie à la plus courte' };
        $('sort-hint').textContent = hints[sort] + (scored ? ` · ${good} à 75 % ou plus` : '');
        $('sort').value = state.sort;

        const chips = activeChips(criteria);
        const active = $('active');
        active.classList.toggle('hidden', chips.length === 0);
        active.classList.toggle('flex', chips.length > 0);
        active.innerHTML = chips.map((c, i) => `<button type="button" class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800 hover:bg-primary-100" data-chip="${i}">${esc(c.label)} <span aria-hidden="true">×</span><span class="sr-only">retirer</span></button>`).join('')
            + (chips.length > 1 ? '<button type="button" id="clear-all" class="text-xs font-semibold text-slate-500 underline hover:text-slate-800">Tout effacer</button>' : '');
        active._chips = chips;
        const ac = $('active-count');
        ac.textContent = chips.length;
        ac.classList.toggle('hidden', chips.length === 0);

        const grid = $('grid');
        const empty = $('empty');
        lastResults = results;
        if (!results.length) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            empty.innerHTML = emptyState();
        } else {
            empty.classList.add('hidden');
            grid.innerHTML = results.slice(0, shown).map(card).join('');
        }
        renderMore();

        renderCompareBar();
        if (!opts.keepUrl) {
            const qs = S.toQuery(state);
            history.replaceState(null, '', qs ? `/?${qs}` : '/');
        }
    }

    // ---------- Chargement automatique au défilement ----------
    function renderMore() {
        const total = lastResults.length;
        const n = Math.min(shown, total);
        const more = $('list-more');
        more.classList.toggle('hidden', total === 0);
        $('more-status').textContent = n < total ? `${n} races affichées sur ${total}` : (total > PAGE ? `Les ${total} races sont affichées` : '');
        $('more-btn').classList.toggle('hidden', n >= total);
        // L'observateur ne se redéclenche que sur un changement : on le relance si le bas est déjà visible
        if (io && n < total) { io.unobserve(more); io.observe(more); }
    }

    function showMore() {
        if (shown >= lastResults.length) return;
        const from = shown;
        shown += PAGE;
        $('grid').insertAdjacentHTML('beforeend', lastResults.slice(from, shown).map(card).join(''));
        renderMore();
    }

    // Zone d'observation prolongée vers le haut : un défilement rapide qui saute par-dessus le bas de liste déclenche quand même
    const io = 'IntersectionObserver' in window
        ? new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) showMore(); }, { rootMargin: '100000px 0px 900px 0px' })
        : null;
    if (io) io.observe($('list-more'));

    // Retour depuis une fiche : on retrouve la même longueur de liste et la même position
    const BACK_KEY = 'rdc-list';
    document.addEventListener('click', e => {
        if (!e.target.closest('#grid a[href^="/races/"]')) return;
        try { sessionStorage.setItem(BACK_KEY, JSON.stringify({ search: location.search, shown, y: scrollY })); } catch (err) { /* ignoré */ }
    });
    function restoreList() {
        let saved = null;
        try { saved = JSON.parse(sessionStorage.getItem(BACK_KEY) || 'null'); sessionStorage.removeItem(BACK_KEY); } catch (err) { /* ignoré */ }
        if (!saved || saved.search !== location.search) return null;
        shown = Math.max(PAGE, Number(saved.shown) || PAGE);
        return Number(saved.y) || 0;
    }

    // Aucun résultat : on propose le critère à retirer qui libère le plus de races
    function emptyState() {
        const tries = [
            ['sizes', { sizes: [] }, 'la taille'], ['coats', { coats: [] }, 'le poil'], ['hypo', { hypo: false }, '« perd très peu de poils »'],
            ['entretien', { entretien: 0 }, 'l’entretien'], ['france', { france: false }, '« races françaises »'],
            ['groups', { groups: [] }, 'le groupe'], ['q', { q: '' }, 'la recherche'], ['nocat', { nocat: false }, 'l’exclusion des catégorisés']
        ].filter(([k]) => Array.isArray(state[k]) ? state[k].length : state[k]);
        const best = tries.map(([k, patch, label]) => ({ k, patch, label, n: countWith(patch) })).sort((a, b) => b.n - a.n)[0];
        return `<p class="text-lg font-bold text-slate-900">Aucune race ne remplit tous ces critères</p>
            <p class="mt-1 text-sm text-slate-600">${best ? `Sans le critère sur ${best.label}, ${best.n} races conviendraient.` : 'Essayez d’assouplir un critère.'}</p>
            ${best ? `<button type="button" class="mt-4 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white" data-relax='${JSON.stringify(best.patch)}'>Retirer ce critère</button>` : ''}`;
    }

    function renderCompareBar() {
        const bar = $('compare-bar');
        bar.style.transform = compare.length ? 'translateY(0)' : '';
        $('compare-n').textContent = compare.length;
        $('compare-go').href = '/compare?races=' + compare.join(',');
        $('compare-thumbs').innerHTML = compare.map(slug => {
            const b = breeds.find(x => x.slug === slug);
            return b?.image ? `<img src="/${b.image.url.replace(/\.jpg$/, '-480.webp')}" alt="" class="h-9 w-9 rounded-full border-2 border-white object-cover">`
                : `<span class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs">🐾</span>`;
        }).join('');
    }

    // ---------- Événements ----------
    function update(patch, opts) {
        state = { ...state, ...patch };
        shown = PAGE;
        render(opts);
    }

    document.addEventListener('click', e => {
        const t = e.target.closest('button, [data-relax]');
        if (!t) return;
        const d = t.dataset;
        if (d.profile) {
            const p = S.PROFILES.find(x => x.id === d.profile);
            state = S.applyProfile(state, d.profile, !p.is(state));
            shown = PAGE;
            render();
        } else if (d.q) update({ [d.q]: state[d.q] === d.v ? null : d.v });
        else if (d.soft) update({ [d.soft]: !state[d.soft] });
        else if (d.rythme) update({ rythme: state.rythme === Number(d.rythme) ? 0 : Number(d.rythme) });
        else if (d.entretien) update({ entretien: Number(d.entretien) });
        else if (d.size) {
            const z = Number(d.size);
            update({ sizes: state.sizes.includes(z) ? state.sizes.filter(x => x !== z) : [...state.sizes, z] });
        } else if (d.coat) {
            if (t.getAttribute('aria-disabled') === 'true') return;
            update({ coats: state.coats.includes(d.coat) ? state.coats.filter(x => x !== d.coat) : [...state.coats, d.coat] });
        } else if (d.toggle) update({ [d.toggle]: !state[d.toggle] });
        else if (d.group) {
            const g = Number(d.group);
            update({ groups: state.groups.includes(g) ? state.groups.filter(x => x !== g) : [...state.groups, g] });
        } else if (d.chip) {
            const chip = $('active')._chips?.[Number(d.chip)];
            if (chip) {
                update(chip.clear);
                if ('q' in chip.clear) $('search').value = '';
            }
        } else if (t.id === 'clear-all' || t.id === 'reset' || t.id === 'reset-mobile') {
            state = { ...S.emptyState(), sort: state.sort };
            $('search').value = '';
            shown = PAGE;
            render();
        } else if (d.relax) update(JSON.parse(d.relax));
        else if (d.compare) {
            e.preventDefault();
            const slug = d.compare;
            if (compare.includes(slug)) compare = compare.filter(x => x !== slug);
            else if (compare.length >= 3) { toast('Trois races au maximum : retirez-en une pour en ajouter une autre.'); return; }
            else compare = [...compare, slug];
            saveCompare();
            render({ keepUrl: true });
        } else if (t.id === 'compare-clear') {
            compare = [];
            saveCompare();
            render({ keepUrl: true });
        } else if (t.id === 'more-btn') showMore();
        else if (t.id === 'filters-open') openSheet(true);
        else if (t.id === 'filters-close' || t.id === 'filters-apply') {
            openSheet(false);
            if (t.id === 'filters-apply') $('results-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    $('sort').addEventListener('change', e => update({ sort: e.target.value }));
    let searchTimer;
    $('search').addEventListener('input', e => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => update({ q: e.target.value.trim() }), 180);
    });
    $('search').addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const { results } = S.rank(breeds, state);
        if (results.length === 1) location.href = '/races/' + results[0].breed.slug;
    });

    function openSheet(open) {
        const f = $('filters');
        f.classList.toggle('hidden', !open);
        f.classList.toggle('flex', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) $('filters-close').focus();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('filters').classList.contains('hidden') && innerWidth < 1024) openSheet(false); });

    // ---------- Données ----------
    async function init() {
        $('search').value = state.q;
        try {
            const url = document.querySelector('meta[name="rdc-data"]')?.content || '/data/breeds-index.json';
            const res = await fetch(url);
            breeds = (await res.json()).breeds;
        } catch (e) {
            $('empty').classList.remove('hidden');
            $('empty').innerHTML = '<p class="font-bold">Impossible de charger les races.</p><p class="text-sm text-slate-600">Vérifiez votre connexion puis rechargez la page.</p>';
            return;
        }
        // Rang de popularité LOF
        [...breeds].filter(b => b.lof?.['2025']).sort((a, b) => b.lof['2025'] - a.lof['2025']).forEach((b, i) => { b.lofRank = i + 1; });
        compare = compare.filter(slug => breeds.some(b => b.slug === slug));
        const y = restoreList();
        render({ keepUrl: !location.search });
        if (y) requestAnimationFrame(() => scrollTo(0, y));
    }
    init();
})();
