/**
 * lib/comparatifs.cjs
 * Pages « Race A ou Race B : lequel choisir ? » (/comparatifs/<a>-ou-<b>), écrites depuis les notes
 * et les mesures des deux races. Français seulement : ces pages n'ont pas d'adresse dans les autres langues.
 *
 * Les duels : pour chacune des races les plus inscrites au LOF, ses voisines les plus proches parmi
 * les races courantes (celles entre lesquelles on hésite vraiment), plus une liste de duels classiques.
 */

// Duels qu'on se pose souvent et que la proximité des notes ne trouve pas toujours
const CLASSIQUES = [
    ['golden-retriever', 'labrador-retriever'], ['berger-australien', 'border-collie'], ['berger-belge-malinois', 'berger-allemand'],
    ['berger-australien', 'berger-americain-miniature'], ['husky-siberien', 'samoyede'], ['shiba-inu', 'akita'], ['akita', 'akita-americain'],
    ['bouledogue-francais', 'carlin'], ['bouledogue-francais', 'boston-terrier'], ['bouledogue-francais', 'bouledogue-anglais'],
    ['cavalier-king-charles', 'cocker-spaniel'], ['staffordshire-bull-terrier', 'staffordshire-terrier-americain'],
    ['chihuahua', 'spitz-nain-loulou-de-pomeranie'], ['yorkshire-terrier', 'bichon-maltais'], ['shih-tzu', 'lhassa-apso'],
    ['coton-de-tulear', 'bichon-havanais'], ['bichon-frise', 'bichon-maltais'], ['caniche-nain', 'bichon-frise'],
    ['jack-russell-terrier', 'beagle'], ['beagle', 'basset-hound'], ['bouvier-bernois', 'terre-neuve'], ['bouvier-bernois', 'saint-bernard'],
    ['leonberg', 'terre-neuve'], ['rottweiler', 'cane-corso'], ['beauceron', 'berger-allemand'], ['berger-blanc-suisse', 'berger-allemand'],
    ['border-collie', 'shetland-sheepdog-berger-des-shetland'], ['colley-a-poil-long', 'shetland-sheepdog-berger-des-shetland'],
    ['setter-anglais', 'epagneul-breton'], ['braque-de-weimar', 'braque-allemand-a-poil-court'], ['boxer', 'staffordshire-bull-terrier'],
    ['whippet', 'petit-levrier-italien'], ['west-highland-white-terrier', 'cairn-terrier'], ['samoyede', 'eurasier'],
    ['golden-retriever', 'berger-australien'], ['labrador-retriever', 'berger-allemand'], ['golden-retriever', 'bouvier-bernois'],
    ['dogue-allemand', 'cane-corso'], ['welsh-corgi-pembroke', 'teckel'], ['cocker-spaniel', 'springer-spaniel-anglais']
];

// « Plutôt lui si… » : ce qu'une meilleure note veut dire pour le futur maître (hi : note plus haute, lo : plus basse)
const PICK = {
    enfants: { hi: 'vous avez de jeunes enfants', w: 3 },
    premier_chien: { hi: 'c’est votre premier chien', w: 3 },
    appartement: { hi: 'vous vivez en appartement', w: 3 },
    solitude: { hi: 'il devra rester seul quelques heures dans la journée', w: 3 },
    energie: { hi: 'vous êtes sportif et voulez un chien qui suit', lo: 'vous préférez un chien plus posé au quotidien', w: 2.5 },
    education: { hi: 'vous voulez un chien plus facile à éduquer', w: 2 },
    perte_poils: { lo: 'vous ne voulez pas de poils partout dans la maison', w: 2 },
    aboiements: { lo: 'vous avez des voisins proches : il aboie moins', w: 2 },
    chats: { hi: 'vous avez un chat', w: 2 },
    entretien_pelage: { lo: 'vous voulez peu d’entretien du poil', w: 1.5 },
    garde: { hi: 'vous voulez un chien qui veille sur la maison', w: 1.5 },
    chiens: { hi: 'il vivra avec d’autres chiens', w: 1.5 },
    fugue: { lo: 'vous voulez un chien qui reste près de vous en balade', w: 1.5 },
    instinct_chasse: { lo: 'vous tenez aux balades sans laisse : son instinct de chasse est moins fort', w: 1 },
    inconnus: { hi: 'vous recevez souvent du monde', w: 1 },
    chaleur: { hi: 'vous vivez dans une région chaude', w: 1 },
    froid: { hi: 'vous vivez en montagne ou dans une région froide', w: 1 },
    bave: { lo: 'la bave vous rebute', w: 1 },
    robustesse: { hi: 'vous cherchez une race plus robuste', w: 1 }
};

