const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 120), { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
  mobileMenu.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}));

document.querySelectorAll('[data-service] button').forEach(button => {
  button.addEventListener('click', () => {
    const current = button.closest('[data-service]');
    document.querySelectorAll('[data-service]').forEach(service => {
      const active = service === current && !service.classList.contains('is-active');
      service.classList.toggle('is-active', active);
      service.querySelector('button').setAttribute('aria-expanded', String(active));
      service.querySelector('.service-icon').textContent = active ? '−' : '+';
      service.querySelector('.service-body').hidden = !active;
    });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();
