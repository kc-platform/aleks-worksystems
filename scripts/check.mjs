import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { lab } from '../src/lab.mjs';

const out = fileURLToPath(new URL('../dist/', import.meta.url));
const readPage = path => readFile(join(out, path, 'index.html'), 'utf8');
const canonical = html => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const route = language => language === 'en' ? '' : `${language}/`;
const scenarioRoute = (language, index) => `${route(language)}lab/${lab[language].scenarios[index].slug}/`;
const languages = Object.keys(lab);
const english = await readPage('');
const site = canonical(english);
assert.ok(site);
const brand = english.match(/<a href="#top" class="brand">(<svg[\s\S]+?<\/span>)<\/a>/)?.[1];
assert.ok(brand);
const shared = [...english.matchAll(/(?:href|src)="\.\/(assets\/(?:home\/site\.(?:js|css)|favicon\.svg)\?v=[a-f0-9]+)"/g)].map(match => match[1]);
assert.equal(shared.length, 3);

function pageChecks(html, language, relative, index) {
  assert.ok(html.includes(`<html lang="${language}">`));
  assert.equal(html.split(brand).length, 3, 'Header and footer must use the current wordmark');
  for (const asset of shared) assert.ok(html.includes(`"${relative}${asset}"`), `Missing shared asset ${asset}`);
  assert.ok(!html.includes('assets/styles.css') && !html.includes('assets/site.js'));
  assert.ok(html.includes('mailto:aleks.worksystems@gmail.com'));
  for (const field of ['name', 'email', 'problem']) assert.ok(html.includes(`name="${field}"`));

  const targets = index === undefined ? ['main', 'work', 'projects', 'contact', 'contact-form', 'copy-message', 'before-panel', 'after-panel', 'demo-reset', 'approve', 'sample-reply']
    : ['main', 'work', 'explore', 'contact', 'contact-form', 'copy-message', 'before-panel', 'after-panel', 'scenario-title'];
  for (const id of targets) assert.equal(html.split(`id="${id}"`).length, 2, `Missing or duplicate #${id}`);

  const destination = code => index === undefined ? route(code) : scenarioRoute(code, index);
  assert.equal(canonical(html), new URL(destination(language), site).href);
  for (const code of [...languages, 'x-default']) {
    const path = destination(code === 'x-default' ? 'en' : code);
    assert.ok(html.includes(`rel="alternate" hreflang="${code}" href="${new URL(path, site).href}"`));
    if (code !== 'x-default') assert.ok(html.includes(`href="${relative}${path}" hreflang="${code}"`));
  }

  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${match[1]}"`), `Broken #${match[1]} in ${canonical(html)}`);
  }
  for (const [index] of lab[language].scenarios.entries()) {
    assert.ok(html.includes(`href="${relative}${scenarioRoute(language, index)}"`));
  }
  const options = JSON.parse(html.match(/id="home-copy">([^<]+)<\/script>/)[1]);
  assert.equal(options.fields.length, 3);
  return options;
}

for (const language of languages) {
  const home = await readPage(route(language));
  const relative = language === 'en' ? './' : '../';
  const options = pageChecks(home, language, relative);
  assert.deepEqual(options.states.map(state => state.length), [4, 4, 4]);
  assert.equal((home.match(/class="inbox-row /g) || []).length, 3);
  for (const [id, url] of [
    ['case-1', 'https://arwt.netlify.app/'],
    ['case-2', 'https://dbac-quito-concept-2026.akd1357.chatgpt.site/'],
    ['case-3', 'https://nora-quito-concept-2026.akd1357.chatgpt.site/'],
    ['case-4', 'https://legartep-quito-concept-2026.akd1357.chatgpt.site/']
  ]) {
    assert.ok(home.split(`id="${id}"`)[1]?.split('</article>')[0].includes(`href="${url}"`), `${language} missing project ${id}`);
  }
  assert.ok(home.includes('href="#projects"'));

  const { scenarios } = lab[language];
  assert.equal(scenarios.length, 6);
  for (const [index, scenario] of scenarios.entries()) {
    const html = await readPage(scenarioRoute(language, index));
    const relative = language === 'en' ? '../../' : '../../../';
    const options = pageChecks(html, language, relative, index);
    assert.ok(options.context.endsWith(scenario.title));
    assert.ok(html.includes(`href="${relative}${route(language)}#work"`));
    assert.ok(html.includes(`href="${relative}${route(language)}#example"`));
    assert.ok(html.includes(`href="${relative}${route(language)}#projects"`));
    assert.ok(html.includes(`href="${relative}${scenarioRoute(language, index)}" aria-current="page"`));
    assert.ok(html.includes('data-scenario-comparison'));
    assert.equal((html.match(/class="scenario-table"/g) || []).length, 2);
    assert.equal((html.match(/data-mode="(?:before|after)"/g) || []).length, 2);
  }
}

pageChecks(await readPage('en/'), 'en', '../');
for (const path of ['assets/home/site.css', 'assets/home/site.js', 'assets/home/aleks.webp', 'assets/favicon.svg', 'assets/og-en.png', 'assets/og-es.png', 'assets/og-ru.png', 'robots.txt', 'sitemap.xml', '.nojekyll']) {
  await stat(join(out, path));
}
const sitemap = await readFile(join(out, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<url>/g) || []).length, 21);
console.log('Checked 4 home routes and 18 examples with shared branding, localized URLs, comparisons and contact.');
