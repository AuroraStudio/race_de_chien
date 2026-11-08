// Après chaque déploiement de production réussi : prévient Bing et les autres moteurs IndexNow
// des pages du sitemap modifiées ces 2 derniers jours (lib/indexnow.cjs).
// Un échec d'IndexNow ne fait jamais échouer le déploiement : il est affiché dans le résumé du build.
import { execFileSync } from 'node:child_process';

export const onSuccess = ({ utils }) => {
    if (process.env.CONTEXT !== 'production') {
        console.log(`IndexNow : contexte ${process.env.CONTEXT}, rien envoyé (production seulement)`);
        return;
    }
    try {
        const sortie = execFileSync('node', ['lib/indexnow.cjs', '--jours', '2'], { encoding: 'utf8', timeout: 60000 }).trim();
        console.log(sortie);
        utils.status.show({ title: 'IndexNow', summary: sortie.split('\n').join(' · ') });
    } catch (e) {
        const detail = `${e.stdout || ''} ${e.stderr || e.message}`.trim();
        console.log('IndexNow en échec :', detail);
        utils.status.show({ title: 'IndexNow en échec', summary: detail.slice(0, 300) });
    }
};
