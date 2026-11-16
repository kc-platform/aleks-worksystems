import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { content } from '../src/content.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root,'dist');
const expected = Object.keys(content.en).sort().join('|');
for (const lang of ['en','es','ru']) {
  const c = content[lang];
  assert.equal(Object.keys(c).sort().join('|'),expected,`Missing top-level translation in ${lang}`);
  assert.equal(c.situations.length,4);
  assert.equal(c.services.length,4);
  assert.equal(c.steps.length,4);
  assert.equal(c.projects.length,4);
  assert.equal(c.aboutFacts.length,3);
  const file = join(out,lang === 'en' ? '' : lang,'index.html');
  const html = await readFile(file,'utf8');
  assert.match(html,new RegExp(`<html lang="${lang}">`));
  assert.match(html,/<main id="main">/);
  assert.match(html,/<ol class="about-facts">/);
  assert.match(html,/<link rel="canonical"/);
  assert.match(html,new RegExp(`assets/og-${lang}\\.png`));
  assert.match(html,/assets\/hero-portrait\.jpg/);
  assert.match(html,new RegExp(`alt="${c.portraitAlt}"`));
  for (const other of ['en','es','ru']) assert.match(html,new RegExp(`hreflang="${other}"`));
  for (const id of ['services','method','examples','about','contact']) assert.match(html,new RegExp(`id="${id}"`));
  assert.equal((html.match(/Independent concept demonstration\.|Demostración conceptual independiente\.|Независимая концептуальная демонстрация\./g)||[]).length,3);
  assert.doesNotMatch(html,/href="\/assets\//);
  assert.doesNotMatch(html,/lorem ipsum|placeholder/i);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]),`Broken #${match[1]} on ${lang}`);
  const base = lang === 'en' ? './' : '../';
  assert.match(html,new RegExp(`href="${base.replaceAll('.','\\.')}assets/styles\\.css"`));
  assert.match(html,/class="wordmark" href="\.\/"/);
}
for (const path of ['assets/styles.css','assets/site.js','assets/favicon.svg','assets/hero-portrait.jpg','assets/og-en.png','assets/og-es.png','assets/og-ru.png','robots.txt','sitemap.xml','.nojekyll']) await stat(join(out,path));
console.log('Static checks passed for EN, ES and RU.');
