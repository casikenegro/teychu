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

const heroSlides = [...document.querySelectorAll('[data-hero-slide]')];
const heroDots = [...document.querySelectorAll('[data-hero-dot]')];
const heroStatus = document.querySelector('[data-hero-status]');
const hero = document.querySelector('.hero');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroLabels = ['Movimiento de tierra', 'Soldadura de tuberías', 'Estudios especiales'];
let heroIndex = 0;
let heroTimer;

function showHeroSlide(index) {
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === heroIndex;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  heroDots.forEach((dot, dotIndex) => {
    const active = dotIndex === heroIndex;
    dot.classList.toggle('is-active', active);
    if (active) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  heroStatus.textContent = `${heroLabels[heroIndex]}, diapositiva ${heroIndex + 1} de ${heroSlides.length}`;
}

function stopHeroCarousel() {
  window.clearInterval(heroTimer);
}

function startHeroCarousel() {
  stopHeroCarousel();
  if (!prefersReducedMotion) heroTimer = window.setInterval(() => showHeroSlide(heroIndex + 1), 6500);
}

document.querySelector('[data-hero-prev]').addEventListener('click', () => {
  showHeroSlide(heroIndex - 1);
  startHeroCarousel();
});
document.querySelector('[data-hero-next]').addEventListener('click', () => {
  showHeroSlide(heroIndex + 1);
  startHeroCarousel();
});
heroDots.forEach(dot => dot.addEventListener('click', () => {
  showHeroSlide(Number(dot.dataset.heroDot));
  startHeroCarousel();
}));
hero.addEventListener('mouseenter', stopHeroCarousel);
hero.addEventListener('mouseleave', startHeroCarousel);
hero.addEventListener('focusin', stopHeroCarousel);
hero.addEventListener('focusout', startHeroCarousel);
startHeroCarousel();

const servicesTrack = document.querySelector('[data-services-carousel]');
const serviceCards = servicesTrack ? [...servicesTrack.querySelectorAll('.service-card')] : [];
let servicesTimer;
let servicesHeld = false;

function stopServicesCarousel() {
  window.clearInterval(servicesTimer);
}

function advanceServicesCarousel() {
  if (!servicesTrack || serviceCards.length < 2) return;
  const origin = serviceCards[0].offsetLeft;
  const current = serviceCards.reduce((closest, card, index) => {
    const distance = Math.abs(card.offsetLeft - origin - servicesTrack.scrollLeft);
    return distance < closest.distance ? { index, distance } : closest;
  }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
  const next = (current + 1) % serviceCards.length;
  servicesTrack.scrollTo({ left: serviceCards[next].offsetLeft - origin, behavior: 'smooth' });
}

function startServicesCarousel() {
  stopServicesCarousel();
  if (!prefersReducedMotion && !servicesHeld && servicesTrack?.scrollWidth > servicesTrack?.clientWidth) {
    servicesTimer = window.setInterval(() => {
      advanceServicesCarousel();
    }, 5000);
  }
}

if (servicesTrack) {
  servicesTrack.addEventListener('pointerdown', () => {
    servicesHeld = true;
    stopServicesCarousel();
  });
  window.addEventListener('pointerup', () => {
    if (!servicesHeld) return;
    servicesHeld = false;
    startServicesCarousel();
  });
  window.addEventListener('pointercancel', () => {
    servicesHeld = false;
    startServicesCarousel();
  });
  servicesTrack.addEventListener('focusin', stopServicesCarousel);
  servicesTrack.addEventListener('focusout', startServicesCarousel);
  window.addEventListener('resize', startServicesCarousel);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopServicesCarousel();
    else startServicesCarousel();
  });
  startServicesCarousel();
}

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
