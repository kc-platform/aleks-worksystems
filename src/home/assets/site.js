(() => {
  'use strict';
  const packet = document.getElementById('portable-pages');
  const pages = packet ? JSON.parse(packet.textContent) : null;
  if (pages) {
    const initial = document.body.cloneNode(true);
    initial.querySelectorAll('script:not(#case-data)').forEach(el => el.remove());
    pages.en = {body: initial.innerHTML, title: document.title, desc: document.querySelector('meta[name="description"]').content};
  }
  function showLanguage(code, carried) {
    const page = pages[code];
    document.documentElement.lang = code;
    document.title = page.title;
    document.querySelector('meta[name="description"]').content = page.desc;
    const template = document.createElement('template');
    template.innerHTML = page.body;
    document.body.replaceChildren(template.content);
    mount(carried);
  }
  let handlers;
  function mount(carried) {
    handlers?.abort();
    handlers = new AbortController();
    const pick = selector => document.querySelector(selector);
    const all = selector => [...document.querySelectorAll(selector)];
    const config = JSON.parse(pick('#case-data').textContent);
    const message = pick('#message');
    const status = pick('#copy-status');
    const mobileMenu = pick('.phone-menu');
    let workflowState;
    let topic = 'default';
    let contextName = '';
    let edited = false;
    const transferKey = 'aleks-work-systems:language-change';

    const save = () => ({workflow: workflowState(), topic, text: edited ? message.value : null});

    function retainForLanguage(link) {
      const handoff = {
        destination: link.href.split('#')[0], when: Date.now(), ...save()
      };
      try {
        sessionStorage.setItem(transferKey, JSON.stringify(handoff));
      } catch {
        // A restricted file viewer can keep the original draft available in this tab.
        if (edited) {
          link.target = '_blank';
          link.rel = 'noopener';
        }
      }
    }
    function restoreLanguage() {
      let saved;
      try {
        saved = JSON.parse(sessionStorage.getItem(transferKey));
        sessionStorage.removeItem(transferKey);
      } catch { return; }
      if (!saved || saved.destination !== location.href.split('#')[0] ||
          Date.now() - saved.when > 30000) return;
      return saved;
    }
    function applyState(saved) {
      if (!Object.hasOwn(config.drafts, saved.topic)) return;
      topic = saved.topic;
      contextName = config.topics[topic];
      edited = typeof saved.text === 'string';
      message.value = edited ? saved.text : config.drafts[topic];
      if (edited) status.textContent = config.u.draftSaved;
    }

    function setMail() {
      const subject = config.subject + (contextName ? ' · ' + contextName : '');
      const body = message.value.replace(/\r?\n/g, '\r\n');
      pick('#open-email').href = 'mailto:' + config.mail + '?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }
    function formContext(key, label) {
      topic = key;
      contextName = label.trim();
      if (!edited) message.value = config.drafts[key];
      status.textContent = edited ? config.u.draftSaved : config.u.contextAdded;
      setMail();
    }
    for (const link of all('[data-locale]')) {
      const url = new URL(link.href, location.href);
      if (!pages && url.protocol !== 'file:') url.pathname = url.pathname.replace(/index\.html$/, '');
      link.href = url.href;
      link.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (location.hash && document.getElementById(location.hash.slice(1))) {
          const href = new URL(link.href);
          href.hash = location.hash;
          link.href = href.href;
        }
        if (pages) {
          e.preventDefault();
          const saved = save();
          const scrollY = window.scrollY;
          try { history.replaceState(null, '', link.href); } catch { /* Some offline viewers use an opaque URL. */ }
          showLanguage(link.dataset.locale, saved);
          const anchor = document.getElementById(location.hash.slice(1));
          if (anchor) anchor.scrollIntoView();
          else window.scrollTo(0,scrollY);
          document.querySelector('[data-locale][aria-current]').focus({preventScroll:true});
        } else retainForLanguage(link);
      });
    }
    for (const link of all('[data-context]')) {
      link.addEventListener('click', () => {
        const key = link.dataset.context;
        formContext(key, link.dataset.topic || config.topics[key]);
        document.getElementById('contact').scrollIntoView();
      });
    }
    message.addEventListener('input', () => {
      edited = message.value !== config.drafts[topic];
      status.textContent = '';
      setMail();
    });
    pick('#copy-message').addEventListener('click', async () => {
      let success = false;
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(message.value);
          success = true;
        }
      } catch { /* A file or embedded viewer may restrict the clipboard. */ }
      if (!success) {
        message.focus();
        message.select();
        try { success = document.execCommand('copy'); } catch { /* Keep the text selected. */ }
      }
      status.textContent = success ? config.copied : config.copyFail;
    });
    mobileMenu.querySelector('nav').addEventListener('click', () => { mobileMenu.open = false; });
    document.body.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.open) { mobileMenu.open = false; mobileMenu.querySelector('summary').focus(); }
    }, {signal:handlers.signal});
    document.body.addEventListener('click', e => {
      if (mobileMenu.open && !mobileMenu.contains(e.target)) mobileMenu.open = false;
    }, {signal:handlers.signal});
    const saved = carried ?? (!pages ? restoreLanguage() : null);
    if (saved) applyState(saved);
    setMail();
    const timeline = JSON.parse(pick('#workflow-timeline').textContent);
    workflowState = InquiryComparison.mount(pick('#lab'), timeline, config.d, saved?.workflow, handlers.signal);
    document.documentElement.classList.add('enhanced');
  }
  const initialLanguage = new URLSearchParams(location.search).get('lang');
  if (pages && initialLanguage && Object.hasOwn(pages, initialLanguage)) showLanguage(initialLanguage, null);
  else mount(null);
  if (pages && location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
