/**
 * i18n/pt/modeles.cjs
 * Phrases types des fiches en portugais du Brésil, traduites par modèle (voir i18n/en/modeles.cjs pour le principe).
 * Les races sont au masculin (o cachorro) : « o Golden Retriever », « do Beagle ».
 *
 * Exporte (ctx) => (clé) => traduction ou null. ctx = { breeds, names, dict }.
 */

const SP = '[ \\u00a0]';
const NB = '\u00a0';

const FR_LEVELS = {
    energie: ['très calme', 'calme', 'modérée', 'élevée', 'débordante'],
    robustesse: ['fragile', 'plutôt fragile', 'moyenne', 'bonne', 'excellente'],
    perte_poils: ['quasi nulle', 'faible', 'modérée', 'forte', 'très forte'],
    entretien_pelage: ['minimal', 'faible', 'moyen', 'important', 'très important']
};
const level = (k, fr) => FR_LEVELS[k].indexOf(fr);

const BY_K = {
    energie: ['Muito baixa', 'Baixa', 'Moderada', 'Alta', 'Inesgotável'], appartement: ['Impossível', 'Difícil', 'Possível', 'Bom', 'Perfeito'],
    solitude: ['Muito mal', 'Mal', 'Algumas horas', 'Bem', 'Muito bem'], enfants: ['Evitar', 'Cautela', 'Razoável', 'Bom', 'Excelente'],
    chiens: ['Evitar', 'Cautela', 'Razoável', 'Bom', 'Excelente'], chats: ['Evitar', 'Cautela', 'Razoável', 'Bom', 'Excelente'],
    inconnus: ['Muito desconfiado', 'Reservado', 'Educado', 'Aberto', 'Muito aberto'], education: ['Muito difícil', 'Difícil', 'Média', 'Fácil', 'Muito fácil'],
    premier_chien: ['Desaconselhado', 'Pouco adequado', 'Possível', 'Adequado', 'Ideal'], garde: ['Nulo', 'Baixo', 'Moderado', 'Marcado', 'Muito marcado'],
    instinct_chasse: ['Muito baixo', 'Baixo', 'Moderado', 'Forte', 'Muito forte'], fugue: ['Muito baixa', 'Baixa', 'Moderada', 'Alta', 'Muito alta'],
    entretien_pelage: ['Mínimo', 'Baixo', 'Médio', 'Alto', 'Muito alto'], perte_poils: ['Quase nenhuma', 'Baixa', 'Moderada', 'Alta', 'Muito alta'],
    bave: ['Nunca', 'Raramente', 'Um pouco', 'Com frequência', 'Muito'], aboiements: ['Muito discreto', 'Discreto', 'Moderados', 'Frequentes', 'Late muito'],
    chaleur: ['Muito baixa', 'Baixa', 'Média', 'Boa', 'Excelente'], froid: ['Muito baixa', 'Baixa', 'Média', 'Boa', 'Excelente'],
    robustesse: ['Frágil', 'Um pouco frágil', 'Média', 'Boa', 'Excelente']
};
const LEVEL = {
    'Très calme': 'Muito baixa', Calme: 'Baixa', 'Modérée': 'Moderada', 'Élevée': 'Alta', 'Débordante': 'Inesgotável',
    Impossible: 'Impossível', Difficile: 'Difícil', Possible: 'Possível', Bien: 'Bem', Parfait: 'Perfeito',
    'Très mal': 'Muito mal', Mal: 'Mal', 'Quelques heures': 'Algumas horas', 'Très bien': 'Muito bem',
    'À éviter': 'Evitar', Prudence: 'Cautela', Correct: 'Razoável', Bon: 'Bom', Excellent: 'Excelente',
    'Très méfiant': 'Muito desconfiado', 'Réservé': 'Reservado', Poli: 'Educado', Ouvert: 'Aberto', 'Très ouvert': 'Muito aberto',
    'Très difficile': 'Muito difícil', Moyenne: 'Média', Facile: 'Fácil', 'Très facile': 'Muito fácil',
    'Déconseillé': 'Desaconselhado', 'Peu adapté': 'Pouco adequado', 'Bien adapté': 'Adequado', 'Idéal': 'Ideal',
    Nul: 'Nulo', Faible: 'Baixo', 'Modéré': 'Moderado', 'Marqué': 'Marcado', 'Très marqué': 'Muito marcado',
    'Très faible': 'Muito baixo', Fort: 'Forte', 'Très fort': 'Muito forte', Forte: 'Alta', 'Très forte': 'Muito alta',
    Minimal: 'Mínimo', Moyen: 'Médio', Important: 'Alto', 'Très important': 'Muito alto', 'Quasi nulle': 'Quase nenhuma',
    Jamais: 'Nunca', Rarement: 'Raramente', 'Un peu': 'Um pouco', Souvent: 'Com frequência', Beaucoup: 'Muito',
    'Très discret': 'Muito discreto', Discret: 'Discreto', 'Modérés': 'Moderados', 'Fréquents': 'Frequentes', 'Très bavard': 'Late muito',
    Bonne: 'Boa', Excellente: 'Excelente', Fragile: 'Frágil', 'Plutôt fragile': 'Um pouco frágil'
};
const ENERGY_SAID = ['é um cachorro muito calmo', 'é um cachorro calmo', 'a energia dele é moderada', 'a energia dele é alta', 'a energia dele é inesgotável'];
const ENERGY_CARD = ['muito calmo', 'calmo', 'energia moderada', 'energia alta', 'energia inesgotável'];
const HARDY_SAID = ['é uma raça frágil', 'é uma raça um pouco frágil', 'a robustez é média', 'é uma raça robusta', 'é uma raça muito robusta'];
const SHED_SAID = ['Quase não solta pelo', 'Solta pouco pelo', 'Solta uma quantidade moderada de pelo', 'Solta muito pelo', 'Solta muitíssimo pelo'];
const COAT_CARE = ['a pelagem exige cuidados mínimos', 'a pelagem exige poucos cuidados', 'a pelagem exige cuidados normais', 'a pelagem exige bastante cuidado', 'a pelagem exige muitos cuidados'];
const CARE_CARD = ['mínimos', 'baixos', 'médios', 'altos', 'muito altos'];
const SIZE = { 'Très petit': 'Muito pequeno', Petit: 'Pequeno', Moyen: 'Médio', Grand: 'Grande', 'Géant': 'Gigante' };
const SIZE_TEXT = { 'de très petite taille': 'de porte muito pequeno', 'de petite taille': 'de porte pequeno', 'de taille moyenne': 'de porte médio', 'de grande taille': 'de porte grande', 'de taille géante': 'de porte gigante' };
const GROUP = {
    'Bergers et bouviers': 'Cães pastores e boiadeiros', 'Molosses, pinschers et bouviers suisses': 'Pinschers e schnauzers, molossos e boiadeiros suíços',
    Terriers: 'Terriers', Teckels: 'Dachshunds', 'Spitz et chiens primitifs': 'Spitz e cães do tipo primitivo', 'Chiens courants': 'Sabujos e cães de busca',
    "Chiens d'arrêt": 'Cães de aponte', "Rapporteurs, leveurs et chiens d'eau": 'Retrievers, levantadores e cães d’água',
    'Chiens de compagnie': 'Cães de companhia', 'Lévriers': 'Lebréis'
};
const APART = {
    'Oui, très bien : calme à l’intérieur, il s’adapte parfaitement à un appartement.': 'Sim, muito bem: calmo dentro de casa, ele se adapta perfeitamente a um apartamento.',
    'Oui, s’il sort plusieurs fois par jour : il s’adapte bien à un logement sans jardin.': 'Sim, desde que saia várias vezes por dia: ele se adapta bem a uma casa sem quintal.',
    'C’est possible, à condition de lui offrir de vraies sorties chaque jour ; un jardin reste un plus.': 'É possível, desde que tenha passeios de verdade todos os dias; um quintal continua sendo uma vantagem.',
    'C’est difficile : il a besoin d’espace et d’activité, un logement avec jardin lui convient mieux.': 'É difícil: ele precisa de espaço e atividade, e uma casa com quintal é mais adequada.',
    'Ce n’est pas recommandé : il lui faut de l’espace, idéalement une maison avec jardin.': 'Não é recomendado: ele precisa de espaço, de preferência uma casa com quintal.'
};
const KIDS = {
    'Oui : patient et doux, c’est un excellent chien de famille, même avec de jeunes enfants.': 'Sim: paciente e carinhoso, é um excelente cachorro de família, mesmo com crianças pequenas.',
    'Oui, il s’entend bien avec les enfants qui le respectent.': 'Sim, ele se dá bem com crianças que o respeitam.',
    'Correctement, plutôt avec des enfants assez grands pour respecter ses limites.': 'Razoavelmente bem, de preferência com crianças grandes o bastante para respeitar os limites dele.',
    'Avec prudence : il tolère mal l’agitation des jeunes enfants.': 'Com cautela: ele tolera mal a agitação das crianças pequenas.',
    'Il est déconseillé avec de jeunes enfants.': 'Não é recomendado para famílias com crianças pequenas.'
};
const EXTRA = {
    'Attention au voisinage : il aboie volontiers.': 'Atenção com os vizinhos: ele late com facilidade.',
    'Ne laissez jamais un jeune enfant seul avec un chien, quelle que soit sa race.': 'Nunca deixe uma criança pequena sozinha com um cachorro, seja qual for a raça.',
    'Ajoutez des jeux et des exercices d’éducation pour occuper aussi sa tête.': 'Inclua brincadeiras e exercícios de adestramento para ocupar também a cabeça dele.',
    'Il fait partie des races qui perdent très peu de poils, souvent mieux tolérées par les personnes allergiques, sans garantie : passez du temps avec la race avant de vous décider.': 'Faz parte das raças que soltam muito pouco pelo e costumam ser mais bem toleradas por pessoas alérgicas, sem garantia: passe um tempo com a raça antes de decidir.',
    'Prévoyez un brossage plusieurs fois par semaine, et davantage pendant les mues de printemps et d’automne.': 'Escove várias vezes por semana, e mais durante as trocas de pelo da primavera e do outono.',
    'Son poil demande un toilettage régulier, parfois chez un professionnel.': 'O pelo precisa de cuidados regulares, às vezes com banho e tosa profissional.'
};
const PROPER = /^(Addison|Cushing|Legg|Von|Willebrand|Wobbler|Horner|Chiari|Ehlers|Stockard|Lyme|Lafora|Fanconi|Sjögren|Krabbe|Vogt|VKH|PRA|MDR1|IVDD)/;

