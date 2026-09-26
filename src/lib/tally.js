import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Exponential ease-out: fast commit, long settle. `1 - (1-p)^4`.
// Exported so the curve is unit-tested rather than trusted.
export const easeOut = (p) => 1 - (1 - p) ** 4;

// The value the figure shows at progress `p`. Pure — testable without a DOM.
export const frameValue = (to, p) => (p >= 1 ? to : Math.round(to * easeOut(p)));

// Counts up to `to` once, when the element first enters the viewport.
//
// Reduced motion (or a browser without IntersectionObserver) renders the final
// value immediately: the number is the content, the count is a garnish. Killing
// the animation must not leave the figure at zero.
export function useTally(to) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setShown(to);
      return undefined;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const DURATION = 900;
        const step = (now) => {
          const p = Math.min(1, (now - start) / DURATION);
          setShown(frameValue(to, p));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return [shown, ref];
}