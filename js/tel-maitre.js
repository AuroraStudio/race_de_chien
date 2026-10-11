// Tel Maître, Tel Chien : photo → race la plus ressemblante (via /api/match-breed)
// ===== CONFIG =====
const API_URL = '/api/match-breed';
// 504 px = 18 × 18 tuiles de 28 px pour l'IA : assez pour un visage, presque rien en tokens
const MAX_PHOTO_SIZE = 504;

// ===== STATE =====
let currentImageBase64 = null;
let currentImageMimeType = null;
let webcamStream = null;
let breedsData = null;
let breedSlugs = null;
let currentResult = null;

// ===== LOADING MESSAGES =====
const loadingMessages = [
    "Analyse de votre museau...",
    "Comparaison des oreilles...",
    "Évaluation du regard...",
    "Vérification de la coiffure...",
    "Consultation de l'encyclopédie canine...",
    "Recherche de votre race idéale...",
    "Calcul du taux de ressemblance...",
];

// ===== INIT: Load breeds data =====
async function loadBreedsData() {
    try {
        const [breedsRes, slugsRes] = await Promise.all([
            fetch('/data/breeds-index.json?v={{V_DATA}}'),
            fetch('/data/breed-slugs.json')
        ]);
        const breedsJson = await breedsRes.json();
        breedsData = breedsJson.breeds;
        breedSlugs = await slugsRes.json();
    } catch (e) {
        console.error('Erreur chargement données races:', e);
    }
}
loadBreedsData();

// ===== DRAG & DROP =====

(function setupDragDrop() {
    const zone = document.getElementById('capture-zone');
    const overlay = document.getElementById('drag-overlay');
    let dragCounter = 0;

    zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;
        if (!currentImageBase64 && !webcamStream) {
            overlay.classList.remove('hidden');
            zone.classList.add('active');
        }
    });

    zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter--;
        if (dragCounter === 0) {
            overlay.classList.add('hidden');
            zone.classList.remove('active');
        }
    });

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter = 0;
        overlay.classList.add('hidden');
        zone.classList.remove('active');

        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    });
})();

// ===== CAPTURE FUNCTIONS =====

function handleCaptureClick() {
    // Only trigger file upload if no image and no webcam active
    if (!currentImageBase64 && !webcamStream) {
        document.getElementById('file-input').click();
    }
}

async function startWebcam() {
    try {
        const video = document.getElementById('webcam-video');
        webcamStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } } 
        });
        video.srcObject = webcamStream;
        
        // Show webcam, hide placeholder
        video.classList.remove('hidden');
        document.getElementById('capture-placeholder').classList.add('hidden');
        document.getElementById('action-buttons').classList.add('hidden');
        document.getElementById('webcam-controls').classList.remove('hidden');
        document.getElementById('capture-zone').classList.add('active');
    } catch (e) {
        alert('Impossible d\'accéder à la caméra. Vérifiez les permissions de votre navigateur.');
        console.error(e);
    }
}

function captureWebcam() {
    const video = document.getElementById('webcam-video');
    const canvas = document.createElement('canvas');
    
    // Square crop from center
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = MAX_PHOTO_SIZE;
    canvas.height = MAX_PHOTO_SIZE;
    const ctx = canvas.getContext('2d');
    
    // Mirror + crop
    ctx.translate(MAX_PHOTO_SIZE, 0);
    ctx.scale(-1, 1);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, MAX_PHOTO_SIZE, MAX_PHOTO_SIZE);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    currentImageBase64 = dataUrl.split(',')[1];
    currentImageMimeType = 'image/jpeg';
    
    showImagePreview(dataUrl);
    stopWebcam();
}

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop());
        webcamStream = null;
    }
    const video = document.getElementById('webcam-video');
    video.srcObject = null;
    video.classList.add('hidden');
    document.getElementById('webcam-controls').classList.add('hidden');
    document.getElementById('capture-zone').classList.remove('active');
    
    if (!currentImageBase64) {
        document.getElementById('capture-placeholder').classList.remove('hidden');
        document.getElementById('action-buttons').classList.remove('hidden');
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    processFile(file);
    event.target.value = ''; // reset
}

function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        
        // Resize if needed
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxSize = MAX_PHOTO_SIZE;
            let w = img.width, h = img.height;
            if (w > maxSize || h > maxSize) {
                if (w > h) { h = (h / w) * maxSize; w = maxSize; }
                else { w = (w / h) * maxSize; h = maxSize; }
            }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const resized = canvas.toDataURL('image/jpeg', 0.85);
            currentImageBase64 = resized.split(',')[1];
            currentImageMimeType = 'image/jpeg';
            showImagePreview(resized);
        };
        img.src = dataUrl;
    };
    reader.readAsDataURL(file);
}

