import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useProgress } from '../lib/progressContext.jsx';

export default function ScrollRig() {
  const { setProgress, altMode } = useProgress();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (altMode) {
      const onScroll = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        const raw = max > 0 ? window.scrollY / max : 0;
        // snap progress to quarter-steps so DOM zone panels match scroll-snap sections
        setProgress(Math.round(raw * 4) / 4);
      };
      onScroll();
      // M-2: per-zone scroll snap for reduced motion (4 × 100vh sections)
      document.documentElement.style.scrollSnapType = 'y mandatory';
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        document.documentElement.style.scrollSnapType = '';
        window.removeEventListener('scroll', onScroll);
      };
    }

    const lenis = new Lenis({ smoothWheel: true, lerp: 0.16, wheelMultiplier: 1.0 });
    lenisRef.current = lenis;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? lenis.scroll / max : 0);
    };
    lenis.on('scroll', onScroll);

    let raf;
    const tick = (t) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [altMode, setProgress]);

  return null;
}
