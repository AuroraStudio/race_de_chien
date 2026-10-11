# Tel maître tel chien : options IA (état au 11 octobre 2026)

Contexte : site statique race-de-chien.com (HTML + Tailwind CDN) sur Vercel, fonction serverless `api/match-breed.js`. Aujourd'hui : selfie en base64 (jusqu'à 1024 px) + prompt de ~21 400 caractères (catalogue des 169 races + consignes) envoyés au modèle `claude-sonnet-4-20250514`, réponse JSON libre (`breed_slug`, pourcentage, explication, traits).

Faits vérifiés par lecture des docs officielles, de l'API Hugging Face, des registres npm/jsDelivr et du code source de Transformers.js 4.3.1. Les temps d'inférence ont été **mesurés** sur un Mac M1 Pro (Chromium 152, page servie en localhost) ; les temps « mobile » sont des **estimations** signalées comme telles.

---

## 0. Constat urgent : la fonction actuelle ne peut plus marcher

- `claude-sonnet-4-20250514` est **retiré depuis le 15 juin 2026** sur l'API Claude (déprécié le 14 avril 2026, remplaçant recommandé `claude-sonnet-5-5`). « Requests to retired models will fail. » Source : https://platform.claude.com/docs/en/about-claude/model-deprecations
- La page de tarifs le marque « retired, except on Bedrock and Google Cloud ». Source : https://platform.claude.com/docs/en/about-claude/pricing
- Coût théorique de l'appel actuel (s'il marchait) : prompt ~6 700 tokens non mis en cache + image 1024×1024 = 1 369 tokens + ~400 tokens de sortie à 3 $/15 $ → **≈ 0,030 $ par analyse** (calcul en §2.5).

Conséquence : quelle que soit l'option retenue, un correctif minimal (changer de modèle) est à faire tout de suite.

---

## 1. Option A : 100 % navigateur, zéro token

### 1.1 Runtime : Transformers.js

| Élément | Fait vérifié | Source |
|---|---|---|
| Dernière version stable | `@huggingface/transformers` **4.3.1** (publiée le 6 oct. 2026) ; 4.3.0 le 16 sept. 2026 ; licence Apache-2.0 | https://registry.npmjs.org/@huggingface/transformers |
| Recommandation d'épinglage | **4.3.0** (plus de 2 semaines) ou 4.3.1 après quelques jours de recul. 4.3.1 dépend de `onnxruntime-web@1.31.0-dev.20260914-8d85527a0` (build *dev*) ; la dernière stable d'ORT Web est 1.30.0 (MIT) | package.json : https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/package.json ; https://registry.npmjs.org/onnxruntime-web/latest |
| Import ESM par CDN | `import { ... } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1'` (sert `dist/transformers.min.js`, 586 Ko brut, **168 Ko en brotli** mesuré) | README du paquet : https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/README.md |
| Binaire WASM chargé par défaut | `https://cdn.jsdelivr.net/npm/onnxruntime-web@<version>/dist/ort-wasm-simd-threaded.asyncify.wasm` : **26,9 Mo brut, 5,5 Mo en brotli** (mesuré). Sur Safari < 26 sans WebGPU, variante sans suffixe : 14,3 Mo brut / 3,1 Mo brotli | code source 4.3.1, `dist/transformers.web.js` (bloc `wasmPathPrefix`) ; fichiers : https://data.jsdelivr.com/v1/packages/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0 |
| Modèles | par défaut depuis `https://huggingface.co/{model}/resolve/{revision}/` ; mis en cache par l'API Cache du navigateur (`transformers-cache`) : 2e visite = pas de re-téléchargement (mesuré : chargement SigLIP q8 en 303 ms depuis le cache contre ~3,4 s à froid) | code source 4.3.1 (`env.remoteHost`, `useBrowserCache`) |
| dtype par défaut | **WASM → q8** (`*_quantized.onnx`) ; **WebGPU → fp32** si on ne précise rien (fichiers de 350 Mo !). Toujours passer `dtype: 'fp16'` ou `'q4f16'` en WebGPU | code source 4.3.1 (`DEFAULT_DEVICE_DTYPE_MAPPING`, `DEFAULT_DTYPE_SUFFIX_MAPPING`) |
| Encodeur image seul | **Oui.** `CLIPVisionModelWithProjection` et `SiglipVisionModel` chargent uniquement `onnx/vision_model{suffixe}.onnx`. Vérifié dans le cache du navigateur : seuls `config.json`, `preprocessor_config.json` et `vision_model_*.onnx` sont téléchargés, pas le tokenizer ni l'encodeur texte | code source 4.3.1 (`model_file_name: "vision_model"`) + inspection de `caches` |
| Threads WASM | sans en-têtes COOP/COEP (`crossOriginIsolated === false`, cas du site actuel), ORT tourne sur **1 thread** | mesuré (`self.crossOriginIsolated` = false) |

