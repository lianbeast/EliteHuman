export const BASE = import.meta.env.BASE_URL;

// Normalize a browser pathname to a route path, stripping the vite base.
// Deep links on GitHub Pages arrive with a trailing slash sometimes and a
// base prefix always; both must resolve to the same route.
export function pathOf(pathname) {
  const p = pathname.startsWith(BASE) ? pathname.slice(BASE.length - 1) : pathname;
  return (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p) || '/';
}

export const searchOf = (href) => (href.includes('?') ? href.slice(href.indexOf('?')) : '');

export const hrefTo = (href) => BASE + href.slice(1);
