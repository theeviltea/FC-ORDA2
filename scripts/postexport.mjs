// After `expo export -p web`: make the SPA work on GitHub Pages.
// 404.html = index.html so deep links (/FC-ORDA2/profile) load the app; .nojekyll keeps the _expo folder.
import { copyFileSync, writeFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log('dist ready for GitHub Pages');
