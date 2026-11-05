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
  // Efeito de digitação isolado em typewriter.js para evitar conflitos.
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
