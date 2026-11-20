import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { renderWorkflow } from './workflow.mjs';

const base = fileURLToPath(new URL('./', import.meta.url));
const get = path => readFile(join(base, path), 'utf8');
const json = async path => JSON.parse(await get(path));
const localeNames = {en:'English', es:'Español', ru:'Русский'};
const langs = Object.keys(localeNames);
const mail = 'aleks.worksystems@gmail.com';
const linkedin = 'https://www.linkedin.com/in/aleksei-karpov-261126275/';
const workURLs = ['https://dbac-quito-concept-2026.akd1357.chatgpt.site/', 'https://nora-quito-concept-2026.akd1357.chatgpt.site/', 'https://legartep-quito-concept-2026.akd1357.chatgpt.site/'];
const esc = t => String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const safeJSON = t => JSON.stringify(t).replaceAll('<','\\u003c');
const interfaces = await json('content/interface.json');
const texts = {};
for (const l of langs) texts[l] = {u:interfaces[l], c:await json('content/'+l+'.json'), d:await json('content/demo-'+l+'.json')};
const timeline = await json('content/workflow.json');
const shapes = {
 logo:'<path d="M3 24V11a6 6 0 0 1 12 0v11a4 4 0 0 0 8 0V8"/><path d="M9 24V11m8 15a8 8 0 0 0 12-7V8"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
 steps:'<circle cx="4" cy="15" r="2"/><circle cx="20" cy="7" r="2"/><path d="M6 15h3a3 3 0 0 0 3-3v-2a3 3 0 0 1 3-3h3"/>',
 run:'<path d="M3 8h11m4 0h3M3 16h3m4 0h11"/><circle cx="16" cy="8" r="2.4"/><circle cx="8" cy="16" r="2.4"/>',
 start:'<path d="M3 20h18M6 20v-9h5v9m2-9V5h5v15M3 6l4-3 4 3"/>',
 inbox:'<path d="m3 15 3-9h12l3 9v4H3z"/><path d="M3 14h5l2 3h4l2-3h5"/>',
 sheet:'<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7m-7 4h5"/>',
 clip:'<path d="m8 12 6-6a3 3 0 1 1 4 4l-8 8a4.25 4.25 0 1 1-6-6l8-8"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
 intake:'<rect x="3" y="4" width="11" height="8" rx="2"/><path d="M7 12v6h9"/><rect x="15" y="14" width="6" height="6" rx="1"/>',
 rescue:'<path d="M3 6h18v14H3zM3 11h18M9 11v9"/><path d="m13 16 2 2 4-4"/>',
 book:'<path d="M4 4h14a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2zM8 4v16M12 9h5M12 12h4"/>',
 home:'<path d="m3 11 9-8 9 8v10H4V11m5 10v-7h6v7"/>',
 law:'<path d="M12 3v17m-6 1h12M4 8l15-3M5 8l-3 6h6zM18 5l-3 6h6z"/>'
};
function icon(name){return '<svg class="icon" aria-hidden="true" viewBox="'+(name==='logo'?'0 0 32 32':'0 0 24 24')+'" fill="none" stroke="currentColor" stroke-width="'+(name==='logo'?'2.8':'1.6')+'" stroke-linecap="round" stroke-linejoin="round">'+shapes[name]+'</svg>'}
const brand = '<span class="brand-mark">'+icon('logo')+'</span><span>Aleks <b>Work Systems</b></span>';
function renderBody(l,root,examples,tool){
  const {u,c,d}=texts[l];
  const file = name => root+'assets/home/'+name;
  const language = k => root+(k==='en'?'':k+'/')+'index.html';
  const links = [['services',u.navHelp],['work',u.navWork],['about',u.navAbout]].map(([id,t])=>'<a href="#'+id+'">'+esc(t)+'</a>').join('');
  const configs = {d,u:{draftSaved:u.draftSaved, contextAdded:u.contextAdded},topics:{default:"",run:u.runShort,start:u.startShort,...Object.fromEntries(c.situations.map(s=>[s.id,s.title]))},drafts:{default:c.draftDefault,start:c.draftStart,run:c.draftRun,...Object.fromEntries(c.situations.map(s=>[s.id,s.draft]))},mail,subject:c.emailSubject,copied:c.copied,copyFail:c.copyFail};
  return `<a class="skip" href="#main">${esc(u.skip)}</a>
<header class="mast"><div class="wrap mast-row">
<a href="#top" class="brand" aria-label="Aleks Work Systems">${brand}</a>
<nav class="desktop-nav" aria-label="${esc(u.nav)}">${links}</nav>
<div class="mast-end"><nav class="lang" aria-label="${esc(u.language)}">${langs.map(k=>`<a href="${language(k)}" data-locale="${k}" hreflang="${k}" lang="${k}" aria-label="${localeNames[k]}" ${k===l?'aria-current="page"':''}>${k.toUpperCase()}</a>`).join('')}</nav>
<a class="head-contact" href="#contact" aria-label="${esc(u.navContact)}">${icon('mail')}<span>${esc(u.navContact)}</span></a><details class="phone-menu"><summary aria-label="${esc(u.menu)}"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6h18M3 12h18M3 18h18"/></svg></summary><nav aria-label="${esc(u.nav)}">${links}<a href="#contact">${esc(u.navContact)}</a></nav></details></div>
</div></header>
<main id="main" tabindex="-1"><section class="hero wrap"><div class="hero-copy">
<p class="eyebrow nameplate"><i></i>${esc(u.kicker)}</p>
<h1>${esc(u.headline[0])}<em>${esc(u.headline[1])}</em></h1>
<p class="lead">${esc(u.lead)}</p><div class="hero-actions">
<a class="button primary" href="#contact">${icon('mail')}${esc(u.cta)}</a><a class="sample-link" href="#example">${icon('steps')}${esc(u.see)}</a>
</div></div>
<figure class="drawing"><img src="${file('thread-study.svg')}" width="560" height="342" alt=""><figcaption><span><i></i>${esc(u.figLeft)}</span><span><i></i>${esc(u.figRight)}</span></figcaption></figure></section>

<section id="paths" class="paths wrap"><h2>${esc(u.pathsTitle)}</h2>
<div class="path-grid">${['run','start'].map(r=>`<article class="path path-${r}"><span class="path-icon">${icon(r)}</span><div><h3>${esc(u.paths[r][0])}</h3><p>${esc(u.paths[r][1])}</p><div class="path-links"><a href="#example">${esc(u.pathLink)}</a><a href="#contact" data-context="${r}">${esc(u.askRoute)}</a></div></div></article>`).join('')}</div></section>

<span id="explore"></span>
${renderWorkflow(d,timeline,esc,icon,u.intakeSubject)}
${relatedExamples(l,root,examples)}

<section id="services" class="section wrap split"><div class="intro"><p class="eyebrow">${esc(u.servicesTag)}</p><h2>${esc(c.servicesTitle)}</h2><p>${esc(c.servicesIntro)}</p></div><div class="service-list">${[c.situations[2],c.situations[1],c.situations[0]].map(s=>`<article><span class="service-icon">${icon({rescue:'rescue',visibility:'globe',intake:'intake'}[s.id])}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.symptom)} ${esc(s.deliverable)}</p><a class="text-link" href="#contact" data-context="${esc(s.id)}">${esc(c.situationCta)}</a></div></article>`).join('')}</div></section>

<section class="section portfolio" id="work"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(u.portfolioTag)}</p><h2>${esc(c.workTitle)}</h2></div><p>${esc(c.workIntro)}</p></div><div class="project-list">${c.work.map((w,i)=>`<article id="case-${i+2}"><span class="work-symbol s${i}">${icon(['book','home','law'][i])}</span><div class="work-name"><p class="micro">${esc(w.type)}</p><h3>${esc(w.name)}</h3></div><p class="work-question">${esc(w.method)}</p><a href="${workURLs[i]}" class="text-link">${esc(w.action)}</a></article>`).join('')}<article id="case-1"><span class="work-symbol s0">${icon('steps')}</span><div class="work-name"><p class="micro">${esc(tool.type)}</p><h3>${esc(tool.name)}</h3></div><p class="work-question">${esc(tool.desc)}</p><a href="${esc(tool.url)}" class="text-link">${esc(u.toolLink)}</a></article></div></div></section>

<section class="section wrap" id="method"><div class="split method-layout"><div class="intro"><p class="eyebrow">${esc(u.methodTag)}</p><h2>${esc(c.methodTitle)}</h2></div><div><ol class="method-list">${c.methodSteps.map((s,i)=>`<li><span aria-hidden="true">0${i+1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div></li>`).join('')}</ol><p class="support">${esc(c.support)}</p></div></div>
<div class="about" id="about">
<img loading="lazy" width="112" height="112" src="${file('aleks.webp')}" alt="">
<div><p class="eyebrow">${esc(u.aboutTag)}</p><h2>${esc(c.aboutTitle)}</h2></div>
<div class="about-copy">
<p>${esc(c.aboutBody)}</p>
<blockquote>${esc(c.aboutQuote)}</blockquote>
<ol>${c.aboutFacts.map(fact=>`<li>${esc(fact)}</li>`).join('')}</ol>
<a class="text-link" href="${linkedin}">${esc(u.aboutLink)}</a>
</div></div></section>
<section class="contact section" id="contact"><div class="wrap split"><div class="intro"><p class="eyebrow">${esc(u.navContact)}</p><h2>${esc(c.contactTitle)}</h2><p>${esc(c.contactLead)}</p><a href="mailto:${mail}" class="email">${mail}</a></div><div class="composer js-only">
<label for="message">${esc(c.messageLabel)}</label><textarea rows="4" id="message">${esc(c.draftDefault)}</textarea><p class="helper">${esc(c.emailHint)}</p><div class="compose-actions"><a id="open-email" class="button light" href="mailto:${mail}">${icon('mail')}${esc(c.openEmail)}</a><button type="button" class="copy" id="copy-message">${icon('copy')}${esc(c.copy)}</button></div><p class="action-status" role="status" id="copy-status"></p></div><noscript><a class="button light" href="mailto:${mail}?subject=${encodeURIComponent(c.emailSubject)}&amp;body=${encodeURIComponent(c.draftDefault)}">${esc(c.openEmail)}</a></noscript></div></section></main>
<footer><div class="wrap"><a href="#top" class="brand">${brand}</a><a class="text-link" href="#top">${esc(u.back)}</a></div></footer>
<script type="application/json" id="case-data">${safeJSON(configs)}</script>`;
}

