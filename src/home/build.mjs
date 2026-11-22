import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { renderWorkflow } from './workflow.mjs';

const base = fileURLToPath(new URL('./', import.meta.url));
const locales = { en: 'English', es: 'Español', ru: 'Русский' };
const languages = Object.keys(locales);
const mail = 'aleks.worksystems@gmail.com';
const linkedin = 'https://www.linkedin.com/in/aleksei-karpov-261126275/';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const safeJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const route = language => language === 'en' ? '' : `${language}/`;
const logo = `<svg class="logo" aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M3 24V11a6 6 0 0 1 12 0v11a4 4 0 0 0 8 0V8"/><path d="M9 24V11m8 15a8 8 0 0 0 12-7V8"/></svg>`;
const brand = `${logo}<span>Aleks <b>Work Systems</b></span>`;
const shapes = [
  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  '<path d="M20 15H9l-5 4V5h16zM8 9h8m-8 3h6"/>',
  '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7m-7 4h5"/>'
];
const icon = shape => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${shape}</svg>`;

function header(c, language, root) {
  const anchors = ['example', 'services', 'about', 'contact'];
  const links = c.nav.map((text, index) => `<a href="#${anchors[index]}">${esc(text)}</a>`).join('');
  const selector = languages.map(code => `<a href="${root}${route(code)}" hreflang="${code}" lang="${code}" aria-label="${locales[code]}"${code === language ? ' aria-current="page"' : ''}>${code.toUpperCase()}</a>`).join('');
  return `<a class="skip" href="#main">${esc(c.skip)}</a>
<header class="mast"><div class="wrap mast-row">
  <a href="#top" class="brand">${brand}</a>
  <nav class="desktop-nav" aria-label="${esc(c.navLabel)}">${links}</nav>
  <nav class="lang" aria-label="${esc(c.language)}">${selector}</nav>
  <details class="phone-menu"><summary aria-label="${esc(c.menu)}">${icon('<path d="M4 7h16M4 12h16M4 17h16"/>')}</summary><nav aria-label="${esc(c.navLabel)}">${links}</nav></details>
</div></header>`;
}

function hero(c) {
  return `<section class="hero wrap" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="eyebrow nameplate">${esc(c.eyebrow)}</p>
    <h1 id="hero-title">${esc(c.headline[0])} <em>${esc(c.headline[1])}</em></h1>
    <p class="lead">${esc(c.lead)}</p>
    <div class="hero-actions"><a class="button primary" href="#contact">${esc(c.cta)}</a><a class="text-link" href="#example">${esc(c.see)}</a></div>
  </div>
  <figure class="drawing">
    <figcaption>${esc(c.figure)}</figcaption>
    <div class="diagram">
      <ul class="sources">${c.sources.map((source, index) => `<li>${icon(shapes[index])}<span>${esc(source)}</span></li>`).join('')}</ul>
      <svg class="routes" aria-hidden="true" viewBox="0 0 64 180" preserveAspectRatio="none" fill="none"><path d="M0 28h9c23 0 15 62 46 62h9M0 90h64M0 152h9c23 0 15-62 46-62h9" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="58" cy="90" r="3" fill="currentColor"/></svg>
      <div class="diagram-record"><strong>${esc(c.record)}</strong><ul>${c.recordItems.map(item => `<li>${esc(item)}</li>`).join('')}</ul></div>
    </div>
    <div class="drawing-foot">${logo}<span>${esc(c.figureNote)}</span></div>
  </figure>
</section>`;
}

function contact(c) {
  return `<section class="contact section" id="contact" aria-labelledby="contact-title"><div class="wrap split">
  <div class="intro"><h2 id="contact-title">${esc(c.cta)}</h2><p>${esc(c.contactLead)}</p>
    <a class="email" href="mailto:${mail}">${esc(c.direct)}<span>${mail}</span></a>
  </div>
  <form id="contact-form" hidden data-email="${mail}">
    <div class="contact-fields">
      <label>${esc(c.fields[0])}<input name="name" autocomplete="name" required maxlength="120"></label>
      <label>${esc(c.fields[1])}<input name="email" type="email" autocomplete="email" required maxlength="254"></label>
    </div>
    <label>${esc(c.fields[2])}<textarea name="problem" rows="5" required maxlength="1200"></textarea></label>
    <p id="email-hint" class="helper">${esc(c.emailNote)}</p>
    <div class="compose-actions"><button type="submit" class="button light" aria-describedby="email-hint">${esc(c.draft)}</button><button type="button" class="copy" id="copy-message">${esc(c.copy)}</button></div>
    <p id="copy-status" class="action-status" role="status"></p>
    <textarea id="copy-fallback" aria-label="${esc(c.copy)}" readonly hidden></textarea>
  </form>
