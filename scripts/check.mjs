import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {content} from '../src/content.mjs';
import {lab} from '../src/lab.mjs';

const root=fileURLToPath(new URL('..',import.meta.url)),out=join(root,'dist');
const languages=['en','es','ru'];
for(const lang of languages){
 const c=content[lang],d=lab[lang],prefix=lang==='en'?'':lang+'/';
 assert.equal(d.scenarios.length,6);
 assert.equal(d.ui.method.length,5);
 assert.equal(d.ui.contactQuestions.length,4);
 assert.equal(c.projects.length,4);
 assert.equal(c.aboutFacts.length,3);
 const home=await readFile(join(out,prefix,'index.html'),'utf8');
 assert.ok(home.includes('<html lang="'+lang+'">'));
 const homeDepth=lang==='en'?'./':'../';
 assert.ok(home.includes('href="'+homeDepth+'assets/home/workflow.css"'));
 assert.ok(home.includes('id="workflow-timeline"'));
 assert.equal((home.match(/data-lane="/g)||[]).length,2);
 assert.ok(home.includes('id="copy-message"'));
 assert.ok(home.includes('mailto:'+c.email));
 assert.ok(home.includes('https://arwt.netlify.app/'));
 for(const id of ['explore','example','paths','services','work','method','about','contact'])assert.ok(home.includes('id="'+id+'"'));
 for(const scenario of d.scenarios)assert.ok(home.includes(prefix+'lab/'+scenario.slug+'/index.html'));
 for(const other of languages)assert.ok(home.includes('hreflang="'+other+'"'));
 for(const match of home.matchAll(/href="#([^"]+)"/g))assert.ok(home.includes('id="'+match[1]+'"'),'Broken #'+match[1]+' in language '+lang);
 assert.ok(!home.includes('data-xr-mode'));
 for(const s of d.scenarios){
  const route=prefix+'lab/'+s.slug+'/';
  const depth=lang==='en'?'../../':'../../../';
  const html=await readFile(join(out,route,'index.html'),'utf8');
  assert.ok(html.includes('<html lang="'+lang+'">'));
  assert.ok(html.includes('href="'+depth+'assets/styles.css?v=20261118b"'));
  assert.ok(html.includes('<link rel="canonical"'));
  assert.ok(html.includes('<main id="main">'));
  assert.ok(html.includes('class="clarity-switch"'));
  assert.ok(html.includes('id="enquiry-form"'));
  assert.ok(html.includes('assets/hero-portrait.jpg'));
  for(const id of ['explore','services','work','method','about','contact'])assert.ok(html.includes('id="'+id+'"'));
  for(const other of languages)assert.ok(html.includes('hreflang="'+other+'"'));
  for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes('id="'+match[1]+'"'),'Broken #'+match[1]+' in '+route);
  assert.ok(!/lorem ipsum|placeholder/i.test(html));
  assert.equal((html.match(/class="lab-module"/g)||[]).length,6);
  assert.equal((html.match(/class="evidence-case"/g)||[]).length,4);
  for(const scenario of d.scenarios)assert.ok(html.includes(scenario.slug));
  assert.ok(html.includes(s.title));
 }
}
const englishAlias=await readFile(join(out,'en','index.html'),'utf8');
const english=await readFile(join(out,'index.html'),'utf8');
assert.ok(englishAlias.includes('href="../assets/home/workflow.css"'));
assert.equal(englishAlias.match(/<link rel="canonical" href="([^"]+)"/)?.[1],english.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);
for(const p of ['assets/styles.css','assets/site.js','assets/favicon.svg','assets/hero-portrait.jpg','assets/og-en.png','assets/og-es.png','assets/og-ru.png','robots.txt','sitemap.xml','.nojekyll'])await stat(join(out,p));
const sitemap=await readFile(join(out,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<url>/g)||[]).length,21);
console.log('Checked restored homepages, 18 preserved scenario pages, links, assets, and sitemap.');


