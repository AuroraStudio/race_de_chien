/**
 * i18n/es/modeles.cjs
 * Phrases types des fiches en espagnol, traduites par modèle (voir i18n/en/modeles.cjs pour le principe) :
 * titres, fil d'Ariane, rang en France, mesures, notes, questions et réponses de la FAQ, santé.
 *
 * Exporte (ctx) => (clé) => traduction ou null. ctx = { breeds, names: { slug: nom espagnol }, dict }.
 */

const SP = '[ \\u00a0]';
const NB = ' ';

// Mots des notes en français (minuscules, comme dans les phrases), pour retrouver le niveau 1 à 5
const FR_LEVELS = {
    energie: ['très calme', 'calme', 'modérée', 'élevée', 'débordante'],
    robustesse: ['fragile', 'plutôt fragile', 'moyenne', 'bonne', 'excellente'],
    perte_poils: ['quasi nulle', 'faible', 'modérée', 'forte', 'très forte'],
    entretien_pelage: ['minimal', 'faible', 'moyen', 'important', 'très important']
};
const level = (k, fr) => FR_LEVELS[k].indexOf(fr);

// Mots de chaque critère, de la note 1 à 5 (guide.md)
const BY_K = {
    energie: ['Muy baja', 'Baja', 'Moderada', 'Alta', 'Desbordante'], appartement: ['Imposible', 'Difícil', 'Posible', 'Bien', 'Perfecto'],
    solitude: ['Muy mal', 'Mal', 'Unas horas', 'Bien', 'Muy bien'], enfants: ['Evitar', 'Precaución', 'Correcto', 'Bueno', 'Excelente'],
    chiens: ['Evitar', 'Precaución', 'Correcto', 'Bueno', 'Excelente'], chats: ['Evitar', 'Precaución', 'Correcto', 'Bueno', 'Excelente'],
    inconnus: ['Muy desconfiado', 'Reservado', 'Educado', 'Abierto', 'Muy abierto'], education: ['Muy difícil', 'Difícil', 'Media', 'Fácil', 'Muy fácil'],
    premier_chien: ['Desaconsejado', 'Poco adecuado', 'Posible', 'Adecuado', 'Ideal'], garde: ['Nulo', 'Bajo', 'Moderado', 'Marcado', 'Muy marcado'],
    instinct_chasse: ['Muy bajo', 'Bajo', 'Moderado', 'Fuerte', 'Muy fuerte'], fugue: ['Muy baja', 'Baja', 'Moderada', 'Alta', 'Muy alta'],
    entretien_pelage: ['Mínimo', 'Bajo', 'Medio', 'Alto', 'Muy alto'], perte_poils: ['Casi nula', 'Baja', 'Moderada', 'Alta', 'Muy alta'],
    bave: ['Nunca', 'Rara vez', 'Un poco', 'A menudo', 'Mucho'], aboiements: ['Muy discreto', 'Discreto', 'Moderados', 'Frecuentes', 'Muy ladrador'],
    chaleur: ['Muy baja', 'Baja', 'Media', 'Buena', 'Excelente'], froid: ['Muy baja', 'Baja', 'Media', 'Buena', 'Excelente'],
    robustesse: ['Frágil', 'Algo frágil', 'Media', 'Buena', 'Excelente']
};
// Mot seul d'une note dont on ne connaît pas le critère
const LEVEL = {
    'Très calme': 'Muy baja', Calme: 'Baja', 'Modérée': 'Moderada', 'Élevée': 'Alta', 'Débordante': 'Desbordante',
    Impossible: 'Imposible', Difficile: 'Difícil', Possible: 'Posible', Bien: 'Bien', Parfait: 'Perfecto',
    'Très mal': 'Muy mal', Mal: 'Mal', 'Quelques heures': 'Unas horas', 'Très bien': 'Muy bien',
    'À éviter': 'Evitar', Prudence: 'Precaución', Correct: 'Correcto', Bon: 'Bueno', Excellent: 'Excelente',
    'Très méfiant': 'Muy desconfiado', 'Réservé': 'Reservado', Poli: 'Educado', Ouvert: 'Abierto', 'Très ouvert': 'Muy abierto',
    'Très difficile': 'Muy difícil', Moyenne: 'Media', Facile: 'Fácil', 'Très facile': 'Muy fácil',
    'Déconseillé': 'Desaconsejado', 'Peu adapté': 'Poco adecuado', 'Bien adapté': 'Adecuado', 'Idéal': 'Ideal',
    Nul: 'Nulo', Faible: 'Bajo', 'Modéré': 'Moderado', 'Marqué': 'Marcado', 'Très marqué': 'Muy marcado',
    'Très faible': 'Muy bajo', Fort: 'Fuerte', 'Très fort': 'Muy fuerte', Forte: 'Alta', 'Très forte': 'Muy alta',
    Minimal: 'Mínimo', Moyen: 'Medio', Important: 'Alto', 'Très important': 'Muy alto', 'Quasi nulle': 'Casi nula',
    Jamais: 'Nunca', Rarement: 'Rara vez', 'Un peu': 'Un poco', Souvent: 'A menudo', Beaucoup: 'Mucho',
    'Très discret': 'Muy discreto', Discret: 'Discreto', 'Modérés': 'Moderados', 'Fréquents': 'Frecuentes', 'Très bavard': 'Muy ladrador',
    Bonne: 'Buena', Excellente: 'Excelente', Fragile: 'Frágil', 'Plutôt fragile': 'Algo frágil'
};
// L'énergie, la robustesse, le poil dits en phrase, du niveau 1 au niveau 5
const ENERGY_SAID = ['es un perro muy tranquilo', 'es un perro tranquilo', 'su energía es moderada', 'su energía es alta', 'su energía es desbordante'];
const ENERGY_CARD = ['muy tranquilo', 'tranquilo', 'energía moderada', 'energía alta', 'energía desbordante'];
const HARDY_SAID = ['es una raza frágil', 'es una raza algo frágil', 'su robustez es media', 'es una raza robusta', 'es una raza muy robusta'];
const SHED_SAID = ['Casi no suelta pelo', 'Suelta poco pelo', 'Suelta una cantidad moderada de pelo', 'Suelta mucho pelo', 'Suelta muchísimo pelo'];
const COAT_CARE = ['su pelaje necesita cuidados mínimos', 'su pelaje necesita pocos cuidados', 'su pelaje necesita cuidados normales', 'su pelaje necesita bastantes cuidados', 'su pelaje necesita muchos cuidados'];
const CARE_CARD = ['mínimo', 'bajo', 'medio', 'alto', 'muy alto'];
const SIZE = { 'Très petit': 'Muy pequeño', Petit: 'Pequeño', Moyen: 'Mediano', Grand: 'Grande', 'Géant': 'Gigante' };
const SIZE_TEXT = { 'de très petite taille': 'muy pequeño', 'de petite taille': 'pequeño', 'de taille moyenne': 'de tamaño mediano', 'de grande taille': 'grande', 'de taille géante': 'gigante' };
const GROUP = {
    'Bergers et bouviers': 'Perros pastores y boyeros', 'Molosses, pinschers et bouviers suisses': 'Pinscher y schnauzer, molosos y boyeros suizos',
    Terriers: 'Terriers', Teckels: 'Teckels', 'Spitz et chiens primitifs': 'Spitz y perros de tipo primitivo', 'Chiens courants': 'Sabuesos y perros de rastro',
    "Chiens d'arrêt": 'Perros de muestra', "Rapporteurs, leveurs et chiens d'eau": 'Cobradores, levantadores y perros de agua',
    'Chiens de compagnie': 'Perros de compañía', 'Lévriers': 'Lebreles'
};
const APART = {
    'Oui, très bien : calme à l’intérieur, il s’adapte parfaitement à un appartement.': 'Sí, muy bien: tranquilo en casa, se adapta perfectamente a un apartamento.',
    'Oui, s’il sort plusieurs fois par jour : il s’adapte bien à un logement sans jardin.': 'Sí, siempre que salga varias veces al día: se adapta bien a una vivienda sin jardín.',
    'C’est possible, à condition de lui offrir de vraies sorties chaque jour ; un jardin reste un plus.': 'Es posible, siempre que tenga salidas de verdad todos los días; un jardín sigue siendo una ventaja.',
    'C’est difficile : il a besoin d’espace et d’activité, un logement avec jardin lui convient mieux.': 'Es difícil: necesita espacio y actividad, y le conviene más una casa con jardín.',
    'Ce n’est pas recommandé : il lui faut de l’espace, idéalement une maison avec jardin.': 'No es recomendable: necesita espacio, idealmente una casa con jardín.'
};
const KIDS = {
    'Oui : patient et doux, c’est un excellent chien de famille, même avec de jeunes enfants.': 'Sí: paciente y cariñoso, es un excelente perro de familia, incluso con niños pequeños.',
    'Oui, il s’entend bien avec les enfants qui le respectent.': 'Sí, se lleva bien con los niños que lo respetan.',
    'Correctement, plutôt avec des enfants assez grands pour respecter ses limites.': 'Se lleva bastante bien con ellos, sobre todo si son lo bastante mayores para respetar sus límites.',
    'Avec prudence : il tolère mal l’agitation des jeunes enfants.': 'Con precaución: tolera mal el bullicio de los niños pequeños.',
    'Il est déconseillé avec de jeunes enfants.': 'No se recomienda con niños pequeños.'
};
const EXTRA = {
    'Attention au voisinage : il aboie volontiers.': 'Cuidado con los vecinos: ladra con facilidad.',
    'Ne laissez jamais un jeune enfant seul avec un chien, quelle que soit sa race.': 'Nunca dejes a un niño pequeño solo con un perro, sea de la raza que sea.',
    'Ajoutez des jeux et des exercices d’éducation pour occuper aussi sa tête.': 'Añade juegos y ejercicios de adiestramiento para que también ejercite la mente.',
    'Il fait partie des races qui perdent très peu de poils, souvent mieux tolérées par les personnes allergiques, sans garantie : passez du temps avec la race avant de vous décider.': 'Es una de las razas que sueltan muy poco pelo y que las personas alérgicas suelen tolerar mejor, sin garantía: pasa tiempo con la raza antes de decidirte.',
    'Prévoyez un brossage plusieurs fois par semaine, et davantage pendant les mues de printemps et d’automne.': 'Cepíllalo varias veces por semana, y más durante las mudas de primavera y otoño.',
    'Son poil demande un toilettage régulier, parfois chez un professionnel.': 'Su pelo necesita un aseo regular, a veces en una peluquería canina.'
};
// Noms propres en tête d'une maladie : on garde la majuscule
const PROPER = /^(Addison|Cushing|Legg|Von|Willebrand|Wobbler|Horner|Chiari|Ehlers|Stockard|Lyme|Lafora|Fanconi|Sjögren|Krabbe|Vogt|VKH|PRA|MDR1|IVDD)/;

