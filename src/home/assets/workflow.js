const InquiryComparison = (() => {
  'use strict';

  const svgNS = 'http://www.w3.org/2000/svg';

  function position(nodes, motion, elapsed) {
    const [start, end, ...route] = motion;
    const progress = Math.max(0, Math.min(1, (elapsed - start) / (end - start)));
    const segment = Math.min(route.length - 2, Math.floor(progress * (route.length - 1)));
    const from = nodes[route[segment]];
    const to = nodes[route[segment + 1]];
    const t = progress * (route.length - 1) - segment;
    return {
      point: from.map((value, index) => value + (to[index] - value) * t),
      route: route.slice(0, segment + 1).map(node => nodes[node]),
      active: elapsed < end
    };
  }

  function sample(timeline, channel, elapsed) {
    const phase = timeline.phases.findLastIndex(start => elapsed >= start);
    const step = timeline.steps.findLastIndex(start => elapsed >= start);
    const lanes = timeline[channel].map((tracks, side) =>
      Object.fromEntries(Object.entries(tracks).map(([key, motions]) => {
        const motion = motions.findLast(([start]) => elapsed >= start);
        const end = timeline.dismiss[key][side];
        return [key, motion && (end === null || elapsed < end) ? position(timeline.nodes, motion, elapsed) : null];
      }))
    );
    return {phase, step, lanes};
  }

  function valuesFor(d, elapsed, phase, channel, side) {
    const submitted = channel === 'form';
    const captured = elapsed >= (submitted && !side ? 5.3 : 2.8);
    const complete = side && (submitted ? captured : elapsed >= 5.6);
    const assigned = side && elapsed >= (submitted ? 7.68 : 10.15);
    const action = phase === 6 ? 4 : phase === 5 ? 3 : phase === 4 ? 2 : assigned ? 1 : 0;
    return {
      1: side && captured ? d.values[1] : '—',
      2: complete || (!side && submitted && captured) ? d.values[2] : '—',
      3: assigned ? d.values[3] : '—',
      4: captured ? d.values[4] : '—',
      5: side && captured ? d.actions[action] : '—'
    };
  }

  function prepareLane(element) {
    const traces = element.querySelector('[data-traces]');
    const pieces = {};
    for (const item of element.querySelectorAll('[data-piece]')) {
      const path = document.createElementNS(svgNS,'polyline');
      path.setAttribute('class','wf-trace wf-trace-' + item.dataset.piece);
      traces.append(path);
      pieces[item.dataset.piece] = {item,path};
    }
    return {
      element, pieces, state: element.querySelector('[data-state]'),
      statusMark: element.querySelector('[data-status-mark]'),
      outcome: element.querySelector('[data-outcome]'),
      fields: [...element.querySelectorAll('[data-value]')]
    };
  }

  function renderLanes(lanes, frame, d, channel, elapsed) {
    const labels = channel === 'form' ? d.formStates : d.states;
    for (const [side,lane] of lanes.entries()) {
      const {phase} = frame;
      lane.element.dataset.phase = phase;
      lane.element.dataset.assigned = String(side === 1 && elapsed >= (channel === 'form' ? 7.68 : 10.15));
      const shortStage = side === 1 && channel === 'form' && phase === 2 && elapsed >= 7.68 ? 3 : phase;
      const status = labels[side][shortStage];
      if (lane.state.textContent !== status) lane.state.textContent = status;
      const marker = phase === 6 ? (side ? '✓' : '×') : phase === 4 && !side ? '◷' : '·';
      if (lane.statusMark.textContent !== marker) lane.statusMark.textContent = marker;
      lane.outcome.hidden = phase !== 6;
      const fields = valuesFor(d, elapsed, phase, channel, side);
      for (const field of lane.fields) {
        const value = fields[field.dataset.value];
        if (field.textContent !== value) field.textContent = value;
        field.classList.toggle('wf-checked', side === 1 && value !== '—');
      }
      for (const [key,{item,path}] of Object.entries(lane.pieces)) {
        const token = frame.lanes[side][key];
        item.hidden = !token;
        if (token) item.style.transform = 'translate(' + token.point.map(coordinate=>coordinate.toFixed(2)+'%').join(',') + ')';
        const points = token ? [...token.route,token.point].map(point=>point.join(',')).join(' ') : '';
        if (path.getAttribute('points') !== points) path.setAttribute('points',points);
      }
    }
  }

  function mount(root, timeline, d, saved, signal) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const lanes = [...root.querySelectorAll('[data-lane]')].map(prepareLane);
    const play = root.querySelector('[data-play]');
    const replay = root.querySelector('[data-replay]');
    const progress = root.querySelector('[data-progress]');
    const clock = root.querySelector('[data-clock]');
    const steps = [...root.querySelectorAll('[data-step]')];
    const channels = [...root.querySelectorAll('[data-channel]')];
    let elapsed = Number.isFinite(saved?.elapsed) ? Math.max(0, Math.min(timeline.duration,saved.elapsed)) :
      reduced.matches ? timeline.duration : 0;
    let channel = saved?.channel === 'form' ? 'form' : 'messages';
    let wantsPlay = !reduced.matches && (saved?.playing ?? true);
    let inView = false;
    let frameId = 0;
    let lastTick;

    function render() {
      const frame = sample(timeline,channel,elapsed);
      progress.value = elapsed;
      if (clock.textContent !== d.minutes[frame.phase]) clock.textContent = d.minutes[frame.phase];
      root.dataset.channel = channel;
      for (const button of steps) button.setAttribute('aria-pressed', String(Number(button.dataset.step) === frame.step));
      for (const button of channels) button.setAttribute('aria-pressed',String(button.dataset.channel === channel));
      const ended = elapsed === timeline.duration;
      const label = reduced.matches ? d.step : ended ? d.replay :
        wantsPlay && inView && !document.hidden ? d.pause : elapsed > 0 ? d.resume : d.play;
      if (play.textContent !== label) play.textContent = label;
      root.dataset.ended = String(ended);
      renderLanes(lanes,frame,d,channel,elapsed);
    }

    function eligible() {
      return wantsPlay && inView && !document.hidden && !reduced.matches && elapsed < timeline.duration;
    }
    function schedule() {
      if (eligible()) {
        if (!frameId) frameId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frameId);
        frameId = 0;
        lastTick = undefined;
      }
    }
    function tick(now) {
      frameId = 0;
      if (!eligible()) return;
      if (lastTick !== undefined) elapsed = Math.min(timeline.duration, elapsed + Math.min(100,now-lastTick)/1000);
      lastTick = now;
      if (elapsed === timeline.duration) wantsPlay = false;
      render();
      schedule();
    }
    function seek(time, playing) {
      elapsed = time;
      wantsPlay = playing && !reduced.matches;
      lastTick = undefined;
      render();
      schedule();
    }
    play.addEventListener('click', () => {
      if (reduced.matches) {
        const current = sample(timeline,channel,elapsed).step;
        seek(timeline.steps[(current+1)%timeline.steps.length],false);
      } else if (elapsed === timeline.duration) seek(0,true);
      else seek(elapsed,!wantsPlay);
    }, {signal});
    replay.addEventListener('click', () => seek(0,true), {signal});
    for (const button of channels) button.addEventListener('click', () => {
      if (button.dataset.channel === channel) return;
      channel = button.dataset.channel;
      seek(0,true);
    }, {signal});
    for (const button of steps) button.addEventListener('click', () => {
      seek(timeline.steps[Number(button.dataset.step)],false);
    }, {signal});
    document.addEventListener('visibilitychange', () => { render(); schedule(); }, {signal});
    reduced.addEventListener('change', () => {
      if (reduced.matches) wantsPlay = false;
      render();
      schedule();
    }, {signal});
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      render();
      schedule();
    }, {threshold:.15});
    observer.observe(root.querySelector('.wf-board'));
    signal.addEventListener('abort', () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    }, {once:true});
    render();
    return () => ({channel,elapsed,playing:wantsPlay});
  }

  return {mount,sample,valuesFor};
})();
