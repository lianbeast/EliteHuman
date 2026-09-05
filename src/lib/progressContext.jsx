import { createContext, useContext, useState } from 'react';

const Ctx = createContext({ progress: 0, altMode: false, setProgress: () => {} });

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const altMode = false; // populated by ScrollRig in Task 4
  return <Ctx.Provider value={{ progress, altMode, setProgress }}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);
