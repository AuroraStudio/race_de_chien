// Header commun pour toutes les pages

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
    "Les chiens ne font pas de bruit quand ils pètent. C'est leur super-pouvoir le plus mystérieux.",
    "Qui besoin d'un réveil quand on a un chien avec une vessie ponctuelle ?",
    "Mon chien détruit tout ce qu'il touche. Sauf mon cœur, celui-là il le garde intact.",
    "Un chien, c'est la preuve que Dieu veut qu'on soit heureux... et qu'on ramasse des crottes."
];

function getRandomQuote() {
    return dogQuotes[Math.floor(Math.random() * dogQuotes.length)];
}

function renderHeader() {
    const quote = getRandomQuote();
    const escapedQuote = quote.replace(/"/g, '&quot;');
    
    const headerHTML = `
        <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
            <div class="max-w-[1600px] mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <a href="/" class="flex items-center gap-3 group shrink-0">
                        <div class="relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white">
                            <div style="position:absolute;inset:0;border-radius:inherit;padding:2px;background:linear-gradient(135deg,#3b82f6,#9333ea);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;"></div>
                            🐕
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-slate-900">Race de Chien</h1>
                            <p class="text-xs text-slate-500">Encyclopédie canine complète</p>
                        </div>
                    </a>

                    <!-- Citation au centre (desktop only) -->
                    <div class="hidden lg:flex flex-1 justify-center px-8 min-w-0">
                        <p id="random-quote" class="text-sm text-slate-400 italic text-center leading-snug" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                            « ${quote} »
                        </p>
                    </div>
                    
                    <nav class="hidden md:flex items-center gap-6 shrink-0">
                        <a href="/" class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Accueil</a>
                        <a href="/#races" class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Les races</a>
                        <a href="/compare" class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Comparer</a>
                        <a href="/tel-maitre-tel-chien" class="relative text-sm font-medium px-3 py-1.5 rounded-lg transition-all hover:shadow-lg" style="background:white;"><span style="position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:linear-gradient(135deg,#3b82f6,#9333ea);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;"></span><span class="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">🐕 Tel Maître, Tel Chien</span></a>
                    </nav>
                    
                    <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-600 hover:text-primary-600">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100">
                <div class="px-6 py-4 space-y-3">
                    <a href="/" class="block text-sm font-medium text-slate-600 hover:text-primary-600">Accueil</a>
                    <a href="/#races" class="block text-sm font-medium text-slate-600 hover:text-primary-600">Les races</a>
                    <a href="/compare" class="block text-sm font-medium text-slate-600 hover:text-primary-600">Comparer</a>
                    <a href="/tel-maitre-tel-chien" class="block text-sm font-medium text-primary-600 hover:text-primary-700 font-bold">🐕 Tel Maître, Tel Chien</a>
                    <p class="text-xs text-slate-400 italic pt-2 border-t border-slate-100">« ${quote} »</p>
                </div>
            </div>
        </header>
    `;
    
    document.querySelectorAll('.site-header').forEach(el => {
        el.innerHTML = headerHTML;
    });
    
    setupMobileMenu();
}

function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

document.addEventListener('DOMContentLoaded', renderHeader);
