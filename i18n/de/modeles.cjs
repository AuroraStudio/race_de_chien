/**
 * i18n/de/modeles.cjs
 * Phrases types des fiches en allemand, traduites par modèle (voir i18n/en/modeles.cjs pour le principe).
 * L'article de chaque race (der, die, das) vient de races.json (genus). Les réponses prennent « diese Rasse »
 * pour sujet : l'accord ne dépend jamais du genre du nom de la race.
 *
 * Exporte (ctx) => (clé) => traduction ou null. ctx = { breeds, names, races, dict }.
 */

const SP = '[ \\u00a0]';
const NB = ' ';

const FR_LEVELS = {
    energie: ['très calme', 'calme', 'modérée', 'élevée', 'débordante'],
    robustesse: ['fragile', 'plutôt fragile', 'moyenne', 'bonne', 'excellente'],
    perte_poils: ['quasi nulle', 'faible', 'modérée', 'forte', 'très forte'],
    entretien_pelage: ['minimal', 'faible', 'moyen', 'important', 'très important']
};
const level = (k, fr) => FR_LEVELS[k].indexOf(fr);

const BY_K = {
    energie: ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Überschäumend'], appartement: ['Unmöglich', 'Schwierig', 'Möglich', 'Gut', 'Perfekt'],
    solitude: ['Sehr schlecht', 'Schlecht', 'Ein paar Stunden', 'Gut', 'Sehr gut'], enfants: ['Meiden', 'Vorsicht', 'Ordentlich', 'Gut', 'Ausgezeichnet'],
    chiens: ['Meiden', 'Vorsicht', 'Ordentlich', 'Gut', 'Ausgezeichnet'], chats: ['Meiden', 'Vorsicht', 'Ordentlich', 'Gut', 'Ausgezeichnet'],
    inconnus: ['Sehr misstrauisch', 'Zurückhaltend', 'Höflich', 'Offen', 'Sehr offen'], education: ['Sehr schwer', 'Schwer', 'Mittel', 'Leicht', 'Sehr leicht'],
    premier_chien: ['Nicht empfohlen', 'Wenig geeignet', 'Möglich', 'Gut geeignet', 'Ideal'], garde: ['Keiner', 'Gering', 'Mäßig', 'Ausgeprägt', 'Sehr ausgeprägt'],
    instinct_chasse: ['Sehr gering', 'Gering', 'Mäßig', 'Stark', 'Sehr stark'], fugue: ['Sehr gering', 'Gering', 'Mäßig', 'Hoch', 'Sehr hoch'],
    entretien_pelage: ['Minimal', 'Gering', 'Mittel', 'Hoch', 'Sehr hoch'], perte_poils: ['Kaum', 'Gering', 'Mäßig', 'Stark', 'Sehr stark'],
    bave: ['Nie', 'Selten', 'Etwas', 'Oft', 'Viel'], aboiements: ['Sehr leise', 'Leise', 'Mäßig', 'Häufig', 'Sehr gesprächig'],
    chaleur: ['Sehr gering', 'Gering', 'Mittel', 'Gut', 'Ausgezeichnet'], froid: ['Sehr gering', 'Gering', 'Mittel', 'Gut', 'Ausgezeichnet'],
    robustesse: ['Empfindlich', 'Eher empfindlich', 'Mittel', 'Gut', 'Ausgezeichnet']
};
const LEVEL = {
    'Très calme': 'Sehr niedrig', Calme: 'Niedrig', 'Modérée': 'Mittel', 'Élevée': 'Hoch', 'Débordante': 'Überschäumend',
    Impossible: 'Unmöglich', Difficile: 'Schwierig', Possible: 'Möglich', Bien: 'Gut', Parfait: 'Perfekt',
    'Très mal': 'Sehr schlecht', Mal: 'Schlecht', 'Quelques heures': 'Ein paar Stunden', 'Très bien': 'Sehr gut',
    'À éviter': 'Meiden', Prudence: 'Vorsicht', Correct: 'Ordentlich', Bon: 'Gut', Excellent: 'Ausgezeichnet',
    'Très méfiant': 'Sehr misstrauisch', 'Réservé': 'Zurückhaltend', Poli: 'Höflich', Ouvert: 'Offen', 'Très ouvert': 'Sehr offen',
    'Très difficile': 'Sehr schwer', Moyenne: 'Mittel', Facile: 'Leicht', 'Très facile': 'Sehr leicht',
    'Déconseillé': 'Nicht empfohlen', 'Peu adapté': 'Wenig geeignet', 'Bien adapté': 'Gut geeignet', 'Idéal': 'Ideal',
    Nul: 'Keiner', Faible: 'Gering', 'Modéré': 'Mäßig', 'Marqué': 'Ausgeprägt', 'Très marqué': 'Sehr ausgeprägt',
    'Très faible': 'Sehr gering', Fort: 'Stark', 'Très fort': 'Sehr stark', Forte: 'Stark', 'Très forte': 'Sehr stark',
    Minimal: 'Minimal', Moyen: 'Mittel', Important: 'Hoch', 'Très important': 'Sehr hoch', 'Quasi nulle': 'Kaum',
    Jamais: 'Nie', Rarement: 'Selten', 'Un peu': 'Etwas', Souvent: 'Oft', Beaucoup: 'Viel',
    'Très discret': 'Sehr leise', Discret: 'Leise', 'Modérés': 'Mäßig', 'Fréquents': 'Häufig', 'Très bavard': 'Sehr gesprächig',
    Bonne: 'Gut', Excellente: 'Ausgezeichnet', Fragile: 'Empfindlich', 'Plutôt fragile': 'Eher empfindlich'
};
const ENERGY_SENT = ['Diese Rasse ist sehr ruhig.', 'Diese Rasse ist ruhig.', 'Ihr Energielevel ist mittel.', 'Ihr Energielevel ist hoch.', 'Ihr Energielevel ist enorm.'];
const ENERGY_CARD = ['sehr ruhig', 'ruhig', 'mäßige Energie', 'viel Energie', 'sehr viel Energie'];
const HARDY_SAID = ['die Rasse gilt als empfindlich', 'die Rasse gilt als eher empfindlich', 'ihre Robustheit ist mittel', 'die Rasse gilt als robust', 'die Rasse gilt als sehr robust'];
const SHED_W = ['kaum spürbar', 'gering', 'mäßig', 'stark', 'sehr stark'];
const CARE_W = ['minimal', 'gering', 'mittel', 'hoch', 'sehr hoch'];
const SIZE = { 'Très petit': 'Sehr klein', Petit: 'Klein', Moyen: 'Mittelgroß', Grand: 'Groß', 'Géant': 'Sehr groß' };
const SIZE_ACC = { 'de très petite taille': 'sehr kleinen', 'de petite taille': 'kleinen', 'de taille moyenne': 'mittelgroßen', 'de grande taille': 'großen', 'de taille géante': 'sehr großen' };
const GROUP = {
    'Bergers et bouviers': 'Hüte- und Treibhunde', 'Molosses, pinschers et bouviers suisses': 'Pinscher und Schnauzer, Molosser und Schweizer Sennenhunde',
    Terriers: 'Terrier', Teckels: 'Dachshunde', 'Spitz et chiens primitifs': 'Spitze und Hunde vom Urtyp', 'Chiens courants': 'Laufhunde und Schweißhunde',
    "Chiens d'arrêt": 'Vorstehhunde', "Rapporteurs, leveurs et chiens d'eau": 'Apportier-, Stöber- und Wasserhunde',
    'Chiens de compagnie': 'Gesellschafts- und Begleithunde', 'Lévriers': 'Windhunde'
};
const APART = {
    'Oui, très bien : calme à l’intérieur, il s’adapte parfaitement à un appartement.': 'Ja, sehr gut: Diese Rasse ist im Haus ruhig und passt sich einer Wohnung perfekt an.',
    'Oui, s’il sort plusieurs fois par jour : il s’adapte bien à un logement sans jardin.': 'Ja, mit mehreren Spaziergängen am Tag: Ein Zuhause ohne Garten ist dann gut möglich.',
    'C’est possible, à condition de lui offrir de vraies sorties chaque jour ; un jardin reste un plus.': 'Das geht, wenn jeden Tag echte Ausflüge drin sind; ein Garten bleibt ein Plus.',
    'C’est difficile : il a besoin d’espace et d’activité, un logement avec jardin lui convient mieux.': 'Das ist schwierig: Diese Rasse braucht Platz und Bewegung, ein Zuhause mit Garten passt besser.',
    'Ce n’est pas recommandé : il lui faut de l’espace, idéalement une maison avec jardin.': 'Nicht empfehlenswert: Diese Rasse braucht Platz, am besten ein Haus mit Garten.'
};
const KIDS = {
    'Oui : patient et doux, c’est un excellent chien de famille, même avec de jeunes enfants.': 'Ja: geduldig und sanft, ein ausgezeichneter Familienhund, auch mit kleinen Kindern.',
    'Oui, il s’entend bien avec les enfants qui le respectent.': 'Ja, mit Kindern, die respektvoll mit Hunden umgehen, versteht sich diese Rasse gut.',
    'Correctement, plutôt avec des enfants assez grands pour respecter ses limites.': 'Ganz gut, am besten mit Kindern, die alt genug sind, um ihre Grenzen zu respektieren.',
    'Avec prudence : il tolère mal l’agitation des jeunes enfants.': 'Mit Vorsicht: Den Trubel kleiner Kinder verträgt diese Rasse schlecht.',
    'Il est déconseillé avec de jeunes enfants.': 'Für Familien mit kleinen Kindern nicht empfehlenswert.'
};
const EXTRA = {
    'Attention au voisinage : il aboie volontiers.': 'Achtung bei hellhörigen Nachbarn: Diese Rasse bellt gern.',
    'Ne laissez jamais un jeune enfant seul avec un chien, quelle que soit sa race.': 'Lass ein kleines Kind nie allein mit einem Hund, ganz gleich welcher Rasse.',
    'Ajoutez des jeux et des exercices d’éducation pour occuper aussi sa tête.': 'Ergänze Spiele und Erziehungsübungen, damit auch der Kopf beschäftigt ist.',
    'Il fait partie des races qui perdent très peu de poils, souvent mieux tolérées par les personnes allergiques, sans garantie : passez du temps avec la race avant de vous décider.': 'Diese Rasse haart sehr wenig und wird von Allergikern oft besser vertragen, ohne Garantie: Verbringe Zeit mit der Rasse, bevor du dich entscheidest.',
    'Prévoyez un brossage plusieurs fois par semaine, et davantage pendant les mues de printemps et d’automne.': 'Plane mehrmals pro Woche Bürsten ein, im Fellwechsel im Frühjahr und Herbst öfter.',
    'Son poil demande un toilettage régulier, parfois chez un professionnel.': 'Das Fell braucht regelmäßige Pflege, manchmal beim Hundefriseur.'
};
// Article au nominatif, et « zum » / « zur » (zu dem / zu der)
const ART_NOM = { m: 'der', f: 'die', n: 'das' };
const ZU = { m: 'zum', f: 'zur', n: 'zum' };

