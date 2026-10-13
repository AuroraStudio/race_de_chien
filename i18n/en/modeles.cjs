/**
 * i18n/en/modeles.cjs
 * Phrases types des fiches, traduites par modèle plutôt qu'une à une : titres, fil d'Ariane, rang en France,
 * mesures, notes, questions et réponses de la FAQ, santé. Chaque phrase générée par generate-breeds.cjs
 * à partir des notes et des mesures a ici sa forme anglaise, la même sur les 231 fiches.
 * Une nouvelle race reçoit ces phrases sans passer par le dictionnaire.
 *
 * Exporte (ctx) => (clé) => traduction ou null. ctx = { breeds, names: { slug: nom anglais }, dict }.
 * null : la phrase n'est pas un modèle connu, ou une de ses parties manque, le dictionnaire prend le relais.
 */

const SP = '[ \\u00a0]';
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Mots des notes : français (minuscules, comme dans les phrases) → anglais, par critère
const W = {
    energie: [['très calme', 'calme', 'modérée', 'élevée', 'débordante'], ['very calm', 'calm', 'moderate', 'high', 'boundless']],
    robustesse: [['fragile', 'plutôt fragile', 'moyenne', 'bonne', 'excellente'], ['fragile', 'rather fragile', 'average', 'good', 'excellent']],
    perte_poils: [['quasi nulle', 'faible', 'modérée', 'forte', 'très forte'], ['It sheds almost nothing', 'It sheds little', 'It sheds moderately', 'It sheds heavily', 'It sheds very heavily']],
    entretien_pelage: [['minimal', 'faible', 'moyen', 'important', 'très important'], ['minimal', 'low', 'average', 'high', 'very high']]
};
const COAT_CARE = ['its coat needs minimal care', 'its coat needs little care', 'its coat needs average care', 'its coat needs a lot of care', 'its coat needs a great deal of care'];
const word = (k, fr) => { const i = W[k][0].indexOf(fr); return i < 0 ? null : W[k][1][i]; };