### 1.2 Compatibilité navigateurs mobiles

| Plateforme | WebGPU | Source |
|---|---|---|
| iOS / iPadOS (Safari 26, sept. 2025) | WebGPU « is now shipping in Safari 26.0 for macOS, iOS, iPadOS, and visionOS » | https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ |
| iOS < 26 | pas de WebGPU → repli WASM (Transformers.js détecte `IS_SAFARI_BELOW_26`) | code source 4.3.1 |
| Android Chrome | activé par défaut depuis Chrome 121 sur **Android 12+ avec GPU Qualcomm et ARM** ; élargissement progressif annoncé, couverture actuelle non publiée | https://developer.chrome.com/blog/new-in-webgpu-121 |

Conclusion pratique : prévoir le repli WASM q8 comme chemin principal, WebGPU comme bonus.

### 1.3 Modèles d'embedding image/texte utilisables

Tailles lues dans l'API Hugging Face (arbre `onnx/`). Temps mesurés sur M1 Pro, image 224 px, médiane de 5 passes après échauffement.

| Modèle (dépôt ONNX compatible Transformers.js) | Licence des poids | Encodeur image q8 | q4f16 | fp16 | WASM q8 (1 thread) | WebGPU |
|---|---|---|---|---|---|---|
| **CLIP ViT-B/32** `Xenova/clip-vit-base-patch32` | MIT (code et poids OpenAI) ; la model card déclare « Any deployed use case of the model … is currently out of scope » | 89,1 Mo | 53,3 Mo | 176,1 Mo | **240 ms** (q4f16 en WASM : 379 ms, plus lent) | fp16 : **24 ms** (1er appel 484 ms) ; q4f16 : 19 ms |
| **SigLIP B/16-224** `Xenova/siglip-base-patch16-224` | Apache-2.0 | 99,5 Mo (`vision_model_quantized`) | 54,6 Mo | 186,1 Mo | **881 à 914 ms** | fp16 : **42 ms** (1er appel 493 ms) |
| **SigLIP 2 B/16-224** `onnx-community/siglip2-base-patch16-224-ONNX` | Apache-2.0 | 94,6 Mo | 54,6 Mo | 186,0 Mo | non mesuré (même architecture B/16, attendre ≈ SigLIP) | non mesuré |
| **TinyCLIP 8M** `onnx-community/TinyCLIP-ViT-8M-16-Text-3M-YFCC15M-ONNX` | MIT | pas d'encodeur séparé : modèle combiné **24,3 Mo** q8 | 32,1 Mo (combiné) | 47,2 Mo | **≈ 105 ms** (image + texte) | non mesuré |
| MobileCLIP-S0 `Xenova/mobileclip_s0` | **Apple AMLR : recherche uniquement**, « does not include any commercial exploitation, product development or use in any commercial product or service » | 11,8 Mo | n/a | 22,9 Mo | 229 ms | non mesuré |
| MobileCLIP2 (Apple, août 2025) | Apple AMLR (même licence) | aucun dépôt Xenova/onnx-community ; seulement des exports communautaires non validés (`plhery/mobileclip2-onnx`, `RuteNL/...`) | | | | |

Sources des tailles : https://huggingface.co/api/models/Xenova/clip-vit-base-patch32/tree/main/onnx , https://huggingface.co/api/models/Xenova/siglip-base-patch16-224/tree/main/onnx , https://huggingface.co/api/models/onnx-community/siglip2-base-patch16-224-ONNX/tree/main/onnx , https://huggingface.co/api/models/onnx-community/TinyCLIP-ViT-8M-16-Text-3M-YFCC15M-ONNX/tree/main?recursive=1 , https://huggingface.co/api/models/Xenova/mobileclip_s0/tree/main/onnx
Sources des licences : https://github.com/openai/CLIP/blob/main/LICENSE , https://huggingface.co/openai/clip-vit-base-patch32 , https://huggingface.co/google/siglip-base-patch16-224 , https://huggingface.co/google/siglip2-base-patch16-224 , https://huggingface.co/wkcn/TinyCLIP-ViT-8M-16-Text-3M-YFCC15M , https://huggingface.co/apple/MobileCLIP-S0/blob/main/LICENSE , https://raw.githubusercontent.com/apple/ml-mobileclip/main/LICENSE_MODELS (ajouté avec la sortie de MobileCLIP2 le 29/08/2025), https://github.com/apple/ml-mobileclip

