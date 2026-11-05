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
