'use strict';

const copy = JSON.parse(document.querySelector('#home-copy').textContent);
const byId = id => document.getElementById(id);

function activateMode(modes, mode) {
  for (const button of modes) {
    const selected = button.dataset.mode === mode;
    button.setAttribute('aria-pressed', String(selected));
    byId(button.getAttribute('aria-controls')).hidden = !selected;
  }
}

function setupScenario(comparison) {
  const modes = [...comparison.querySelectorAll('[data-mode]')];
  const announcement = comparison.querySelector('[role="status"]');
  for (const button of modes) {
    button.addEventListener('click', () => {
      activateMode(modes, button.dataset.mode);
      announcement.textContent = button.textContent;
    });
  }
  activateMode(modes, 'before');
  comparison.querySelector('[data-scenario-toolbar]').hidden = false;
}


function setupInquiry() {
  const modes = [...document.querySelectorAll('[data-mode]')];
  const panels = { before: byId('before-panel'), after: byId('after-panel') };
  const steps = [...document.querySelectorAll('.before-track li')];
  const history = document.querySelector('.history');
  const entries = [...history.querySelectorAll('li')];
  const afterToggle = document.querySelector('[data-mode=after]');
  const next = byId('before-next');
  const compare = byId('compare');
  const approve = byId('approve');
  const reply = byId('sample-reply');
  const status = byId('record-status');
  const announcement = byId('demo-announcement');
  let beforeStep = 0;
  let stage = 0;

  const showMode = mode => activateMode(modes, mode);

  function renderBefore() {
    steps.forEach((step, index) => {
      if (index === beforeStep) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
      step.querySelector('p').hidden = index > beforeStep;
    });
    const finished = beforeStep === steps.length - 1;
    next.hidden = finished;
    compare.hidden = !finished;
  }

  function renderAfter() {
    const [state, nextAction, decision] = copy.states[stage];
    status.textContent = state;
    status.dataset.stage = stage;
    byId('record-next').textContent = nextAction;
    byId('decision-text').textContent = decision;
    byId('question').hidden = stage !== 0;
    approve.hidden = stage !== 0;
    reply.hidden = stage !== 1;
    byId('missing-text').textContent = stage === 2 ? copy.readyDetails : copy.missingDetails;
    byId('sample-details').hidden = stage !== 2;
    entries.forEach((entry, index) => { entry.hidden = index >= 3 + stage; });
  }

  for (const button of modes) {
    button.addEventListener('click', () => {
      showMode(button.dataset.mode);
      announcement.textContent = panels[button.dataset.mode].querySelector('h3').textContent;
    });
  }
  next.addEventListener('click', () => {
    beforeStep += 1;
    renderBefore();
    announcement.textContent = steps[beforeStep].textContent.trim();
    if (next.hidden) compare.focus();
  });
  compare.addEventListener('click', () => {
    showMode('after');
    announcement.textContent = panels.after.querySelector('h3').textContent;
    afterToggle.focus();
  });

  approve.addEventListener('click', () => {
    stage = 1;
    renderAfter();
    announcement.textContent = copy.states[stage][3];
    reply.focus();
  });
  reply.addEventListener('click', () => {
    stage = 2;
    renderAfter();
    announcement.textContent = copy.states[stage][3];
    status.focus();
  });
  byId('demo-reset').addEventListener('click', () => {
    beforeStep = 0;
    stage = 0;
    history.open = false;
    renderBefore();
    renderAfter();
    showMode('before');
    announcement.textContent = copy.resetMessage;
  });
  renderBefore();
  for (const control of document.querySelectorAll('[data-demo-control]')) control.hidden = false;
}

const scenario = document.querySelector('[data-scenario-comparison]');
if (scenario) setupScenario(scenario);
else setupInquiry();

const menu = document.querySelector('.phone-menu');
menu.addEventListener('click', event => {
  if (event.target.closest('a')) menu.open = false;
});
menu.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});

const languages = document.querySelectorAll('.lang a');
function syncLanguageLinks() {
  for (const link of languages) {
    const url = new URL(link.href);
    url.hash = location.hash;
    link.href = url.href;
  }
  if (location.hash === '#work') byId('work').open = true;
}
syncLanguageLinks();
window.addEventListener('hashchange', syncLanguageLinks);

const form = byId('contact-form');
const feedback = byId('copy-status');
const fallback = byId('copy-fallback');
const contactFields = [...form.querySelectorAll('[required]')];

function validDraft() {
  for (const field of contactFields) field.value = field.value.trim();
  return form.reportValidity();
}

function message() {
  const [name, email, problem] = contactFields.map(field => field.value);
  const fields = `${copy.fields[0]}: ${name}\n${copy.fields[1]}: ${email}`;
  return [copy.context, fields, problem].filter(Boolean).join('\n\n');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validDraft()) return;
  window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(message())}`;
});
byId('copy-message').addEventListener('click', async () => {
  if (!validDraft()) return;
  const draft = message();
  try {
    await navigator.clipboard.writeText(draft);
    fallback.hidden = true;
    feedback.textContent = copy.copied;
  } catch {
    fallback.value = draft;
    fallback.hidden = false;
    feedback.textContent = copy.copyFail;
    fallback.select();
  }
});
form.addEventListener('input', () => {
  fallback.hidden = true;
  feedback.textContent = '';
});
form.hidden = false;
