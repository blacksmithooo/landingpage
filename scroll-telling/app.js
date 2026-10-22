const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
if (reduced) root.classList.add('static');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Smooth, weighted scrolling (same feel as the main page)
const lenis = !reduced && window.Lenis ? new Lenis({ autoRaf: true, lerp: 0.08, anchors: true }) : null;

// ---------- Scroll scenes ----------
// Every [data-scene] gets --p from 0 to 1. Pinned scenes (with a .pin child)
// run from when the pin locks to when it releases; the rest run from entering
// the bottom of the viewport to leaving the top.
const scenes = [...document.querySelectorAll('[data-scene]')].map((el) => ({ el, pinned: !!el.querySelector(':scope > .pin') }));
const hero = document.querySelector('.hero');
const words = [...document.querySelectorAll('[data-words]')].map((p) => {
  p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => `<span>${w}</span>`).join(' ');
  return [...p.children];
});
const header = document.getElementById('header');
const bar = document.getElementById('bar');

function update() {
  const vh = innerHeight;
  if (!reduced) {
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      const p = s.pinned ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      s.el.style.setProperty('--p', clamp(p).toFixed(4));
    }
    // Intro copy lights up word by word through the middle of the hero
    const hp = clamp(-hero.getBoundingClientRect().top / (hero.offsetHeight - vh));
    for (const list of words) {
      const step = 0.42 / list.length;
      list.forEach((w, i) => { w.style.opacity = (0.28 + 0.72 * clamp((hp - 0.3 - i * step) / 0.05)).toFixed(3); });
    }
  }
  const y = scrollY;
  header.classList.toggle('is-hidden', y > 120);
  bar.classList.toggle('is-shown', y > hero.offsetHeight - vh * 0.9);
}
let ticking = false;
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); } };
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
update();

// ---------- Butterfly lands on the glasses in the "100%" scene ----------
// Frames were cut out of a generated landing clip (assets/scroll/butterfly.webp,
// positions in butterfly.json, in 960×540 clip space, which shares the product
// shot's framing). Scroll only triggers it: once the 100% has formed, the
// flight plays on its own clock (approach from off-screen, then the real flight
// and landing frames at 24 fps), so it stays smooth however you scroll. Once
// perched it flutters now and then. Scrolling back above the scene resets it.
const morph = document.querySelector('.morph');
const flyCanvas = morph.querySelector('.morph__fly');
const glassesImg = morph.querySelector('.morph__glasses');
const fly = { img: new Image(), meta: null, on: false, t0: null };
// trigger/reset: scroll progress that starts and re-arms the flight.
// approach: seconds to fly in. landed: frame where it has settled (later frames are identical).
const FLY = { trigger: 0.48, reset: 0.3, approach: 1.5, fps: 24, landed: 42, idleFrom: 30, scale: 1.3, anchor: [50, 135] };
fly.img.src = '../assets/scroll/butterfly.webp';
fetch('../assets/scroll/butterfly.json').then((r) => r.json()).then((m) => { fly.meta = m; drawFly(); });
const ease = (t) => 1 - Math.pow(1 - t, 3);
const bez = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };

function sizeCanvas() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  flyCanvas.width = Math.round(flyCanvas.clientWidth * dpr);
  flyCanvas.height = Math.round(flyCanvas.clientHeight * dpr);
}
function drawFly(now = performance.now()) {
  const m = fly.meta;
  if (!m || !fly.img.complete || !flyCanvas.width) return;
  const ctx = flyCanvas.getContext('2d');
  ctx.clearRect(0, 0, flyCanvas.width, flyCanvas.height);
  const p = clamp(-morph.getBoundingClientRect().top / (morph.offsetHeight - innerHeight));
  if (p < FLY.reset) fly.t0 = null;
  if (fly.t0 === null && p >= FLY.trigger) fly.t0 = now;
  if (fly.t0 === null && !reduced) return;
  const k = flyCanvas.width / flyCanvas.clientWidth;
  const cr = flyCanvas.getBoundingClientRect();
  const gr = glassesImg.getBoundingClientRect();
  const s = gr.width / m.src_w; // clip px → CSS px
  // Page position (CSS px, canvas space) of frame i's window
  const at = (i) => [gr.left - cr.left + m.pos[i][0] * s, gr.top - cr.top + m.pos[i][1] * s];
  const e = reduced ? Infinity : (now - fly.t0) / 1000;
  const flight = (FLY.landed + 1) / FLY.fps;
  let i; let x; let y; let grow = 1;
  if (e < FLY.approach) {
    // Approach: loop the first wing beats while travelling in from off-screen,
    // phased so the loop hands over on frame 0. Slightly larger while "closer".
    const t = ease(e / FLY.approach);
    i = ((Math.floor((e - FLY.approach) * 18) % 7) + 7) % 7;
    const [ex, ey] = at(0);
    const sx = cr.width + 120; const sy = -cr.height * 0.2;
    x = bez(sx, sx - cr.width * 0.25, ex + cr.width * 0.18, ex, t);
    y = bez(sy, sy + cr.height * 0.55, ey - cr.height * 0.32, ey, t) + Math.sin(e * 4) * 6 * (1 - t);
    grow = 1 + 0.35 * (1 - t);
  } else if (e < FLY.approach + flight) {
    // The real flight and landing, at the clip's own frame rate
    i = Math.min(FLY.landed, Math.floor((e - FLY.approach) * FLY.fps));
    [x, y] = at(i);
  } else {
    // Perched: a slow flutter through the settling frames every few seconds
    const c = (e - FLY.approach - flight) % 4.5;
    const span = FLY.landed - FLY.idleFrom;
    const q = Math.min(1, c / 1.6) * 2; // 0 → 2 over the first 1.6 s, then rest
    i = reduced ? FLY.landed : FLY.landed - Math.round((q < 1 ? q : 2 - q) * span);
    [x, y] = at(i);
  }
  // Draw slightly larger than life, scaled around the feet so it still sits on the rim
  const sc = FLY.scale * grow * (cr.width < 700 ? 1.45 : 1); // a touch bigger on phones
  const w = m.w * s * sc; const h = m.h * s * sc;
  const dx = x + FLY.anchor[0] * s * (1 - sc); const dy = y + FLY.anchor[1] * s * (1 - sc);
  const sxp = (i % m.cols) * m.w; const syp = Math.floor(i / m.cols) * m.h;
  ctx.drawImage(fly.img, sxp, syp, m.w, m.h, dx * k, dy * k, w * k, h * k);
}
fly.img.addEventListener('load', () => drawFly());
sizeCanvas();
addEventListener('resize', () => { sizeCanvas(); drawFly(); });
// Animate while the scene is on screen (wing beats and the perched flutter are time-based)
new IntersectionObserver(([e]) => {
  fly.on = e.isIntersecting;
  if (fly.on && !reduced) requestAnimationFrame(function loop(t) { drawFly(t); if (fly.on) requestAnimationFrame(loop); });
  else drawFly();
}).observe(morph);

// ---------- Reveal on enter ----------
const countUp = (el) => {
  const to = Number(el.dataset.count);
  if (reduced) { el.textContent = to; return; }
  const t0 = performance.now();
  const tick = (t) => {
    const k = clamp((t - t0) / 1400);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
document.querySelectorAll('.stats .stat').forEach((s, i) => s.style.setProperty('--i', i));
if (reduced) document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

// ---------- Videos: play only while on screen ----------
const film = document.querySelector('.film__video');
const built = document.querySelector('.built__card video');
const vio = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && !reduced) e.target.play().catch(() => {});
    else e.target.pause();
  }
}, { threshold: 0.25 });
[film, built, document.querySelector('.battery__img')].forEach((v) => vio.observe(v));
if (reduced) built.removeAttribute('autoplay');

