import { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext({ progress: 0, altMode: false, setProgress: () => {} });

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [altMode, setAltMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setAltMode(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return <Ctx.Provider value={{ progress, altMode, setProgress }}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);
