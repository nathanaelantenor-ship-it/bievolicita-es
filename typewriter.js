/* Efeito de máquina de escrever: Oportunidades, Método Bievo e FAQ. */
(() => {
  const headingIds = ['opp-title', 'method-title', 'faq-title'];
  const headings = headingIds.map(id => document.getElementById(id)).filter(Boolean);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const controllers = new Map();
  headings.forEach(heading => {
    const emphasis = heading.querySelector('em');
    const mainText = heading.firstChild?.textContent?.trim() || '';
    const accentText = emphasis?.textContent?.trim() || '';
    if (!mainText || !accentText) return;

    const originalNodes = [...heading.childNodes];
    const mainLetters = Array.from(mainText);
    const accentLetters = Array.from(accentText);
    const hasLineBreak = originalNodes.some(node => node.nodeName === 'BR');
    let currentState = 'idle';
    let timer = null;
    let inside = false;
    heading.dataset.typewriterState = 'idle';

    const clear = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    const restore = (state = 'idle') => {
      clear();
      if (heading.classList.contains('typing-title')) {
        heading.replaceChildren(...originalNodes);
        heading.classList.remove('typing-title');
        heading.removeAttribute('aria-label');
      }
      currentState = state;
      heading.dataset.typewriterState = state;
    };
    const start = () => {
      if (reducedMotion.matches || currentState !== 'idle' || !heading.isConnected) return;

      const ghost = document.createElement('span');
      ghost.className = 'typing-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      originalNodes.forEach(node => ghost.append(node.cloneNode(true)));
      const output = document.createElement('span');
      output.className = 'typing-output';
      output.setAttribute('aria-hidden', 'true');
      const first = document.createTextNode('');
      const second = document.createElement('em');
      const cursor = document.createElement('span');
      cursor.className = 'typing-caret';
      cursor.setAttribute('aria-hidden', 'true');
      output.append(first, cursor);

      heading.replaceChildren(ghost, output);
      heading.classList.add('typing-title');
      heading.setAttribute('aria-label', mainText + ' ' + accentText);
      heading.dataset.typewriterState = 'typing';
      currentState = 'typing';

      let position = 0;
      let accentStarted = false;
      const tick = () => {
        if (reducedMotion.matches || !heading.isConnected) {
          restore('idle');
          return;
        }
        if (document.hidden) {
          timer = window.setTimeout(tick, 160);
          return;
        }
        if (position < mainLetters.length) {
          first.textContent += mainLetters[position++];
          timer = window.setTimeout(tick, 78);
          return;
        }
        if (!accentStarted) {
          accentStarted = true;
          if (hasLineBreak) output.insertBefore(document.createElement('br'), cursor);
          else output.insertBefore(document.createTextNode(' '), cursor);
          output.insertBefore(second, cursor);
          timer = window.setTimeout(tick, 220);
          return;
        }
        const secondPosition = position - mainLetters.length;
        if (secondPosition < accentLetters.length) {
          second.textContent += accentLetters[secondPosition];
          position++;
          timer = window.setTimeout(tick, 78);
          return;
        }
        // O título fica completo. Uma nova entrada na viewport reinicia o efeito.
        timer = window.setTimeout(() => restore('complete'), 1100);
      };
      timer = window.setTimeout(tick, 450);
    };
    controllers.set(heading, {
      onVisibility(isVisible) {
        if (isVisible && !inside) start();
        else if (!isVisible && inside) restore('idle');
        inside = isVisible;
      },
      restore
    });
  });

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      controllers.get(entry.target)?.onVisibility(visible);
    }
  }, { threshold: [0, 0.2, 0.35], rootMargin: '0px 0px -8% 0px' });
  for (const heading of controllers.keys()) observer.observe(heading);

  const onPreferenceChange = () => {
    if (reducedMotion.matches) {
      for (const controller of controllers.values()) controller.restore('idle');
      observer.disconnect();
    }
  };
  reducedMotion.addEventListener?.('change', onPreferenceChange);
})();