module.exports = function comparatifs(ctx) {
    const { PRIX, euros, breeds, popular, S, SCORE_META, SCORE_GROUPS, GUIDES, SITE_URL, DATE, DATE_FR,
        tone, TONE, gauge, picture, icon, esc, le, Le, range, clip, fmtInt, ordinal, page, headMeta, ldTag, crumbs, crumbsLd } = ctx;
    const bySlug = Object.fromEntries(breeds.map(b => [b.slug, b]));
    const short = b => b.name_fr.replace(/\s*\([^)]*\)/g, '');
    const du = n => (/^[AEIOUYÉÈÊÂÎÔ]/i.test(n) ? `de l’${n}` : `du ${n}`);
    const KEYS = SCORE_GROUPS.flatMap(([, keys]) => keys);
    const word = (b, k) => SCORE_META[k].words[b.scores[k] - 1];
    const lower = s => s.toLowerCase();

    // ---------- Choix des duels ----------
    const SIM = ['energie', 'enfants', 'appartement', 'education', 'premier_chien', 'entretien_pelage', 'perte_poils', 'garde', 'solitude'];
    const dist = (a, b) => {
        let d = Math.abs(S.SIZE_ID[a.physical.size_category] - S.SIZE_ID[b.physical.size_category]) * 1.5;
        for (const k of SIM) d += Math.abs(a.scores[k] - b.scores[k]);
        if (a.fci?.group && a.fci.group === b.fci?.group) d -= 1;
        return d;
    };
    const pool = popular.slice(0, 70);
    const seen = new Set();
    const pairs = [];
    const add = (a, b) => {
        if (!a || !b || a === b) return;
        // La race la plus inscrite au LOF en premier : l'adresse d'un duel ne change pas selon l'ordre de saisie
        const [x, y] = [a, b].sort((p, q) => (p.lofRank || 999) - (q.lofRank || 999) || p.slug.localeCompare(q.slug));
        const slug = `${x.slug}-ou-${y.slug}`;
        if (seen.has(slug)) return;
        seen.add(slug);
        pairs.push({ slug, a: x, b: y });
    };
    for (const [a, b] of CLASSIQUES) add(bySlug[a], bySlug[b]);
    for (const a of popular.slice(0, 45)) {
        pool.filter(o => o !== a).map(o => ({ o, d: dist(a, o) })).sort((p, q) => p.d - q.d || p.o.lofRank - q.o.lofRank).slice(0, 3).forEach(x => add(a, x.o));
    }
    pairs.sort((p, q) => (p.a.lofRank + p.b.lofRank) - (q.a.lofRank + q.b.lofRank));
    const pairUrl = p => `/comparatifs/${p.slug}`;
    const pairsOf = b => pairs.filter(p => p.a === b || p.b === b);
    const label = p => `${short(p.a)} ou ${short(p.b)}`;

    // ---------- Textes tirés des notes ----------
    function reasons(x, y) {
        const out = [];
        for (const [k, m] of Object.entries(PICK)) {
            const d = x.scores[k] - y.scores[k];
            if (d > 0 && m.hi) out.push({ g: d * m.w, text: m.hi });
            else if (d < 0 && m.lo) out.push({ g: -d * m.w, text: m.lo });
        }
        const wx = x.physical.weight_kg?.average, wy = y.physical.weight_kg?.average;
        if (wx && wy && wx <= wy * 0.7) out.push({ g: 2.5, text: `vous voulez un chien moins encombrant : ${range(x.physical.weight_kg.min, x.physical.weight_kg.max, 'kg')}, contre ${range(y.physical.weight_kg.min, y.physical.weight_kg.max, 'kg')}` });
        const lx = x.physical.life_span_years?.average, ly = y.physical.life_span_years?.average;
        if (lx && ly && lx - ly >= 1.5) out.push({ g: 2, text: `la longévité compte pour vous : ${range(x.physical.life_span_years.min, x.physical.life_span_years.max, 'ans')} d’espérance de vie` });
        return out.sort((p, q) => q.g - p.g).slice(0, 5).map(r => r.text);
    }
    const sizeText = b => ({ toy: 'très petit chien', small: 'petit chien', medium: 'chien de taille moyenne', large: 'grand chien', giant: 'très grand chien' }[b.physical.size_category]);

    function intro(a, b) {
        const A = short(a), B = short(b);
        const same = KEYS.filter(k => a.scores[k] === b.scores[k]).length;
        const diffs = KEYS.map(k => ({ k, d: Math.abs(a.scores[k] - b.scores[k]) })).filter(x => x.d >= 1).sort((p, q) => q.d - p.d || (PICK[q.k]?.w || 0) - (PICK[p.k]?.w || 0)).slice(0, 3);
        const parts = [];
        const sameGroup = a.fci?.group && a.fci.group === b.fci?.group;
        const sameSize = a.physical.size_category === b.physical.size_category;
        if (sameGroup && sameSize) parts.push(`${Le(A)} et ${le(B)} appartiennent au même groupe (${lower(S.FCI_GROUPS[a.fci.group])}) et ont le même gabarit.`);
        else if (sameGroup) parts.push(`${Le(A)} et ${le(B)} appartiennent au même groupe (${lower(S.FCI_GROUPS[a.fci.group])}), mais pas au même gabarit : ${sizeText(a)} pour le premier, ${sizeText(b)} pour le second.`);
        else if (sameSize) parts.push(`${Le(A)} et ${le(B)} ont le même gabarit, mais pas la même histoire : ${a.fci?.group ? lower(S.FCI_GROUPS[a.fci.group]) : 'race non reconnue par la FCI'} pour le premier, ${b.fci?.group ? lower(S.FCI_GROUPS[b.fci.group]) : 'race non reconnue par la FCI'} pour le second.`);
        else parts.push(`${Le(A)} est un ${sizeText(a)}, ${le(B)} un ${sizeText(b)} : le gabarit est déjà une première différence.`);
        parts.push(same === KEYS.length
            ? `Leurs ${KEYS.length} notes sont identiques : le choix se joue sur le physique, l’entretien et le coup de cœur.`
            : `Sur nos ${KEYS.length} notes, ${same} sont identiques.`);
        if (diffs.length) parts.push(`Ce qui les sépare le plus : ${diffs.map(({ k }) => `${lower(SCORE_META[k].label)} (${lower(word(a, k))} pour ${le(A)}, ${lower(word(b, k))} pour ${le(B)})`).join(' ; ')}.`);
        return parts.join(' ');
    }

    // Question « lequel… » : la réponse cite les deux notes, ou dit qu'il n'y a pas d'écart
    function duelAnswer(a, b, k, better, same) {
        const A = short(a), B = short(b);
        const va = a.scores[k], vb = b.scores[k];
        if (va === vb) return `${same} Les deux races ont la même note : ${lower(word(a, k))}.`;
        const reverse = SCORE_META[k].reverse;
        const win = (reverse ? va < vb : va > vb) ? a : b, lose = win === a ? b : a;
        return `${Le(short(win))} ${better} : ${lower(word(win, k))}, contre ${lower(word(lose, k))} pour ${le(short(lose))}.`;
    }
    function faq(a, b) {
        const A = short(a), B = short(b);
        const q = [];
        q.push([`${A} ou ${B} pour un premier chien ?`, duelAnswer(a, b, 'premier_chien', 'convient mieux à un débutant', 'Aucun des deux ne prend l’avantage.')]);
        q.push([`${A} ou ${B} en appartement ?`, duelAnswer(a, b, 'appartement', 's’adapte mieux à un logement sans jardin', 'Pas de différence sur ce point.')]);
        q.push([`Lequel perd le moins de poils ?`, duelAnswer(a, b, 'perte_poils', 'perd moins de poils', 'Ils perdent autant de poils l’un que l’autre.')]);
        q.push([`Lequel est le plus adapté aux enfants ?`, duelAnswer(a, b, 'enfants', 'est le mieux noté avec les enfants', 'Ils sont à égalité.') + ' Ne laissez jamais un jeune enfant seul avec un chien, quelle que soit sa race.']);
        const ea = a.scores.exercice_min_jour, eb = b.scores.exercice_min_jour;
        if (ea && eb) q.push([`Lequel a besoin de plus d’exercice ?`, ea === eb ? `Les deux demandent environ ${ea} minutes d’activité par jour.` : `${Le(short(ea > eb ? a : b))} : comptez environ ${Math.max(ea, eb)} minutes d’activité par jour, contre ${Math.min(ea, eb)} minutes pour ${le(short(ea > eb ? b : a))}.`]);
        const la = a.physical.life_span_years, lb = b.physical.life_span_years;
        if (la && lb) q.push([`Lequel vit le plus longtemps ?`, la.average === lb.average ? `Leur espérance de vie est la même : ${range(la.min, la.max, 'ans')}.` : `${Le(short(la.average > lb.average ? a : b))} : ${range(...(la.average > lb.average ? [la.min, la.max] : [lb.min, lb.max]), 'ans')}, contre ${range(...(la.average > lb.average ? [lb.min, lb.max] : [la.min, la.max]), 'ans')} pour ${le(short(la.average > lb.average ? b : a))}.`]);
        return q;
    }

    // ---------- Page d'un duel ----------
    function pairPage(p) {
        const { a, b } = p;
        const A = short(a), B = short(b);
        const url = SITE_URL + pairUrl(p);
        const title = [`${A} ou ${B} : lequel choisir ?`, `${A} ou ${B} : le comparatif`, `${A} ou ${B} ?`].find(t => t.length <= 60) || `${A} ou ${B}`;
        const description = clip(`${A} ou ${B} ? Taille, caractère, enfants, appartement, entretien, santé : les deux races comparées note par note, et pour qui chacune est faite.`);
        const ra = reasons(a, b), rb = reasons(b, a);
        const none = 'aucune note ne le place nettement devant : fiez-vous à la rencontre avec la race';
        const faqs = faq(a, b);
        const facts = [
            ['Taille au garrot', x => range(x.physical.height_cm?.min, x.physical.height_cm?.max, 'cm')],
            ['Poids', x => range(x.physical.weight_kg?.min, x.physical.weight_kg?.max, 'kg')],
            ['Espérance de vie', x => range(x.physical.life_span_years?.min, x.physical.life_span_years?.max, 'ans')],
            ['Activité par jour', x => `${x.scores.exercice_min_jour} minutes`],
            ['Origine', x => x.origin || ''],
            ['Groupe FCI', x => (x.fci?.group ? `${x.fci.group} · ${S.FCI_GROUPS[x.fci.group]}` : 'Non reconnue')],
            ['Chiots inscrits au LOF en 2025', x => (x.lof?.['2025'] ? `${fmtInt(x.lof['2025'])} (${ordinal(x.lofRank)} race)` : 'Non inscrite')],
            ['Poil', x => [x.coat?.length, x.coat?.type].filter(Boolean).join(', ').toLowerCase()],
            // Relevé ponctuel des annonces (data/prix-annonces.json), seulement si les deux races en ont un
            ...(PRIX.races[a.slug] && PRIX.races[b.slug] ? [['Prix médian relevé, chiot LOF', x => `${euros(PRIX.races[x.slug].mediane)} (${PRIX.races[x.slug].n} annonces)`]] : [])
        ];
        const cell = (x, o, k) => {
            const m = SCORE_META[k];
            // En vert : la meilleure des deux notes, sauf si elle reste un point à prévoir (« mal » contre « très mal »)
            const better = !m.neutral && k !== 'inconnus' && x.scores[k] !== o.scores[k] && (m.reverse ? x.scores[k] < o.scores[k] : x.scores[k] > o.scores[k]) && tone(k, x.scores[k]) !== 'watch';
            return `<td class="px-3 py-2.5 align-top"><span class="block text-sm font-semibold ${better ? 'text-emerald-700' : 'text-slate-800'}">${m.words[x.scores[k] - 1]}<span class="sr-only">, ${x.scores[k]} sur 5${better ? ', la meilleure note des deux' : ''}</span></span>${gauge(k, x.scores[k], 'mt-1.5 max-w-[120px]')}</td>`;
        };
        const commons = KEYS.filter(k => a.scores[k] === b.scores[k] && tone(k, a.scores[k]) !== 'mid');
        const health = x => `<div class="rounded-2xl border border-slate-200 bg-white p-5">
                        <h3 class="font-bold text-slate-900">${esc(short(x))}</h3>
                        <p class="mt-1 text-sm text-slate-600">Espérance de vie de ${range(x.physical.life_span_years?.min, x.physical.life_span_years?.max, 'ans')}, robustesse ${lower(word(x, 'robustesse'))}.</p>
                        ${(x.health?.common_issues || []).length ? `<ul class="mt-3 space-y-1.5 text-sm text-slate-700">${x.health.common_issues.map(i => `<li class="flex gap-2"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true"></span><span>${esc(i)}</span></li>`).join('')}</ul>` : ''}
                    </div>`;
        const vigil = x => (GUIDES[x.slug]?.vigilance?.length ? `<div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                        <h3 class="font-bold text-amber-900">Avant d’adopter un ${esc(short(x))}</h3>
                        <ul class="mt-3 space-y-2 text-sm text-amber-900">${GUIDES[x.slug].vigilance.map(v => `<li class="flex gap-2">${icon('warning-circle', 'mt-0.5 h-4 w-4 shrink-0 text-amber-700')}<span>${esc(v)}</span></li>`).join('')}</ul>
                    </div>` : '');
        const head = x => `<a href="/races/${x.slug}" class="group block overflow-hidden rounded-3xl border border-slate-200 bg-white card-hover">
                    <div class="aspect-[4/3] overflow-hidden bg-slate-100">${picture(x, 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105', { eager: true, sizes: '(min-width: 1024px) 480px, 50vw' })}</div>
                    <div class="p-4 sm:p-5">
                        <p class="text-lg font-bold leading-snug text-slate-900 sm:text-xl">${esc(x.name_fr)}</p>
                        <p class="mt-1 text-sm text-slate-600">${esc(({ toy: 'Très petit', small: 'Petit', medium: 'Moyen', large: 'Grand', giant: 'Géant' })[x.physical.size_category])} · ${range(x.physical.weight_kg?.min, x.physical.weight_kg?.max, 'kg')}</p>
                        <p class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">Voir la fiche${icon('arrow-right', 'h-4 w-4')}</p>
                    </div>
                </a>`;
        const others = [...new Set([...pairsOf(a), ...pairsOf(b)])].filter(o => o !== p).slice(0, 12);
        const body = `
    <main class="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        ${crumbs([['Comparer des races', '/compare'], [`${A} ou ${B}`]])}
        <article>
            <header class="max-w-3xl">
                <h1 class="display">${esc(A)} ou ${esc(B)} : lequel choisir ?</h1>
                <p class="mt-3 leading-relaxed text-slate-700">${esc(intro(a, b))}</p>
                <p class="mt-3 text-sm text-slate-500">Comparatif établi à partir de nos notes de 1 à 5, à jour du ${DATE_FR}. <a href="/methode" class="font-semibold text-primary-700 underline">Comment les races sont notées</a></p>
            </header>

            <div class="mt-8 grid grid-cols-2 gap-3 sm:gap-6">
                ${head(a)}
                ${head(b)}
            </div>

            <section class="mt-12" aria-labelledby="choisir">
                <h2 id="choisir" class="text-2xl font-bold text-slate-900">Lequel est fait pour vous ?</h2>
                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                    ${[[a, ra], [b, rb]].map(([x, r]) => `<div class="rounded-2xl border border-slate-200 bg-white p-5">
                        <h3 class="font-bold text-slate-900">Plutôt ${esc(le(short(x)))} si…</h3>
                        <ul class="mt-3 space-y-2 text-sm text-slate-700">${(r.length ? r : [none]).map(t => `<li class="flex gap-2">${icon('check', 'mt-0.5 h-4 w-4 shrink-0 text-emerald-700')}<span>${esc(t)}</span></li>`).join('')}</ul>
                    </div>`).join('')}
                </div>
            </section>

            <section class="mt-12" aria-labelledby="chiffres">
                <h2 id="chiffres" class="text-2xl font-bold text-slate-900">Taille, poids, longévité</h2>
                <div class="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table class="w-full min-w-[480px] table-fixed border-collapse text-sm">
                        <thead><tr class="text-left"><th class="w-[34%] px-3 py-3"><span class="sr-only">Critère</span></th><th scope="col" class="px-3 py-3 font-bold text-slate-900">${esc(A)}</th><th scope="col" class="px-3 py-3 font-bold text-slate-900">${esc(B)}</th></tr></thead>
                        <tbody>${facts.map(([l, f]) => `<tr class="border-t border-slate-200"><th scope="row" class="px-3 py-2.5 text-left font-medium text-slate-600">${l}</th><td class="px-3 py-2.5 font-semibold text-slate-900">${esc(f(a))}</td><td class="px-3 py-2.5 font-semibold text-slate-900">${esc(f(b))}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
            </section>

            <section class="mt-12" aria-labelledby="notes">
                <h2 id="notes" class="text-2xl font-bold text-slate-900">Caractère et quotidien, note par note</h2>
                <p class="mt-2 text-sm text-slate-600"><span class="font-semibold text-emerald-700">En vert</span>, la meilleure note des deux quand le critère a un sens. Une note qui reste un point à prévoir n’est jamais en vert. L’énergie, l’instinct de garde et le rapport aux inconnus dépendent de ce que vous cherchez.</p>
                <div class="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table class="w-full min-w-[480px] table-fixed border-collapse">
                        <thead><tr class="text-left text-sm"><th class="w-[34%] px-3 py-3"><span class="sr-only">Critère</span></th><th scope="col" class="px-3 py-3 font-bold text-slate-900">${esc(A)}</th><th scope="col" class="px-3 py-3 font-bold text-slate-900">${esc(B)}</th></tr></thead>
                        <tbody>${SCORE_GROUPS.map(([g, keys]) => `<tr><th colspan="3" scope="colgroup" class="bg-slate-50 px-3 py-2 text-left text-[13px] font-semibold text-slate-600">${g}</th></tr>${keys.map(k => `<tr class="border-t border-slate-200"><th scope="row" class="px-3 py-2.5 text-left align-top text-sm font-medium text-slate-600">${SCORE_META[k].label}</th>${cell(a, b, k)}${cell(b, a, k)}</tr>`).join('')}`).join('')}</tbody>
                    </table>
                </div>
                ${commons.length ? `<h3 class="mt-8 text-lg font-bold text-slate-900">Ce qu’ils ont en commun</h3>
                <ul class="mt-3 flex flex-wrap gap-2">${commons.map(k => `<li class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">${SCORE_META[k].label} : <span class="font-semibold ${TONE[tone(k, a.scores[k])].text}">${lower(word(a, k))}</span></li>`).join('')}</ul>` : ''}
            </section>

            <section class="mt-12" aria-labelledby="sante">
                <h2 id="sante" class="text-2xl font-bold text-slate-900">Santé : ce qu’il faut surveiller</h2>
                <div class="mt-4 grid items-start gap-4 sm:grid-cols-2">${health(a)}${health(b)}</div>
                ${PRIX.races[a.slug] && PRIX.races[b.slug] ? `<p class="mt-3 text-sm text-slate-500">Les prix viennent d’un relevé ponctuel d’annonces, expliqué dans <a href="/guides/combien-coute-un-chien#prix-races" class="font-semibold text-primary-700 underline">le guide du budget</a>.</p>` : ''}
                <p class="mt-3 text-sm text-slate-500">Pour l’une comme pour l’autre, choisissez un éleveur qui fait pratiquer les dépistages de la race sur les parents, et demandez-en les résultats.</p>
                ${vigil(a) || vigil(b) ? `<div class="mt-6 grid items-start gap-4 sm:grid-cols-2">${vigil(a)}${vigil(b)}</div>` : ''}
            </section>

            <section class="mt-12 max-w-3xl" aria-labelledby="faq">
                <h2 id="faq" class="text-2xl font-bold text-slate-900">${esc(A)} ou ${esc(B)} : vos questions</h2>
                <div class="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                    ${faqs.map(([q, r]) => `<div class="p-5"><h3 class="font-bold text-slate-900">${esc(q)}</h3><p class="mt-1.5 text-sm leading-relaxed text-slate-700">${esc(r)}</p></div>`).join('')}
                </div>
            </section>
        </article>

        <section class="mt-12 grid gap-4 sm:grid-cols-2">
            <a href="/compare?races=${a.slug},${b.slug}" class="rounded-3xl bg-slate-900 p-6 text-white hover:bg-slate-800"><p class="flex items-center gap-2 text-lg font-bold">${icon('plus', 'h-6 w-6')}Ajouter une troisième race</p><p class="mt-1 text-sm text-slate-300">Ouvrez ce duel dans le comparateur et ajoutez la race qui vous fait hésiter.</p></a>
            <a href="/quel-chien-choisir" class="rounded-3xl border border-slate-200 bg-white p-6 hover:border-primary-300"><p class="flex items-center gap-2 text-lg font-bold text-slate-900">${icon('compass', 'h-6 w-6')}Quel chien pour moi ?</p><p class="mt-1 text-sm text-slate-600">8 questions sur votre vie, et les races les plus compatibles parmi ${breeds.length}.</p></a>
        </section>

        ${others.length ? `<section class="mt-12 rounded-3xl border border-slate-200 bg-white p-6" aria-labelledby="autres">
            <h2 id="autres" class="text-lg font-bold text-slate-900">Autres comparatifs</h2>
            <ul class="mt-3 flex flex-wrap gap-2">${others.map(o => `<li class="max-w-full"><a href="${pairUrl(o)}" class="opt opt-wrap">${esc(label(o))}</a></li>`).join('')}</ul>
        </section>` : ''}
    </main>`;
        const ld = [{
            '@context': 'https://schema.org', '@type': 'Article', headline: `${A} ou ${B} : lequel choisir ?`, description,
            image: a.image ? `${SITE_URL}/${a.image.url}` : undefined, author: { '@type': 'Organization', name: 'Race de Chien', url: `${SITE_URL}/methode` },
            publisher: { '@type': 'Organization', name: 'Race de Chien', url: SITE_URL }, mainEntityOfPage: url, dateModified: DATE
        }, {
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: faqs.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } }))
        }, crumbsLd([['Comparer des races', '/compare'], [`${A} ou ${B}`, pairUrl(p)]])];
        return page({ head: headMeta({ title, description, url, image: a.image ? `${SITE_URL}/${a.image.url}` : null, type: 'article' }) + ldTag(ld), body });
    }

    // ---------- Liens vers les duels ----------
    // Sur la page du comparateur : tous les duels, les plus courants d'abord
    const indexHtml = () => `<ul class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">${pairs.map(p => `<li><a href="${pairUrl(p)}" class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 pr-3 hover:border-primary-300">
                <span class="flex shrink-0 -space-x-3">${[p.a, p.b].map(x => `<span class="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-slate-100">${x.image ? picture(x, 'h-full w-full object-cover', { sizes: '44px', alt: '' }) : ''}</span>`).join('')}</span>
                <span class="min-w-0 text-sm font-semibold leading-snug text-slate-900">${esc(label(p))}</span>
            </a></li>`).join('')}</ul>`;
    // Sur une fiche : les duels de cette race
    const linksFor = b => pairsOf(b).map(p => ({ url: pairUrl(p), other: p.a === b ? p.b : p.a }));

    return { pairs, pairUrl, pairPage, indexHtml, linksFor };
};
