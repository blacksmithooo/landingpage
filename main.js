// Smooth, momentum-style scrolling (https://github.com/darkroomengineering/lenis).
// Skipped for people who've asked their OS for reduced motion.
if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.08,          // lower = more glide; 0.1 is Lenis' default
    wheelMultiplier: 1,
  });
  window.lenis = lenis;
}

document.documentElement.classList.add('js');

// Header: shadow once the page scrolls, hides while scrolling down and
// returns on any scroll up. Stays put while the mobile menu is open or
// something inside it has keyboard focus.
const header = document.querySelector('.header');
const menu = document.querySelector('.menu');
const nav = document.getElementById('nav');

let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  const delta = y - lastY;
  header.classList.toggle('is-scrolled', y > 8);
  if (Math.abs(delta) < 4) return;
  const pinned = nav.classList.contains('is-open') || header.querySelector(':focus-visible');
  header.classList.toggle('is-hidden', delta > 0 && y > 160 && !pinned);
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
header.addEventListener('focusin', (e) => {
  if (e.target.matches(':focus-visible')) header.classList.remove('is-hidden');
});
onScroll();

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', open);
  menu.textContent = open ? 'Close' : 'Menu';
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a') && nav.classList.contains('is-open')) menu.click();
});

// Services carousel: arrow buttons scroll one card at a time.
const carousel = document.querySelector('.carousel');
const buttons = document.querySelectorAll('.carousel-controls .round');

const step = () => {
  const card = carousel.querySelector('.card');
  return card.getBoundingClientRect().width + parseFloat(getComputedStyle(carousel).columnGap);
};
const updateButtons = () => {
  const max = carousel.scrollWidth - carousel.clientWidth - 2;
  buttons[0].disabled = carousel.scrollLeft <= 2;
  buttons[1].disabled = carousel.scrollLeft >= max;
};
buttons.forEach((b) => b.addEventListener('click', () => {
  carousel.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' });
}));
carousel.addEventListener('scroll', updateButtons, { passive: true });
window.addEventListener('resize', updateButtons);
updateButtons();

// Fade sections in as they enter the viewport.
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