Points importants :
- **MobileCLIP et MobileCLIP2 sont exclus** pour un site public : les poids sont sous licence de recherche Apple. Le fichier LICENSE du dépôt Xenova reprend l'ancienne licence de code Apple (2024), mais Apple applique désormais la licence AMLR aux poids.
- Une version LAION de CLIP B/32 sous MIT existe (`onnx-community/CLIP-ViT-B-32-laion2B-s34B-b79K-ONNX`) mais seulement en modèle combiné (152,7 Mo q8) : il faudrait refaire un export « vision seule » soi-même.
- **Temps mobile (estimation, non mesurée)** : un iPhone récent a une performance mono-cœur du même ordre qu'un M1 → CLIP B/32 q8 ≈ 250-400 ms, SigLIP q8 ≈ 1-1,5 s en WASM ; Android milieu de gamme ≈ ×2 à ×4, entrée de gamme davantage. Le premier appel WebGPU ajoute ~0,5 s de compilation des shaders (mesuré sur Mac). À mesurer sur vrais téléphones avec la page de bench (§6).

### 1.4 MediaPipe Tasks Vision : Face Landmarker

| Élément | Fait vérifié | Source |
|---|---|---|
| Version | `@mediapipe/tasks-vision` **1.1.0** (6 oct. 2026), 1.0.1 (31 juil. 2026), nightlies 1.1.1-rc ; recommandé : **1.0.1** | https://registry.npmjs.org/@mediapipe/tasks-vision |
| Licence | paquet Apache-2.0 (npm) ; poids annoncés Apache-2.0 par des sources tierces, **à confirmer dans les model cards** liées depuis la doc | https://www.npmjs.com/package/@mediapipe/tasks-vision ; https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker |
| Modèle | `face_landmarker.task` float16 : **3,76 Mo** (3 758 596 octets, non compressible) ; contient détecteur BlazeFace + Face Mesh V2 (478 points 3D) + modèle de 52 blendshapes | HEAD sur https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task ; doc ci-dessus |
| Runtime | `vision_bundle.mjs` 45 Ko brotli + `vision_wasm_internal.wasm` 13,0 Mo brut / **3,1 Mo brotli** | https://data.jsdelivr.com/v1/packages/npm/@mediapipe/tasks-vision@1.1.0?structure=flat (tailles mesurées sur 1.0.1) |
| Total à télécharger | **≈ 6,9 Mo** (et non ~4 Mo : le WASM pèse plus que le modèle) | calcul |
| Temps mesuré (M1 Pro) | délégué CPU : **27 ms** médiane (1er appel 89 ms, chargement 1,0 s) ; délégué GPU : 25 ms mais **5,7 s au premier appel** → rester en CPU pour une image unique | mesuré |
| Sorties utiles | 478 landmarks (largeur/hauteur du visage, écartement des yeux, mâchoire), 52 blendshapes (ex. `mouthSmileLeft` = 0,96 sur un portrait souriant) | mesuré |

MediaPipe ne donne ni couleur ni texture des cheveux, ni barbe, ni lunettes : il faut un modèle type CLIP/SigLIP, de l'échantillonnage de pixels (fragile), ou demander à l'utilisateur.

### 1.5 Qualité : ce que montrent deux tests rapides

Tests sur un seul portrait officiel (homme souriant, cheveux noirs très courts, rasé, sans lunettes). **Un seul exemple, ce n'est pas une évaluation**, mais les signaux sont nets.

1. **Attributs zéro-shot par texte** (softmax par groupe de libellés anglais) :
   - Recadrer sur le visage améliore nettement les scores (CLIP fp16 : « rasé » passe de 0,59 à 0,86, « sans lunettes » de 0,66 à 0,88).
   - **CLIP B/32 q8 (WASM) se trompe sur les lunettes** (« glasses » 0,52) alors que CLIP fp16/q4f16 en WebGPU répond juste : la quantification dégrade CLIP. Il faut évaluer le dtype réellement livré.
   - **SigLIP q8 est le plus juste** : cheveux noirs, très courts, rasé, sans lunettes (0,96), grand sourire (0,97), mâchoire carrée.
   - Tous les modèles hésitent sur « très courts » contre « chauve », et CLIP voit souvent « gris ».
2. **Similarité directe selfie → photos de races** (15 photos du site) : écart entre la meilleure et la pire race de 0,086 (SigLIP) à 0,12 (CLIP), et les deux modèles ne s'accordent pas (Carlin contre Lévrier afghan en tête). Le signal est dominé par la composition de la photo. **Précalculer les embeddings des 169 photos de races ne suffit pas** pour un matching crédible.

