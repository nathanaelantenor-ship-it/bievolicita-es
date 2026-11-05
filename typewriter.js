/* Visible typewriter effect for the two Bievo institutional headings. */
(() => {
  const headings = ['opp-title', 'method-title']
    .map(id => document.getElementById(id)).filter(Boolean);
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionPreference.matches) return;

  const typeHeading = (heading) => {
    if (heading.dataset.typewriterState) return;
    const emphasis = heading.querySelector('em');
    const lead = heading.firstChild?.textContent?.trim() || '';
    const accent = emphasis?.textContent?.trim() || '';
    if (!lead || !accent) return;

    const original = [...heading.childNodes];
    const ghost = document.createElement('span');
    ghost.className = 'typing-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    original.forEach(node => ghost.append(node.cloneNode(true)));

    const display = document.createElement('span');
    display.className = 'typing-output';
    display.setAttribute('aria-hidden', 'true');
    const normalText = document.createTextNode('');
    const emphasizedText = document.createElement('em');
    const caret = document.createElement('span');
    caret.className = 'typing-caret';
    caret.setAttribute('aria-hidden', 'true');
    display.append(normalText, caret);

    heading.dataset.typewriterState = 'typing';
    heading.setAttribute('aria-label', lead + ' ' + accent);
    heading.classList.add('typing-title');
    heading.replaceChildren(ghost, display);

    const chars = text => Array.from(text);
    const mainChars = chars(lead);
    const accentChars = chars(accent);
    let index = 0;
    let timer;
    const end = () => {
      if (timer) window.clearTimeout(timer);
      heading.replaceChildren(...original);
      heading.classList.remove('typing-title');
      heading.removeAttribute('aria-label');
      heading.dataset.typewriterState = 'complete';
    };
    const onPreferenceChange = () => {
      if (motionPreference.matches) {
        motionPreference.removeEventListener?.('change', onPreferenceChange);
        end();
      }
    };
    motionPreference.addEventListener?.('change', onPreferenceChange);
    const step = () => {
      if (!heading.isConnected || motionPreference.matches) return end();
      if (document.hidden) {
        timer = window.setTimeout(step, 180);
        return;
      }
      if (index < mainChars.length) {
        normalText.textContent += mainChars[index++];
        timer = window.setTimeout(step, 83);
        return;
      }
      if (index === mainChars.length) {
        index++;
        display.insertBefore(document.createElement('br'), caret);
        display.insertBefore(emphasizedText, caret);
        timer = window.setTimeout(step, 240);
        return;
      }
      const accentIndex = index - mainChars.length - 1;
      if (accentIndex < accentChars.length) {
        emphasizedText.textContent += accentChars[accentIndex];
        index++;
        timer = window.setTimeout(step, 83);
      } else {
        motionPreference.removeEventListener?.('change', onPreferenceChange);
        timer = window.setTimeout(end, 1000);
      }
    };
    timer = window.setTimeout(step, 380);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        typeHeading(entry.target);
      }
    }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});
    headings.forEach(heading => observer.observe(heading));
  } else {
    // Readable, fully rendered fallback on older devices.
    headings.forEach(heading => { heading.dataset.typewriterState = 'unsupported'; });
  }
})();
