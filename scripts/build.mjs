import { mkdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lab } from '../src/lab.mjs';
import { buildSite } from '../src/home/build.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'dist');
const siteUrl = (process.env.SITE_URL || 'https://kc-platform.github.io/aleks-worksystems/').replace(/\/?$/, '/');

await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'assets'), { recursive: true });
const sharedAssets = ['favicon.svg', 'og-en.png', 'og-es.png', 'og-ru.png'];
await Promise.all(sharedAssets.map(asset => copyFile(join(root, 'src', 'assets', asset), join(out, 'assets', asset))));
await writeFile(join(out, '.nojekyll'), '');

const urls = await buildSite(out, siteUrl, lab);
await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${urls.length} canonical pages for ${siteUrl}`);