module.exports = function modeles({ breeds, names, dict }) {
    const nfr = s => s.replace(/ /g, ' ');
    const byName = new Map();
    for (const b of breeds) {
        byName.set(nfr(b.name_fr), b);
        const short = b.name_fr.replace(/\s*\([^)]*\)/, '');
        if (!byName.has(short)) byName.set(short, b);
    }
    const es = n => { const b = byName.get(nfr(n)); return b && names[b.slug] ? names[b.slug] : null; };
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
        const unit = { cm: 'cm', kg: 'kg', ans: 'años', minutes: 'minutos' }[m[3]];
        return m[2] ? `${de ? 'de ' : ''}${m[1]} a ${m[2]}${NB}${unit}` : `${m[1]}${NB}${unit}`;
    };
    const lifeDe = s => { const l = range(s, true); return l && (l.startsWith('de ') ? l : `de ${l}`); };
    const lcFirst = t => (PROPER.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
    // « y » devient « e » devant un son « i » (hipotiroidismo, insuficiencia)
    const and = (a, b) => `${a} ${/^(h?i)(?![aeiouáéíóú])/i.test(b) ? 'e' : 'y'} ${b}`;
    const sentences = (rest, map) => {
        const parts = rest.trim() ? rest.trim().split(/(?<=\.) (?=[A-ZÉÀ])/) : [];
        const out = parts.map(p => map[nfr(p)] ?? map[p] ?? null);
        return out.includes(null) ? null : out;
    };
    const rules = [
        [new RegExp(`^${NAME}${SP}: caractère(?:, éducation)?(?:, santé)?(?: et (?:entretien|santé))$`), m => {
            const n = es(m[1]);
            if (!n) return null;
            return [`${n}: carácter, educación, salud y cuidados`, `${n}: carácter, salud y cuidados`, `${n}: carácter y salud`].find(t => t.length <= 60) || n;
        }],
        [new RegExp(`^${NAME}${SP}: fiche complète de la race$`), m => es(m[1]) && `${es(m[1])}: ficha completa de la raza`],
        [new RegExp(`^${NAME}, chien de race$`), m => es(m[1]) && `${es(m[1])}, perro de raza`],
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3> <g4>›<\/g4><g5>(.+?)<\/g5>$/, m => GROUP[m[1]] && es(m[2]) && `<g1>Razas de perros</g1> <g2>›</g2><g3>${GROUP[m[1]]}</g3> <g4>›</g4><g5>${es(m[2])}</g5>`],
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3>$/, m => es(m[1]) && `<g1>Razas de perros</g1> <g2>›</g2><g3>${es(m[1])}</g3>`],
        [new RegExp(`^(<g1>)?(\\d+)(?:re|e)${SP}race en France · ([\\d \\u00a0\\u202f]+) chiots LOF en 2025(</g1>)?$`), m => {
            const r = Number(m[2]), n = Number(m[3].replace(/\D/g, ''));
            const rank = r === 1 ? 'La raza más popular en Francia' : `${r}.ª raza más popular en Francia`;
            return `${m[1] || ''}${rank} · ${n === 1 ? '1 cachorro inscrito' : `${n.toLocaleString('es-ES')} cachorros inscritos`} en 2025 (LOF)${m[4] || ''}`;
        }],
        [/^\d+(?:,\d+)?(?: à \d+(?:,\d+)?)?[  ](?:cm|kg|ans|minutes)$/, m => range(m[0])],
        [/^(\d+) · (.+)$/, m => GROUP[m[2]] && `${m[1]} · ${GROUP[m[2]]}`],
        [/^(.+) · (.+)$/, m => {
            const o = dict[m[1]];
            return GROUP[m[2]] && o != null ? `${o} · ${GROUP[m[2]]}` : null;
        }],
        [/^(Très petit|Petit|Moyen|Grand|Géant) · énergie (.+?) · entretien (.+)$/, m => {
            const e = level('energie', m[2]), c = level('entretien_pelage', m[3]);
            return e >= 0 && c >= 0 && `${SIZE[m[1]]} · ${ENERGY_CARD[e]} · cuidado del pelo ${CARE_CARD[c]}`;
        }],
        [/^([a-z_]+)§.+?<g1>, (\d) sur 5<\/g1>$/, m => BY_K[m[1]] && `${BY_K[m[1]][m[2] - 1]}<g1>, ${m[2]} de 5</g1>`],
        [/^(.+?)<g1>, (\d) sur 5<\/g1>$/, m => LEVEL[m[1]] && `${LEVEL[m[1]]}<g1>, ${m[2]} de 5</g1>`],
        // FAQ
        [new RegExp(`^Questions fréquentes sur ${ART}${NAME}$`), m => es(m[1]) && `Preguntas frecuentes sobre el ${es(m[1])}`],
        [new RegExp(`^Quelle taille et quel poids pour ${ART}${NAME}${SP}\\?$`), m => es(m[1]) && `¿Cuánto mide y cuánto pesa el ${es(m[1])}?`],
        [new RegExp(`^${ART}${NAME} <g1>perd-il</g1> beaucoup de poils${SP}\\?$`), m => es(m[1]) && `¿El ${es(m[1])} suelta mucho <g1>pelo?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>peut-il</g1> vivre en appartement${SP}\\?$`), m => es(m[1]) && `¿Puede el ${es(m[1])} vivir en <g1>un apartamento?</g1>`],
        [new RegExp(`^Combien de temps <g1>faut-il</g1> promener ${ART}${NAME}${SP}\\?$`), m => es(m[1]) && `¿Cuánto ejercicio necesita el ${es(m[1])} <g1>al día?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> adapté aux enfants${SP}\\?$`), m => es(m[1]) && `¿El ${es(m[1])} es bueno <g1>con los niños?</g1>`],
        [new RegExp(`^Quelle est l’espérance de vie (?:de l’|du )${NAME}${SP}\\?$`), m => es(m[1]) && `¿Cuántos años vive el ${es(m[1])}?`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> un chien catégorisé${SP}\\?$`), m => es(m[1]) && `¿El ${es(m[1])} está catalogado como peligroso <g1>en Francia?</g1>`],
        [new RegExp(`^${ART}${NAME} mesure (.+?)\\. C’est un chien (de [^.]+)\\.$`), m => {
            const n = es(m[1]), size = SIZE_TEXT[m[3]];
            if (!n || !size) return null;
            const p = m[2].match(/^(?:(.+?) au garrot)?(?: pour )?(.+?)?$/);
            const h = p[1] ? range(p[1], true) : null, kg = p[2] ? range(p[2], true) : null;
            if ((p[1] && !h) || (p[2] && !kg)) return null;
            const body = h && kg ? `mide ${h} a la cruz y pesa ${kg}` : h ? `mide ${h} a la cruz` : `pesa ${kg}`;
            return `El ${n} ${body}. Es un perro ${size}.`;
        }],
        [new RegExp(`^Sa perte de poils est (.+?) et l’entretien de son poil est (.+?)\\.(.*)$`), m => {
            const i = level('perte_poils', m[1]), j = level('entretien_pelage', m[2]);
            const rest = sentences(m[3], EXTRA);
            return i < 0 || j < 0 || !rest ? null : [`${SHED_SAID[i]} y ${COAT_CARE[j]}.`, ...rest].join(' ');
        }],
        [/^(.+?\.)((?: .+)?)$/, m => {
            const a = APART[nfr(m[1])] ?? APART[m[1]] ?? KIDS[nfr(m[1])] ?? KIDS[m[1]];
            const rest = sentences(m[2], EXTRA);
            return a && rest ? [a, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Comptez environ (\\d+)${SP}minutes d’activité par jour, pour une énergie (.+?)\\.(.*)$`), m => {
            const e = level('energie', m[2]), rest = sentences(m[3], EXTRA);
            return e >= 0 && rest ? [`Calcula unos ${m[1]}${NB}minutos de actividad al día: ${ENERGY_SAID[e]}.`, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Elle est de (.+?), pour une robustesse (.+?)\\.(?: Les problèmes de santé à surveiller en priorité${SP}: (.+)\\.)?$`), m => {
            const life = lifeDe(m[1]), r = level('robustesse', m[2]);
            if (!life || r < 0) return null;
            let out = `Su esperanza de vida es ${life} y ${HARDY_SAID[r]}.`;
            if (m[3]) {
                const issues = ISSUES.get(nfr(m[3]));
                const tr = (issues || []).map(issue);
                if (!issues || tr.some(t => t == null)) return null;
                const named = tr.map(t => lcFirst(t.replace(/<\/?[gx]\d+\/?>/g, '')));
                const list = named.length < 2 ? named[0] : named.some(x => / y /.test(x)) ? `${named[0]}, así como ${named[1]}` : and(named[0], named[1]);
                // Liste après deux-points : pas d'article à accorder avec chaque maladie
                out += ` Problemas de salud que hay que vigilar especialmente: ${list}.`;
            }
            return out;
        }],
        [new RegExp(`^Espérance de vie de (.+?), robustesse (.+?)\\.( Les affections les plus fréquentes dans la race${SP}:)?$`), m => {
            const life = lifeDe(m[1]), r = level('robustesse', m[2]);
            return life && r >= 0 ? `Su esperanza de vida es ${life} y ${HARDY_SAID[r]}.${m[3] ? ' Las afecciones más frecuentes en la raza:' : ''}` : null;
        }],
        [/^Même gabarit et notes voisines\. <g1>Toutes les races du groupe (.+?)<x2\/><\/g1>$/, m => GROUP[m[1]] && `Mismo tamaño y notas parecidas. <g1>Todos los ${GROUP[m[1]].charAt(0).toLowerCase() + GROUP[m[1]].slice(1)}<x2/></g1>`]
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