// Mots des notes affichés seuls (« En bref », « Toutes ses notes »)
const LEVEL = {
    'Très calme': 'Very calm', Calme: 'Calm', 'Modérée': 'Moderate', 'Élevée': 'High', 'Débordante': 'Boundless',
    Impossible: 'Impossible', Difficile: 'Difficult', Possible: 'Possible', Bien: 'Good', Parfait: 'Perfect',
    'Très mal': 'Very poorly', Mal: 'Poorly', 'Quelques heures': 'A few hours', 'Très bien': 'Very well',
    'À éviter': 'Avoid', Prudence: 'Caution', Correct: 'Fair', Bon: 'Good', Excellent: 'Excellent',
    'Très méfiant': 'Very wary', 'Réservé': 'Reserved', Poli: 'Polite', Ouvert: 'Open', 'Très ouvert': 'Very open',
    'Très difficile': 'Very hard', Moyenne: 'Average', Facile: 'Easy', 'Très facile': 'Very easy',
    'Déconseillé': 'Not advised', 'Peu adapté': 'Poor fit', 'Bien adapté': 'Good fit', 'Idéal': 'Ideal',
    Nul: 'None', Faible: 'Low', 'Modéré': 'Moderate', 'Marqué': 'Strong', 'Très marqué': 'Very strong',
    'Très faible': 'Very low', Fort: 'Strong', 'Très fort': 'Very strong', Forte: 'High', 'Très forte': 'Very high',
    Minimal: 'Minimal', Moyen: 'Average', Important: 'High', 'Très important': 'Very high', 'Quasi nulle': 'Almost none',
    Jamais: 'Never', Rarement: 'Rarely', 'Un peu': 'A little', Souvent: 'Often', Beaucoup: 'A lot',
    'Très discret': 'Very quiet', Discret: 'Quiet', 'Modérés': 'Moderate', 'Fréquents': 'Frequent', 'Très bavard': 'Very vocal',
    Bonne: 'Good', Excellente: 'Excellent', Fragile: 'Fragile', 'Plutôt fragile': 'Rather fragile'
};
const SIZE = { 'Très petit': 'Very small', Petit: 'Small', Moyen: 'Medium', Grand: 'Large', 'Géant': 'Giant' };
const SIZE_TEXT = { 'de très petite taille': 'very small', 'de petite taille': 'small', 'de taille moyenne': 'medium-sized', 'de grande taille': 'large', 'de taille géante': 'giant' };
const GROUP = {
    'Bergers et bouviers': 'Sheepdogs and cattle dogs', 'Molosses, pinschers et bouviers suisses': 'Pinschers, molossers and Swiss mountain dogs',
    Terriers: 'Terriers', Teckels: 'Dachshunds', 'Spitz et chiens primitifs': 'Spitz and primitive types', 'Chiens courants': 'Scent hounds',
    "Chiens d'arrêt": 'Pointing dogs', "Rapporteurs, leveurs et chiens d'eau": 'Retrievers, flushing dogs and water dogs',
    'Chiens de compagnie': 'Companion and toy dogs', 'Lévriers': 'Sighthounds'
};
const APART = {
    'Oui, très bien : calme à l’intérieur, il s’adapte parfaitement à un appartement.': 'Yes, very well: calm indoors, it adapts perfectly to an apartment.',
    'Oui, s’il sort plusieurs fois par jour : il s’adapte bien à un logement sans jardin.': 'Yes, if it goes out several times a day: it adapts well to a home without a yard.',
    'C’est possible, à condition de lui offrir de vraies sorties chaque jour ; un jardin reste un plus.': 'It can, as long as it gets real outings every day; a yard is still a plus.',
    'C’est difficile : il a besoin d’espace et d’activité, un logement avec jardin lui convient mieux.': 'It is difficult: it needs space and activity, and a home with a yard suits it better.',
    'Ce n’est pas recommandé : il lui faut de l’espace, idéalement une maison avec jardin.': 'It is not recommended: it needs space, ideally a house with a yard.'
};
const KIDS = {
    'Oui : patient et doux, c’est un excellent chien de famille, même avec de jeunes enfants.': 'Yes: patient and gentle, it is an excellent family dog, even with young children.',
    'Oui, il s’entend bien avec les enfants qui le respectent.': 'Yes, it gets along well with children who respect it.',
    'Correctement, plutôt avec des enfants assez grands pour respecter ses limites.': 'Fairly well, preferably with children old enough to respect its limits.',
    'Avec prudence : il tolère mal l’agitation des jeunes enfants.': 'With caution: it does not cope well with the commotion of young children.',
    'Il est déconseillé avec de jeunes enfants.': 'It is not advised with young children.'
};
const EXTRA = {
    'Attention au voisinage : il aboie volontiers.': 'Mind the neighbors: it barks readily.',
    'Ne laissez jamais un jeune enfant seul avec un chien, quelle que soit sa race.': 'Never leave a young child alone with a dog, whatever the breed.',
    'Ajoutez des jeux et des exercices d’éducation pour occuper aussi sa tête.': 'Add games and training exercises to keep its mind busy too.',
    'Il fait partie des races qui perdent très peu de poils, souvent mieux tolérées par les personnes allergiques, sans garantie : passez du temps avec la race avant de vous décider.': 'It is one of the breeds that shed very little and are often better tolerated by people with allergies, with no guarantee: spend time with the breed before you decide.',
    'Prévoyez un brossage plusieurs fois par semaine, et davantage pendant les mues de printemps et d’automne.': 'Plan on brushing several times a week, and more during the spring and fall shedding seasons.',
    'Son poil demande un toilettage régulier, parfois chez un professionnel.': 'Its coat needs regular grooming, sometimes by a professional.'
};
// Noms propres en tête d'une maladie : on ne met pas de minuscule
const PROPER = /^(Addison|Cushing|Legg|Von|Willebrand|Wobbler|Horner|Chiari|Ehlers|Stockard|Collie|Scottie|Shar|Westie|Cavalier|Alaskan|Siberian|Dalmatian|Irish|Lyme|Leishmania|Lafora|Fanconi|Hodgkin|Sertoli|Sjögren|Krabbe|Pelger|Glanzmann|Tyzzer|Vogt|VKH|PRA|CEA|MDR1|DM|IVDD|BOAS)/;

