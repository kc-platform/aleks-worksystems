function recordsTable(scenario, caption, rows, esc) {
  const headings = scenario.columns.map(column => `<th scope="col" role="columnheader">${esc(column)}</th>`).join('');
  const entries = rows.map(row => `<tr role="row">${row.map((value, index) => {
    const label = `<span class="cell-label" aria-hidden="true">${esc(scenario.columns[index])}</span>`;
    return index === 0
      ? `<th scope="row" role="rowheader">${label}<span>${esc(value)}</span></th>`
      : `<td role="cell">${label}<span>${esc(value)}</span></td>`;
  }).join('')}</tr>`).join('');
  return `<table class="scenario-table" role="table">
    <caption class="sr">${esc(caption)}</caption>
    <thead role="rowgroup"><tr role="row">${headings}</tr></thead>
    <tbody role="rowgroup">${entries}</tbody>
  </table>`;
}

export function renderScenario(c, scenario, ui, home, esc) {
  const comparisons = [
    { mode: 'before', label: c.before, rows: scenario.before },
    { mode: 'after', label: c.after, rows: scenario.after }
  ];
  return `<section class="scenario-intro wrap" aria-labelledby="scenario-title">
    <a class="text-link scenario-back" href="${home}#work">${esc(ui.back)}</a>
    <h1 id="scenario-title">${esc(scenario.title)}</h1>
    <p class="lead">${esc(scenario.problem)}</p>
  </section>
  <section class="example section scenario-section" id="explore" aria-label="${esc(c.modeLabel)}">
    <div class="wrap">
      <div class="scenario-comparison" data-scenario-comparison>
        <div class="demo-toolbar" data-scenario-toolbar hidden>
          <div class="mode-switch" role="group" aria-label="${esc(c.modeLabel)}">
            ${comparisons.map(({ mode, label }) => `<button type="button" data-mode="${mode}" aria-controls="${mode}-panel" aria-pressed="${mode === 'before'}">${esc(label)}</button>`).join('')}
          </div>
          <p class="sample-note">${esc(ui.sample)}</p>
        </div>
        <noscript><p class="sample-note scenario-static-note">${esc(ui.sample)}</p></noscript>
        ${comparisons.map(({ mode, label, rows }) => `<div id="${mode}-panel" class="demo-panel scenario-panel">
          <h2>${esc(label)}</h2>
          ${recordsTable(scenario, `${scenario.title} · ${label}`, rows, esc)}
        </div>`).join('')}
        <p class="sr" role="status"></p>
      </div>
      <dl class="scenario-notes">
        <div><dt>${esc(ui.change)}</dt><dd>${esc(scenario.change)}</dd></div>
        <div><dt>${esc(ui.verify)}</dt><dd>${esc(scenario.verify)}</dd></div>
      </dl>
      <a class="button primary" href="#contact">${esc(ui.discuss)}</a>
    </div>
  </section>`;
}
