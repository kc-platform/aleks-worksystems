import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { content } from '../src/content.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'dist');
const siteUrl = (process.env.SITE_URL || 'https://kc-platform.github.io/aleks-worksystems/').replace(/\/?$/, '/');
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const route = lang => lang === 'en' ? '' : `${lang}/`;
const link = (lang, target = '') => `${lang === 'en' ? './' : '../'}${target}`;
const mailto = (c, category = '') => `mailto:${c.email}?subject=${encodeURIComponent(c.emailSubject + (category ? `: ${category}` : ''))}&body=${encodeURIComponent(c.emailBody)}`;
const section = (id, kicker, title, intro = '') => `<div class="section-head"><p class="eyebrow">${esc(kicker)}</p><h2 id="${id}-title">${esc(title)}</h2>${intro ? `<p class="section-intro">${esc(intro)}</p>` : ''}</div>`;
const ext = (url, label, c) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)} (${esc(c.external)})">${esc(label)} <span aria-hidden="true">↗</span></a>`;

function page(lang) {
  const c = content[lang];
  const home = './';
  const assetBase = link(lang);
  const ids = ['services','method','examples','about','contact'];
  const nav = c.nav.map((label, i) => `<a href="#${ids[i]}">${esc(label)}</a>`).join('');
  const languages = ['en','es','ru'].map(l => `<a href="${link(lang, route(l))}" lang="${l}" hreflang="${l}" ${l === lang ? 'aria-current="page"' : ''}>${l.toUpperCase()}</a>`).join('<span aria-hidden="true">/</span>');
  const alternates = ['en','es','ru'].map(l => `<link rel="alternate" hreflang="${l}" href="${siteUrl}${route(l)}">`).join('');
  const situations = c.situations.map((s,i) => `<article class="situation" id="situation-${i+1}"><div class="situation-number">0${i+1}</div><div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><p class="situation-answer">${esc(s.solution)}</p><div class="inline-actions"><a href="#service-${i+1}">${esc(c.seeApproach)} <span aria-hidden="true">→</span></a><a href="${mailto(c,s.category)}">${esc(c.situationCta)} <span aria-hidden="true">↗</span></a></div></div></article>`).join('');
  const services = c.services.map((s,i) => `<article class="service" id="service-${i+1}"><div class="service-top"><span class="service-number">0${i+1}</span><h3>${esc(s.name)}</h3></div><dl><div><dt>${esc(c.labels.problem)}</dt><dd>${esc(s.problem)}</dd></div><div><dt>${esc(c.labels.work)}</dt><dd>${esc(s.work)}</dd></div><div><dt>${esc(c.labels.deliverable)}</dt><dd>${esc(s.deliverable)}</dd></div><div><dt>${esc(c.labels.boundary)}</dt><dd>${esc(s.boundary)}</dd></div></dl></article>`).join('');
  const steps = c.steps.map((s,i) => `<li><span class="step-number">0${i+1}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></li>`).join('');
  const projects = c.projects.map((p,i) => `<article class="project"><div class="project-meta"><span>0${i+1}</span><span>${esc(p.type)}</span></div><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><p class="project-shows">${esc(p.shows)}</p>${p.concept ? `<p class="concept-note">${esc(c.independent)}</p>` : ''}<div class="project-link">${ext(p.url,c.projectLink,c)}</div></article>`).join('');
  const categoryLinks = c.situations.map(s => `<a href="${mailto(c,s.category)}">${esc(s.category)} <span aria-hidden="true">↗</span></a>`).join('');
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.title)}</title><meta name="description" content="${esc(c.description)}">
  <meta name="theme-color" content="#f7f8f4"><meta name="color-scheme" content="light">
  <link rel="canonical" href="${siteUrl}${route(lang)}">${alternates}<link rel="alternate" hreflang="x-default" href="${siteUrl}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="Aleks Work Systems"><meta property="og:locale" content="${{en:'en_US',es:'es_EC',ru:'ru_RU'}[lang]}">
  <meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:url" content="${siteUrl}${route(lang)}"><meta property="og:image" content="${siteUrl}assets/og.svg">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(c.title)}"><meta name="twitter:description" content="${esc(c.description)}">
  <link rel="icon" href="${assetBase}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${assetBase}assets/styles.css"><script src="${assetBase}assets/site.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">${esc(c.skip)}</a>
  <header class="site-header"><div class="container header-inner"><a class="wordmark" href="${home}" aria-label="Aleks Work Systems"><span class="mark" aria-hidden="true">A<span>·</span></span><span>Aleks<br>Work Systems</span></a><nav class="desktop-nav" aria-label="${esc(c.menu)}">${nav}</nav><div class="desktop-languages language-list" aria-label="${esc(c.languageLabel)}">${languages}</div><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${esc(c.menu)}" data-open-label="${esc(c.menu)}" data-close-label="${esc(c.close)}"><span></span><span></span></button></div><nav id="mobile-menu" class="mobile-menu" aria-label="${esc(c.menu)}" hidden><div class="container">${nav}<div class="language-list" aria-label="${esc(c.languageLabel)}">${languages}</div></div></nav></header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title"><div class="container hero-grid"><div class="hero-content"><p class="eyebrow">${esc(c.eyebrow)}</p><h1 id="hero-title">${c.hero}</h1><p class="hero-intro">${esc(c.intro)}</p><div class="hero-actions"><a class="button button-primary" href="#contact">${esc(c.primary)} <span aria-hidden="true">↗</span></a><a class="button button-text" href="#examples">${esc(c.secondary)} <span aria-hidden="true">↘</span></a></div><p class="hero-byline">${esc(c.byline)}</p></div><aside class="hero-aside" aria-label="${esc(c.heroNote)}"><div class="quiet-motif" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p>${esc(c.heroNote)}</p></aside></div></section>
    <section id="situations" class="section situations-section" aria-labelledby="situations-title"><div class="container">${section('situations',c.situationKicker,c.situationTitle,c.situationIntro)}<div class="situation-grid">${situations}</div></div></section>
    <section id="services" class="section services-section" aria-labelledby="services-title"><div class="container">${section('services',c.servicesKicker,c.servicesTitle,c.servicesIntro)}<div class="services-grid">${services}</div></div></section>
    <section id="method" class="section method-section" aria-labelledby="method-title"><div class="container">${section('method',c.methodKicker,c.methodTitle,c.methodIntro)}<ol class="steps">${steps}</ol><p class="audit-note">${esc(c.audit)}</p></div></section>
    <section id="examples" class="section examples-section" aria-labelledby="examples-title"><div class="container">${section('examples',c.workKicker,c.workTitle,c.workIntro)}<div class="projects-grid">${projects}</div></div></section>
    <section id="about" class="section about-section" aria-labelledby="about-title"><div class="container about-grid"><div>${section('about',c.aboutKicker,c.aboutTitle)}</div><div class="about-copy"><p>${esc(c.about1)}</p><p>${esc(c.about2)}</p><p>${ext('https://www.linkedin.com/in/aleksei-karpov-261126275/',c.linkedIn,c)}</p></div></div></section>
    <section id="contact" class="section contact-section" aria-labelledby="contact-title"><div class="container contact-grid"><div>${section('contact',c.contactKicker,c.contactTitle,c.contactIntro)}<a class="button button-light" href="${mailto(c)}">${esc(c.emailLabel)} <span aria-hidden="true">↗</span></a><p class="contact-email"><a href="mailto:${c.email}">${c.email}</a></p></div><div class="contact-options"><p>${esc(c.categoryLabel)}</p>${categoryLinks}</div></div></section>
  </main>
  <footer class="site-footer"><div class="container footer-grid"><div><a class="footer-wordmark" href="${home}">Aleks Work Systems</a><p>${esc(c.footer)}</p></div><div class="footer-links"><a href="mailto:${c.email}">${c.email}</a>${ext('https://www.linkedin.com/in/aleksei-karpov-261126275/','LinkedIn',c)}</div></div><div class="container footer-bottom"><small>© ${new Date().getFullYear()} Aleks Work Systems</small><small>${esc(c.privacy)}</small></div></footer>
</body></html>`;
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root,'src','assets'), join(out,'assets'), { recursive: true });
await writeFile(join(out,'.nojekyll'),'');
for (const lang of ['en','es','ru']) {
  const dest = join(out,route(lang));
  await mkdir(dest, {recursive:true});
  await writeFile(join(dest,'index.html'),page(lang));
}
await writeFile(join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${['en','es','ru'].map(l=>`<url><loc>${siteUrl}${route(l)}</loc>${['en','es','ru'].map(a=>`<xhtml:link rel="alternate" hreflang="${a}" href="${siteUrl}${route(a)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}"/></url>`).join('')}</urlset>`);
console.log(`Built three languages for ${siteUrl}`);