Architecture A crédible : visage recadré (MediaPipe) → attributs zéro-shot (SigLIP) + géométrie et sourire (MediaPipe) → table d'attributs des races (couleur, longueur et texture du pelage, barbe, catégorie morphologique déjà présente dans `match-breed.js`) → score pondéré + léger aléa déterministe (hash de l'image) pour éviter de toujours sortir les mêmes races. À calibrer sur 50 à 100 selfies annotés.

### 1.6 Hébergement des fichiers et CSP

Vercel Hobby :
- « Static File uploads » limité à **100 Mo** (1 Go en Pro) ; le dossier `images/breeds` pèse déjà **62 Mo**. Un encodeur de 89 à 99,5 Mo ne passe pas. Source : https://vercel.com/docs/limits (un changelog du 17/06/2026 annonce la suppression de limites « CLI-specific » sans préciser lesquelles : https://vercel.com/changelog/cli-deployment-limits-removed)
- Bande passante incluse : **100 Go/mois** de Fast Data Transfer. Un modèle de 89 Mo servi par Vercel = ~1 100 premiers chargements par mois avant blocage. Source : https://vercel.com/docs/plans/hobby
- Hobby = « non-commercial, personal use only ». Même source.
- GitHub (déploiement par Git) : avertissement au-delà de 50 Mio, **blocage au-delà de 100 Mio** sans Git LFS. Le fichier SigLIP Xenova (99,5 Mo) est à la limite. Source : https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github

Recommandation : modèles chargés depuis le CDN Hugging Face **en épinglant le commit** (`revision`), runtimes depuis jsDelivr en version exacte. Auto-hébergement possible pour MediaPipe seul (~6,9 Mo). Hugging Face redirige les `.onnx` vers un CDN `*.hf.co` (constaté : `https://us.aws.cdn.hf.co/xet-bridge-us/...`, `access-control-allow-origin: *`, pas de compression).

Commits à épingler (relevés le 11/10/2026) :
- `Xenova/clip-vit-base-patch32` : `d15189d7028b43f1d3e65039190477f6af591c2a`
- `Xenova/siglip-base-patch16-224` : `4649052661e53c7000355844105f8a1792088239`
- `onnx-community/siglip2-base-patch16-224-ONNX` : `ba1f3b0843f24bc5417d38e19c37b287d719b2f4`
- `onnx-community/TinyCLIP-ViT-8M-16-Text-3M-YFCC15M-ONNX` : `9463a9c508a344c837ffefe9d724f3827bf2dc79`

Content-Security-Policy (la CSP actuelle est dans `vercel.json`) :

| Directive | À ajouter pour l'option A | Pourquoi |
|---|---|---|
| `script-src` | `https://cdn.jsdelivr.net blob:` | import ESM de Transformers.js et MediaPipe ; Transformers.js recharge la fabrique WASM d'ORT en **URL `blob:`** puis l'importe (`loadWasmFactory`, code 4.3.1) |
| `script-src` (WASM) | `'wasm-unsafe-eval'` | compilation WebAssembly. La CSP actuelle contient déjà `'unsafe-eval'`, qui l'autorise aussi ; passer à `'wasm-unsafe-eval'` seul est plus strict, à tester avec Tailwind CDN |
| `connect-src` | `https://cdn.jsdelivr.net https://huggingface.co https://*.hf.co https://storage.googleapis.com` | `fetch` du `.wasm` (mis en cache), des modèles HF et de leur redirection CDN, du `.task` MediaPipe |
| `worker-src` | `'self' blob:` | seulement si l'inférence est déplacée dans un Web Worker (conseillé pour ne pas figer l'interface) |
| `connect-src` | retirer `https://api.anthropic.com` | inutile aujourd'hui : l'appel part du serveur, pas du navigateur |

Variante tout auto-hébergé : `env.allowRemoteModels = false`, `env.localModelPath = '/models/'`, `env.backends.onnx.wasm.wasmPaths = '/vendor/ort/'` ; alors `script-src 'self' blob: 'wasm-unsafe-eval'` et `connect-src 'self'` suffisent, au prix des limites Vercel ci-dessus.

### 1.7 Modèle de démonstration conseillé et code minimal

- **Le plus fiable** testé : `Xenova/siglip-base-patch16-224` (Apache-2.0). Lourd : 99,5 Mo en q8 (WASM), 54,6 Mo en q4f16 (WebGPU).
- **Le plus léger** sous licence permissive : TinyCLIP 8M (MIT, 24,3 Mo, ~105 ms), mais modèle combiné et qualité plus faible (cheveux vus « gris »).
- CLIP B/32 : correct en fp16/q4f16 WebGPU, moins fiable en q8.

