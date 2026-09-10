import { useEffect, useState } from 'react';
import PostList from './blog/PostList.jsx';
import Post from './blog/Post.jsx';
import Archive from './archive/Archive.jsx';

const BASE = import.meta.env.BASE_URL; // '/EliteHuman/' on Pages, '/' local
const routeOf = (url) => {
  let p = url.startsWith(BASE) ? url.slice(BASE.length - 1) : url; // strip base, keep leading /
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
};

function useRoute() {
  const [path, setPath] = useState(() => routeOf(window.location.pathname));
  // SPA fallback (404.html) lands on /#archive-style hash — adopt it once, then strip
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const p = window.location.hash.slice(1);
      window.history.replaceState({}, '', BASE + p.slice(1));
      setPath(p);
    }
  }, []);
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
        window.scrollTo(0, 0);
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

export default function App() {
  const path = useRoute();

  const postMatch = path.match(/^\/post\/([\w-]+)$/);
  if (postMatch) return <Post slug={postMatch[1]} />;
  if (path === '/archive') return <Archive />;
  return <PostList />;
}
