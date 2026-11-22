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
 assert.ok(home.includes('href="'+homeDepth+'assets/home/site.css?v='));
 for(const id of ['main','explore','example','services','work','method','about','contact','contact-form','copy-message','demo-reset','before-panel','after-panel','approve','sample-reply','home-copy']){
  assert.equal(home.split('id="'+id+'"').length,2,lang+' missing or duplicate ID '+id);
 }
 assert.equal((home.match(/aria-controls="(?:before|after)-panel"/g)||[]).length,2);
 assert.equal((home.match(/class="inbox-row /g)||[]).length,3);
 for(const name of ['name','email','problem'])assert.ok(home.includes('name="'+name+'"'));
 assert.ok(home.includes('mailto:'+c.email));
 for(const scenario of d.scenarios)assert.ok(home.includes(homeDepth+prefix+'lab/'+scenario.slug+'/'));
 for(const other of [...languages,'x-default'])assert.ok(home.includes('hreflang="'+other+'"'));
 for(const match of home.matchAll(/href="#([^"]+)"/g))assert.ok(home.includes('id="'+match[1]+'"'),'Broken #'+match[1]+' in language '+lang);
 const options=JSON.parse(home.match(/id="home-copy">([^<]+)<\/script>/)[1]);
 assert.deepEqual(options.states.map(state=>state.length),[4,4,4]);
 assert.equal(options.fields.length,3);
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
assert.ok(englishAlias.includes('href="../assets/home/site.css?v='));
assert.equal(englishAlias.match(/<link rel="canonical" href="([^"]+)"/)?.[1],english.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);
for(const p of ['assets/home/site.css','assets/home/site.js','assets/home/aleks.webp','assets/styles.css','assets/site.js','assets/favicon.svg','assets/hero-portrait.jpg','assets/og-en.png','assets/og-es.png','assets/og-ru.png','robots.txt','sitemap.xml','.nojekyll'])await stat(join(out,p));
const sitemap=await readFile(join(out,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<url>/g)||[]).length,21);
console.log('Checked four localized home routes, 18 scenario pages, demo markup, contact, assets, and sitemap.');
