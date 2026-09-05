import { useEffect, useState } from 'react';
import { ProgressProvider, useProgress } from './lib/progressContext.jsx';
import ScrollRig from './journey/ScrollRig.jsx';
import Journey from './journey/Journey.jsx';
import AscentMeter from './journey/AscentMeter.jsx';
import Preloader from './journey/Preloader.jsx';
import DOMOverlays from './journey/DOMOverlays.jsx';
import Archive from './archive/Archive.jsx';

const BASE = import.meta.env.BASE_URL; // '/EliteHuman/' on Pages, '/' local
const routeOf = (url) => {
  let p = url.startsWith(BASE) ? url.slice(BASE.length - 1) : url; // strip base, keep leading /
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
};

function useRoute() {
  const [path, setPath] = useState(() => routeOf(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPath(routeOf(window.location.pathname));
    window.addEventListener('popstate', onPop);
    const onClick = (e) => {
      const a = e.target.closest('a');
      const href = a?.getAttribute('href');
      if (a && href?.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        window.history.pushState({}, '', BASE + href.slice(1));
        setPath(href);
      }
    };
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('click', onClick);
    };
  }, []);
  return path;
}

function Spacer() {
  const { altMode } = useProgress();
  return (
    <div style={altMode
      ? { height: '400vh', zIndex: 1, pointerEvents: 'none', scrollSnapType: 'y mandatory' }
      : { height: '2500vh', position: 'relative', zIndex: 1, pointerEvents: 'none' }}
      aria-hidden="true">
      {altMode && [0, 1, 2, 3].map((i) => (
        <div key={i} style={{ height: '100vh', scrollSnapAlign: 'start' }} />
      ))}
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const path = useRoute();

  if (path === '/archive') return <ProgressProvider><Archive /></ProgressProvider>;

  return (
    <ProgressProvider>
      <a href="#ascent-meter" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
        onFocus={(e) => {
          e.currentTarget.style.cssText = 'position:fixed;left:1rem;top:1rem;z-index:200;background:#0A0A0C;color:#F0C75E;padding:0.5rem 1rem;border:1px solid #C9A227;font-family:var(--font-mono);';
        }}
        onBlur={(e) => {
          e.currentTarget.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden';
        }}>
        Skip to ascent meter
      </a>
      <ScrollRig />
      <Journey onReady={() => setReady(true)} />
      <AscentMeter />
      <DOMOverlays />
      {/* scroll spacer — 4 zone sections enable scroll-snap under reduced motion */}
      <Spacer />
      {!ready && <Preloader onDone={() => setReady(true)} />}
    </ProgressProvider>
  );
}
