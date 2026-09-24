import { useEffect, useState } from 'react';
import PostList from './blog/PostList.jsx';
import Post from './blog/Post.jsx';
import Archive from './archive/Archive.jsx';
import { CartProvider } from './shop/cart.jsx';
import { HomePage, ShopPage, ProductPage, ManifestoPage, CheckoutPage } from './shop/pages.jsx';

const BASE = import.meta.env.BASE_URL; // '/EliteHuman/' on Pages, '/' local
const routeOf = (url) => {
  let p = url.startsWith(BASE) ? url.slice(BASE.length - 1) : url; // strip base, keep leading /
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
};

function useRoute() {
  const [path, setPath] = useState(() => routeOf(window.location.pathname) + window.location.search);
  // SPA fallback (404.html) lands on /#archive-style hash — adopt it once, then strip
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const p = window.location.hash.slice(1);
      window.history.replaceState({}, '', BASE + p.slice(1));
      setPath(p);
    }
  }, []);
  useEffect(() => {
    const onPop = () => setPath(routeOf(window.location.pathname) + window.location.search);
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
  const fullPath = useRoute();
  const [cleanPath, search] = (() => {
    const q = fullPath.indexOf('?');
    return q === -1 ? [fullPath, ''] : [fullPath.slice(0, q), fullPath.slice(q)];
  })();
  const path = cleanPath || '/';

  const postMatch = path.match(/^\/post\/([\w-]+)$/);
  const productMatch = path.match(/^\/product\/([\w-]+)$/);
  const content = (() => {
    if (postMatch) return <Post slug={postMatch[1]} />;
    if (productMatch) return <ProductPage route={path} slug={productMatch[1]} />;
    if (path === '/archive') return <Archive />;
    if (path === '/journal') return <PostList />;
    if (path === '/shop') {
      const pillar = new URLSearchParams(search).get('pillar');
      return <ShopPage key={search} route={path} initialPillar={pillar} />;
    }
    if (path === '/manifesto') return <ManifestoPage route={path} />;
    if (path === '/checkout') return <CheckoutPage route={path} />;
    if (path === '/') return <HomePage route={path} />;
    return <HomePage route={path} />;
  })();

  return <CartProvider>{content}</CartProvider>;
}