Côté navigateur (charge **uniquement** l'encodeur image) :

```html
<script type="module">
import { env, AutoProcessor, SiglipVisionModel, RawImage }
  from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0';

const MODEL = 'Xenova/siglip-base-patch16-224';
const REVISION = '4649052661e53c7000355844105f8a1792088239';

const adapter = 'gpu' in navigator ? await navigator.gpu.requestAdapter() : null;
const device = adapter ? 'webgpu' : 'wasm';
const dtype  = adapter ? 'q4f16' : 'q8';   // jamais fp32 par défaut en WebGPU

const [processor, vision, bank] = await Promise.all([
  AutoProcessor.from_pretrained(MODEL, { revision: REVISION }),
  SiglipVisionModel.from_pretrained(MODEL, { revision: REVISION, device, dtype }),
  fetch('/data/attr-embeddings.json').then(r => r.json()),   // précalculé hors ligne
]);

// canvas = visage recadré (boîte issue de MediaPipe Face Landmarker)
export async function embedCanvas(canvas) {
  const inputs = await processor(RawImage.fromCanvas(canvas));
  const { pooler_output } = await vision(inputs);   // CLIP : image_embeds
  return pooler_output.normalize().data;            // Float32Array(768)
}

export function scoreAttributes(vec) {
  const out = {};
  for (const [group, { labels, emb }] of Object.entries(bank.groups)) {
    const logits = emb.map(e => 100 * e.reduce((s, x, i) => s + x * vec[i], 0));
    const m = Math.max(...logits);
    const ex = logits.map(l => Math.exp(l - m));
    const z = ex.reduce((a, b) => a + b, 0);
    out[group] = Object.fromEntries(labels.map((l, i) => [l, ex[i] / z]));
  }
  return out;   // { hair_color: { 'black hair': 0.65, ... }, ... }
}
</script>
```

Hors ligne (Node, une fois) pour les embeddings texte des attributs :

```js
// npm i @huggingface/transformers@4.3.0 ; node precompute.mjs
import { AutoTokenizer, SiglipTextModel } from '@huggingface/transformers';
import fs from 'node:fs';

const MODEL = 'Xenova/siglip-base-patch16-224';
const GROUPS = {
  hair_color: ['blond hair', 'brown hair', 'black hair', 'red hair', 'gray hair'],
  hair_length: ['very short hair', 'long hair', 'a bald head'],
  hair_texture: ['straight hair', 'curly hair'],
  beard: ['a clean-shaven face', 'a beard'],
  glasses: ['glasses', 'no glasses'],
};
const tok = await AutoTokenizer.from_pretrained(MODEL);
const txt = await SiglipTextModel.from_pretrained(MODEL, { dtype: 'fp32' });
const bank = { model: MODEL, groups: {} };
for (const [g, labels] of Object.entries(GROUPS)) {
  // SigLIP attend un padding 'max_length' (64)
  const inputs = tok(labels.map(l => `a photo of a person with ${l}`),
                     { padding: 'max_length', max_length: 64, truncation: true });
  const { pooler_output } = await txt(inputs);
  bank.groups[g] = { labels, emb: pooler_output.normalize().tolist()
                                   .map(v => v.map(x => +x.toFixed(4))) };
}
fs.writeFileSync('data/attr-embeddings.json', JSON.stringify(bank));
```

Ce code reprend exactement les appels utilisés pendant les mesures (classes, options, `padding: 'max_length'` pour SigLIP). Libellés en anglais : CLIP et SigLIP v1 sont entraînés en anglais.

Chiffres clés option A (premier chargement, transfert compressé) :

| Variante | À télécharger | Inférence mesurée M1 (WASM / WebGPU) |
|---|---|---|
| A-léger : MediaPipe seul | **≈ 6,9 Mo** | 27 ms |
| A + TinyCLIP 8M | ≈ 37 Mo | ~105 ms + 27 ms |
| A + CLIP B/32 q8 | ≈ 102 Mo | 240 ms / 19-24 ms |
| A + SigLIP B/16 q8 | ≈ 112 Mo | 0,9 s / 42 ms |

(ORT 5,5 Mo + Transformers.js 0,17 Mo + modèle + MediaPipe 6,9 Mo.)

---

## 2. Option B : API Claude avec très peu de tokens

### 2.1 Modèles (vérifiés)

| Modèle | ID API | Prix entrée / sortie par MTok | Cache : écriture 5 min / 1 h / lecture | Notes |
|---|---|---|---|---|
| **Claude Haiku 5.5** | `claude-haiku-5-5` | **0,10 $ / 0,50 $** (prompts ≤ 100 000 tokens ; 0,50 $/2,50 $ au-delà) | 0,125 $ / 0,20 $ / **0,01 $** | sorti le **7 oct. 2026** ; « Fastest » ; texte + images ; contexte 1M ; retrait pas avant le 7 oct. 2027 ; effort par défaut `medium` |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 2 $ / 10 $ | 2,50 $ / 4 $ / 0,10 $ | retrait pas avant le 28 sept. 2027 |
| Claude Haiku 4.5 (à éviter) | `claude-haiku-4-5-20251001` | 1 $ / 5 $ | 1,25 $ / 2 $ / 0,10 $ | retrait possible dès le 15 oct. 2026 ; cache impossible sous 4 096 tokens |

Les deux identifiants proposés (`claude-haiku-5-5`, `claude-sonnet-5-5`) sont exacts : ce sont des snapshots épinglés sans date. Sources : https://platform.claude.com/docs/en/about-claude/models/overview , https://platform.claude.com/docs/en/models/haiku-5-5/overview , https://platform.claude.com/docs/en/about-claude/pricing , https://platform.claude.com/docs/en/about-claude/model-deprecations

### 2.2 Tokens d'une image : la formule a changé

- La formule `largeur × hauteur / 750` n'est plus celle de la doc. Désormais : **`⌈largeur/28⌉ × ⌈hauteur/28⌉`** (patchs de 28×28 px). Source : https://platform.claude.com/docs/en/build-with-claude/vision
- 512×512 → 19 × 19 = **361 tokens** ; **504×504 → 324** ; 448×448 → 256 ; 392×392 → 196 ; 1024×1024 (webcam actuelle) → 1 369 ; 1024×768 → 1 036.
- Choisir un côté multiple de 28 (504 plutôt que 512) évite de payer une rangée de patchs presque vide.
- Plafonds : 1 568 px / 1 568 tokens (tier standard), 2 576 px / 4 784 tokens pour « Claude 4.7 and later models ». À 504 px on est loin de ces plafonds.
- La doc signale aussi des erreurs possibles sous 200 px : rester à 392-504 px.

### 2.3 Prompt caching

- Durée : 5 min par défaut, prolongée gratuitement à chaque lecture ; option `ttl: "1h"`. Écriture = 1,25× (5 min) ou 2× (1 h) le prix d'entrée ; lecture = 0,1× (0,05× sur Opus 5.5 et Sonnet 5.5).
- **Minimum cacheable : 512 tokens sur Haiku 5.5 et Sonnet 5.5** : un prompt système de 1 500 tokens se met donc en cache.
- Les images sont cachables, mais le selfie change à chaque requête : seul le prompt système (catalogue) est à cacher.
- Source : https://platform.claude.com/docs/en/build-with-claude/prompt-caching

### 2.4 Sorties structurées

- `output_config: { format: { type: "json_schema", schema: {...} } }`, **GA, sans en-tête beta**, supporté par `claude-haiku-5-5` et `claude-sonnet-5-5`. L'ancien `output_format` est déprécié.
- `enum` de chaînes accepté : on peut contraindre **`breed_slug` aux 169 slugs**, ce qui rend impossible un slug inventé.
- **Non supportés** (erreur 400) : `minimum`, `maximum`, `minLength`, `maxLength`, `minItems` > 1 (et `maxItems`). Le pourcentage 75-95 et le nombre de traits sont donc à valider ou borner côté serveur.
- Grammaire compilée une première fois (latence), mise en cache 24 h.
- Gérer `stop_reason` `"refusal"` ou `"max_tokens"`, qui peuvent produire une sortie non conforme.
- Source : https://platform.claude.com/docs/en/build-with-claude/structured-outputs

### 2.5 Réflexion (thinking) : piège de coût

Haiku 5.5 a la réflexion adaptative **activée par défaut**, et les tokens de réflexion sont facturés comme des tokens de sortie. Haiku 5.5 accepte `thinking: {type: "disabled"}` à l'effort `high` ou en dessous (défaut `medium`). Sur Sonnet 5.5, `disabled` renvoie une erreur 400 : il faut `{type: "between_tools"}`. Source : https://platform.claude.com/docs/en/build-with-claude/thinking

Exemple de corps de requête (à adapter dans `api/match-breed.js`) :

```json
{
  "model": "claude-haiku-5-5",
  "max_tokens": 400,
  "thinking": { "type": "disabled" },
  "system": [
    { "type": "text", "text": "<consignes + catalogue des races>", "cache_control": { "type": "ephemeral" } }
  ],
  "messages": [{
    "role": "user",
    "content": [
      { "type": "image", "source": { "type": "base64", "media_type": "image/jpeg", "data": "<selfie 504x504>" } },
      { "type": "text", "text": "Analyse ce selfie selon les consignes." }
    ]
  }],
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "breed_slug": { "type": "string", "enum": ["bouledogue-francais", "carlin", "..."] },
          "match_percentage": { "type": "integer" },
          "reason": { "type": "string" },
          "traits_communs": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["breed_slug", "match_percentage", "reason", "traits_communs"],
        "additionalProperties": false
      }
    }
  }
}
```

Pas de `temperature`, `top_p`, `top_k` : une valeur non par défaut renvoie une 400 sur Haiku 5.5.

### 2.6 Coût par analyse (image 512×512, système 1 500 tokens, ~60 tokens de consigne, 150 tokens de sortie)

Calcul : `système × tarif (lecture, écriture ou plein) + (361 + 60) × prix d'entrée + 150 × prix de sortie`.

| Modèle | Cache lu (trafic continu) | Écriture 5 min (requête isolée) | Écriture 1 h | Sans cache |
|---|---|---|---|---|
| **Haiku 5.5** | **0,000132 $** (0,13 $ / 1 000) | 0,000305 $ (0,31 $ / 1 000) | 0,000417 $ | 0,000267 $ |
| Sonnet 5.5 | 0,00249 $ (2,49 $ / 1 000) | 0,00609 $ | 0,00834 $ | 0,00534 $ |
| Haiku 4.5 (cache impossible) | n/a | n/a | n/a | 0,00267 $ |

Lectures :
- Sur Haiku 5.5, l'image ne coûte que 0,000036 $ ; **la sortie (150 tokens = 0,000075 $) pèse plus de la moitié** de la facture. Réduire l'explication rapporte plus que réduire l'image.
- Le cache ne vaut le coup que si les requêtes se suivent à moins de 5 min. Avec peu de trafic, la plupart seront des écritures (0,31 $ / 1 000 au lieu de 0,27 $ sans cache). À ce prix l'écart est négligeable : activer le cache 5 min, ignorer le 1 h.
- Garder le catalogue complet coûte peu : avec le prompt actuel (~8 250 tokens au nouveau tokenizer, environ 30 % de tokens en plus pour le même texte), Haiku 5.5 revient à 0,00019 $ en cache lu et 0,00094 $ sans cache. Ramener le prompt à 1 500 tokens n'est donc pas indispensable.
- Ordre de grandeur : **≈ 100 à 230 fois moins cher** que l'appel actuel à Sonnet 4 (~0,030 $).

---

## 3. Option C : hybride (analyse locale + petit appel texte)

- Entrée : JSON d'attributs (~150 tokens) + consignes (~450 tokens, sous le minimum de 512 donc non cachées) ; sortie 150 tokens.
- **Haiku 5.5 : ≈ 0,000135 $ par analyse** (0,000096 $ si la consigne dépasse 512 tokens et est lue en cache) ; Sonnet 5.5 : ≈ 0,0027 $.
- Constat : **C ne coûte pas moins cher que B** (0,000135 $ contre 0,000132 à 0,000305 $), parce qu'une image de 504 px ne coûte presque rien sur Haiku 5.5. Son seul vrai gain est la **vie privée** : le selfie ne quitte pas le téléphone, seuls des attributs non identifiants partent.
- Variante zéro token à l'usage : **prégénérer** les textes drôles hors ligne (par exemple 12 variantes par race selon le trait dominant) via l'API Batch (50 % de remise). 169 requêtes × (1 500 tokens en entrée + 2 400 en sortie) ≈ **0,11 $ une fois** sur Haiku 5.5 (≈ 2,30 $ sur Sonnet 5.5). Ensuite plus aucune clé d'API, ni rate limit, ni appel à l'usage.

---

## 4. Comparatif

| Critère | A-léger (MediaPipe + textes prégénérés) | A + SigLIP | B (Haiku 5.5, 504 px) | C (local + Haiku texte) |
|---|---|---|---|---|
| Coût à l'usage | 0 $ | 0 $ | 0,13 à 0,31 $ / 1 000 | ≈ 0,10 à 0,14 $ / 1 000 |
| À télécharger (1re visite) | ≈ 6,9 Mo | ≈ 112 Mo (q8) / ≈ 67 Mo (q4f16 WebGPU) | 0 (selfie ~40 Ko envoyé) | idem A |
| Latence | ~30 ms + chargement | 0,9 s WASM M1 (1-4 s mobile estimé) / 42 ms WebGPU | ~1-3 s réseau + modèle (non mesuré) | A + appel |
| Qualité du matching | faible (géométrie + sourire seulement) | moyenne, à calibrer | **la meilleure** (le modèle voit le visage) | moyenne |
| Vie privée | photo locale | photo locale | photo envoyée à Anthropic | attributs seulement |
| Effort de dev | moyen | élevé (calibration, table des races) | **faible** (changer le modèle, le schéma, le redimensionnement) | élevé |

---

## 5. Recommandation

1. **Tout de suite (B)** : remplacer `claude-sonnet-4-20250514` par `claude-haiku-5-5` ; redimensionner côté client à **504×504** (324 tokens) au lieu de 1024 ; `thinking: {type: "disabled"}` ; sorties structurées avec `enum` des 169 slugs ; `cache_control` sur le système ; borner le pourcentage et le nombre de traits côté serveur. Coût **≈ 0,0001 à 0,0003 $ par analyse**, 0 Mo pour l'utilisateur, meilleure qualité, quelques heures de travail.
2. **Option vie privée, plus tard (A ou C)** : seulement si « votre photo ne quitte pas votre téléphone » devient un argument. Combinaison conseillée : MediaPipe Face Landmarker 1.0.1 (recadrage, géométrie, sourire) + SigLIP base (Apache-2.0) en q4f16 si WebGPU, sinon TinyCLIP 8M ou repli serveur B, avec des textes prégénérés hors ligne (≈ 0,11 $ une fois).
3. **À éviter** : MobileCLIP/MobileCLIP2 (licence recherche), poids fp32 en WebGPU (défaut de Transformers.js), auto-hébergement des modèles sur Vercel Hobby, similarité directe selfie → photos de races.

---

## 6. Risques

- **Panne actuelle** : modèle retiré, à corriger avant tout le reste.
- **Haiku 5.5 très récent** (7 oct. 2026) : vérifier le ton « drôle et bienveillant » sur une vingtaine de selfies avant de basculer ; Sonnet 5.5 en secours (~19 fois plus cher que Haiku 5.5, mais encore 5 à 12 fois moins cher que l'appel actuel).
- **Rate limit** : le repli en mémoire (`Map`) de `match-breed.js` est propre à chaque instance serverless, donc peu fiable. À ~0,0003 $ l'appel, l'abus coûte peu, mais un plafond de dépense dans la Console Anthropic reste prudent.
- **Vie privée (B)** : le selfie transite par Anthropic ; à mentionner dans la page. Retirer du prompt les critères sensibles comme la « corpulence ».
- **Option A, poids et mémoire** : 37 à 112 Mo en 4G au premier usage ; mémoire limitée des vieux iPhone (non mesurée) ; WebGPU absent sous iOS < 26 et sur une partie du parc Android ; premier appel WebGPU plus lent (compilation des shaders).
- **Option A, qualité** : attributs zéro-shot fragiles (erreur « lunettes » de CLIP q8, confusion « très courts / chauve ») ; calibration indispensable sur un jeu annoté ; biais possibles selon le teint ou le genre, à tester.
- **Option A, chaîne d'approvisionnement** : Transformers.js 4.3.1 tire un build *dev* d'ORT Web ; épingler les versions npm et les commits HF ; dépendance à la disponibilité de huggingface.co et jsDelivr (sinon auto-héberger, en Pro).
- **Licences** : SigLIP / SigLIP 2 (Apache-2.0) et TinyCLIP (MIT) sont les plus sûrs ; CLIP OpenAI est MIT mais sa model card déconseille tout déploiement ; licence des poids MediaPipe à confirmer dans les model cards ; Vercel Hobby limité à un usage non commercial.

---

## 7. Méthode et outil de mesure

- Mesures du 11/10/2026 : Mac M1 Pro (10 cœurs, 16 Go), Chromium 152 (volet navigateur de Claude), page servie en `http://127.0.0.1`, sans isolation cross-origin (WASM 1 thread), image de test `https://storage.googleapis.com/mediapipe-assets/portrait.jpg` (820×1024), Transformers.js 4.3.1, MediaPipe 1.0.1. Le temps de chargement inclut le téléchargement depuis HF/jsDelivr ; la médiane porte sur 5 passes après une passe d'échauffement.
- Page de bench réutilisable sur vrais téléphones (à servir en HTTPS ou localhost) : `/private/tmp/claude-501/-Users-quentin-Desktop-Claude/b29437b6-3ed8-44f0-95ed-06304fc2325d/scratchpad/bench/index.html`, paramètres `?device=wasm|webgpu&models=clipq8,clipq4f16,clipfp16,siglipq8,siglipfp16,siglip2q4f16,mobileclip,mediapipe` ; résultats dans `window.BENCH`.
- Coûts calculés à partir des tarifs de https://platform.claude.com/docs/en/about-claude/pricing et de la formule de https://platform.claude.com/docs/en/build-with-claude/vision . Tailles de prompt estimées depuis le nombre de caractères de `api/match-breed.js` (21 449 caractères), sans appel à `count_tokens`.
