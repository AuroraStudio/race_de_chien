// Comparateur : jusqu'à trois races sur les 20 notes
(function () {
    const S = window.RDCScoring;
    const KEY = 'rdc-compare';
    const $ = id => document.getElementById(id);
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const num = n => String(n).replace('.', ',');
    const range = (r, unit) => r ? (r.min === r.max ? `${num(r.min)} ${unit}` : `${num(r.min)} à ${num(r.max)} ${unit}`) : '';

    // Libellés et sens de lecture des notes (reverse : une note basse est préférable)
    const ROWS = [
        ['Mode de vie', [['energie', 'Énergie', null], ['appartement', 'En appartement', false], ['solitude', 'Seul à la maison', false]]],
        ['Famille', [['enfants', 'Avec les enfants', false], ['chiens', 'Avec les autres chiens', false], ['chats', 'Avec les chats', false], ['inconnus', 'Avec les inconnus', null]]],
        ['Éducation', [['education', "Facilité d'éducation", false], ['premier_chien', 'Pour un premier chien', false], ['garde', 'Instinct de garde', null], ['instinct_chasse', 'Instinct de chasse', true], ['fugue', 'Tendance à fuguer', true]]],
        ['Entretien', [['entretien_pelage', 'Entretien du poil', true], ['perte_poils', 'Perte de poils', true], ['bave', 'Bave', true], ['aboiements', 'Aboiements', true]]],
        ['Climat et santé', [['chaleur', 'Chaleur', false], ['froid', 'Froid', false], ['robustesse', 'Robustesse', false]]]
    ];

    let breeds = [];
    let picked = [];

    function readList() {
        const p = new URLSearchParams(location.search);
        const fromUrl = (p.get('races') || '').split(',').filter(Boolean);
        // Anciennes adresses : ?ids=12,45
        const legacy = (p.get('ids') || '').split(',').filter(Boolean).map(id => breeds.find(b => String(b.id) === id)?.slug).filter(Boolean);
        let stored = [];
        try { stored = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { /* ignoré */ }
        const list = fromUrl.length ? fromUrl : legacy.length ? legacy : stored;
        return list.filter(s => breeds.some(b => b.slug === s)).slice(0, 3);
    }

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(picked)); } catch (e) { /* ignoré */ }
        history.replaceState(null, '', picked.length ? `/compare?races=${picked.join(',')}` : '/compare');
    }

    const gauge = (v, best) => `<span class="gauge w-20" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? (best ? 'on !bg-emerald-500' : 'on') : ''}"></i>`).join('')}</span><span class="sr-only">${v} sur 5</span>`;

    function render() {
        const list = picked.map(s => breeds.find(b => b.slug === s));
        $('hint').textContent = list.length >= 3 ? 'Trois races au maximum.' : '';
        $('add').disabled = list.length >= 3;
        if (list.length === 0) {
            $('table').innerHTML = '';
            $('empty').classList.remove('hidden');
            const sugg = breeds.filter(b => b.lof?.['2025']).sort((a, b) => b.lof['2025'] - a.lof['2025']).slice(0, 8);
            $('suggest').innerHTML = sugg.map(b => `<button type="button" class="opt" data-add="${b.slug}">+ ${esc(b.name_fr)}</button>`).join('');
            return;
        }
        $('empty').classList.add('hidden');
        const cols = list.length;
        const head = list.map(b => `
            <th scope="col" class="min-w-[180px] p-3 align-top">
                <div class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div class="aspect-[4/3] bg-slate-100">${b.image ? `<img src="/${b.image.url.replace(/\.jpg$/, '-480.webp')}" alt="" class="h-full w-full object-cover">` : '<div class="flex h-full items-center justify-center text-4xl">🐾</div>'}</div>
                    <div class="p-3 text-left">
                        <a href="/races/${b.slug}" class="font-bold text-slate-900 hover:text-primary-700">${esc(b.name_fr)}</a>
                        <p class="text-xs font-normal text-slate-500">${esc(b.origin || '')}</p>
                    </div>
                    <button type="button" data-remove="${b.slug}" class="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-700 shadow hover:bg-white" aria-label="Retirer ${esc(b.name_fr)}">Retirer</button>
                </div>
            </th>`).join('');
        const facts = [
            ['Taille', b => range(b.physical.height_cm, 'cm')],
            ['Poids', b => range(b.physical.weight_kg, 'kg')],
            ['Espérance de vie', b => range(b.physical.life_span_years, 'ans')],
            ['Activité par jour', b => `${b.scores.exercice_min_jour} min`],
            ['Groupe FCI', b => b.fci?.group ? `${b.fci.group} · ${S.FCI_GROUPS[b.fci.group]}` : 'Non reconnue'],
            ['Popularité (LOF 2025)', b => b.lof?.['2025'] ? `${b.lof['2025'].toLocaleString('fr-FR')} chiots` : 'Non inscrite'],
            ['Catégorie légale', b => b.legal_category ? `<span class="chip-law">Catégorie ${b.legal_category}</span>` : 'Aucune'],
            ['Perd très peu de poils', b => b.hypoallergenic ? 'Oui' : 'Non']
        ];
        const factRows = facts.map(([label, f]) => `<tr class="border-t border-slate-200"><th scope="row" class="px-3 py-2.5 text-left text-sm font-medium text-slate-600">${label}</th>${list.map(b => `<td class="px-3 py-2.5 text-sm font-semibold text-slate-900">${f(b)}</td>`).join('')}</tr>`).join('');
        const scoreRows = ROWS.map(([group, rows]) => `
            <tr><th colspan="${cols + 1}" class="px-3 pb-1 pt-6 text-left text-xs font-bold uppercase tracking-wider text-slate-500">${group}</th></tr>
            ${rows.map(([k, label, reverse]) => {
                const vals = list.map(b => b.scores[k]);
                const best = reverse === null || cols < 2 ? null : (reverse ? Math.min(...vals) : Math.max(...vals));
                const allSame = vals.every(v => v === vals[0]);
                return `<tr class="border-t border-slate-200"><th scope="row" class="px-3 py-2.5 text-left text-sm font-medium text-slate-700">${label}</th>${list.map(b => `<td class="px-3 py-2.5">${gauge(b.scores[k], best !== null && !allSame && b.scores[k] === best)}</td>`).join('')}</tr>`;
            }).join('')}`).join('');
        $('table').innerHTML = `<table class="w-full min-w-[560px] table-fixed border-collapse rounded-2xl bg-white">
            <thead><tr><th class="w-44 p-3"><span class="sr-only">Critère</span></th>${head}</tr></thead>
            <tbody>${factRows}${scoreRows}</tbody></table>
            <p class="mt-3 text-xs text-slate-500">En vert : la meilleure note de la ligne, quand le critère a un sens (moins de bave, plus facile à éduquer…). L'énergie, le rapport aux inconnus et la garde dépendent de ce que vous cherchez.</p>`;
    }

    function add(slug) {
        if (!slug || picked.includes(slug) || picked.length >= 3) return;
        picked.push(slug);
        save();
        render();
    }

    document.addEventListener('click', e => {
        const t = e.target.closest('button');
        if (!t) return;
        if (t.dataset.remove) { picked = picked.filter(s => s !== t.dataset.remove); save(); render(); }
        if (t.dataset.add) add(t.dataset.add);
    });
    $('add').addEventListener('change', e => {
        const q = S.normalize(e.target.value);
        const b = breeds.find(x => S.normalize(x.name_fr) === q) || breeds.find(x => S.normalize(x.name_fr).startsWith(q));
        if (b) add(b.slug);
        e.target.value = '';
    });

    (async function init() {
        const url = document.querySelector('meta[name="rdc-data"]')?.content || '/data/breeds-index.json';
        breeds = (await (await fetch(url)).json()).breeds;
        $('breed-list').innerHTML = breeds.map(b => `<option value="${esc(b.name_fr)}"></option>`).join('');
        picked = readList();
        save();
        render();
    })();
})();