module.exports = function modeles({ breeds, names, dict }) {
    const nfr = s => s.replace(/ /g, ' ');
    const byName = new Map();
    for (const b of breeds) {
        byName.set(nfr(b.name_fr), b);
        const short = b.name_fr.replace(/\s*\([^)]*\)/, '');
        if (!byName.has(short)) byName.set(short, b);
    }
    const pt = n => { const b = byName.get(nfr(n)); return b && names[b.slug] ? names[b.slug] : null; };
    const cut = x => x.split(/ \(|, /)[0];
    const ISSUES = new Map();
    for (const b of breeds) {
        const list = (b.health?.common_issues || []).slice(0, 2).map(cut);
        if (list.length) ISSUES.set(nfr(list.map(x => (/^[A-ZÀ-Ý][a-zà-ÿ]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x)).join(' et ')), list);
    }
    const keys = Object.keys(dict);
    const issue = x => {
        const k = x.replace(/&/g, '&amp;');
        if (dict[k] != null) return dict[k];
        const full = keys.find(y => y.startsWith(`${k} (`) || y.startsWith(`${k}, `));
        return full ? dict[full].split(/ \(|, /)[0] : null;
    };
    const NAME = '(.+?)';
    const ART = '(?:[Ll]e |[Ll]’)';
    // « 58 à 70 cm » → « 58 a 70 cm » (valeur seule) ou « de 58 a 70 cm » (dans une phrase)
    const range = (s, de = false) => {
        const m = nfr(s).match(/^(\d+(?:,\d+)?)(?: à (\d+(?:,\d+)?))? (cm|kg|ans|minutes)$/);
        if (!m) return null;
        const unit = { cm: 'cm', kg: 'kg', ans: 'anos', minutes: 'minutos' }[m[3]];
        return m[2] ? `${de ? 'de ' : ''}${m[1]} a ${m[2]}${NB}${unit}` : `${m[1]}${NB}${unit}`;
    };
    const lifeDe = s => { const l = range(s, true); return l && (l.startsWith('de ') ? l : `de ${l}`); };
    const lcFirst = t => (PROPER.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
    const and = (a, b) => `${a} e ${b}`;
    const sentences = (rest, map) => {
        const parts = rest.trim() ? rest.trim().split(/(?<=\.) (?=[A-ZÉÀ])/) : [];
        const out = parts.map(p => map[nfr(p)] ?? map[p] ?? null);
        return out.includes(null) ? null : out;
    };
    const rules = [
        [new RegExp(`^${NAME}${SP}: caractère(?:, éducation)?(?:, santé)?(?: et (?:entretien|santé))$`), m => {
            const n = pt(m[1]);
            if (!n) return null;
            return [`${n}: temperamento, adestramento, saúde e cuidados`, `${n}: temperamento, saúde e cuidados`, `${n}: temperamento e saúde`].find(t => t.length <= 60) || n;
        }],
        [new RegExp(`^${NAME}${SP}: fiche complète de la race$`), m => pt(m[1]) && `${pt(m[1])}: ficha completa da raça`],
        [new RegExp(`^${NAME}, chien de race$`), m => pt(m[1]) && `${pt(m[1])}, cachorro de raça`],
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3> <g4>›<\/g4><g5>(.+?)<\/g5>$/, m => GROUP[m[1]] && pt(m[2]) && `<g1>Raças de cachorro</g1> <g2>›</g2><g3>${GROUP[m[1]]}</g3> <g4>›</g4><g5>${pt(m[2])}</g5>`],
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3>$/, m => pt(m[1]) && `<g1>Raças de cachorro</g1> <g2>›</g2><g3>${pt(m[1])}</g3>`],
        [new RegExp(`^(<g1>)?(\\d+)(?:re|e)${SP}race en France · ([\\d \\u00a0\\u202f]+) chiots LOF en 2025(</g1>)?$`), m => {
            const r = Number(m[2]), n = Number(m[3].replace(/\D/g, ''));
            const rank = r === 1 ? 'A raça mais popular da França' : `${r}ª raça mais popular da França`;
            return `${m[1] || ''}${rank} · ${n === 1 ? '1 filhote registrado' : `${n.toLocaleString('pt-BR')} filhotes registrados`} em 2025 (LOF)${m[4] || ''}`;
        }],
        [/^\d+(?:,\d+)?(?: à \d+(?:,\d+)?)?[  ](?:cm|kg|ans|minutes)$/, m => range(m[0])],
        [/^(\d+) · (.+)$/, m => GROUP[m[2]] && `${m[1]} · ${GROUP[m[2]]}`],
        [/^(.+) · (.+)$/, m => {
            const o = dict[m[1]];
            return GROUP[m[2]] && o != null ? `${o} · ${GROUP[m[2]]}` : null;
        }],
        [/^(Très petit|Petit|Moyen|Grand|Géant) · énergie (.+?) · entretien (.+)$/, m => {
            const e = level('energie', m[2]), c = level('entretien_pelage', m[3]);
            return e >= 0 && c >= 0 && `${SIZE[m[1]]} · ${ENERGY_CARD[e]} · cuidados ${CARE_CARD[c]}`;
        }],
        [/^([a-z_]+)§.+?<g1>, (\d) sur 5<\/g1>$/, m => BY_K[m[1]] && `${BY_K[m[1]][m[2] - 1]}<g1>, ${m[2]} de 5</g1>`],
        [/^(.+?)<g1>, (\d) sur 5<\/g1>$/, m => LEVEL[m[1]] && `${LEVEL[m[1]]}<g1>, ${m[2]} de 5</g1>`],
        // FAQ
        [new RegExp(`^Questions fréquentes sur ${ART}${NAME}$`), m => pt(m[1]) && `Perguntas frequentes sobre o ${pt(m[1])}`],
        [new RegExp(`^Quelle taille et quel poids pour ${ART}${NAME}${SP}\\?$`), m => pt(m[1]) && `Qual é o tamanho e o peso do ${pt(m[1])}?`],
        [new RegExp(`^${ART}${NAME} <g1>perd-il</g1> beaucoup de poils${SP}\\?$`), m => pt(m[1]) && `O ${pt(m[1])} solta muito <g1>pelo?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>peut-il</g1> vivre en appartement${SP}\\?$`), m => pt(m[1]) && `O ${pt(m[1])} pode viver em <g1>apartamento?</g1>`],
        [new RegExp(`^Combien de temps <g1>faut-il</g1> promener ${ART}${NAME}${SP}\\?$`), m => pt(m[1]) && `Quanto exercício o ${pt(m[1])} precisa <g1>por dia?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> adapté aux enfants${SP}\\?$`), m => pt(m[1]) && `O ${pt(m[1])} se dá bem <g1>com crianças?</g1>`],
        [new RegExp(`^Quelle est l’espérance de vie (?:de l’|du )${NAME}${SP}\\?$`), m => pt(m[1]) && `Quantos anos vive o ${pt(m[1])}?`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> un chien catégorisé${SP}\\?$`), m => pt(m[1]) && `O ${pt(m[1])} é considerado perigoso <g1>na França?</g1>`],
        [new RegExp(`^${ART}${NAME} mesure (.+?)\\. C’est un chien (de [^.]+)\\.$`), m => {
            const n = pt(m[1]), size = SIZE_TEXT[m[3]];
            if (!n || !size) return null;
            const p = m[2].match(/^(?:(.+?) au garrot)?(?: pour )?(.+?)?$/);
            const h = p[1] ? range(p[1], true) : null, kg = p[2] ? range(p[2], true) : null;
            if ((p[1] && !h) || (p[2] && !kg)) return null;
            const body = h && kg ? `mede ${h} na cernelha e pesa ${kg}` : h ? `mede ${h} na cernelha` : `pesa ${kg}`;
            return `O ${n} ${body}. É um cachorro ${size}.`;
        }],
        [new RegExp(`^Sa perte de poils est (.+?) et l’entretien de son poil est (.+?)\\.(.*)$`), m => {
            const i = level('perte_poils', m[1]), j = level('entretien_pelage', m[2]);
            const rest = sentences(m[3], EXTRA);
            return i < 0 || j < 0 || !rest ? null : [`${SHED_SAID[i]} e ${COAT_CARE[j]}.`, ...rest].join(' ');
        }],
        [/^(.+?\.)((?: .+)?)$/, m => {
            const a = APART[nfr(m[1])] ?? APART[m[1]] ?? KIDS[nfr(m[1])] ?? KIDS[m[1]];
            const rest = sentences(m[2], EXTRA);
            return a && rest ? [a, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Comptez environ (\\d+)${SP}minutes d’activité par jour, pour une énergie (.+?)\\.(.*)$`), m => {
            const e = level('energie', m[2]), rest = sentences(m[3], EXTRA);
            return e >= 0 && rest ? [`Conte com cerca de ${m[1]}${NB}minutos de atividade por dia: ${ENERGY_SAID[e]}.`, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Elle est de (.+?), pour une robustesse (.+?)\\.(?: Les problèmes de santé à surveiller en priorité${SP}: (.+)\\.)?$`), m => {
            const life = lifeDe(m[1]), r = level('robustesse', m[2]);
            if (!life || r < 0) return null;
            let out = `A expectativa de vida é ${life} e ${HARDY_SAID[r]}.`;
            if (m[3]) {
                const issues = ISSUES.get(nfr(m[3]));
                const tr = (issues || []).map(issue);
                if (!issues || tr.some(t => t == null)) return null;
                const named = tr.map(t => lcFirst(t.replace(/<\/?[gx]\d+\/?>/g, '')));
                const list = named.length < 2 ? named[0] : named.some(x => / e /.test(x)) ? `${named[0]}, além de ${named[1]}` : and(named[0], named[1]);
                // Liste après deux-points : pas d'article à accorder avec chaque maladie
                out += ` Problemas de saúde que merecem atenção especial: ${list}.`;
            }
            return out;
        }],
        [new RegExp(`^Espérance de vie de (.+?), robustesse (.+?)\\.( Les affections les plus fréquentes dans la race${SP}:)?$`), m => {
            const life = lifeDe(m[1]), r = level('robustesse', m[2]);
            return life && r >= 0 ? `A expectativa de vida é ${life} e ${HARDY_SAID[r]}.${m[3] ? ' As doenças mais comuns na raça:' : ''}` : null;
        }],
        [/^Même gabarit et notes voisines\. <g1>Toutes les races du groupe (.+?)<x2\/><\/g1>$/, m => GROUP[m[1]] && `Mesmo porte e notas parecidas. <g1>Todos os ${GROUP[m[1]].charAt(0).toLowerCase() + GROUP[m[1]].slice(1)}<x2/></g1>`]
    ];
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
