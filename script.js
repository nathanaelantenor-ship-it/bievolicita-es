(() => {
  const menuToggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#main-nav');
  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));
  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

})();

/* Accessible horizontally scrolling service cards; no changes to website copy. */
(() => {
  const track = document.querySelector('.services-grid');
  const buttons = [...document.querySelectorAll('.carousel-arrow')];
  if (!track || !buttons.length) return;
  function updateButtons() {
    buttons.forEach(button => {
      const isPrev = button.dataset.direction === 'prev';
      button.disabled = isPrev ? track.scrollLeft <= 4 : (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const card = track.querySelector('.service');
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const amount = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: amount * (button.dataset.direction === 'prev' ? -1 : 1), behavior: 'smooth' });
  }));
  track.addEventListener('scroll', updateButtons, {passive:true});
  window.addEventListener('resize', updateButtons);
  updateButtons();
})();


/* BIEVO — interação progressiva, sem dependências ou alterações na copy. */
(() => {
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const titles=[document.querySelector('#opp-title'),document.querySelector('#method-title')].filter(Boolean);
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const observer=new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const heading=entry.target;
        if (heading.dataset.typed==='true') continue;
        const em=heading.querySelector('em');
        if (!em) continue;
        const regular=heading.firstChild?.textContent?.trim() ?? '';
        const emphasis=em.textContent.trim();
        if (!regular || !emphasis) continue;
        heading.dataset.typed='true';
        const original=[...heading.childNodes];
        const ghost=document.createElement('span');
        ghost.className='typing-ghost';
        ghost.setAttribute('aria-hidden','true');
        ghost.append(...original);
        const output=document.createElement('span');
        output.className='typing-output';
        output.setAttribute('aria-hidden','true');
        const regularNode=document.createTextNode('');
        const emphasisEl=document.createElement('em');
        const caret=document.createElement('span');
        caret.className='typing-caret';
        caret.setAttribute('aria-hidden','true');
        output.append(regularNode,caret);
        heading.setAttribute('aria-label',regular+' '+emphasis);
        heading.classList.add('typing-title');
        heading.append(ghost,output);
        let pos=0;
        let startedEmphasis=false;
        function finish(){
          heading.replaceChildren(...original);
          heading.classList.remove('typing-title');
          heading.removeAttribute('aria-label');
        }
        function tick(){
          if (!heading.isConnected || reduceMotion.matches || document.hidden) {
            finish();
            return;
          }
          if (pos < regular.length) {
            regularNode.textContent=regular.slice(0,++pos);
          } else if (!startedEmphasis) {
            startedEmphasis=true;
            output.insertBefore(document.createElement('br'),caret);
            output.insertBefore(emphasisEl,caret);
          } else if (pos < regular.length+emphasis.length) {
            pos++;
            emphasisEl.textContent=emphasis.slice(0,pos-regular.length);
          } else {
            finish();
            return;
          }
          window.setTimeout(tick,39);
        }
        tick();
      }
    },{threshold:.3,rootMargin:'0px 0px -8% 0px'});
    titles.forEach(title => observer.observe(title));
  }

  // Em telas sensíveis ao toque: toque alterna um card por grupo.
  const groups=['.audience-grid','.services-grid','.testimonials-grid'];
  const touch=window.matchMedia('(hover: none), (pointer: coarse)');
  for (const selector of groups) {
    const group=document.querySelector(selector);
    if (!group) continue;
    const cards=[...group.querySelectorAll('.motion-card')];
    cards.forEach(card => {
      card.addEventListener('click',(event) => {
        if (!touch.matches || event.target.closest('a,button')) return;
        const wasActive=card.classList.contains('is-active');
        cards.forEach(other => other.classList.remove('is-active'));
        if (!wasActive) card.classList.add('is-active');
        card.blur();
      });
      card.addEventListener('keydown',(event) => {
        if (event.target!==card || (event.key!=='Enter' && event.key!==' ')) return;
        event.preventDefault();
        const wasActive=card.classList.contains('is-active');
        cards.forEach(other=>other.classList.remove('is-active'));
        if (!wasActive) card.classList.add('is-active');
      });
    });
  }
})();
