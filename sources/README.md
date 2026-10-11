# Sources de la refonte d'octobre 2026 (non publiées sur le site)

- `audit-2026-10-11.html` : l'audit complet (aussi publié en artefact privé).
- `relecture/` : relecture des 169 fiches d'origine (`all-reviews.json` : erreurs avec justification, notes, santé, confiance),
  harmonisation des notes (`harmo-*.json`), popularité LOF 2025 (`lof-presentes.json`), textes corrigés (`textes.json`),
  races manquantes (`races-manquantes.*`) et fiches des 62 nouvelles races (`nouvelles-data-*.json`),
  étude des options d'IA pour Tel Maître (`ia-options.md`), script de fusion utilisé une fois (`migration-v2.py`).
- `photos/` : prompts des photos restant à générer et script d'intégration.

Depuis la refonte, la source de vérité est `data/breeds.json` : on le modifie directement, puis `npm run generate`.
