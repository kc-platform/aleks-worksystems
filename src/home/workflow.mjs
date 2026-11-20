export function renderWorkflow(d, time, esc, icon, contactTopic) {
  const mark = (at, content, classes='') => {
    const [x,y]=time.nodes[at];
    return `<div class="wf-mark ${classes}" style="--x:${x}%;--y:${y}%">${content}</div>`;
  };
  const glyphs = {
    person:'<circle cx="12" cy="8" r="3"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/>',
    chat:'<path d="M4 4h16v12H9l-5 4zM8 9h8M8 12h5"/>',
    phone:'<path d="M7 4h3l1 5-2 1a12 12 0 0 0 5 5l1-2 5 1v3c0 2-2 3-4 2C9 17 5 13 4 7c0-2 1-3 3-3z"/>',
    clock:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
    desk:'<rect x="4" y="4" width="16" height="15" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    question:'<path d="M9 8a3 3 0 1 1 4 3c-1 .5-1 1-1 2m0 3h.01"/>',
    payment:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18m-5 4h2"/>',
    cross:'<path d="m7 7 10 10M7 17 17 7"/>'
  };
  const draw = name => glyphs[name]
    ? `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[name]}</svg>`
    : icon(name);
  const pieces = Object.entries({
    request:['chat',0],file:['clip',1],question:['question',2],area:['sheet',3],
    record:['sheet',4],retained:['sheet',3],repeat:['question',2],draft:['sheet',5],result:['check',5],
    payment:['payment',6],form:['desk',7],customer:['person',null]
  });
  const lanes=d.headings.map((heading,i)=>{
    const routes=time.routes[i].map(route=>`<polyline points="${route.map(key=>time.nodes[key].join(',')).join(' ')}"/>`).join('');
    return `<article class="wf-lane wf-lane-${i}" data-lane="${i}">
    <h3>${esc(heading)}</h3>
    <div class="wf-diagram" aria-hidden="true">
      <svg class="wf-tracks" viewBox="0 0 100 100" preserveAspectRatio="none">${routes}<g data-traces></g></svg>
      ${mark('n',`${draw('person')}<span>${esc(d.customer)}</span>`,'wf-client')}
      ${[['w','chat',d.wa],['e','mail',d.mail],['p','phone',d.phone],['f','desk',d.form]].map(([at,glyph,label])=>mark(at,`${draw(glyph)}<span>${esc(label)}</span>`,`wf-channel wf-channel-${at}`)).join('')}
      ${mark('desk',`${draw(i?'desk':'inbox')}<span>${esc(d.desk[i])}</span>`,'wf-desk')}
      ${['a','b','c'].map(at=>mark(at,`<span class="wf-avatar">${at.toUpperCase()}</span><span>${esc(at==='c'?d.specialist:d.staff)}</span>`,`wf-worker wf-worker-${at}`)).join('')}
      ${pieces.map(([key,[glyph,index]])=>`<div class="wf-piece wf-piece-${key}" data-piece="${key}" hidden><span>${draw(glyph)}${esc(index===null?d.customer:d.tokens[index])}</span></div>`).join('')}
    </div>
    <p class="wf-lane-status"><span aria-hidden="true" data-status-mark>${i?'✓':'×'}</span><strong data-state>${esc(i?d.delivered:d.lost)}</strong></p>
    <dl class="wf-fields" aria-label="${esc(d.record)} Q‑014">
    ${[2,1,3,4,5].map(index=>`<div><dt>${esc(d.fields[index])}</dt><dd data-value="${index}">${esc(i||index===4?index===5?d.actions[4]:d.values[index]:'—')}</dd></div>`).join('')}
    </dl>
    <div class="wf-outcome" data-outcome>${draw(i?'check':'cross')}<span>${esc(d.outcomes[i])}</span></div></article>`;
  }).join('');
  return `<section id="example" class="example section"><div class="wrap">
  <div class="section-head"><h2>${esc(d.title)}</h2><p>${esc(d.intro)}</p></div>
  <div class="wf" id="lab">
    <div class="wf-top"><p class="wf-meta">${esc(d.story)} <span aria-hidden="true">·</span> <strong>Q‑014</strong></p>
      <div class="wf-switch js-only" role="group" aria-label="${esc(d.mode)}">
      ${d.channels.map((label,index)=>`<button type="button" data-channel="${index?'form':'messages'}" aria-pressed="${!index}">${esc(label)}</button>`).join('')}</div>
    </div>
    <div class="wf-controls js-only">
      <button class="wf-play" type="button" data-play>${esc(d.play)}</button>
      <button type="button" data-replay>${esc(d.replay)}</button>
      <span class="wf-clock">${draw('clock')} <span data-clock>${esc(d.minutes[0])}</span></span>
      <progress data-progress value="0" max="${time.duration}" aria-label="${esc(d.progress)}"></progress>
    </div>
    <div class="wf-board">${lanes}</div>
    <div class="wf-steps js-only" role="group" aria-label="${esc(d.progress)}">
    ${d.steps.map((label,index)=>`<button type="button" data-step="${index}" aria-pressed="${!index}"><span>${esc(label)}</span></button>`).join('')}
    </div>
    <details class="wf-summary"><summary>${esc(d.summaryTitle)}</summary><p>${esc(d.summary)}</p><p>${esc(d.phoneNote)}</p></details>
  </div>
  <div class="wf-contact"><p>${esc(d.bridge)}</p><a class="text-link" data-context="intake" data-topic="${esc(contactTopic)}" href="#contact">${esc(d.contact)}</a></div>
  </div></section>`;
}
