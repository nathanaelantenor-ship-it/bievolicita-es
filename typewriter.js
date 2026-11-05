/* Bievo: digitação automática em desktop/mobile; replay ao retornar à seção ou aba. */
(() => {
  const ids = ['opp-title', 'method-title', 'faq-title'];
  const headings = ids.map(id => document.getElementById(id)).filter(Boolean);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controllers = new Map();
  headings.forEach(heading => {
    const emphasis = heading.querySelector('em');
    const primary = heading.firstChild?.textContent?.trim() || '';
    const secondary = emphasis?.textContent?.trim() || '';
    if (!primary || !secondary) return;
    const original = [...heading.childNodes];
    const mainLetters = Array.from(primary);
    const accentLetters = Array.from(secondary);
    const lineBreak = original.some(node => node.nodeName === 'BR');
    let state = 'idle', visible = false, timer = null, entryTimer = null, isManual = false;
    heading.dataset.typewriterState = 'idle';
    const cancelTimers = () => {
      window.clearTimeout(timer); window.clearTimeout(entryTimer);
      timer = null; entryTimer = null;
    };
    const restore = (nextState = 'idle') => {
      cancelTimers();
      if (heading.classList.contains('typing-title')) {
        heading.replaceChildren(...original);
        heading.classList.remove('typing-title');
        heading.removeAttribute('aria-label');
      }
      state = nextState;
      heading.dataset.typewriterState = state;
    };
    const begin = (manual = false) => {
      if (!manual && reducedMotion.matches) return;
      if (state !== 'idle') restore('idle');
      isManual = manual;
      const ghost = document.createElement('span');
      ghost.className = 'typing-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      original.forEach(node => ghost.append(node.cloneNode(true)));
      const output = document.createElement('span');
      output.className = 'typing-output';
      output.setAttribute('aria-hidden', 'true');
      const plain = document.createTextNode('');
      const accented = document.createElement('em');
      const caret = document.createElement('span');
      caret.className = 'typing-caret';
      caret.setAttribute('aria-hidden', 'true');
      output.append(plain, caret);
      heading.replaceChildren(ghost, output);
      heading.classList.add('typing-title');
      heading.setAttribute('aria-label', primary + ' ' + secondary);
      state = 'typing';
      heading.dataset.typewriterState = state;
      let mainIndex = 0, accentIndex = 0, accentStarted = false;
      const tick = () => {
        if (!heading.isConnected || (reducedMotion.matches && !isManual)) return restore('idle');
        if (document.hidden) { timer = window.setTimeout(tick,180); return; }
        if (mainIndex < mainLetters.length) {
          plain.textContent += mainLetters[mainIndex++];
          timer = window.setTimeout(tick,112); return;
        }
        if (!accentStarted) {
          accentStarted = true;
          if (lineBreak) output.insertBefore(document.createElement('br'),caret);
          else output.insertBefore(document.createTextNode(' '),caret);
          output.insertBefore(accented,caret);
          timer = window.setTimeout(tick,280); return;
        }
        if (accentIndex < accentLetters.length) {
          accented.textContent += accentLetters[accentIndex++];
          timer = window.setTimeout(tick,112); return;
        }
        timer = window.setTimeout(() => restore('complete'),1300);
      };
      timer = window.setTimeout(tick,250);
    };
    const onVisibility = (show) => {
      if (visible === show) return;
      visible = show;
      if (show) {
        if (!reducedMotion.matches) entryTimer = window.setTimeout(() => {
          if (visible && state === 'idle') begin();
        },130);
      } else restore('idle');
    };
    const replay = () => { restore('idle'); begin(true); };
    heading.addEventListener('click',replay);
    heading.addEventListener('keydown',event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); replay();
      }
    });
    controllers.set(heading,{onVisibility,replay,restore});
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0;
        controllers.get(entry.target)?.onVisibility(visible);
      }
    },{threshold:[0,.01,.15,.45],rootMargin:'0px 0px 0px 0px'});
    for (const heading of controllers.keys()) observer.observe(heading);
    reducedMotion.addEventListener?.('change',() => {
      for (const controller of controllers.values()) controller.onVisibility(false);
      if (!reducedMotion.matches) window.requestAnimationFrame(syncViewport);
    });
  }
  // Cobre abertura da página, back/forward cache e retorno de abas sem exigir clique.
  function syncViewport() {
    if (document.hidden) return;
    for (const [heading, controller] of controllers) {
      const box = heading.getBoundingClientRect();
      const inView = box.bottom > 0 && box.top < window.innerHeight &&
        box.right > 0 && box.left < window.innerWidth;
      controller.onVisibility(inView);
    }
  }
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) {
      for (const controller of controllers.values()) controller.onVisibility(false);
    } else {
      window.requestAnimationFrame(syncViewport);
    }
  });
  window.addEventListener('pageshow',(event) => {
    if (event.persisted) {
      for (const controller of controllers.values()) controller.onVisibility(false);
    }
    window.requestAnimationFrame(syncViewport);
  });
  if (!('IntersectionObserver' in window)) {
    window.addEventListener('scroll',syncViewport,{passive:true});
    window.addEventListener('resize',syncViewport,{passive:true});
  }
  window.requestAnimationFrame(syncViewport);
})();
