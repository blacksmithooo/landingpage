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
