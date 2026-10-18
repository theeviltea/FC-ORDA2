// Builds one self-contained HTML of the web prototype (JS + images + fonts inlined as data URIs)
// for the «ORDA App Preview» artifact — same approach as the 919 preview.
// Run: npm run build:artifact  → preview/orda-preview.html
import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const out = 'dist-artifact';
execSync(`npx expo export -p web --output-dir ${out}`, { stdio: 'inherit', env: { ...process.env, ORDA_BASE_URL: '', CI: '1' } });

const mime = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.otf': 'font/otf', '.ico': 'image/x-icon' };
const jsDir = join(out, '_expo/static/js/web');
let js = readdirSync(jsDir).filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(jsDir, f), 'utf8')).join('\n');

// Bundled assets appear as {uri:"/assets/…"} (images) or "/assets/…" (fonts). Inline the ones the app uses;
// unused Roboto Condensed weights shipped by the font package stay out to keep the file small.
const usedFonts = /RobotoCondensed_(400Regular|500Medium|600SemiBold|700Bold)\./;
let n = 0;
js = js.replace(/"(\/assets\/[^"]+)"/g, (m, p) => {
  const type = mime[extname(p)];
  if (!type || (p.includes('@expo-google-fonts') && !usedFonts.test(p))) return m;
  n++;
  return `"data:${type};base64,${readFileSync(join(out, decodeURIComponent(p))).toString('base64')}"`;
});
// A literal </script> inside the bundle would end the inline script early.
js = js.replace(/<\/script/gi, '<\\/script');

// The artifact host wraps the page in its own doctype/head/body skeleton, so the file starts at <title>.
const html = `<title>ORDA App Preview</title>
<style>
:root{padding:0!important}
html,body{height:100%;background:#E3EAF3;color:#172A51}
body{overflow:hidden}
#root{display:flex;height:100%;flex:1}
</style>
<div id="root"></div>
<script>try{history.replaceState(null,'','/')}catch(e){}</script>
<script>${js}</script>
`;

mkdirSync('preview', { recursive: true });
writeFileSync('preview/orda-preview.html', html);
console.log(`preview/orda-preview.html — ${n} assets inlined, ${(html.length / 1e6).toFixed(1)} MB`);
