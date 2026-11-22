export function renderWorkflow(c, esc) {
  const [status, action, decision] = c.states[0];
  return `<section class="example section" id="example" aria-labelledby="example-title">
  <div class="wrap" id="explore">
    <header class="example-head">
      <div><p class="eyebrow">${esc(c.demoLabel)}</p><h2 id="example-title">${esc(c.demoTitle)}</h2></div>
      <p>${esc(c.demoIntro)}</p>
    </header>
    <div class="demo">
      <aside class="inquiry">
        <p class="eyebrow">${esc(c.requestLabel)}</p>
        <blockquote>${esc(c.quote)}</blockquote>
        <p class="principle">${esc(c.principle)}</p>
        <p class="demo-note">${esc(c.exampleNote)}</p>
      </aside>
      <div class="workspace">
        <div class="demo-toolbar" data-demo-control hidden>
          <div class="mode-switch" role="group" aria-label="${esc(c.modeLabel)}">
            <button type="button" aria-pressed="true" aria-controls="before-panel" data-mode="before">${esc(c.before)}</button>
            <button type="button" aria-pressed="false" aria-controls="after-panel" data-mode="after">${esc(c.after)}</button>
          </div>
          <button type="button" class="plain" id="demo-reset">${esc(c.reset)}</button>
        </div>
        <div id="before-panel" class="demo-panel">
          <h3>${esc(c.beforeHeading)}</h3><p class="panel-intro">${esc(c.beforeIntro)}</p>
          <ol class="before-track">${c.beforeSteps.map(([title, detail]) => `<li><div><strong>${esc(title)}</strong><p>${esc(detail)}</p></div></li>`).join('')}</ol>
          <div class="demo-actions" data-demo-control hidden>
            <button type="button" class="button secondary" id="before-next">${esc(c.nextStep)}</button>
            <button type="button" class="button primary" id="compare" hidden>${esc(c.compare)}</button>
          </div>
        </div>
        <div id="after-panel" class="demo-panel" hidden>
          <h3>${esc(c.afterHeading)}</h3>
          <dl class="record">
            <div><dt>${esc(c.owner)}</dt><dd>${esc(c.ownerValue)}</dd></div>
            <div><dt>${esc(c.status)}</dt><dd id="record-status" data-stage="0" tabindex="-1">${esc(status)}</dd></div>
            <div><dt>${esc(c.next)}</dt><dd id="record-next">${esc(action)}</dd></div>
          </dl>
          <div class="inbox">
            <div class="inbox-row decision-row">
              <h4>${esc(c.decision)}</h4>
              <div><p id="decision-text">${esc(decision)}</p><p class="question" id="question">${esc(c.question)}</p>
                <button type="button" class="button primary" id="approve">${esc(c.approval)}</button>
              </div>
            </div>
            <div class="inbox-row missing-row">
              <h4>${esc(c.missing)}</h4>
              <div><p id="missing-text">${esc(c.missingDetails)}</p><p id="sample-details" hidden>${esc(c.sample)}</p>
                <button type="button" class="button primary" id="sample-reply" hidden>${esc(c.reply)}</button>
              </div>
            </div>
            <div class="inbox-row automatic-row"><h4>${esc(c.automatic)}</h4><p>${esc(c.autoDetails)}</p></div>
          </div>
          <details class="history"><summary>${esc(c.history)}</summary>
            <ol>${c.historyItems.map((text, index) => `<li${index >= 3 ? ' hidden' : ''}>${esc(text)}</li>`).join('')}</ol>
          </details>
        </div>
        <p id="demo-announcement" class="sr" role="status"></p>
        <noscript><div class="demo-panel static-after"><h3>${esc(c.after)}</h3><p>${esc(c.noScript)}</p></div></noscript>
      </div>
    </div>
  </div>
</section>`;
}
