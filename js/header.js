// Header commun pour toutes les pages
function renderHeader() {
    const headerHTML = `
        <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
            <div class="max-w-[1600px] mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <a href="index.html" class="flex items-center gap-3 group">
                        <!-- Logo avec bordure dégradée -->
                        <div class="relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white">
                            <div style="position:absolute;inset:0;border-radius:inherit;padding:2px;background:linear-gradient(135deg,#3b82f6,#9333ea);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;"></div>
                            🐕
                        </div>
                        
                        <div>
                            <h1 class="text-xl font-bold text-slate-900">Race de Chien</h1>
                            <p class="text-xs text-slate-500">Encyclopédie canine complète</p>
                        </div>
                    </a>
                    
                    <nav class="hidden md:flex items-center gap-6">
                        <a href="index.html" class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Accueil</a>
                        <a href="index.html#races" class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Les races</a>
                        <a href="compare.html" class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Comparer</a>
                    </nav>
                    
                    <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-600 hover:text-primary-600">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100">
                <div class="px-6 py-4 space-y-3">
                    <a href="index.html" class="block text-sm font-medium text-slate-600 hover:text-primary-600">Accueil</a>
                    <a href="index.html#races" class="block text-sm font-medium text-slate-600 hover:text-primary-600">Les races</a>
                    <a href="compare.html" class="block text-sm font-medium text-slate-600 hover:text-primary-600">Comparer</a>
                </div>
            </div>
        </header>
    `;
    
    // Injecter dans tous les éléments avec la classe 'site-header'
    document.querySelectorAll('.site-header').forEach(el => {
        el.innerHTML = headerHTML;
    });
    
    // Setup mobile menu
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

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', renderHeader);