const viewer = document.getElementById('viewer');
const viewerVideo = viewer.querySelector('video');
document.querySelector('.film__play').addEventListener('click', () => {
  viewer.showModal();
  lenis?.stop();
  viewerVideo.currentTime = 0;
  viewerVideo.play().catch(() => {});
});
viewer.querySelector('.viewer__close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
viewer.addEventListener('close', () => { viewerVideo.pause(); lenis?.start(); });

// ---------- Feature tabs + rail ----------
const P = '../assets/photos/';
const icon = {
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  audio: '<path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/>',
  camera: '<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1.5-3h3L15 7"/>',
  calls: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
  privacy: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
};
const features = [
  { name: 'Assistant', icon: 'spark', lead: 'assistant.jpg', cards: [
    ['Ask about what you see', 'Look at a landmark, a menu or a plant and ask. Answers arrive in your ear.', 'camera.jpg'],
    ['Live translation', 'Hear the conversation around you translated in real time.', 'family-audio.jpg'],
    ['Reminders by voice', 'Set reminders, timers and notes without reaching for your phone.', 'app.jpg'],
    ['Describe my surroundings', 'Get a spoken description of what’s in front of you, whenever you need it.', 'accessibility.jpg'],
  ] },
  { name: 'Audio', icon: 'audio', lead: 'audio.jpg', cards: [
    ['Open-ear speakers', 'Sound aimed at your ears, so music stays yours and the street stays audible.', 'slow-motion.jpg'],
    ['Your music apps', 'Stream from the apps you already use, controlled by voice or touch.', 'family-gen2.jpg'],
    ['Clear in the wind', 'Five microphones isolate your voice from wind and crowds.', 'calls.jpg'],
    ['Automatic volume', 'Volume adjusts to how loud it is around you.', 'privacy.jpg'],
  ] },
  { name: 'Camera', icon: 'camera', lead: 'camera.jpg', cards: [
    ['12MP photos', 'An ultra-wide camera in the hinge captures exactly what you see.', 'live-photo.jpg'],
    ['3K video', 'Smooth, stabilised clips from your point of view.', 'slow-motion.jpg'],
    ['Hands-free capture', 'Say “take a photo” or tap the frame. Keep both hands free.', 'banner.jpg'],
    ['Instant import', 'Photos land in the Lumen app, ready to edit and share.', 'app.jpg'],
  ] },
  { name: 'Calls and messages', icon: 'calls', lead: 'calls.jpg', cards: [
    ['Voice notes', 'Record and send a voice note in a sentence.', 'audio.jpg'],
    ['Messages read aloud', 'Hear new messages and reply without looking down.', 'family-audio.jpg'],
    ['Point-of-view video calls', 'Share what you’re seeing on a video call.', 'camera.jpg'],
    ['Smart notifications', 'Only what matters gets through. Everything else waits.', 'app.jpg'],
  ] },
  { name: 'Privacy', icon: 'privacy', lead: 'privacy.jpg', cards: [
    ['Capture light', 'A light on the frame shows whenever the camera is recording.', 'family-gen2.jpg'],
    ['Covered means off', 'If the light is covered, the camera won’t record.', 'banner.jpg'],
    ['Your data, your call', 'Choose what’s stored, shared and deleted in the app.', 'app.jpg'],
    ['Hands-off switch', 'Turn off the camera and microphones with one switch.', 'accessibility.jpg'],
  ] },
];
const tabs = document.querySelector('.tabs');
const rail = document.getElementById('rail');
const thumb = document.getElementById('thumb');
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icon[k]}</svg>`;
tabs.innerHTML = features.map((f, i) => `<button class="tab" role="tab" type="button" aria-selected="${i === 0}" data-i="${i}">${svg(f.icon)}${f.name}</button>`).join('');
const renderRail = (i) => {
  const f = features[i];
  rail.innerHTML = `<article class="card card--lead" style="--i:0"><div class="card__media"><img src="${P}${f.lead}" alt="" loading="lazy"><span class="card__badge">${svg(f.icon)}</span></div></article>`
    + f.cards.map(([t, d, img], j) => `<article class="card" style="--i:${j + 1}"><div class="card__media"><img src="${P}${img}" alt="" loading="lazy"></div><h3>${t}</h3><p>${d}</p></article>`).join('');
  rail.scrollLeft = 0;
  syncThumb();
};
const syncThumb = () => {
  const max = rail.scrollWidth - rail.clientWidth;
  const vis = rail.clientWidth / rail.scrollWidth;
  thumb.style.width = `${Math.max(12, vis * 100)}%`;
  thumb.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`;
};
tabs.addEventListener('click', (e) => {
  const b = e.target.closest('.tab');
  if (!b) return;
  tabs.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', t === b));
  renderRail(Number(b.dataset.i));
});
rail.addEventListener('scroll', syncThumb, { passive: true });
addEventListener('resize', syncThumb);
document.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => {
  rail.scrollBy({ left: Number(b.dataset.dir) * rail.clientWidth * 0.8, behavior: 'smooth' });
}));
renderRail(0);

// ---------- Finish picker ----------
const styles = [
  ['wayline-black', 'Wayline', 'Matte black', '€379'], ['wayline-tortoise', 'Wayline', 'Tortoise', '€379'],
  ['pilot-tortoise', 'Pilot', 'Tortoise', '€299'], ['cateye-black', 'Cat-eye', 'Matte black', '€399'],
  ['wayline-olive', 'Wayline', 'Olive', '€379'], ['pilot-clear', 'Pilot', 'Clear', '€299'],
  ['cateye-amber', 'Cat-eye', 'Amber', '€399'], ['wayline-sand', 'Wayline', 'Sand', '€379'],
  ['pilot-black', 'Pilot', 'Matte black', '€299'], ['cateye-tortoise', 'Cat-eye', 'Tortoise', '€399'],
  ['wayline-navy', 'Wayline', 'Navy', '€379'], ['pilot-chestnut', 'Pilot', 'Chestnut', '€299'],
  ['cateye-forest', 'Cat-eye', 'Forest', '€399'], ['wayline-slate', 'Wayline', 'Slate', '€379'],
  ['pilot-olive', 'Pilot', 'Olive', '€299'],
];
const fr = document.getElementById('finishRail');
fr.innerHTML = styles.map(([img, name, colour, price]) => `<a class="swatch" href="#finish">
  <span class="swatch__price">${price}</span>
  <img src="../assets/products/${img}.jpg" alt="${name} in ${colour.toLowerCase()}" loading="lazy">
  <h3>${colour}</h3><p>${name}</p></a>`).join('');
document.querySelectorAll('[data-fdir]').forEach((b) => b.addEventListener('click', () => {
  fr.scrollBy({ left: Number(b.dataset.fdir) * fr.clientWidth * 0.8, behavior: 'smooth' });
}));
