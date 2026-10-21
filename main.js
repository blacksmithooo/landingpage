const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header + product bar: header is transparent over the hero and turns white
// after it. The product bar rides at the bottom of the hero, then sticks
// under the header.
const topbar = document.getElementById('topbar');
const hero = document.querySelector('.hero');
const header = topbar.querySelector('.header');
const onScroll = () => {
  const heroBottom = hero.getBoundingClientRect().bottom;
  const headerH = header.offsetHeight;
  topbar.classList.toggle('is-solid', heroBottom <= headerH + 1);
  topbar.style.setProperty('--bar-y', `${Math.max(0, heroBottom - headerH)}px`);
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

// Mobile menu
const menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
  const open = topbar.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', open);
});
document.getElementById('nav').addEventListener('click', (e) => {
  if (!e.target.closest('a')) return;
  topbar.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
});

// Hero video play / pause. Reduced motion: don't autoplay, start paused.
const play = document.querySelector('.hero__play');
const video = hero.querySelector('.hero__video');
const showPaused = (paused) => {
  hero.classList.toggle('is-paused', paused);
  play.setAttribute('aria-pressed', paused);
  play.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
};
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.removeAttribute('autoplay');
  video.pause();
  showPaused(true);
}
video.addEventListener('play', () => showPaused(false));
video.addEventListener('pause', () => showPaused(true));
play.addEventListener('click', () => {
  if (video.paused) video.play().catch(() => {});
  else video.pause();
});

// Style cards: swatches recolour the frames
document.querySelectorAll('[data-style]').forEach((card) => {
  const frames = card.querySelector('.style-card__frames');
  const swatches = card.querySelectorAll('.swatches button');
  swatches.forEach((sw) => sw.addEventListener('click', () => {
    swatches.forEach((b) => b.setAttribute('aria-checked', b === sw));
    frames.style.color = sw.style.getPropertyValue('--c');
  }));
});

// Assistant: cycle example questions, and raise the video card with scroll
const query = document.getElementById('query');
const questions = [
  'what’s the story behind this building?',
  'translate this menu into English.',
  'remind me where I parked.',
  'what plant is this?',
];
if (!reduced) {
  let q = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    await wait(2500);
    for (;;) {
      q = (q + 1) % questions.length;
      const text = questions[q];
      for (let i = query.textContent.length; i >= 0; i--) { query.textContent = query.textContent.slice(0, i); await wait(15); }
      for (let i = 0; i <= text.length; i++) { query.textContent = text.slice(0, i); await wait(40); }
      await wait(2500);
    }
  })();
}
const track = document.querySelector('.assist__track');
const card = document.querySelector('.assist__card');
const raise = () => {
  const r = track.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  card.style.setProperty('--rise', reduced ? 0 : (1 - Math.min(1, p * 1.6)).toFixed(3));
};
window.addEventListener('scroll', raise, { passive: true });
raise();

// Hotspots: hover/focus shows the label (CSS); click opens the detail sheet
const sheet = document.getElementById('sheet');
document.querySelectorAll('.hotspot').forEach((spot) => {
  spot.addEventListener('click', () => {
    sheet.querySelector('#sheet-title').textContent = spot.dataset.title;
    sheet.querySelector('#sheet-body').textContent = spot.dataset.body;
    sheet.showModal();
  });
});
sheet.querySelector('.sheet__close').addEventListener('click', () => sheet.close());
sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });

// Compare: each column has a model picker
const icon = {
  battery: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M7 10v4M11 10v4"/></svg>',
  video: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/></svg>',
  audio: '<svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/></svg>',
  fit: '<svg viewBox="0 0 24 24"><circle cx="7" cy="13" r="4"/><circle cx="17" cy="13" r="4"/><path d="M11 13h2M3 13V9M21 13V9"/></svg>',
  button: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M12 10v6M8 20h8"/></svg>',
};
const models = [
  { name: 'Wayline (Gen 3)', color: '#111', lens: '#2d3a2d', price: '€379', specs: [['battery', 'Up to 8 hours'], ['video', '3K video at 30 fps'], ['fit', 'Standard fit'], ['button', 'Custom action button']] },
  { name: 'Pilot (Audio)', color: '#5a3a22', lens: '#3b2a1e', price: '€299', specs: [['battery', 'Up to 10 hours'], ['audio', 'Audio only'], ['fit', 'Lightweight fit'], ['button', 'Custom action button']] },
  { name: 'Wayline (Gen 2)', color: '#4a5560', lens: '#1f2f4a', price: '€329', specs: [['battery', 'Up to 4 hours'], ['video', '1080p video at 30 fps'], ['fit', 'Standard fit'], ['button', 'Capture button']] },
  { name: 'Cat-eye (Gen 3)', color: '#111', lens: '#2c3b2c', price: '€399', specs: [['battery', 'Up to 8 hours'], ['video', '3K video at 30 fps'], ['fit', 'Narrow fit'], ['button', 'Custom action button']] },
];
document.querySelectorAll('[data-compare]').forEach((col) => {
  const render = (i) => {
    const m = models[i];
    col.innerHTML = `
      <div class="select"><label class="visually-hidden" for="cmp-${col.dataset.compare}">Choose a model</label>
        <select id="cmp-${col.dataset.compare}">${models.map((o, j) => `<option value="${j}"${j === i ? ' selected' : ''}>${o.name}</option>`).join('')}</select></div>
      <div class="compare__media"><svg style="color:${m.color};--lens:${m.lens}"><use href="#frames"/></svg></div>
      <p class="compare__eyebrow">Lumen</p>
      <h3>${m.name}</h3>
      <p class="compare__price">Starting at<b>${m.price}</b></p>
      <a class="pill pill--primary" href="#styles">Shop now</a>
      <ul class="specs">${m.specs.map(([k, t]) => `<li>${icon[k]}${t}</li>`).join('')}</ul>`;
    col.querySelector('select').addEventListener('change', (e) => render(Number(e.target.value)));
  };
  render(Number(col.dataset.compare));
});

// FAQ: one answer open at a time
const items = document.querySelectorAll('.faq details');
items.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
}));

// Newsletter (no backend yet)
document.getElementById('newsletter').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.querySelector('button').textContent = 'Thanks!';
});

// Scroll reveals for section headings and cards
const revealables = document.querySelectorAll('.section > h2, .feature__head, .style-card, .control article, .family-card, .duo article, .compare__col');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.1 });
if (!reduced) revealables.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
