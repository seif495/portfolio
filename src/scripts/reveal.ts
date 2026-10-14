/** Fade sections in as they enter the viewport. Content is visible without JS. */
export function initReveal() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );
  els.forEach((el) => io.observe(el));
  // Anything targeted by a deep link should be visible immediately.
  if (location.hash) {
    document.querySelector(location.hash)?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  }
}