function showImagePreview(dataUrl) {
    const preview = document.getElementById('image-preview');
    preview.src = dataUrl;
    preview.classList.remove('hidden');
    document.getElementById('capture-placeholder').classList.add('hidden');
    document.getElementById('action-buttons').classList.add('hidden');
    document.getElementById('analyze-controls').classList.remove('hidden');
    document.getElementById('capture-zone').classList.add('has-image');
    document.getElementById('capture-zone').onclick = null;
}

function resetCapture() {
    currentImageBase64 = null;
    currentImageMimeType = null;
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('image-preview').src = '';
    document.getElementById('capture-placeholder').classList.remove('hidden');
    document.getElementById('action-buttons').classList.remove('hidden');
    document.getElementById('analyze-controls').classList.add('hidden');
    document.getElementById('capture-zone').classList.remove('has-image');
    document.getElementById('capture-zone').onclick = () => handleCaptureClick();
}

// ===== ANALYSIS =====

let remainingAttempts = null; // null = pas encore connu

async function analyzePhoto() {
    if (!currentImageBase64) return;
    
    // Désactiver le bouton pour éviter le double-clic
    const btnAnalyze = document.getElementById('btn-analyze');
    btnAnalyze.disabled = true;
    btnAnalyze.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Show loading
    document.getElementById('capture-section').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('loading-section').classList.remove('hidden');
    
    // Animate loading
    animateLoading();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_base64: currentImageBase64,
                mime_type: currentImageMimeType
            })
        });

        const responseData = await response.json().catch(() => ({}));

        // Gérer le rate limit
        if (response.status === 429) {
            remainingAttempts = 0;
            showError('🐾 Vous avez atteint la limite de 5 essais par jour. Revenez demain pour un nouveau test !');
            return;
        }

        if (!response.ok) {
            throw new Error(responseData.error || `Erreur serveur (${response.status})`);
        }

        // Mettre à jour les essais restants
        if (responseData.remaining !== undefined) {
            remainingAttempts = responseData.remaining;
        }

        // Réponse déjà validée par le serveur (schéma imposé à l'IA)
        const result = responseData.result;
        if (!result?.breed_slug) {
            throw new Error('Réponse inattendue de l\'IA, veuillez réessayer');
        }

        // Valider que le slug existe
        if (breedSlugs && !Object.values(breedSlugs).includes(result.breed_slug)) {
            console.warn('Slug inconnu retourné:', result.breed_slug);
            result.breed_slug = 'golden-retriever'; // fallback safe
        }
        
        currentResult = result;
        showResult(result);
        
    } catch (error) {
        console.error('Erreur analyse:', error);
        showError('😅 ' + error.message + '\n\nVeuillez réessayer avec une autre photo.');
    }
}

function showError(message) {
    if (window._loadingInterval) clearInterval(window._loadingInterval);
    document.getElementById('loading-section').classList.add('hidden');
    document.getElementById('hero-section').classList.remove('hidden');
    document.getElementById('capture-section').classList.remove('hidden');
    
    // Réactiver le bouton
    const btnAnalyze = document.getElementById('btn-analyze');
    btnAnalyze.disabled = false;
    btnAnalyze.classList.remove('opacity-50', 'cursor-not-allowed');
    
    // Afficher un message d'erreur élégant au lieu d'un alert
    showToast(message);
}

function animateLoading() {
    let step = 0;
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    
    const interval = setInterval(() => {
        step++;
        if (step >= loadingMessages.length) {
            clearInterval(interval);
            bar.style.width = '95%';
            return;
        }
        text.textContent = loadingMessages[step];
        bar.style.width = `${Math.min(15 + step * 13, 95)}%`;
    }, 700);
    
    // Store interval to clear later
    window._loadingInterval = interval;
}

// ===== DISPLAY RESULT =====

