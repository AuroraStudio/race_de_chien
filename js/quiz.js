// Test « Quel chien est fait pour moi ? » : mêmes critères et même moteur que la page d'accueil
(function () {
    const S = window.RDCScoring;
    // Textes et adresses dans la langue de la page (français par défaut, voir js/icons.js)
    const T = window.RDCT, P = window.RDCPath;
    const $ = id => document.getElementById(id);
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const STEPS = [
        { key: 'logement', q: T`Où vivra votre chien ?`, answers: [['appart', 'buildings', T`En appartement`], ['maison', 'house', T`En maison, sans jardin`], ['jardin', 'tree', T`En maison avec jardin`], ['campagne', 'farm', T`À la campagne`]] },
        { key: 'enfants', q: T`Y a-t-il des enfants à la maison ?`, help: T`Ou qui viennent souvent.`, answers: [['aucun', 'user', T`Non`], ['grands', 'student', T`Oui, de plus de 8 ans`], ['jeunes', 'baby', T`Oui, de jeunes enfants`]] },
        { key: 'animaux', multi: true, q: T`Partagera-t-il la maison avec d’autres animaux ?`, help: T`Plusieurs réponses possibles.`, answers: [['chat', 'cat', T`Un ou des chats`], ['chien', 'dog', T`Un autre chien`], ['aucun', 'prohibit', T`Aucun animal`]] },
        { key: 'seul', q: T`Combien de temps restera-t-il seul dans la journée ?`, answers: [['court', 'hourglass-simple-low', T`Moins de 2 heures`], ['moyen', 'hourglass-simple-medium', T`De 2 à 4 heures`], ['long', 'hourglass-simple-high', T`4 heures et plus`]] },
        { key: 'experience', q: T`Avez-vous déjà eu un chien ?`, answers: [['premier', 'plant', T`Non, ce sera mon premier`], ['deja', 'thumbs-up', T`Oui, un ou deux`], ['expert', 'graduation-cap', T`Oui, je suis expérimenté`]] },
        { key: 'rythme', q: T`Quel rythme pour vos journées ensemble ?`, answers: [['1', 'couch', T`Canapé et petites balades`], ['2', 'person-simple-walk', T`Balades tranquilles`], ['3', 'tree', T`Une belle promenade par jour`], ['4', 'boot', T`Randonnées, beaucoup de sorties`], ['5', 'person-simple-run', T`Sport tous les jours`]] },
        { key: 'allergie', q: T`Quelqu’un est-il gêné par les poils de chien ?`, answers: [['non', 'smiley', T`Non`], ['oui', 'broom', T`Oui, il faut un chien qui perd très peu de poils`]] },
        { key: 'taille', multi: true, q: T`Quelle taille vous plairait ?`, help: T`Plusieurs réponses possibles.`, answers: [['1-2', 'dog:h-4 w-4', T`Petit (moins de 40 cm)`], ['3', 'dog:h-6 w-6', T`Moyen`], ['4-5', 'dog:h-8 w-8', T`Grand ou géant`], ['all', 'sparkle', T`Peu importe`]] }
    ];
    // Icône d'une réponse : « nom » ou « nom:classes » (le chien grandit avec la taille proposée)
    const answerIcon = spec => { const [n, c] = spec.split(':'); return window.RDCIcon(n, c || 'h-6 w-6'); };

    let breeds = [];
    let ready = null;
    let step = 0;
    let answers = {};

    function toState() {
        const s = S.emptyState();
        if (answers.logement) s.logement = answers.logement;
        if (answers.enfants) s.enfants = answers.enfants;
        const an = answers.animaux || [];
        s.chat = an.includes('chat');
        s.chien = an.includes('chien');
        if (answers.seul) s.seul = answers.seul;
        if (answers.experience) s.experience = answers.experience;
        if (answers.rythme) s.rythme = Number(answers.rythme);
        s.hypo = answers.allergie === 'oui';
        const t = answers.taille || [];
        if (t.length && !t.includes('all')) s.sizes = t.flatMap(x => x.split('-').map(Number));
        return s;
    }

    function renderStep() {
        const st = STEPS[step];
        $('step-label').textContent = T`Question ${step + 1} sur ${STEPS.length}`;
        $('bar').style.width = `${((step + 1) / STEPS.length) * 100}%`;
        $('question').textContent = st.q;
        $('help').textContent = st.help || '';
        $('back').classList.toggle('invisible', step === 0);
        // L'introduction ne sert qu'à la première question : ensuite la question remonte en haut de l'écran
        $('quiz-intro').classList.toggle('hidden', step > 0);
        const cur = answers[st.key];
        $('answers').innerHTML = st.answers.map(([v, icon, label]) => {
            const on = st.multi ? (cur || []).includes(v) : cur === v;
            return `<button type="button" data-v="${v}" aria-pressed="${on}" class="flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left text-[15px] font-semibold transition-colors ${on ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-slate-200 bg-white text-slate-800 hover:border-primary-300'}"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${on ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}">${answerIcon(icon)}</span>${esc(label)}</button>`;
        }).join('');
        $('next-wrap').classList.toggle('hidden', !st.multi);
        $('answers').querySelector('button')?.focus({ preventScroll: true });
    }

    function choose(v) {
        const st = STEPS[step];
        if (st.multi) {
            let cur = answers[st.key] || [];
            const exclusive = v === 'aucun' || v === 'all';
            if (exclusive) cur = cur.includes(v) ? [] : [v];
            else cur = cur.includes(v) ? cur.filter(x => x !== v) : [...cur.filter(x => x !== 'aucun' && x !== 'all'), v];
            answers[st.key] = cur;
            renderStep();
            return;
        }
        answers[st.key] = v;
        next();
    }

    function next() {
        if (step < STEPS.length - 1) { step++; renderStep(); }
        else showResults();
    }

    const scoreBadge = pct => `<span class="score ${pct >= 75 ? 'score-hi' : pct >= 55 ? 'score-mid' : 'score-lo'}">${T`${pct} %`}<span class="sr-only">${T` de compatibilité`}</span></span>`;
    const chip = x => `<span class="${x.ok ? 'chip-ok' : 'chip-ko'}">${window.RDCIcon(x.ok ? 'check' : 'warning-circle')}${esc(x.text)}</span>`;
    // Ce qu'il faut prévoir, tiré des notes de la race (en plus des critères non remplis)
    function watchOuts(b) {
        const s = b.scores, w = [];
        if (s.energie >= 5) w.push(T`Très énergique : beaucoup d’activité chaque jour`);
        if (s.solitude <= 2) w.push(T`Supporte mal la solitude`);
        if (s.perte_poils >= 4) w.push(T`Perd beaucoup de poils`);
        if (s.entretien_pelage >= 4) w.push(T`Entretien du poil important`);
        if (s.aboiements >= 4) w.push(T`Aboie volontiers`);
        if (s.education <= 2) w.push(T`Éducation exigeante`);
        if (s.chaleur <= 2) w.push(T`Craint la chaleur`);
        return w.slice(0, 2);
    }

    // La race n°1 : grande photo, raisons, ce qu'il faut prévoir, lien vers la fiche
    function featured(r) {
        const b = r.breed;
        const src = b.image ? '/' + b.image.url.replace(/\.jpg$/, '') : null;
        const img = src
            ? `<picture><source srcset="${src}-480.webp 480w, ${src}-768.webp 768w" sizes="(min-width: 640px) 400px, calc(100vw - 32px)" type="image/webp"><img src="/${b.image.url}" alt="" width="${b.image.width}" height="${b.image.height}" class="h-full w-full object-cover"></picture>`
            : `<div class="flex h-full items-center justify-center bg-slate-100 text-slate-400">${window.RDCIcon('paw-print', 'h-12 w-12')}</div>`;
        const ok = r.reasons.filter(x => x.ok).slice(0, 4);
        const ko = [...r.reasons.filter(x => !x.ok).map(x => x.text), ...watchOuts(b)].slice(0, 3);
        return `<li class="rise overflow-hidden rounded-3xl border border-slate-200 bg-white sm:grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div class="aspect-[16/10] bg-slate-100 sm:aspect-auto sm:min-h-[340px]">${img}</div>
            <div class="p-5 sm:p-7">
                <div class="flex items-start justify-between gap-3"><h3 class="display">${esc(b.name_fr)}</h3><span class="mt-2 shrink-0">${scoreBadge(r.pct)}</span></div>
                ${ok.length ? `<p class="mt-4 text-sm font-semibold text-slate-900">${T`Pourquoi`}</p><div class="mt-1.5 flex flex-wrap gap-1.5">${ok.map(chip).join('')}</div>` : ''}
                ${ko.length ? `<p class="mt-4 text-sm font-semibold text-slate-900">${T`À prévoir`}</p><div class="mt-1.5 flex flex-wrap gap-1.5">${ko.map(t => chip({ ok: false, text: t })).join('')}</div>` : ''}
                <a href="${P('/races/' + b.slug)}" class="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-700">${T`Voir la fiche`}${window.RDCIcon('arrow-right', 'h-4 w-4')}</a>
            </div>
        </li>`;
    }

    function card(r, i) {
        const b = r.breed;
        const img = b.image
            ? `<img src="/${b.image.url.replace(/\.jpg$/, '-480.webp')}" alt="" width="480" height="${Math.round(480 * b.image.height / b.image.width)}" class="h-full w-full object-cover" loading="lazy">`
            : `<div class="flex h-full items-center justify-center bg-slate-100 text-slate-400">${window.RDCIcon('paw-print', 'h-8 w-8')}</div>`;
        return `<li class="rise overflow-hidden rounded-2xl border border-slate-200 bg-white" style="--i:${i}">
            <a href="${P('/races/' + b.slug)}" class="flex">
                <div class="relative w-32 shrink-0 bg-slate-100 sm:w-36">${img}<span class="absolute left-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-bold tabular-nums text-slate-900">${i + 1}</span></div>
                <div class="min-w-0 flex-1 p-4">
                    <div class="flex items-start justify-between gap-2"><p class="font-bold text-slate-900">${esc(b.name_fr)}</p>${scoreBadge(r.pct)}</div>
                    <div class="mt-2 flex flex-wrap gap-1">${r.reasons.slice(0, 3).map(chip).join('')}</div>
                </div>
            </a>
        </li>`;
    }

    // Classement du test : toutes les races à 60 % ou plus (au moins 24), chargées par paquets au défilement
    const BATCH = 24;
    let list = [], shownN = 0;
    function showMore() {
        if (shownN >= list.length) return;
        const from = shownN;
        shownN = Math.min(list.length, shownN + BATCH);
        $('top').insertAdjacentHTML('beforeend', list.slice(from, shownN).map((r, k) => card(r, from + k + 1)).join(''));
        renderMore();
    }
    function renderMore() {
        const total = list.length + 1;
        $('top-more').textContent = shownN < list.length ? T`${shownN + 1} races affichées sur ${total}` : (total > 1 ? T`Les ${total} races les plus compatibles sont affichées.` : '');
        if (io && shownN < list.length) { io.unobserve($('top-more')); io.observe($('top-more')); }
    }
    const io = 'IntersectionObserver' in window
        ? new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) showMore(); }, { rootMargin: '100000px 0px 800px 0px' })
        : null;

    async function showResults() {
        await ready;
        const state = toState();
        const { results } = S.rank(breeds, state);
        $('quiz').classList.add('hidden');
        $('quiz-intro').classList.add('hidden');
        $('results').classList.remove('hidden');
        const good = results.filter(r => r.pct >= 75).length;
        $('summary').textContent = results.length
            ? T`${good}\u00a0races dépassent 75\u00a0% de compatibilité avec vos réponses. Le classement continue en dessous, jusqu’à 60\u00a0%.`
            : T`Aucune race ne remplit vos critères éliminatoires : élargissez la taille ou le critère des poils.`;
        $('top-first').innerHTML = results.length ? featured(results[0]) : '';
        const rest = results.slice(1);
        const above = rest.filter(r => r.pct >= 60).length;
        list = rest.slice(0, Math.max(above, Math.min(BATCH, rest.length)));
        shownN = 0;
        $('top').innerHTML = '';
        showMore();
        $('full-list').href = P('/?' + S.toQuery(state));
        // Arrivée depuis une fiche : « Est-il fait pour moi ? »
        const race = new URLSearchParams(location.search).get('race');
        const target = race && breeds.find(b => b.slug === race);
        if (target) {
            const all = S.rank(breeds, { ...state, sizes: [], hypo: false }).results;
            const r = all.find(x => x.breed.slug === race);
            const rankPos = results.findIndex(x => x.breed.slug === race);
            const box = $('race-check');
            box.classList.remove('hidden');
            if (r) {
                const where = rankPos >= 0 ? T`, ${window.RDCOrd(rankPos + 1)} sur ${results.length}` : T`, mais il ne passe pas vos critères de taille ou de poils`;
                const ko = r.reasons.filter(x => !x.ok).map(x => esc(x.text.toLowerCase())).join(', ');
                box.innerHTML = T`Et le <strong>${esc(target.name_fr)}</strong> ? ${r.pct} % de compatibilité${where}.` + (ko ? T` Points de vigilance : ${ko}.` : '');
            } else box.innerHTML = '';
        }
        try { if (window.gtag) gtag('event', 'quiz_complete'); } catch (e) { /* ignoré */ }
        $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.addEventListener('click', e => {
        const t = e.target.closest('button');
        if (!t) return;
        if (t.dataset.v && t.closest('#answers')) choose(t.dataset.v);
        else if (t.id === 'next') next();
        else if (t.id === 'back' && step > 0) { step--; renderStep(); }
        else if (t.id === 'restart') {
            answers = {}; step = 0;
            $('results').classList.add('hidden');
            $('quiz').classList.remove('hidden');
            renderStep();
            $('quiz-intro').classList.remove('hidden');
            $('quiz').scrollIntoView({ behavior: 'smooth' });
        }
    });

    renderStep();
    const url = document.querySelector('meta[name="rdc-data"]')?.content || '/data/breeds-index.json';
    ready = fetch(url).then(r => r.json()).then(d => { breeds = d.breeds; });
})();
