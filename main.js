// Header: transparent over the hero, solid after it, hides on scroll down
const header = document.getElementById('header');
const hero = document.querySelector('.hero');
let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-solid', y > hero.offsetHeight - 160);
  header.classList.toggle('is-hidden', y > lastY && y > hero.offsetHeight);
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const menu = document.querySelector('.menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', open);
  header.classList.toggle('is-solid', open || window.scrollY > hero.offsetHeight - 160);
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }
});

// Hero play / pause
const play = document.querySelector('.hero__play');
play.addEventListener('click', () => {
  const paused = hero.classList.toggle('is-paused');
  play.setAttribute('aria-pressed', paused);
  play.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
});

// Assistant: type out example questions in a loop
const query = document.getElementById('query');
const questions = [
  'what’s worth seeing on this street?',
  'translate this menu for me.',
  'remind me where I parked.',
  'what kind of plant is this?',
];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced) {
  let q = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    for (;;) {
      const text = questions[q];
      for (let i = 0; i <= text.length; i++) { query.textContent = text.slice(0, i); await wait(45); }
      await wait(2200);
      for (let i = text.length; i >= 0; i--) { query.textContent = text.slice(0, i); await wait(18); }
      await wait(300);
      q = (q + 1) % questions.length;
    }
  })();
}

// Camera mode tabs (arrow keys move between tabs)
const tabs = [...document.querySelectorAll('[role="tab"]')];
const select = (tab) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
};
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const next = tabs[(i + d + tabs.length) % tabs.length];
    select(next);
    next.focus();
  });
});

// Compare cards: colour swatches recolour the frame
document.querySelectorAll('[data-card]').forEach((card) => {
  const frames = card.querySelector('.card__frames');
  card.querySelectorAll('.swatches button').forEach((sw, _, all) => {
    sw.addEventListener('click', () => {
      all.forEach((b) => b.setAttribute('aria-checked', b === sw));
      frames.style.color = getComputedStyle(sw).getPropertyValue('--c');
    });
  });
});

// Family carousel arrows
const track = document.getElementById('track');
document.querySelectorAll('.family__nav button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const step = track.firstElementChild.offsetWidth + 24;
    track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
  });
});

// FAQ: one answer open at a time
const items = document.querySelectorAll('.faq details');
items.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
}));

// Scroll reveals
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