module.exports = function modeles({ breeds, races = {}, dict }) {
    const nfr = s => s.replace(/ /g, ' ');
    const byName = new Map();
    for (const b of breeds) {
        byName.set(nfr(b.name_fr), b);
        const short = b.name_fr.replace(/\s*\([^)]*\)/, '');
        if (!byName.has(short)) byName.set(short, b);
    }
    // Nom allemand et genre de la race citée en français
    const de = n => { const b = byName.get(nfr(n)); const r = b && races[b.slug]; return r?.name ? { name: r.name, g: ART_NOM[r.genus] ? r.genus : 'm' } : null; };
    const the = (x, cap = false) => { const a = ART_NOM[x.g]; return `${cap ? a[0].toUpperCase() + a.slice(1) : a} ${x.name}`; };
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
    // « 58 à 70 cm » → « 58 bis 70 cm » ; « 10 à 13 ans » → « 10 bis 13 Jahre » (« Jahren » après « bei »)
    const range = (s, dat = false) => {
        const m = nfr(s).match(/^(\d+(?:,\d+)?)(?: à (\d+(?:,\d+)?))? (cm|kg|ans|minutes)$/);
        if (!m) return null;
        const unit = { cm: 'cm', kg: 'kg', ans: dat ? 'Jahren' : 'Jahre', minutes: 'Minuten' }[m[3]];
        return m[2] ? `${m[1]} bis ${m[2]}${NB}${unit}` : `${m[1]}${NB}${unit}`;
    };
    // Un adjectif en tête d'une maladie prend la minuscule après les deux-points (progressive Retinaatrophie)
    const lcAdj = t => (/^[A-ZÄÖÜ][a-zäöüß]+(e|er|es|en) [A-ZÄÖÜ]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);
    const sentences = (rest, map) => {
        const parts = rest.trim() ? rest.trim().split(/(?<=\.) (?=[A-ZÉÀ])/) : [];
        const out = parts.map(p => map[nfr(p)] ?? map[p] ?? null);
        return out.includes(null) ? null : out;
    };
    const rules = [
        [new RegExp(`^${NAME}${SP}: caractère(?:, éducation)?(?:, santé)?(?: et (?:entretien|santé))$`), m => {
            const x = de(m[1]);
            if (!x) return null;
            return [`${x.name}: Charakter, Erziehung, Gesundheit und Pflege`, `${x.name}: Charakter, Gesundheit und Pflege`, `${x.name}: Charakter und Gesundheit`].find(t => t.length <= 60) || x.name;
        }],
        [new RegExp(`^${NAME}${SP}: fiche complète de la race$`), m => de(m[1]) && `${de(m[1]).name}: Rasseporträt`],
        [new RegExp(`^${NAME}, chien de race$`), m => de(m[1]) && `${de(m[1]).name}, Rassehund`],
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3> <g4>›<\/g4><g5>(.+?)<\/g5>$/, m => GROUP[m[1]] && de(m[2]) && `<g1>Hunderassen</g1> <g2>›</g2><g3>${GROUP[m[1]]}</g3> <g4>›</g4><g5>${de(m[2]).name}</g5>`],
        [/^<g1>Races de chiens<\/g1> <g2>›<\/g2><g3>(.+?)<\/g3>$/, m => de(m[1]) && `<g1>Hunderassen</g1> <g2>›</g2><g3>${de(m[1]).name}</g3>`],
        [new RegExp(`^(<g1>)?(\\d+)(?:re|e)${SP}race en France · ([\\d \\u00a0\\u202f]+) chiots LOF en 2025(</g1>)?$`), m => {
            const r = Number(m[2]), n = Number(m[3].replace(/\D/g, ''));
            const rank = r === 1 ? 'Beliebteste Rasse in Frankreich' : `Platz ${r} der beliebtesten Rassen in Frankreich`;
            return `${m[1] || ''}${rank} · ${n === 1 ? '1 Welpe' : `${n.toLocaleString('de-DE')} Welpen`} im LOF 2025 eingetragen${m[4] || ''}`;
        }],
        [/^\d+(?:,\d+)?(?: à \d+(?:,\d+)?)?[  ](?:cm|kg|ans|minutes)$/, m => range(m[0])],
        [/^(\d+) · (.+)$/, m => GROUP[m[2]] && `${m[1]} · ${GROUP[m[2]]}`],
        [/^(.+) · (.+)$/, m => {
            const o = dict[m[1]];
            return GROUP[m[2]] && o != null ? `${o} · ${GROUP[m[2]]}` : null;
        }],
        [/^(Très petit|Petit|Moyen|Grand|Géant) · énergie (.+?) · entretien (.+)$/, m => {
            const e = level('energie', m[2]), c = level('entretien_pelage', m[3]);
            return e >= 0 && c >= 0 && `${SIZE[m[1]]} · ${ENERGY_CARD[e]} · Pflege ${CARE_W[c]}`;
        }],
        [/^([a-z_]+)§.+?<g1>, (\d) sur 5<\/g1>$/, m => BY_K[m[1]] && `${BY_K[m[1]][m[2] - 1]}<g1>, ${m[2]} von 5</g1>`],
        [/^(.+?)<g1>, (\d) sur 5<\/g1>$/, m => LEVEL[m[1]] && `${LEVEL[m[1]]}<g1>, ${m[2]} von 5</g1>`],
        // FAQ
        [new RegExp(`^Questions fréquentes sur ${ART}${NAME}$`), m => { const x = de(m[1]); return x && `Häufige Fragen ${ZU[x.g]} ${x.name}`; }],
        [new RegExp(`^Quelle taille et quel poids pour ${ART}${NAME}${SP}\\?$`), m => de(m[1]) && `Wie groß und schwer wird ${the(de(m[1]))}?`],
        [new RegExp(`^${ART}${NAME} <g1>perd-il</g1> beaucoup de poils${SP}\\?$`), m => de(m[1]) && `Haart ${the(de(m[1]))} <g1>stark?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>peut-il</g1> vivre en appartement${SP}\\?$`), m => de(m[1]) && `Kann ${the(de(m[1]))} in einer <g1>Wohnung leben?</g1>`],
        [new RegExp(`^Combien de temps <g1>faut-il</g1> promener ${ART}${NAME}${SP}\\?$`), m => de(m[1]) && `Wie viel Bewegung braucht ${the(de(m[1]))} <g1>am Tag?</g1>`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> adapté aux enfants${SP}\\?$`), m => de(m[1]) && `Ist ${the(de(m[1]))} für Kinder <g1>geeignet?</g1>`],
        [new RegExp(`^Quelle est l’espérance de vie (?:de l’|du )${NAME}${SP}\\?$`), m => de(m[1]) && `Wie alt wird ${the(de(m[1]))}?`],
        [new RegExp(`^${ART}${NAME} <g1>est-il</g1> un chien catégorisé${SP}\\?$`), m => de(m[1]) && `Gilt ${the(de(m[1]))} in Frankreich als <g1>Listenhund?</g1>`],
        [new RegExp(`^${ART}${NAME} mesure (.+?)\\. C’est un chien (de [^.]+)\\.$`), m => {
            const x = de(m[1]), size = SIZE_ACC[m[3]];
            if (!x || !size) return null;
            const p = m[2].match(/^(?:(.+?) au garrot)?(?: pour )?(.+?)?$/);
            const h = p[1] ? range(p[1]) : null, kg = p[2] ? range(p[2]) : null;
            if ((p[1] && !h) || (p[2] && !kg)) return null;
            const body = h && kg ? `erreicht ${h} Schulterhöhe und wiegt ${kg}` : h ? `erreicht ${h} Schulterhöhe` : `wiegt ${kg}`;
            return `${the(x, true)} ${body}. Es handelt sich um einen ${size} Hund.`;
        }],
        [new RegExp(`^Sa perte de poils est (.+?) et l’entretien de son poil est (.+?)\\.(.*)$`), m => {
            const i = level('perte_poils', m[1]), j = level('entretien_pelage', m[2]);
            const rest = sentences(m[3], EXTRA);
            return i < 0 || j < 0 || !rest ? null : [`Der Haarverlust ist ${SHED_W[i]} und der Pflegeaufwand ${CARE_W[j]}.`, ...rest].join(' ');
        }],
        [/^(.+?\.)((?: .+)?)$/, m => {
            const a = APART[nfr(m[1])] ?? APART[m[1]] ?? KIDS[nfr(m[1])] ?? KIDS[m[1]];
            const rest = sentences(m[2], EXTRA);
            return a && rest ? [a, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Comptez environ (\\d+)${SP}minutes d’activité par jour, pour une énergie (.+?)\\.(.*)$`), m => {
            const e = level('energie', m[2]), rest = sentences(m[3], EXTRA);
            return e >= 0 && rest ? [`Rechne mit etwa ${m[1]}${NB}Minuten Bewegung am Tag. ${ENERGY_SENT[e]}`, ...rest].join(' ') : null;
        }],
        [new RegExp(`^Elle est de (.+?), pour une robustesse (.+?)\\.(?: Les problèmes de santé à surveiller en priorité${SP}: (.+)\\.)?$`), m => {
            const life = range(m[1], true), r = level('robustesse', m[2]);
            if (!life || r < 0) return null;
            let out = `Die Lebenserwartung liegt bei ${life}, ${HARDY_SAID[r]}.`;
            if (m[3]) {
                const issues = ISSUES.get(nfr(m[3]));
                const tr = (issues || []).map(issue);
                if (!issues || tr.some(t => t == null)) return null;
                const named = tr.map(t => lcAdj(t.replace(/<\/?[gx]\d+\/?>/g, '')));
                out += ` Gesundheitlich besonders im Blick behalten: ${named.join(named.some(x => / und /.test(x)) ? ', außerdem ' : ' und ')}.`;
            }
            return out;
        }],
        [new RegExp(`^Espérance de vie de (.+?), robustesse (.+?)\\.( Les affections les plus fréquentes dans la race${SP}:)?$`), m => {
            const life = range(m[1], true), r = level('robustesse', m[2]);
            return life && r >= 0 ? `Die Lebenserwartung liegt bei ${life}, ${HARDY_SAID[r]}.${m[3] ? ' Die häufigsten Erkrankungen der Rasse:' : ''}` : null;
        }],
        [/^Même gabarit et notes voisines\. <g1>Toutes les races du groupe (.+?)<x2\/><\/g1>$/, m => GROUP[m[1]] && `Gleiche Größe, ähnliche Bewertungen. <g1>Alle ${GROUP[m[1]]}<x2/></g1>`]
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
