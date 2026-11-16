/**
 * lib/guides-pratiques.cjs
 * Guides pratiques (/guides/<slug>) : budget, règles d'achat et d'adoption, assurance.
 * Français seulement. Chaque chiffre vient d'une source citée en bas de page (SOURCES), consultée le 16/11/2026 :
 * ne rien ajouter sans source, et revoir les montants quand les sources changent.
 */

const VU = '16/11/2026';
const SOURCES = {
    sp: { nom: 'Service-public.gouv.fr, « Avoir un chien ou un chat : quelles sont les règles ? »', detail: 'vérifié le 28 avril 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F34877' },
    justice: { nom: 'Justice.fr, « Particulier : vendre ou donner des chiens ou des chats »', detail: 'mis à jour le 28 avril 2026', url: 'https://www.justice.fr/fiche/particulier-vendre-donner-chiens-chats' },
    cat: { nom: 'Service-public.gouv.fr, chiens de 1re et 2e catégorie', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F1839' },
    spa: { nom: 'La SPA, « Participation financière »', url: 'https://www.la-spa.fr/adopter/comment-adopter/les-etapes-de-l-adoption/participation-financiere/' },
    moneyvox: { nom: 'MoneyVox, « Faut-il assurer son animal de compagnie et à quel prix en 2026 ? »', detail: 'publié le 2 septembre 2026 ; prix médians tirés de plus de 70 000 simulations du comparateur Meilleurtaux en 2026, dépenses vétérinaires tirées d’une étude SantéVet auprès de 500 propriétaires de chiens', url: 'https://www.moneyvox.fr/assurance/actualites/110075/faut-il-assurer-son-animal-de-compagnie-et-a-quel-prix-en-2026' },
    icad: { nom: 'I-CAD, fichier national d’identification des carnivores domestiques', url: 'https://www.i-cad.fr' },
    scc: { nom: 'Société Centrale Canine (LOF, clubs de race, éleveurs)', url: 'https://www.centrale-canine.fr' }
};

module.exports = function guidesPratiques(ctx) {
    const { breeds, popular, icon, esc, page, headMeta, ldTag, crumbs, crumbsLd, clip, SITE_URL, DATE, DATE_FR, COUNT } = ctx;
    const a = (href, txt) => `<a href="${href}" class="font-semibold text-primary-700 underline">${txt}</a>`;
    const src = k => `<a href="#sources" class="whitespace-nowrap text-sm font-semibold text-primary-700 underline">source</a>`;
    const p = t => `<p class="mt-3 leading-relaxed text-slate-700">${t}</p>`;
    const ul = items => `<ul class="mt-3 space-y-2 leading-relaxed text-slate-700">${items.map(i => `<li class="flex gap-2"><span class="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true"></span><span>${i}</span></li>`).join('')}</ul>`;
    const table = (head, rows) => `<div class="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table class="w-full min-w-[440px] border-collapse text-sm">
                <thead><tr class="text-left text-slate-600">${head.map(h => `<th scope="col" class="px-3 py-2.5 font-semibold">${h}</th>`).join('')}</tr></thead>
                <tbody>${rows.map(r => `<tr class="border-t border-slate-200">${r.map((c, i) => (i === 0 ? `<th scope="row" class="px-3 py-2.5 text-left font-semibold text-slate-900">${c}</th>` : `<td class="px-3 py-2.5 text-slate-700">${c}</td>`)).join('')}</tr>`).join('')}</tbody>
            </table></div>`;
    const note = t => `<p class="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm leading-relaxed text-amber-900">${t}</p>`;

    // Races les plus fragiles et les plus robustes d'après nos notes, les plus inscrites au LOF d'abord
    const byRob = test => popular.filter(b => test(b.scores.robustesse)).slice(0, 8);
    const links = list => list.map(b => `<a href="/races/${b.slug}" class="font-semibold text-primary-700 underline">${esc(b.name_fr.replace(/\s*\([^)]*\)/g, ''))}</a>`).join(', ');
    const fragiles = byRob(v => v <= 2), robustes = byRob(v => v >= 4);
    const nFragiles = breeds.filter(b => b.scores.robustesse <= 2).length;

    const GUIDES = [
        {
            slug: 'combien-coute-un-chien', short: 'Combien coûte un chien', icon: 'calculator',
            title: 'Combien coûte un chien ? Le budget poste par poste',
            seo: 'Combien coûte un chien ? Le budget poste par poste',
            desc: 'Adoption ou achat, équipement de départ, vétérinaire, assurance, alimentation : les postes du budget d’un chien, avec les montants que l’on peut vérifier et ceux qu’il faut demander.',
            intro: 'Un chien vit dix à quinze ans, et son budget ne s’arrête pas au prix d’achat. Voici les postes à prévoir, avec des montants sourcés quand ils existent. Là où les prix sont libres, nous vous disons quoi demander plutôt que d’avancer une moyenne invérifiable.',
            sources: ['spa', 'moneyvox', 'sp', 'scc'],
            sections: [
                ['acquisition', 'Le prix de départ : adopter ou acheter', [
                    p(`<strong>En refuge.</strong> À la SPA, la participation aux frais d’adoption est de 275 € pour un chien et de 365 € pour un chiot de moins de 6 mois. Elle couvre les frais vétérinaires engagés pendant sa prise en charge : stérilisation, identification, vaccination. Si le chien n’est pas encore stérilisé, un chèque de caution de 300 € est demandé. ${src()}`),
                    p(`<strong>Chez un éleveur.</strong> Les prix sont libres : chaque éleveur fixe le sien, et ils varient beaucoup selon la race, la lignée et l’inscription au LOF. Aucun organisme ne publie de prix moyen par race, et nous n’en donnons donc pas. Demandez plutôt ce que le prix comprend : l’identification est obligatoirement à la charge du vendeur, et il doit vous remettre un certificat vétérinaire de moins de 3 mois. ${src()}`),
                    p(`Un prix très bas doit alerter autant qu’un prix très haut : un chiot vendu sans identification, sans certificat vétérinaire ou avant l’âge de 8 semaines est vendu hors la loi. Les règles sont détaillées dans ${a('/guides/acheter-ou-adopter-un-chien-les-regles', 'notre guide sur l’achat et l’adoption')}.`)
                ]],
                ['depart', 'L’équipement de départ', [
                    p('Avant l’arrivée du chien, comptez un premier panier d’achats, à faire une fois :'),
                    ul(['un couchage et, pour un chiot, une caisse ou un parc', 'deux gamelles, un collier ou un harnais, une laisse, une longe pour le rappel', 'une médaille avec votre numéro de téléphone', 'de quoi le transporter en voiture en sécurité : caisse, harnais attaché ou grille', 'brosse, coupe-griffes, shampoing adapté, selon son poil', 'quelques jouets à mâcher et d’occupation']),
                    p('Le montant dépend surtout de la taille du chien : une caisse de transport pour un grand chien coûte plusieurs fois le prix de celle d’un chihuahua. Achetez ce poste à la taille adulte quand c’est possible.')
                ]],
                ['annuel', 'Les dépenses de chaque année', [
                    table(['Poste', 'Ce qu’on sait', 'Ce qui fait varier'], [
                        ['Vétérinaire', 'En moyenne 208 € et 1,9 visite sur douze mois pour un chien, d’après une étude SantéVet', 'L’âge, la race, les imprévus. Les tarifs ont augmenté d’environ 20 % en dix ans selon le syndicat des vétérinaires libéraux'],
                        ['Assurance santé (facultative)', 'Prix médian de 11 € par mois en formule économique à 38 € en formule la plus couvrante, pour un chien d’un an', 'La race, l’âge et le niveau de garantie'],
                        ['Alimentation', 'Aucune moyenne fiable : elle dépend du poids du chien et de la gamme choisie', 'Le poids adulte avant tout : un chien de 40 kg mange plusieurs fois la ration d’un chien de 8 kg'],
                        ['Toilettage', 'Nul pour un poil court, régulier pour un poil à pousse continue', 'Le type de poil : voir la note « Entretien du poil » de chaque fiche'],
                        ['Garde et vacances', 'Selon votre organisation', 'Pension, garde à domicile ou proches']
                    ]),
                    p(`Les deux premiers montants viennent des mêmes travaux, cités par MoneyVox. ${src()} La moyenne des dépenses vétérinaires cache de grands écarts : une année sans souci coûte un rappel de vaccin et des antiparasitaires, une opération peut dépasser le millier d’euros.`),
                    note('Pour estimer l’alimentation, faites le calcul vous-même : la ration journalière indiquée sur le sac pour le poids adulte de la race, multipliée par 365, divisée par le poids du sac, donne le nombre de sacs par an. C’est le seul chiffre qui vaille pour votre chien.')
                ]],
                ['taille', 'Ce que la taille et la race changent', [
                    p(`Le gabarit pèse sur presque tous les postes : nourriture, antiparasitaires et médicaments dosés au poids, matériel, pension. Les ${a('/selections/grands-chiens', 'grands chiens')} coûtent plus cher à nourrir et à soigner que les ${a('/selections/petits-chiens', 'petits chiens')}.`),
                    p(`La santé de la race compte aussi. Sur nos fiches, la note « Robustesse » résume la fréquence des problèmes de santé connus, et la rubrique « Santé » liste les affections à surveiller. Parmi les races les plus répandues, les mieux notées sont : ${links(robustes)}. Les moins bien notées : ${links(fragiles)}.`),
                    p(`Enfin, le poil : une race à poil qui pousse en continu demande un toilettage régulier, parfois chez un professionnel. C’est le revers des ${a('/selections/chiens-qui-perdent-peu-de-poils', 'chiens qui perdent peu de poils')}.`)
                ]],
                ['imprevus', 'Prévoir les imprévus', [
                    p(`Deux façons de s’y préparer : mettre de côté chaque mois une somme réservée au chien, ou souscrire une assurance santé. Les deux se défendent, et le choix dépend surtout de la race et de votre capacité à sortir une grosse somme d’un coup. Nous détaillons le fonctionnement et les prix dans ${a('/guides/assurance-chien', 'notre guide de l’assurance chien')}.`),
                    p('Dans tous les cas, votre assurance habitation couvre en général les dommages que votre chien cause à autrui au titre de la responsabilité civile : vérifiez-le auprès de votre assureur avant son arrivée, surtout pour un chien catégorisé, pour lequel cette assurance est obligatoire.')
                ]]
            ]
        },
        {
            slug: 'acheter-ou-adopter-un-chien-les-regles', short: 'Acheter ou adopter : les règles', icon: 'scales',
            title: 'Acheter ou adopter un chien : ce que dit la loi',
            seo: 'Acheter ou adopter un chien : ce que dit la loi',
            desc: 'Âge minimum de 8 semaines, identification, certificat d’engagement signé 7 jours avant, documents à recevoir, annonces en ligne : les règles à connaître avant d’accueillir un chien.',
            intro: 'Que le chien soit vendu ou donné, par un éleveur, un refuge ou un particulier, la loi impose les mêmes garde-fous. Les connaître, c’est savoir reconnaître une cession sérieuse et écarter les autres. Tout ce qui suit vient des fiches officielles de l’administration, vérifiées le 28 avril 2026.',
            sources: ['sp', 'justice', 'icad', 'cat'],
            sections: [
                ['avant', 'Avant : le certificat d’engagement et de connaissance', [
                    p(`Avant d’acquérir un chien, vous devez signer un certificat d’engagement et de connaissance. Il rappelle les besoins de l’animal et ce qu’il implique, et comporte une mention écrite de votre main. ${src()}`),
                    ul(['Il est délivré par une personne titulaire de l’attestation de connaissances (Acaced) ou d’une équivalence, par exemple un vétérinaire, un auxiliaire vétérinaire ou le responsable d’un refuge ou d’une association.', 'Le vendeur ou le donneur doit vérifier que vous l’avez signé <strong>au moins 7 jours avant</strong> la cession. Ce délai est fait pour éviter les achats sur un coup de tête.', 'S’il ne le vérifie pas, il risque une amende de 450 €.']),
                    p('En pratique : un vendeur qui vous propose de repartir avec le chiot le jour même, sans ce certificat, ne respecte pas la loi.')
                ]],
                ['age', 'L’âge minimum : 8 semaines', [
                    p(`Un chiot ne peut être ni vendu ni donné avant l’âge de 8 semaines. Plus jeune, il est séparé trop tôt de sa mère. Proposer un chiot de 8 semaines ou moins est puni d’une amende de 750 €. ${src()}`)
                ]],
                ['identification', 'L’identification, à la charge de celui qui cède', [
                    p(`Tout chien cédé, chiot ou adulte, doit être identifié par puce électronique ou tatouage et enregistré au fichier national, l’I-CAD. C’est à celui qui vend ou donne le chien de le faire identifier, à ses frais, avant la cession. ${src()}`),
                    ul(['L’identification est de toute façon obligatoire pour tous les chiens de plus de 4 mois.', 'Le changement de propriétaire doit être déclaré à l’I-CAD : vérifiez ensuite que le chien est bien enregistré à votre nom.', 'Céder ou détenir un chien non identifié est puni d’une amende de 750 €.'])
                ]],
                ['documents', 'Les documents que vous devez recevoir', [
                    table(['Document', 'À quoi il sert'], [
                        ['Attestation de cession', 'La preuve de la vente ou du don, datée et signée'],
                        ['Certificat vétérinaire de moins de 3 mois', 'Établi après examen du chien : identité du cédant, identification, vaccinations s’il est vacciné, stérilisation s’il est stérilisé, déclaration de naissance au LOF s’il est de race, catégorie s’il est catégorisé'],
                        ['Justificatif d’identification', 'Le document I-CAD avec le numéro de puce ou de tatouage'],
                        ['Document d’information', 'Les caractéristiques et les besoins du chien, avec des conseils d’éducation si besoin ; il est prévu dans certains cas, demandez-le']
                    ]),
                    p(`Céder un chien sans certificat vétérinaire est puni d’une amende de 750 €. ${src()} Pour un chien de race, demandez aussi comment le chiot sera inscrit au LOF : c’est la Société Centrale Canine qui tient ce livre.`)
                ]],
                ['annonces', 'Annonces en ligne et animaleries', [
                    ul(['<strong>Les animaleries ne peuvent plus vendre de chiens ni de chats</strong> depuis le 1er janvier 2024. Elles peuvent seulement présenter à l’adoption des animaux de refuges et d’associations.', 'En ligne, <strong>seuls les éleveurs et vendeurs professionnels peuvent publier une annonce de vente</strong>. Un particulier ne peut y proposer un chien que gratuitement.', 'Une annonce doit indiquer la race ou la mention « n’appartient pas à une race », le sexe, l’âge, le lieu de naissance, le numéro d’identification, l’inscription ou non au LOF, et le prix ou la gratuité. Celle d’un éleveur porte aussi son numéro Siren ou Siret et le nombre de femelles reproductrices.', 'Vendre un chiot né d’une chienne que l’on détient fait de vous un éleveur, avec les obligations qui vont avec.']),
                    p(`Une annonce sans numéro d’identification ni numéro Siren pour une vente est donc à écarter d’emblée. ${src()}`)
                ]],
                ['apres', 'Après : vos obligations de propriétaire', [
                    ul(['Vous êtes responsable des dommages causés par votre chien, même s’il s’est échappé.', 'La divagation est interdite : un chien est en divagation dès qu’il n’est plus sous surveillance, hors de portée de voix ou à plus de 100 mètres de vous. L’amende est de 150 €.', 'Ne pas ramasser ses déjections sur la voie publique est puni d’une amende de 750 € en cas de flagrant délit.', 'Il doit disposer d’une nourriture adaptée, d’eau en permanence et d’un abri. Il est interdit d’attacher un chien qui n’est pas adulte.']),
                    p(`Les chiens de 1re et 2e catégorie obéissent à des règles supplémentaires : permis de détention, muselière, assurance. Nous les résumons sur ${a('/chiens-categorises', 'notre page sur les chiens catégorisés')}.`),
                    note('Ce guide résume les fiches officielles et ne les remplace pas. En cas de doute sur une situation précise, reportez-vous aux textes cités dans les sources ou à votre mairie.')
                ]]
            ]
        },
        {
            slug: 'assurance-chien', short: 'Assurance chien : comment ça marche', icon: 'shield-check',
            title: 'Assurance chien : comment ça marche, et pour qui',
            seo: 'Assurance chien : comment ça marche, prix et pièges',
            desc: 'Formules, taux de remboursement, franchise, plafond, délai de carence : comprendre une assurance santé pour chien, ses prix médians en 2026 et les questions à poser avant de signer.',
            intro: 'Une assurance santé pour chien rembourse une partie des frais vétérinaires en échange d’une cotisation mensuelle. Elle n’est pas obligatoire, et peu de chiens sont assurés : 5 à 6 % des animaux en France, selon une estimation reprise par MoneyVox. Voici comment lire un contrat et décider si elle vaut le coup pour vous.',
            sources: ['moneyvox', 'sp'],
            sections: [
                ['mots', 'Les cinq mots à comprendre', [
                    table(['Terme', 'Ce que ça veut dire', 'À regarder'], [
                        ['Formule', 'Le niveau de garantie : accident seul, accident et maladie, avec ou sans prévention', 'Ce qui est couvert, pas seulement le prix'],
                        ['Taux de remboursement', 'La part des frais remboursée', 'Le remboursement est le plus souvent partiel ; seules les formules les plus chères approchent le remboursement complet'],
                        ['Franchise', 'Ce qui reste à votre charge', 'Si elle s’applique par an ou à chaque acte'],
                        ['Plafond annuel', 'Le maximum remboursé sur une année', 'Un plafond bas est vite atteint par une seule opération'],
                        ['Délai de carence', 'Le temps entre la signature et le début de la couverture', 'Sa durée, parfois différente pour la maladie, l’accident et la chirurgie']
                    ])
                ]],
                ['prix', 'Les prix en 2026', [
                    p(`Pour un chien d’un an, le prix médian va de <strong>11 € par mois</strong> en formule économique à <strong>38 € par mois</strong> pour la formule la plus couvrante. Ces médianes viennent de plus de 70 000 simulations faites en 2026 sur le comparateur Meilleurtaux. ${src()}`),
                    ul(['<strong>La race compte.</strong> En formule intermédiaire, la médiane est de 24,50 € par mois pour un chihuahua et de 32,10 € pour un bouledogue français.', '<strong>L’âge compte encore plus.</strong> En formule haute, la cotisation moyenne passe de 45,40 € par mois à 2 ans à près de 70 € à 9 ans.']),
                    p('Une médiane veut dire que la moitié des assurés paient plus, l’autre moitié moins : demandez toujours un devis pour votre chien, avec sa race et son âge exacts.')
                ]],
                ['compare', 'À quoi comparer la cotisation', [
                    p(`D’après une étude SantéVet menée auprès de 500 propriétaires, un chien coûte en moyenne 208 € de vétérinaire sur douze mois, pour 1,9 visite. ${src()} Une formule à 38 € par mois représente 456 € par an : sur une année ordinaire, l’assurance coûte donc plus qu’elle ne rembourse. Elle se justifie par les mauvaises années, quand une opération ou une maladie chronique fait grimper la note.`),
                    p('Un exemple cité par MoneyVox donne la mesure : une IRM avec anesthésie, une prise de sang et deux consultations ont coûté 1 200 € au propriétaire d’un Shiba Inu, remboursés 800 € parce que son plafond annuel de 1 000 € était déjà entamé.')
                ]],
                ['qui', 'Pour quels chiens elle a le plus de sens', [
                    ul(['<strong>Les races à la santé fragile.</strong> Sur nos fiches, ' + nFragiles + ' races ont une note de robustesse basse. Parmi les plus répandues : ' + links(fragiles) + '. La rubrique « Santé » de chaque fiche liste les affections à surveiller.', '<strong>Les grands chiens</strong>, dont les soins et les médicaments, dosés au poids, coûtent plus cher.', '<strong>Les foyers qui ne pourraient pas avancer une grosse somme</strong> du jour au lendemain.']),
                    p(`À l’inverse, pour une race robuste et si vous pouvez mettre de côté chaque mois l’équivalent d’une cotisation, l’épargne dédiée est une alternative raisonnable. Parmi les races répandues les mieux notées en robustesse : ${links(robustes)}.`)
                ]],
                ['questions', 'Huit questions à poser avant de signer', [
                    ul(['Les maladies héréditaires et congénitales de la race sont-elles couvertes ?', 'Quelles affections sont exclues, et les problèmes déjà connus de mon chien le sont-ils ?', 'Quel est le délai de carence pour la maladie, l’accident et la chirurgie ?', 'La franchise s’applique-t-elle par an ou à chaque acte ?', 'Quel est le plafond annuel, et y a-t-il des plafonds par acte ?', 'Les vaccins, vermifuges et antiparasitaires sont-ils pris en charge ?', 'Comment la cotisation évolue-t-elle avec l’âge du chien ?', 'Jusqu’à quel âge peut-on souscrire, et l’assureur peut-il résilier après un sinistre ?']),
                    note('Les réponses changent d’un contrat à l’autre : ce guide vous dit quoi demander, pas quel contrat choisir. Comparez plusieurs devis et lisez les exclusions avant le prix.')
                ]],
                ['rc', 'Ne pas confondre avec la responsabilité civile', [
                    p(`L’assurance santé rembourse les soins de votre chien. Les dommages qu’il cause à autrui relèvent d’une autre garantie, la responsabilité civile : en tant que propriétaire, vous êtes responsable de ces dommages, même si le chien s’est échappé. ${src()} Cette garantie est en général incluse dans l’assurance habitation : vérifiez-le auprès de votre assureur. Pour les ${a('/chiens-categorises', 'chiens de 1re et 2e catégorie')}, elle est obligatoire.`)
                ]]
            ]
        }
    ];

    const guideUrl = g => `/guides/${g.slug}`;

    function guidePage(g) {
        const url = SITE_URL + guideUrl(g);
        const others = GUIDES.filter(o => o !== g);
        const body = `
    <main class="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        ${crumbs([['Guides pratiques', '/guides'], [g.short]])}
        <article>
            <h1 class="display">${g.title}</h1>
            <p class="mt-4 text-[17px] leading-relaxed text-slate-700">${g.intro}</p>
            <p class="mt-3 text-sm text-slate-500">Mis à jour le ${DATE_FR}. Sources consultées le ${VU}, listées en bas de page.</p>
            <nav class="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Sommaire">
                <p class="text-sm font-bold text-slate-900">Dans ce guide</p>
                <ol class="mt-2 space-y-1.5 text-sm">${g.sections.map(([id, h]) => `<li><a href="#${id}" class="text-primary-700 hover:underline">${h}</a></li>`).join('')}</ol>
            </nav>
            ${g.sections.map(([id, h, blocks]) => `<section class="mt-10 scroll-mt-24" aria-labelledby="${id}">
                <h2 id="${id}" class="text-2xl font-bold text-slate-900">${h}</h2>
                ${blocks.join('\n                ')}
            </section>`).join('\n            ')}
            <section class="mt-12 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="sources">
                <h2 id="sources" class="text-lg font-bold text-slate-900">Sources</h2>
                <ul class="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">${g.sources.map(k => `<li><a href="${SOURCES[k].url}" target="_blank" rel="noopener" class="font-semibold text-primary-700 underline">${SOURCES[k].nom}</a>${SOURCES[k].detail ? ` (${SOURCES[k].detail})` : ''}.</li>`).join('')}</ul>
                <p class="mt-3 text-sm text-slate-500">Les montants et les règles peuvent changer : vérifiez-les à la source avant de vous engager. <a href="/methode" class="font-semibold text-primary-700 underline">Notre méthode</a></p>
            </section>
        </article>

        <section class="mt-12" aria-labelledby="autres-guides">
            <h2 id="autres-guides" class="text-2xl font-bold text-slate-900">À lire aussi</h2>
            <ul class="mt-4 grid gap-4 sm:grid-cols-2">${others.map(o => `<li><a href="${guideUrl(o)}" class="block h-full rounded-2xl border border-slate-200 bg-white p-5 card-hover"><p class="flex items-center gap-2 font-bold text-slate-900">${icon(o.icon, 'h-5 w-5 shrink-0 text-slate-500')}${o.short}</p><p class="mt-1.5 text-sm leading-relaxed text-slate-600">${o.desc}</p></a></li>`).join('')}</ul>
        </section>

        <section class="mt-12 grid gap-4 sm:grid-cols-2">
            <a href="/quel-chien-choisir" class="rounded-3xl bg-slate-900 p-6 text-white hover:bg-slate-800"><p class="flex items-center gap-2 text-lg font-bold">${icon('compass', 'h-6 w-6')}Quel chien pour moi ?</p><p class="mt-1 text-sm text-slate-300">8 questions sur votre vie, et les races les plus compatibles parmi ${COUNT}.</p></a>
            <a href="/compare" class="rounded-3xl border border-slate-200 bg-white p-6 hover:border-primary-300"><p class="flex items-center gap-2 text-lg font-bold text-slate-900">${icon('plus', 'h-6 w-6')}Comparer deux races</p><p class="mt-1 text-sm text-slate-600">Vous hésitez encore ? Mettez-les côte à côte, note par note.</p></a>
        </section>
    </main>`;
        const ld = [{
            '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: clip(g.desc), mainEntityOfPage: url,
            author: { '@type': 'Organization', name: 'Race de Chien', url: `${SITE_URL}/methode` }, publisher: { '@type': 'Organization', name: 'Race de Chien', url: SITE_URL },
            dateModified: DATE, citation: g.sources.map(k => SOURCES[k].url)
        }, crumbsLd([['Guides pratiques', '/guides'], [g.short, guideUrl(g)]])];
        return page({ head: headMeta({ title: g.seo, description: clip(g.desc), url, type: 'article' }) + ldTag(ld), body });
    }

    function indexPage() {
        const url = `${SITE_URL}/guides`;
        const title = 'Guides pratiques : budget, règles et assurance du chien';
        const description = clip('Avant d’accueillir un chien : ce qu’il coûte poste par poste, ce que la loi impose à l’achat ou à l’adoption, et comment fonctionne une assurance santé. Des guides sourcés.');
        const body = `
    <main class="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        ${crumbs([['Guides pratiques']])}
        <header class="max-w-3xl">
            <h1 class="display">Guides pratiques</h1>
            <p class="mt-3 leading-relaxed text-slate-700">Choisir la race n’est que la première étape. Ces guides répondent aux questions qui viennent juste après : combien ça coûte, ce que la loi impose, comment se couvrir. Chaque chiffre y est rattaché à sa source.</p>
        </header>
        <ul class="mt-8 grid gap-4">${GUIDES.map(g => `<li><a href="${guideUrl(g)}" class="block rounded-2xl border border-slate-200 bg-white p-6 card-hover">
            <h2 class="flex items-center gap-2 text-xl font-bold text-slate-900">${icon(g.icon, 'h-6 w-6 shrink-0 text-slate-500')}${g.title}</h2>
            <p class="mt-2 leading-relaxed text-slate-600">${g.desc}</p>
            <p class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">Lire le guide${icon('arrow-right', 'h-4 w-4')}</p>
        </a></li>`).join('')}</ul>
    </main>`;
        const ld = [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url,
            mainEntity: { '@type': 'ItemList', itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE_URL + guideUrl(g), name: g.title })) } },
            crumbsLd([['Guides pratiques', '/guides']])];
        return page({ head: headMeta({ title, description, url }) + ldTag(ld), body });
    }

    return { guides: GUIDES, guideUrl, guidePage, indexPage };
};
