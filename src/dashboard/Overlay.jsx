import React, { useEffect, useRef, useState } from 'react';
import { useProgress } from '../lib/progressContext.jsx';
import ProgressChart from './components/ProgressChart.jsx';
import CalendarIsland from './components/CalendarIsland.jsx';
import '../styles/glass.css';

export default function Overlay() {
  const containerRef = useRef(null);
  const { altMode } = useProgress();
  const [isPeak, setIsPeak] = useState(false);

  // Pointer state held in ref to avoid React re-renders
  const mouse = useRef({ x: 0, y: 0, currentX: 0, currentY: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMove);

    let frameId;
    const loop = () => {
      if (!altMode && containerRef.current) {
        // Lerp for smoothness
        mouse.current.currentX += (mouse.current.x - mouse.current.currentX) * 0.1;
        mouse.current.currentY += (mouse.current.y - mouse.current.currentY) * 0.1;

        const { currentX, currentY } = mouse.current;
        const rotateX = currentY * -5; // Tilt based on Y
        const rotateY = currentX * 5;  // Tilt based on X
        const translateX = currentX * -10;
        const translateY = currentY * -10;

        containerRef.current.style.transform =
          `perspective(1000px) translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(frameId);
    };
  }, [altMode]);

  const triggerPeak = () => {
    setIsPeak(true);
    setTimeout(() => setIsPeak(false), 2000);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10,
      pointerEvents: 'none',
      display: 'grid',
      gridTemplateRows: '64px 1fr auto',
      padding: 'var(--space-4)',
      gap: 'var(--space-4)',
      boxSizing: 'border-box'
    }}>
      <div className="glass" style={{
        pointerEvents: 'auto',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--space-4)',
        justifyContent: 'space-between',
        boxShadow: isPeak ? '0 0 40px var(--cyan)' : 'none',
        transition: 'box-shadow 0.3s ease'
      }}>
        <div className="glass-header" style={{ margin: 0, fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => window.history.pushState({}, '', '/journey')}>ELITEHUMAN // SPATIAL OS v1.0</div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          <span>CAP {Math.floor(Math.random() * 100)}%</span>
          <span>{new Date().toLocaleTimeString()}</span>
          <span style={{ color: 'var(--cyan)' }}>● SYNCED</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 0.9fr',
        gap: 'var(--space-4)',
        pointerEvents: 'auto',
        ref: containerRef
      }}>
        <div className="glass" style={{ position: 'relative' }}>
           <div className="glass-content">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
               <div className="glass-header" style={{ margin: 0 }}>BIOMETRICS</div>
               <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                 <ProgressChart liftName="Squat" />
                 <ProgressChart liftName="Bench" />
                 <ProgressChart liftName="Deadlift" />
               </div>
             </div>
             <div style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               gap: 'var(--space-3)',
               padding: 'var(--space-4) 0',
               textAlign: 'center'
             }}>
               <div style={{ fontSize: '0.9rem', color: 'var(--chalk)', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                 READY FOR NEXT SESSION
               </div>
               <button
                onClick={triggerPeak}
                style={{
                  background: 'var(--cyan)',
                  color: 'var(--obsidian)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 15px var(--cyan)'
                }}
               >
                 Log Daily Win
               </button>
             </div>
           </div>
        </div>
        <div className="glass" style={{ position: 'relative' }}>
           <div className="glass-content">
             <div className="glass-header">MERCH STORE</div>
             <div style={{ color: 'var(--chalk)', opacity: 0.6, fontSize: '0.9rem', marginBottom: 'var(--space-3)' }}>Explore EliteHuman gear.</div>
             <a href="/archive" style={{
               color: 'var(--cyan)',
               textDecoration: 'none',
               fontFamily: 'var(--font-mono)',
               fontSize: '0.8rem',
               border: '1px solid var(--cyan)',
               padding: '0.5rem 1rem',
               borderRadius: '8px',
               display: 'inline-block',
               textAlign: 'center'
             }}>VIEW ARCHIVE →</a>
           </div>
        </div>
      </div>

      <div className="glass" style={{ pointerEvents: 'auto', height: '160px' }}>
         <div className="glass-content">
           <CalendarIsland />
         </div>
      </div>

      {isPeak && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 100,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(62,240,216,0.05)',
          animation: 'peakFade 2s forwards'
        }}>
          <div style={{
            fontSize: '5rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--cyan)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textShadow: '0 0 30px var(--cyan)',
            animation: 'peakScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            PR HIT
          </div>
          <style>{`
            @keyframes peakFade {
              0% { opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes peakScale {
              0% { transform: scale(0.5); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