module.exports = function modeles({ breeds, names, dict }) {
    const nfr = s => s.replace(/ /g, ' ');
    // Nom français (avec ou sans sa parenthèse) → race
    const byName = new Map();
    for (const b of breeds) {
        byName.set(nfr(b.name_fr), b);
        const short = b.name_fr.replace(/\s*\([^)]*\)/, '');
        if (!byName.has(short)) byName.set(short, b);
    }
    const en = n => { const b = byName.get(nfr(n)); return b && names[b.slug] ? names[b.slug] : null; };
    const breedOf = n => byName.get(nfr(n)) || null;
    // Les deux affections citées dans la FAQ, telles que le générateur les écrit, pour chaque race
    const cut = x => x.split(/ \(|, /)[0];
    const ISSUES = new Map();
    for (const b of breeds) {
        const list = (b.health?.common_issues || []).slice(0, 2).map(cut);
        if (list.length) ISSUES.set(nfr(list.map(x => (/^[A-ZÀ-Ý][a-zà-ÿ]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x)).join(' et ')), list);
    }
    // Traduction d'une affection telle que la FAQ la cite : l'entrée de la liste « Santé », coupée comme en français
    const keys = Object.keys(dict);
    const issue = x => {
        const k = x.replace(/&/g, '&amp;');
        if (dict[k] != null) return dict[k];
        const full = keys.find(y => y.startsWith(`${k} (`) || y.startsWith(`${k}, `));
        return full ? dict[full].split(/ \(|, /)[0] : null;
    };
    const NAME = '(.+?)';
    const ART = '(?:[Ll]e |[Ll]’)';
    const num = s => s.replace(',', '.');
    const range = s => {
        const m = nfr(s).match(/^(\d+(?:,\d+)?)(?: à (\d+(?:,\d+)?))? (cm|kg|ans|minutes)$/);
        if (!m) return null;
        const unit = { cm: 'cm', kg: 'kg', ans: 'years', minutes: 'minutes' }[m[3]];
        return m[2] ? `${num(m[1])} to ${num(m[2])} ${unit}` : `${num(m[1])} ${unit}`;
    };
    const ord = n => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
    const lcFirst = t => (PROPER.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
    const sentences = (rest, map) => {
        const parts = rest.trim() ? rest.trim().split(/(?<=\.) (?=[A-ZÉÀ])/) : [];
        const out = parts.map(p => map[nfr(p)] ?? map[p] ?? null);
        return out.includes(null) ? null : out;
    };
    const rules = [
        // Titres de la fiche (le plus complet qui tient dans les 60 caractères affichés par Google)
        [new RegExp(`^${NAME}${SP}: caractère(?:, éducation)?(?:, santé)?(?: et (?:entretien|santé))$`), m => {
            const n = en(m[1]);
            if (!n) return null;
            return [`${n}: temperament, training, health and care`, `${n}: temperament, health and care`, `${n}: temperament and health`].find(t => t.length <= 60) || n;
        }],
        [new RegExp(`^${NAME}${SP}: fiche complète de la race$`), m => en(m[1]) && `${en(m[1])}: full breed profile`],
        [new RegExp(`^${NAME}, chien de race$`), m => en(m[1]) && `${en(m[1])}, purebred dog`],
        // Fil d'Ariane
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3> <g4>›<\/g4><g5>(.+?)<\/g5>$/, m => GROUP[m[1]] && en(m[2]) && `<g1>Dog breeds</g1> <g2>›</g2><g3>${GROUP[m[1]]}</g3> <g4>›</g4><g5>${en(m[2])}</g5>`],
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3>$/, m => en(m[1]) && `<g1>Dog breeds</g1> <g2>›</g2><g3>${en(m[1])}</g3>`],
        // Rang en France
        [new RegExp(`^(<g1>)?(\\d+)(?:re|e)${SP}race en France · ([\\d \\u00a0\\u202f]+) chiots LOF en 2025(</g1>)?$`), m => {
            const r = Number(m[2]), n = Number(m[3].replace(/\D/g, ''));
            const rank = r === 1 ? 'Most popular breed in France' : `${ord(r)} most popular breed in France`;
            return `${m[1] || ''}${rank} · ${n === 1 ? '1 puppy' : `${n.toLocaleString('en-US')} puppies`} registered in 2025 (LOF)${m[4] || ''}`;
        }],
        // Mesures
        [/^\d+(?:,\d+)?(?: à \d+(?:,\d+)?)?[  ](?:cm|kg|ans|minutes)$/, m => range(m[0])],
        [/^(\d+) · (.+)$/, m => GROUP[m[2]] && `${m[1]} · ${GROUP[m[2]]}`],
        [/^(.+) · (.+)$/, m => {
            const o = dict[m[1]];
            return GROUP[m[2]] && o != null ? `${o} · ${GROUP[m[2]]}` : null;
        }],
        // Repères des cartes de sélection
        [/^(Très petit|Petit|Moyen|Grand|Géant) · énergie (.+?) · entretien (.+)$/, m => {
            const e = word('energie', m[2]), c = word('entretien_pelage', m[3]);
            return e && c && `${SIZE[m[1]]} · ${e} energy · ${c} coat care`;
        }],
        // Note avec sa valeur pour les lecteurs d'écran
        [/^(.+?)<g1>, (\d) sur 5<\/g1>$/, m => LEVEL[m[1]] && `${LEVEL[m[1]]}<g1>, ${m[2]} out of 5</g1>`],
        // FAQ
        [new RegExp(`^Questions fréquentes sur ${ART}${NAME}$`), m => en(m[1]) && `${en(m[1])} FAQ`],
        [new RegExp(`^Quelle taille et quel poids pour ${ART}${NAME}${SP}\\?$`), m => en(m[1]) && `How big does the ${en(m[1])} get?`],
        [new RegExp(`^${ART}${NAME} <g1>perd-il</g1> beaucoup de poils${SP}\\?$`), m => en(m[1]) && `Does the ${en(m[1])} shed <g1>a lot?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>peut-il</g1> vivre en appartement${SP}\\?$`), m => en(m[1]) && `Can the ${en(m[1])} live in <g1>an apartment?</g1>`],
        [new RegExp(`^Combien de temps <g1>faut-il</g1> promener ${ART}${NAME}${SP}\\?$`), m => en(m[1]) && `How much exercise does the ${en(m[1])} <g1>need each day?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> adapté aux enfants${SP}\\?$`), m => en(m[1]) && `Is the ${en(m[1])} good <g1>with children?</g1>`],
        [new RegExp(`^Quelle est l’espérance de vie (?:de l’|du )${NAME}${SP}\\?$`), m => en(m[1]) && `How long does the ${en(m[1])} live?`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> un chien catégorisé${SP}\\?$`), m => en(m[1]) && `Is the ${en(m[1])} a restricted dog <g1>in France?</g1>`],
        [new RegExp(`^${ART}${NAME} mesure (.+?)\\. C’est un chien (de [^.]+)\\.$`), m => {
            const n = en(m[1]), size = SIZE_TEXT[m[3]];
            if (!n || !size) return null;
            const p = m[2].match(/^(?:(.+?) au garrot)?(?: pour )?(.+?)?$/);
            const h = p[1] ? range(p[1]) : null, kg = p[2] ? range(p[2]) : null;
            if ((p[1] && !h) || (p[2] && !kg)) return null;
            const body = h && kg ? `stands ${h} at the withers and weighs ${kg}` : h ? `stands ${h} at the withers` : `weighs ${kg}`;
            return `The ${n} ${body}. It is a ${size} dog.`;
        }],
        [new RegExp(`^Sa perte de poils est (.+?) et l’entretien de son poil est (.+?)\\.(.*)$`), m => {
            const i = W.perte_poils[0].indexOf(m[1]), j = W.entretien_pelage[0].indexOf(m[2]);
            const rest = sentences(m[3], EXTRA);
            return i < 0 || j < 0 || !rest ? null : [`${W.perte_poils[1][i]} and ${COAT_CARE[j]}.`, ...rest].join(' ');
        }],
        [/^(.+?\.)((?: .+)?)$/, m => {
            const a = APART[nfr(m[1])] ?? APART[m[1]] ?? KIDS[nfr(m[1])] ?? KIDS[m[1]];
            const rest = sentences(m[2], EXTRA);
            return a && rest ? [a, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Comptez environ (\\d+)${SP}minutes d’activité par jour, pour une énergie (.+?)\\.(.*)$`), m => {
            const e = word('energie', m[2]), rest = sentences(m[3], EXTRA);
            return e && rest ? [`Allow about ${m[1]} minutes of activity a day: its energy is ${e}.`, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Elle est de (.+?), pour une robustesse (.+?)\\.(?: Les problèmes de santé à surveiller en priorité${SP}: (.+)\\.)?$`), m => {
            const life = range(m[1]), r = word('robustesse', m[2]);
            if (!life || !r) return null;
            let out = `Life expectancy is ${life}, and its hardiness is ${r}.`;
            if (m[3]) {
                // Les deux affections citées : leur traduction vient de la liste « Santé » de la fiche
                const issues = ISSUES.get(nfr(m[3]));
                const tr = (issues || []).map(issue);
                if (!issues || tr.some(t => t == null)) return null;
                out += ` The main health problems to watch for are ${tr.map(t => lcFirst(t.replace(/<\/?[gx]\d+\/?>/g, ''))).join(' and ')}.`;
            }
            return out;
        }],
        [new RegExp(`^Espérance de vie de (.+?), robustesse (.+?)\\.( Les affections les plus fréquentes dans la race${SP}:)?$`), m => {
            const life = range(m[1]), r = word('robustesse', m[2]);
            return life && r ? `Life expectancy is ${life}, and its hardiness is ${r}.${m[3] ? ' The most common health problems in the breed:' : ''}` : null;
        }],
        [/^Même gabarit et notes voisines\. <g1>Toutes les races du groupe (.+?)<x2\/><\/g1>$/, m => GROUP[m[1]] && `Same size and similar ratings. <g1>All ${GROUP[m[1]].charAt(0).toLowerCase() + GROUP[m[1]].slice(1)}<x2/></g1>`]
    ];
    // Badges en tête de fiche, posés côte à côte : chacun se traduit seul
    rules.push([/^(?:<g\d+>[^<]*<\/g\d+>){2,}$/, m => {
        const out = m[0].replace(/<g(\d+)>([^<]*)<\/g\1>/g, (x, i, inner) => {
            const t = apply(inner) ?? dict[inner];
            return t == null ? '\u0000' : `<g${i}>${t}</g${i}>`;
        });
        return out.includes('\u0000') ? null : out;
    }]);
    function apply(key) {
        for (const [re, fn] of rules) {
            const m = key.match(re);
            if (!m) continue;
            const t = fn(m, key);
            if (t) return t;
        }
        return null;
    }
    return apply;
};
