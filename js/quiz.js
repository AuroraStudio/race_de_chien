// Test « Quel chien est fait pour moi ? » : mêmes critères et même moteur que la page d'accueil
(function () {
    const S = window.RDCScoring;
    const $ = id => document.getElementById(id);
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const STEPS = [
        { key: 'logement', q: 'Où vivra votre chien ?', answers: [['appart', '🏢', 'En appartement'], ['maison', '🏠', 'En maison, sans jardin'], ['jardin', '🌳', 'En maison avec jardin'], ['campagne', '🌾', 'À la campagne']] },
        { key: 'enfants', q: 'Y a-t-il des enfants à la maison ?', help: 'Ou qui viennent souvent.', answers: [['aucun', '🙂', 'Non'], ['grands', '🧒', 'Oui, de plus de 8 ans'], ['jeunes', '👶', 'Oui, de jeunes enfants']] },
        { key: 'animaux', multi: true, q: 'Partagera-t-il la maison avec d’autres animaux ?', help: 'Plusieurs réponses possibles.', answers: [['chat', '🐱', 'Un ou des chats'], ['chien', '🐕', 'Un autre chien'], ['aucun', '—', 'Aucun animal']] },
        { key: 'seul', q: 'Combien de temps restera-t-il seul dans la journée ?', answers: [['court', '⏱️', 'Moins de 2 heures'], ['moyen', '🕑', 'De 2 à 4 heures'], ['long', '⏰', '4 heures et plus']] },
        { key: 'experience', q: 'Avez-vous déjà eu un chien ?', answers: [['premier', '🐣', 'Non, ce sera mon premier'], ['deja', '👍', 'Oui, un ou deux'], ['expert', '🎓', 'Oui, je suis expérimenté']] },
        { key: 'rythme', q: 'Quel rythme pour vos journées ensemble ?', answers: [['1', '🛋️', 'Canapé et petites balades'], ['2', '🚶', 'Balades tranquilles'], ['3', '🌲', 'Une belle promenade par jour'], ['4', '🥾', 'Randonnées, beaucoup de sorties'], ['5', '🏃', 'Sport tous les jours']] },
        { key: 'allergie', q: 'Quelqu’un est-il gêné par les poils de chien ?', answers: [['non', '🙂', 'Non'], ['oui', '🤧', 'Oui, il faut un chien qui perd très peu de poils']] },
        { key: 'taille', multi: true, q: 'Quelle taille vous plairait ?', help: 'Plusieurs réponses possibles.', answers: [['1-2', '🐕', 'Petit (moins de 40 cm)'], ['3', '🐕‍🦺', 'Moyen'], ['4-5', '🐺', 'Grand ou géant'], ['all', '✨', 'Peu importe']] }
    ];

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
        $('step-label').textContent = `Question ${step + 1} sur ${STEPS.length}`;
        $('bar').style.width = `${((step + 1) / STEPS.length) * 100}%`;
        $('question').textContent = st.q;
        $('help').textContent = st.help || '';
        $('back').classList.toggle('invisible', step === 0);
        const cur = answers[st.key];
        $('answers').innerHTML = st.answers.map(([v, icon, label]) => {
            const on = st.multi ? (cur || []).includes(v) : cur === v;
            return `<button type="button" data-v="${v}" aria-pressed="${on}" class="flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-[15px] font-semibold transition-colors ${on ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-slate-200 bg-white text-slate-800 hover:border-primary-300'}"><span class="text-2xl" aria-hidden="true">${icon}</span>${esc(label)}</button>`;
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

    function card(r, i) {
        const b = r.breed;
        const img = b.image
            ? `<img src="/${b.image.url.replace(/\.jpg$/, '-480.webp')}" alt="${esc(b.name_fr)}" class="h-full w-full object-cover" loading="lazy">`
            : '<div class="flex h-full items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 text-4xl">🐾</div>';
        return `<li class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <a href="/races/${b.slug}" class="flex">
                <div class="relative w-32 shrink-0 bg-slate-100 sm:w-36">${img}<span class="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-xs font-extrabold text-slate-900 shadow">${i + 1}</span></div>
                <div class="min-w-0 flex-1 p-4">
                    <p class="font-bold text-slate-900">${esc(b.name_fr)}</p>
                    <p class="text-sm font-extrabold ${r.pct >= 75 ? 'text-emerald-700' : 'text-amber-700'}">${r.pct} % compatible</p>
                    <div class="mt-2 flex flex-wrap gap-1">${r.reasons.slice(0, 4).map(x => `<span class="${x.ok ? 'chip-ok' : 'chip-ko'}">${x.ok ? '✓ ' : ''}${esc(x.text)}</span>`).join('')}</div>
                </div>
            </a>
        </li>`;
    }

    async function showResults() {
        await ready;
        const state = toState();
        const { results } = S.rank(breeds, state);
        $('quiz').classList.add('hidden');
        $('results').classList.remove('hidden');
        const good = results.filter(r => r.pct >= 75).length;
        $('summary').textContent = results.length
            ? `${good} races dépassent 75 % de compatibilité avec vos réponses. Voici les dix premières.`
            : 'Aucune race ne remplit vos critères éliminatoires : élargissez la taille ou le critère des poils.';
        $('top').innerHTML = results.slice(0, 10).map(card).join('');
        $('full-list').href = '/?' + S.toQuery(state);
        // Arrivée depuis une fiche : « Est-il fait pour moi ? »
        const race = new URLSearchParams(location.search).get('race');
        const target = race && breeds.find(b => b.slug === race);
        if (target) {
            const all = S.rank(breeds, { ...state, sizes: [], hypo: false, nonfci: true }).results;
            const r = all.find(x => x.breed.slug === race);
            const rankPos = results.findIndex(x => x.breed.slug === race);
            const box = $('race-check');
            box.classList.remove('hidden');
            box.innerHTML = r ? `Et le <strong>${esc(target.name_fr)}</strong> ? ${r.pct} % de compatibilité${rankPos >= 0 ? `, ${rankPos + 1}e sur ${results.length}` : ', mais il ne passe pas vos critères de taille ou de poils'}.${r.reasons.filter(x => !x.ok).length ? ' Points de vigilance : ' + r.reasons.filter(x => !x.ok).map(x => esc(x.text.toLowerCase())).join(', ') + '.' : ''}` : '';
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
            $('quiz').scrollIntoView({ behavior: 'smooth' });
        }
    });

    renderStep();
    const url = document.querySelector('meta[name="rdc-data"]')?.content || '/data/breeds-index.json';
    ready = fetch(url).then(r => r.json()).then(d => { breeds = d.breeds; });
})();
