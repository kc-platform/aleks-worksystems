document.documentElement.classList.add('js');
const menuButton=document.querySelector('.menu-toggle'),mobileMenu=document.querySelector('#mobile-menu');
if(menuButton&&mobileMenu){
 const close=()=>{menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label',menuButton.dataset.openLabel);mobileMenu.hidden=true};
 menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?menuButton.dataset.closeLabel:menuButton.dataset.openLabel);mobileMenu.hidden=!open});
 mobileMenu.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 matchMedia('(min-width: 861px)').addEventListener('change',e=>{if(e.matches)close()});
}
const tabs=[...document.querySelectorAll('[data-tab]')],modules=[...document.querySelectorAll('[data-scenario]')],form=document.querySelector('#enquiry-form');
function choose(i,focus=false){
 tabs.forEach(t=>{const active=Number(t.dataset.tab)===i;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
 modules.forEach(m=>{m.hidden=Number(m.dataset.scenario)!==i});
 if(form)form.elements.scenario.value=tabs[i]?.textContent.replace(/^\s*0\d/,'').replace(/↗\s*$/,'').trim()||'';
 if(focus)tabs[i]?.focus();
}
if(tabs.length){
 choose(Number(document.body.dataset.selected)||0);
 tabs.forEach(tab=>tab.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const i=Number(tab.dataset.tab);choose(i);history.pushState({scenario:i},'',tab.href);document.querySelector('#explore').scrollIntoView({block:'start'})}));
 document.querySelector('.scenario-tabs')?.addEventListener('keydown',e=>{const i=Number(document.querySelector('[data-tab][aria-selected="true"]')?.dataset.tab)||0;const next=e.key==='ArrowDown'||e.key==='ArrowRight'?(i+1)%tabs.length:e.key==='ArrowUp'||e.key==='ArrowLeft'?(i+tabs.length-1)%tabs.length:null;if(next!==null){e.preventDefault();tabs[next].click();tabs[next].focus()}});
 addEventListener('popstate',()=>{const i=tabs.findIndex(t=>t.href===location.href);choose(i>=0?i:0)});
}
document.querySelectorAll('[data-clarity]').forEach(unit=>{
 const button=unit.querySelector('.clarity-switch');
 button.addEventListener('click',()=>{const improved=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(improved));button.setAttribute('aria-label',improved?button.dataset.after:button.dataset.before);button.querySelector('.switch-label').textContent=improved?button.dataset.after:button.dataset.before;unit.classList.toggle('is-improved',improved)});
});
const heroDisplay=document.querySelector('.hero-display'),heroAction=document.querySelector('.display-bottom a');
if(heroDisplay&&heroAction){
 const label=heroAction.textContent.replace('↓','').trim();
 const button=document.createElement('button');
 button.type='button';button.className='hero-transform';button.setAttribute('aria-pressed','false');button.textContent=label+' ↔';
 heroAction.replaceWith(button);
 button.addEventListener('click',()=>{const improved=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(improved));heroDisplay.classList.toggle('hero-improved',improved)});
}
document.querySelectorAll('[data-enquiry]').forEach(a=>a.addEventListener('click',()=>{const i=Number(a.dataset.enquiry);if(form&&tabs[i])form.elements.scenario.value=tabs[i].textContent.replace(/^\s*0\d/,'').replace(/↗\s*$/,'').trim()}));
if(form){
 const i18n=JSON.parse(document.querySelector('#lab-i18n').textContent);
 const status=form.querySelector('.form-status');
 const fallback=form.querySelector('.copy-fallback');
 const message=()=>{const d=new FormData(form),labels=[...form.querySelectorAll('label')].map(x=>x.childNodes[0].textContent.trim());return [form.dataset.scenarioLabel+': '+d.get('scenario'),'',...['problem','tools','outcome','reply'].map((key,i)=>labels[i]+'\n'+(d.get(key)||'—'))].join('\n\n')};
 form.addEventListener('submit',e=>{e.preventDefault();location.href='mailto:'+form.dataset.email+'?subject='+encodeURIComponent(form.dataset.subject)+'&body='+encodeURIComponent(message())});
 form.querySelector('#copy-message').addEventListener('click',async()=>{const value=message();try{await navigator.clipboard.writeText(value);status.textContent=i18n.copied;fallback.hidden=true}catch{fallback.value=value;fallback.hidden=false;fallback.select();status.textContent=i18n.copyFail}});
}
