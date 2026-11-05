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
  const form = document.querySelector('#lead-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const nome = form.querySelector('#nome').value.trim();
    const empresa = form.querySelector('#empresa').value.trim();
    const momento = form.querySelector('#momento').value;
    const mensagem = form.querySelector('#mensagem').value.trim();
    const text = `Olá, equipe Bievo! Meu nome é ${nome} e represento a empresa ${empresa}.\n\nMeu objetivo: ${momento}.${mensagem ? '\n\nMais informações: '+mensagem : ''}\n\nGostaria de conversar sobre oportunidades de licitações.`;
    const phone = String(window.BIEVO_CONFIG?.whatsapp || '').replace(/\D/g, '');
    if (phone.length >= 12) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    } else {
      const email = window.BIEVO_CONFIG?.email || 'contato@bievoassessoria.com';
      location.href = `mailto:${email}?subject=${encodeURIComponent('Contato pelo site — Bievo Licitações')}&body=${encodeURIComponent(text)}`;
    }
  });
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

/* Approved CTA copy retained; configured WhatsApp routes existing primary buttons. */
(() => {
  const phone = String(window.BIEVO_CONFIG?.whatsapp || '').replace(/\D/g, '');
  if (phone.length < 12) return;
  const message = encodeURIComponent('Olá, equipe Bievo! Gostaria de conversar sobre oportunidades de licitações para minha empresa.');
  const url = `https://wa.me/${phone}?text=${message}`;
  document.querySelectorAll('.desktop-cta, .hero-actions .btn-camel').forEach(link => {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
})();
