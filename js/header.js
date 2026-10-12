// Header commun pour toutes les pages + consentement à la mesure d'audience

// Citations drôles et sympathiques sur les chiens
const dogQuotes = [
    "Le chien est le seul être au monde qui vous aime plus qu'il ne s'aime lui-même.",
    "Un chien, c'est un peu comme un enfant qui ne grandit jamais... et qui ne réclame jamais la voiture !",
    "Les chiens ne mentent jamais sur leur amour. Contrairement aux chats, qui ne mentent jamais sur leur indifférence.",
    "Qui a dit que l'argent ne faisait pas le bonheur ? Il n'a jamais acheté de croquettes apparemment !",
    "Mon chien n'est pas gros, il est juste... facile à trouver dans le noir.",
    "Un chien heureux remue la queue. Un chat heureux... existe-t-il vraiment ?",
    "Les chiens ont des maîtres. Les chats ont du personnel.",
    "Je ne suis pas paresseux, je suis en mode économie d'énergie. Comme mon chien sur le canapé.",
    "Le meilleur ami de l'homme ? Celui qui ne juge pas quand on mange du fromage à 3h du matin.",
    "Un chien, c'est un coeur qui bat au bout d'une laisse.",
    "Mon chien me regarde manger comme si je venais de gagner à la loterie. À chaque repas.",
    "Qui a besoin d'un réveil quand on a un chien avec une vessie ponctuelle ?",
    "Mon chien détruit tout ce qu'il touche. Sauf mon cœur, celui-là il le garde intact."
];

function getRandomQuote() {
    return dogQuotes[Math.floor(Math.random() * dogQuotes.length)];
}

const NAV_LINKS = [
    { href: '/', label: 'Les races' },
    { href: '/quel-chien-choisir', label: 'Quel chien pour moi ?' },
    { href: '/compare', label: 'Comparer' }
];

function renderHeader() {
    const quote = getRandomQuote();
    const path = location.pathname.replace(/\/$/, '') || '/';
    const navItem = l => `<a href="${l.href}" class="text-sm font-medium ${path === l.href ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'} transition-colors"${path === l.href ? ' aria-current="page"' : ''}>${l.label}</a>`;

    const ic = (n, c) => (window.RDCIcon ? window.RDCIcon(n, c) : '');
    const headerHTML = `
        <a href="#contenu" class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-700 focus:shadow-lg">Aller au contenu</a>
        <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
            <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
                <div class="flex items-center justify-between gap-4">
                    <a href="/" class="flex items-center gap-3 group shrink-0">
                        <span class="relative w-11 h-11 rounded-2xl flex items-center justify-center text-2xl bg-white">
                            <span aria-hidden="true" style="position:absolute;inset:0;border-radius:inherit;padding:2px;background:linear-gradient(135deg,#3b82f6,#9333ea);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;"></span>
                            <span aria-hidden="true">🐕</span>
                        </span>
                        <span>
                            <span class="block text-lg font-bold text-slate-900 leading-tight">Race de Chien</span>
                            <span class="block text-xs text-slate-500">Trouver la race faite pour soi</span>
                        </span>
                    </a>

                    <div class="hidden xl:flex flex-1 justify-center px-6 min-w-0">
                        <p class="text-sm text-slate-500 italic text-center leading-snug" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:520px;">«&nbsp;${quote}&nbsp;»</p>
                    </div>

                    <nav class="hidden md:flex items-center gap-6 shrink-0" aria-label="Navigation principale">
                        ${NAV_LINKS.map(navItem).join('')}
                        <a href="/tel-maitre-tel-chien" class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-colors ${path === '/tel-maitre-tel-chien' ? 'border-primary-600 bg-primary-600 text-white' : 'border-primary-200 bg-primary-50 text-primary-700 hover:border-primary-300 hover:bg-primary-100'}"${path === '/tel-maitre-tel-chien' ? ' aria-current="page"' : ''}>${ic('camera', 'h-[18px] w-[18px]')}Tel Maître, Tel Chien</a>
                    </nav>

                    <button id="mobile-menu-btn" class="md:hidden -mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu">
                        ${ic('list', 'h-6 w-6')}
                    </button>
                </div>
            </div>

            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100">
                <nav class="px-6 py-4 space-y-3" aria-label="Navigation mobile">
                    ${NAV_LINKS.map(l => `<a href="${l.href}" class="block py-1 text-[15px] font-medium text-slate-800 hover:text-primary-600">${l.label}</a>`).join('')}
                    <a href="/tel-maitre-tel-chien" class="flex items-center gap-2 py-1 text-[15px] font-semibold text-primary-700">${ic('camera', 'h-5 w-5')}Tel Maître, Tel Chien</a>
                    <p class="text-sm text-slate-500 italic pt-3 border-t border-slate-100">«&nbsp;${quote}&nbsp;»</p>
                </nav>
            </div>
        </header>
    `;

    document.querySelectorAll('.site-header').forEach(el => {
        el.innerHTML = headerHTML;
    });
    // Cible du lien « Aller au contenu »
    const main = document.querySelector('main');
    if (main) {
        if (!main.id) main.id = 'contenu';
        main.setAttribute('tabindex', '-1');
        document.querySelector('a[href="#contenu"]')?.setAttribute('href', '#' + main.id);
    }

    setupMobileMenu();
}

function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            const open = menu.classList.toggle('hidden') === false;
            btn.setAttribute('aria-expanded', String(open));
        });
    }
}

// ===== Consentement (CNIL) : Google Analytics ne se charge qu'après un « Accepter » =====
const GA_ID = 'G-WFNTS7FRZP';
const CONSENT_KEY = 'rdc-consent';
const CONSENT_DAYS = 395; // 13 mois maximum

function readConsent() {
    try {
        const raw = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
        if (raw && Date.now() - raw.at < CONSENT_DAYS * 864e5) return raw.value;
    } catch (e) { /* stockage indisponible : on redemandera */ }
    return null;
}

function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, at: Date.now() })); } catch (e) { /* ignoré */ }
}

function loadAnalytics() {
    if (window.__rdcGaLoaded) return;
    window.__rdcGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
}

function showConsentBanner() {
    if (document.getElementById('consent-banner')) return;
    const box = document.createElement('div');
    box.id = 'consent-banner';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Mesure d’audience');
    box.className = 'fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-[60] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl';
    box.innerHTML = `
        <p class="text-sm text-slate-700 leading-relaxed">Nous aimerions mesurer l'audience du site avec Google Analytics, pour savoir quelles pages vous servent. Rien ne se déclenche sans votre accord.</p>
        <div class="mt-3 flex gap-2">
            <button type="button" data-consent="denied" class="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refuser</button>
            <button type="button" data-consent="granted" class="flex-1 rounded-xl border border-primary-600 bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700">Accepter</button>
        </div>
        <a href="/confidentialite" class="mt-2 inline-block text-xs text-slate-500 underline hover:text-slate-700">Ce que nous mesurons</a>`;
    box.addEventListener('click', e => {
        const value = e.target.closest('[data-consent]')?.dataset.consent;
        if (!value) return;
        saveConsent(value);
        box.remove();
        if (value === 'granted') loadAnalytics();
    });
    document.body.appendChild(box);
}

window.rdcConsent = { open: showConsentBanner };

function initConsent() {
    const consent = readConsent();
    if (consent === 'granted') loadAnalytics();
    else if (consent === null) showConsentBanner();
    document.querySelectorAll('[data-open-consent]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); showConsentBanner(); }));
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    initConsent();
});