function relatedExamples(language, root, scenarios) {
  const u = texts[language].u;
  const prefix = language === 'en' ? '' : `${language}/`;
  const entries = scenarios.map(s => `<li><a href="${root}${prefix}lab/${esc(s.slug)}/index.html">${esc(s.title)}</a></li>`).join('');
  return `<div class="wrap"><details class="home-scenarios"><summary>${esc(u.moreExamples)}</summary><ul>${entries}</ul></details></div>`;
}

function doc(language, root, siteUrl, scenarios, tool) {
  const {u,c} = texts[language];
  const url = code => new URL(code === 'en' ? './' : `${code}/`, siteUrl).href;
  const alternates = langs.concat('x-default').map(code =>
    `<link rel="alternate" hreflang="${code}" href="${esc(url(code === 'x-default' ? 'en' : code))}">`).join('');
  const structured = {'@context':'https://schema.org','@graph':[
    {'@type':'Person','@id':'#aleks',name:'Aleks Karpov',email:mail,sameAs:[linkedin]},
    ...c.situations.map(s=>({'@type':'Service',name:s.title,description:s.deliverable,provider:{'@id':'#aleks'}}))
  ]};
  return `<!doctype html><html lang="${language}"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(u.title)}</title><meta name="description" content="${esc(u.meta)}"><meta name="theme-color" content="#f8f7ef">
  <link rel="canonical" href="${esc(url(language))}">${alternates}
  <meta property="og:type" content="website"><meta property="og:site_name" content="Aleks Work Systems">
  <meta property="og:title" content="${esc(u.title)}"><meta property="og:description" content="${esc(u.meta)}">
  <meta property="og:url" content="${esc(url(language))}"><meta property="og:image" content="${esc(new URL(`assets/og-${language}.png`,siteUrl).href)}">
  <meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/svg+xml" href="${root}assets/favicon.svg">
  <link rel="stylesheet" href="${root}assets/home/site.css"><link rel="stylesheet" href="${root}assets/home/workflow.css">
  <script type="application/ld+json">${safeJSON(structured)}</script><script type="application/json" id="workflow-timeline">${safeJSON(timeline)}</script>
  <script src="${root}assets/home/workflow.js" defer></script><script src="${root}assets/home/site.js" defer></script>
  </head><body id="top">${renderBody(language,root,scenarios,tool)}</body></html>\n`;
}

export async function buildHome(out, siteUrl, labs, content) {
  await cp(join(base,'assets'),join(out,'assets','home'),{recursive:true});
  for (const language of langs) {
    const scenarios = labs[language].scenarios;
    const tool = content[language].projects[0];
    const directory = join(out,language);
    const localized = doc(language,'../',siteUrl,scenarios,tool);
    await mkdir(directory,{recursive:true});
    await writeFile(join(directory,'index.html'),localized);
    if (language === 'en') {
      await writeFile(join(out,'index.html'),doc(language,'./',siteUrl,scenarios,tool));
    }
  }
}
