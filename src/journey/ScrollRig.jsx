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
        setProgress(max > 0 ? window.scrollY / max : 0);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
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