function showResult(result) {
    if (window._loadingInterval) clearInterval(window._loadingInterval);
    
    // Find breed data
    const breed = breedsData?.find(b => {
        const id = b.id;
        return breedSlugs && breedSlugs[id] === result.breed_slug;
    });
    
    // Fill in result data
    const breedName = breed?.name_fr || result.breed_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    document.getElementById('result-breed-name').textContent = breedName;
    result.breed_name = breedName;
    document.getElementById('result-percentage').textContent = result.match_percentage;
    document.getElementById('result-reason').textContent = result.reason;
    
    // User photo
    document.getElementById('result-user-photo').src = `data:${currentImageMimeType};base64,${currentImageBase64}`;
    
    // Breed photo — utilise le chemin depuis breeds.json (nommé par slug)
    const breedImgUrl = breed?.image?.url ? `/${breed.image.url}` : '/images/placeholder-race.svg';
    document.getElementById('result-breed-photo').src = breedImgUrl;
    document.getElementById('result-breed-photo').onerror = function() {
        // Fallback to external URL from breeds data
        if (breed?.images?.url) this.src = breed.images.url;
    };
    
    // Breed link
    document.getElementById('result-breed-link').href = `/races/${result.breed_slug}`;
    
    // Traits
    const traitsContainer = document.getElementById('result-traits');
    traitsContainer.replaceChildren(...result.traits_communs.map(t => {
        const badge = document.createElement('span');
        badge.className = 'trait-badge';
        badge.textContent = t;
        return badge;
    }));
    
    // Share links
    const shareText = `Je ressemble à un ${breedName} à ${result.match_percentage}% ! 🐕 Découvrez à quelle race de chien vous ressemblez :`;
    const shareUrl = 'https://race-de-chien.com/tel-maitre-tel-chien';
    
    document.getElementById('share-x').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    document.getElementById('share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    document.getElementById('share-wa').href = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    
    // Show result, hide loading
    document.getElementById('loading-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    
    // Confetti!
    launchConfetti();
    
    // Scroll to result
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== RESET =====

function resetAll() {
    currentResult = null;
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('hero-section').classList.remove('hidden');
    document.getElementById('capture-section').classList.remove('hidden');
    resetCapture();
    
    // Réactiver le bouton
    const btnAnalyze = document.getElementById('btn-analyze');
    btnAnalyze.disabled = false;
    btnAnalyze.classList.remove('opacity-50', 'cursor-not-allowed');
    
    // Afficher le compteur d'essais restants si connu
    if (remainingAttempts !== null && remainingAttempts <= 2) {
        showToast(`🐾 Il vous reste ${remainingAttempts} essai${remainingAttempts > 1 ? 's' : ''} aujourd'hui`);
    }
    if (remainingAttempts === 0) {
        showToast('🐾 Vous avez utilisé tous vos essais pour aujourd\'hui. Revenez demain !');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== TOAST NOTIFICATION =====

function showToast(message) {
    // Supprimer un éventuel toast existant
    const existing = document.getElementById('toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: #1e293b; color: white; padding: 16px 24px; border-radius: 16px;
        font-size: 0.95rem; font-weight: 500; z-index: 1000; max-width: 90vw;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center;
        animation: slide-up 0.4s ease-out; line-height: 1.5;
        white-space: pre-line;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s, transform 0.4s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ===== CONFETTI =====

function launchConfetti() {
    const colors = ['#3b82f6', '#9333ea', '#f97316', '#10b981', '#f43f5e', '#eab308'];
    const shapes = ['●', '■', '▲', '🐾'];
    
    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.color = colors[Math.floor(Math.random() * colors.length)];
        piece.style.fontSize = (Math.random() * 12 + 8) + 'px';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(piece);
        
        setTimeout(() => piece.remove(), 4000);
    }
}

// ===== DOWNLOAD RESULT IMAGE =====

async function shareToApp(platform) {
    // Try Web Share API (works on mobile — can share image directly to Instagram/TikTok)
    if (navigator.share && navigator.canShare) {
        try {
            const canvas = document.getElementById('share-canvas');
            canvas.width = 1080;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');

            // Draw background
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, 1080, 1080);

            // Draw header gradient
            const headerGrad = ctx.createLinearGradient(0, 0, 1080, 0);
            headerGrad.addColorStop(0, '#3b82f6');
            headerGrad.addColorStop(1, '#a855f7');
            ctx.fillStyle = headerGrad;
            ctx.fillRect(0, 0, 1080, 160);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 36px Plus Jakarta Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Je ressemble à un...', 540, 60);
            ctx.font = 'bold 56px Plus Jakarta Sans, sans-serif';
            ctx.fillText(currentResult.breed_name, 540, 125);

            // Draw photos side by side
            const userImg = document.getElementById('result-user-photo');
            const breedImg = document.getElementById('result-breed-photo');
            const photoY = 180;
            const photoSize = 420;
            ctx.drawImage(userImg, 100, photoY, photoSize, photoSize);
            ctx.drawImage(breedImg, 560, photoY, photoSize, photoSize);

            // VS circle
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(540, photoY + photoSize / 2, 32, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
            ctx.fillText('VS', 540, photoY + photoSize / 2 + 8);

            // Match percentage
            ctx.font = 'bold 72px Plus Jakarta Sans, sans-serif';
            ctx.fillStyle = '#3b82f6';
            ctx.fillText(currentResult.match_percentage + '%', 540, 680);
            ctx.font = '24px Plus Jakarta Sans, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText('de ressemblance', 540, 720);

            // Footer
            ctx.font = 'bold 28px Plus Jakarta Sans, sans-serif';
            ctx.fillStyle = '#334155';
            ctx.fillText('race-de-chien.com/tel-maitre-tel-chien', 540, 1040);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'mon-chien-jumeau.png', { type: 'image/png' });

            const shareData = {
                title: `Je ressemble à un ${currentResult.breed_name} !`,
                text: `Je ressemble à un ${currentResult.breed_name} à ${currentResult.match_percentage}% ! 🐕 Découvrez à quelle race de chien vous ressemblez :`,
                url: 'https://race-de-chien.com/tel-maitre-tel-chien',
                files: [file]
            };

            if (navigator.canShare(shareData)) {
                await navigator.share(shareData);
                return;
            }
        } catch (e) {
            if (e.name === 'AbortError') return; // User cancelled
            console.warn('Web Share failed, falling back:', e);
        }
    }

    // Fallback: download the image + show instruction
    await downloadResult();
    const appName = platform === 'instagram' ? 'Instagram' : 'TikTok';
    alert(`L'image a été téléchargée ! 📸\nOuvrez ${appName} et partagez-la depuis votre galerie.`);
}

async function downloadResult() {
    if (!currentResult) return;
    
    const canvas = document.getElementById('share-canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#9333ea');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    
    // White card
    ctx.fillStyle = 'white';
    roundRect(ctx, 40, 40, 1000, 1000, 30);
    ctx.fill();
    
    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 42px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tel Maître, Tel Chien 🐕', 540, 110);
    
    // Load and draw images
    try {
        const userImg = await loadImage(`data:${currentImageMimeType};base64,${currentImageBase64}`);
        const breedForImg = breedsData?.find(b => breedSlugs?.[b.id] === currentResult.breed_slug);
        const breedShareImgUrl = breedForImg?.image?.url ? `/${breedForImg.image.url}` : `/images/breeds/${currentResult.breed_slug}.jpg`;
        
        // User photo (left)
        ctx.save();
        roundRect(ctx, 80, 150, 420, 420, 20);
        ctx.clip();
        drawCover(ctx, userImg, 80, 150, 420, 420);
        ctx.restore();
        
        // Breed photo (right)
        try {
            const breedImg = await loadImage(breedShareImgUrl);
            ctx.save();
            roundRect(ctx, 580, 150, 420, 420, 20);
            ctx.clip();
            drawCover(ctx, breedImg, 580, 150, 420, 420);
            ctx.restore();
        } catch(e) {
            ctx.fillStyle = '#f1f5f9';
            roundRect(ctx, 580, 150, 420, 420, 20);
            ctx.fill();
        }
    } catch(e) {
        console.error('Image load error for share canvas:', e);
    }
    
    // VS badge
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(540, 360, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
    ctx.fillText('VS', 540, 368);
    
    // Breed name
    const breedName = document.getElementById('result-breed-name').textContent;
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 38px Plus Jakarta Sans, sans-serif';
    ctx.fillText(breedName, 540, 640);
    
    // Percentage
    const pct = currentResult.match_percentage;
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 56px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`${pct}%`, 540, 710);
    
    // Reason (wrapped)
    ctx.fillStyle = '#64748b';
    ctx.font = '20px Plus Jakarta Sans, sans-serif';
    wrapText(ctx, currentResult.reason, 540, 770, 880, 28);
    
    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Plus Jakarta Sans, sans-serif';
    ctx.fillText('race-de-chien.com/tel-maitre-tel-chien', 540, 1010);
    
    // Download
    const link = document.createElement('a');
    link.download = `tel-maitre-tel-chien-${currentResult.breed_slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Canvas helper functions
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function drawCover(ctx, img, x, y, w, h) {
    const ratio = Math.max(w / img.width, h / img.height);
    const nw = img.width * ratio;
    const nh = img.height * ratio;
    ctx.drawImage(img, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;
    for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxWidth && line) {
            ctx.fillText(line.trim(), x, y + lineCount * lineHeight);
            line = word + ' ';
            lineCount++;
            if (lineCount >= 4) { // Max 4 lines
                ctx.fillText(line.trim() + '...', x, y + lineCount * lineHeight);
                return;
            }
        } else {
            line = test;
        }
    }
    ctx.fillText(line.trim(), x, y + lineCount * lineHeight);
}
