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
 for(const [index,s] of [[null,null],...d.scenarios.map((x,i)=>[i,x])]){
  const route=index===null?prefix:prefix+'lab/'+s.slug+'/';
  const depth=index===null?(lang==='en'?'./':'../'):(lang==='en'?'../../':'../../../');
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
  if(index!==null)assert.ok(html.includes(s.title));
 }
}
for(const p of ['assets/styles.css','assets/site.js','assets/favicon.svg','assets/hero-portrait.jpg','assets/og-en.png','assets/og-es.png','assets/og-ru.png','robots.txt','sitemap.xml','.nojekyll'])await stat(join(out,p));
const sitemap=await readFile(join(out,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<url>/g)||[]).length,21);
console.log('Checked 21 pages, six localized scenarios, links, assets, and sitemap.');