</div></section>`;
}

function body(c, language, root, scenarios) {
  const labLinks = scenarios.map(s => `<li><a href="${root}${route(language)}lab/${esc(s.slug)}/">${esc(s.title)}</a></li>`).join('');
  return `${header(c, language, root)}
<main id="main" tabindex="-1">
  ${hero(c)}
  ${renderWorkflow(c, esc)}
  <section class="section wrap split" id="services" aria-labelledby="services-title">
    <div class="intro" id="paths"><h2 id="services-title">${esc(c.servicesTitle)}</h2><p>${esc(c.servicesIntro)}</p></div>
    <div class="service-list">${c.services.map(([title, problem, response]) => `<article><h3>${esc(title)}</h3><div><p>${esc(problem)}</p><p class="response">${esc(response)}</p></div></article>`).join('')}
    <p class="services-end">${esc(c.servicesEnd)}</p></div>
  </section>
  <section class="method section" id="method" aria-labelledby="method-title"><div class="wrap">
    <h2 id="method-title">${esc(c.methodTitle)}</h2>
    <ol class="method-list">${c.method.map(([title, description]) => `<li><h3>${esc(title)}</h3><p>${esc(description)}</p></li>`).join('')}</ol>
  </div></section>
  <section class="section wrap about" id="about" aria-labelledby="about-title">
    <img loading="lazy" width="288" height="288" src="${root}assets/home/aleks.webp" alt="">
    <div><h2 id="about-title">${esc(c.aboutTitle)}</h2><p>${esc(c.aboutBody)}</p><p>${esc(c.aboutFocus)}</p><a class="text-link" href="${linkedin}">${esc(c.aboutLink)}</a></div>
  </section>
  ${contact(c)}
</main>
<footer><div class="wrap footer-row"><a href="#top" class="brand">${brand}</a>
  <details id="work" class="home-scenarios"><summary>${esc(c.examples)}</summary><ul>${labLinks}</ul></details>
  <a class="text-link" href="#top">${esc(c.back)}</a>
</div></footer>`;
}

function document(c, language, root, siteUrl, scenarios, version) {
  const url = code => new URL(route(code), siteUrl).href;
  const alternates = [...languages, 'x-default'].map(code => `<link rel="alternate" hreflang="${code}" href="${esc(url(code === 'x-default' ? 'en' : code))}">`).join('\n');
  const ogLocales = { en: 'en_US', es: 'es_ES', ru: 'ru_RU' };
  const structured = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Person', '@id': `${url('en')}#aleks`, name: 'Aleks Karpov', email: mail, sameAs: [linkedin] },
      ...c.services.map(([name, , description]) => ({ '@type': 'Service', name, description, provider: { '@id': `${url('en')}#aleks` } }))
    ]
  };
  const local = {
    states: c.states, readyDetails: c.readyDetails, missingDetails: c.missingDetails,
    resetMessage: c.resetMessage, fields: c.fields, subject: c.subject, copied: c.copied, copyFail: c.copyFail
  };
  return `<!doctype html>
<html lang="${language}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.title)}</title><meta name="description" content="${esc(c.meta)}"><meta name="theme-color" content="#fbfaf5">
<link rel="canonical" href="${esc(url(language))}">
${alternates}
<meta property="og:type" content="website"><meta property="og:site_name" content="Aleks Work Systems">
<meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.meta)}">
<meta property="og:url" content="${esc(url(language))}"><meta property="og:locale" content="${ogLocales[language]}">
<meta property="og:image" content="${esc(new URL(`assets/og-${language}.png`, siteUrl).href)}">
<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${root}assets/home/site.css?v=${version}">
<script type="application/ld+json">${safeJSON(structured)}</script>
<script type="application/json" id="home-copy">${safeJSON(local)}</script>
<script src="${root}assets/home/site.js?v=${version}" defer></script>
</head><body id="top">
${body(c, language, root, scenarios)}
</body></html>\n`;
}

export async function buildHome(out, siteUrl, labs) {
  const directory = join(out, 'assets', 'home');
  await mkdir(directory, { recursive: true });
  const assets = ['site.css', 'site.js', 'aleks.webp'];
  const hash = createHash('sha256');
  for (const asset of assets) {
    const source = join(base, 'assets', asset);
    hash.update(await readFile(source));
    await copyFile(source, join(directory, asset));
  }
  const version = hash.digest('hex').slice(0, 12);
  for (const language of languages) {
    const c = JSON.parse(await readFile(join(base, 'content', `${language}.json`), 'utf8'));
    const localized = join(out, language);
    const scenarios = labs[language].scenarios;
    await mkdir(localized, { recursive: true });
    await writeFile(join(localized, 'index.html'), document(c, language, '../', siteUrl, scenarios, version));
    if (language === 'en') {
      await writeFile(join(out, 'index.html'), document(c, language, './', siteUrl, scenarios, version));
    }
  }
}
