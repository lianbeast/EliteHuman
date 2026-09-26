import { useEffect, useRef, useState } from 'react';
import { loadPosts, imageUrl, imageUrlFull, srcSet, gridSizes, PILLARS, FEATURED, IG_URL } from './data.js';
import { BASE, pathOf, searchOf, hrefTo } from './lib/router.js';
import { Count } from './components/Count.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CartSheet } from './components/CartSheet.jsx';
import { Shop } from './components/Shop.jsx';
import { ProductDetail } from './components/ProductDetail.jsx';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';

const currentPath = () => pathOf(window.location.pathname);

function useRoute() {
  const [route, setRoute] = useState(() => ({
    path: currentPath(),
    search: window.location.search,
  }));

  useEffect(() => {
    // GitHub Pages 404 fallback rewrites deep links to /#/path — adopt once, then strip.
    if (window.location.hash.startsWith('#/')) {
      const p = window.location.hash.slice(1);
      window.history.replaceState({}, '', hrefTo(p));
      setRoute({ path: pathOf(p.split('?')[0]), search: searchOf(p) });
    }
  }, []);

  useEffect(() => {
    const onPop = () => setRoute({ path: currentPath(), search: window.location.search });
    const onClick = (e) => {
      const a = e.target.closest('a');
      const href = a?.getAttribute('href');
      if (!a || !href?.startsWith('/') || href.startsWith('//') || a.target === '_blank') return;
      e.preventDefault();
      window.history.pushState({}, '', hrefTo(href));
      setRoute({ path: pathOf(href.split('?')[0]), search: searchOf(href) });
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return route;
}

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtShort = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

/* ── lightbox ───────────────────────────────────────────────────────── */

function Lightbox({ post, list, onClose, onStep }) {
  const closeRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    restoreRef.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
      if (e.key !== 'Tab') return;
      // Focus trap: the dialog is the only tabbable surface.
      const focusables = e.currentTarget.querySelectorAll('button, a[href]');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      restoreRef.current?.focus?.();
    };
  }, [onClose, onStep]);

  if (!post) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Post ${post.no} of 105`}>
      <div className="lightbox__bar meta">
        <span>
          {post.no} · {fmtDate(post.date)} · {post.pillar} · {post.likes} likes
        </span>
        <button ref={closeRef} onClick={onClose}>
          Close ×
        </button>
      </div>

      <div className="lightbox__stage">
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={() => onStep(-1)}
          aria-label="Previous post"
        >
          ←
        </button>
        <img src={imageUrlFull(post)} srcSet={srcSet(post)} sizes="100vw" alt={`Archive post ${post.no}`} />
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={() => onStep(1)}
          aria-label="Next post"
        >
          →
        </button>
      </div>

      <p className="lightbox__caption">{post.caption}</p>
    </div>
  );
}

/* ── home ───────────────────────────────────────────────────────────── */

// Hero evidence: the record's own strongest post, not a stock garment shot.
// 80 likes — the most in the archive. Real record, used as the brand's proof
// in the first viewport instead of a paragraph about it.
const HERO_POST = '1870461511266088094';

function Home({ posts }) {
  const featured = FEATURED.map((id) => posts.find((p) => p.id === id)).filter(Boolean);
  const hero = posts.find((p) => p.id === HERO_POST);
  const total = posts.length;

  return (
    <main>
      {hero && (
        <section className="hero" aria-labelledby="hero-title">
          <figure className="hero__media">
            <img
              className="hero__img"
              src={imageUrlFull(hero)}
              srcSet={srcSet(hero)}
              sizes="100vw"
              alt={`Archive post ${hero.no} — ${hero.pillar} pillar, ${fmtShort(hero.date)}`}
              width="1080"
              height="1350"
              fetchPriority="high"
            />
            <figcaption className="hero__credit meta">
              <a href={`/post/${hero.id}`}>
                <span className="muted">{hero.no}</span> · {fmtShort(hero.date)} ·{' '}
                {hero.pillar} · {hero.likes} likes
              </a>
            </figcaption>
          </figure>

          <div className="shell hero__body">
            <h1 id="hero-title" className="t-hero hero__title">
              The <Count to={total} className="hero__count" />{' '}
              <br />
              Marks
            </h1>
            <p className="t-lede hero__sub">
              Every session posted. Three years, one account, nothing taken back.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="/shop">
                Shop the uniform
              </a>
              <a className="btn btn--ghost" href="/archive">
                Read the record
              </a>
            </div>
          </div>
        </section>
      )}

      <ul className="shell hero__stats" role="list">
        {PILLARS.map((p) => (
          <li key={p.key}>
            <a className="hero__stat" href={`/archive?pillar=${p.key}`}>
              <span className="hero__stat-num">{String(p.count).padStart(2, '0')}</span>
              <span className="hero__stat-key label">{p.key}</span>
            </a>
          </li>
        ))}
        <li className="meta">October 2015 — November 2018</li>
      </ul>

      <div className="shell profile">
        <div>
          <img
            className="profile__lockup"
            src={`${BASE}brand/logo-640.webp`}
            width="1444"
            height="699"
            alt="Elite Human"
          />
          <p className="meta profile__caption">@elitehuman · 2015 — 2018</p>
        </div>
        <p className="profile__body">
          105 posts, October 2015 to November 2018. Iron, Mind, Spirit. Pulled off Instagram and
          left exactly as written, typos and hashtags included.
        </p>
      </div>

      <section className="section">
        <div className="shell">
          <h2 className="t-section">Selected Marks</h2>
          <div className="marks">
            {featured.map((post) => (
              <div key={post.id} className="marks__card">
                <a className="photo" href={`/post/${post.id}`}>
                  <img src={imageUrl(post)} srcSet={srcSet(post)} sizes={gridSizes} alt={`Archive post ${post.no}`} loading="lazy" />
                </a>
                <span className="photo__meta meta">
                  <span>{post.no}</span>
                  <span>{fmtShort(post.date)}</span>
                  <span>{post.likes} likes</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <h2 className="t-section">By Pillar</h2>
          <div className="pillars">
            {PILLARS.map((p) => (
              <div className="pillar" key={p.key}>
                <p className="label pillar__head">
                  {p.key} · {p.count} posts
                </p>
                <p className="t-body muted">{p.blurb}</p>
                <a className="label pillar__link" href={`/archive?pillar=${p.key}`}>
                  Read →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── archive ────────────────────────────────────────────────────────── */

function Archive({ posts, search }) {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState(() => {
    const q = new URLSearchParams(search).get('pillar');
    return PILLARS.some((p) => p.key === q) ? q : 'ALL';
  });

  // Keep the filter in the URL so a filtered view is shareable.
  useEffect(() => {
    const url = filter === 'ALL' ? hrefTo('/archive') : `${hrefTo('/archive')}?pillar=${filter}`;
    window.history.replaceState({}, '', url);
  }, [filter]);

  const list = filter === 'ALL' ? posts : posts.filter((p) => p.pillar === filter);
  const step = (d) => {
    const i = list.findIndex((x) => x.id === open?.id);
    if (i === -1) return;
    setOpen(list[(i + d + list.length) % list.length]);
  };

  const counts = Object.fromEntries(PILLARS.map((p) => [p.key, posts.filter((x) => x.pillar === p.key).length]));

  return (
    <main>
      <div className="shell archive__head">
        <h1 className="t-section">The 105 Marks</h1>
        <p className="t-body muted" style={{ marginTop: '1rem' }}>
          All 105 posts, oldest at the bottom. Body, mind, spirit.
        </p>

        <div className="filters label" role="group" aria-label="Filter by pillar">
          <button aria-pressed={filter === 'ALL'} onClick={() => setFilter('ALL')}>
            ALL <Count to={posts.length} />
          </button>
          {PILLARS.map((p) => (
            <button
              key={p.key}
              aria-pressed={filter === p.key}
              aria-label={`${p.key}, ${counts[p.key]} posts`}
              onClick={() => setFilter(p.key)}
            >
              {p.key} <Count to={counts[p.key]} />
            </button>
          ))}
        </div>
      </div>

      <div className="shell">
        {list.length ? (
          <div className="grid">
            {list.map((post) => (
              <button key={post.id} className="photo" onClick={() => setOpen(post)}>
                <img src={imageUrl(post)} srcSet={srcSet(post)} sizes={gridSizes} alt={`Archive post ${post.no}`} loading="lazy" />
              </button>
            ))}
          </div>
        ) : (
          <p className="empty t-body">Nothing filed under {filter} yet.</p>
        )}
      </div>

      <Lightbox post={open} list={list} onClose={() => setOpen(null)} onStep={step} />
    </main>
  );
}

/* ── post ───────────────────────────────────────────────────────────── */

function Post({ posts, id }) {
  const i = posts.findIndex((p) => p.id === id);
  if (i === -1) {
    return (
      <main className="shell">
        <p className="empty t-body">That mark is not in the archive.</p>
      </main>
    );
  }
  const post = posts[i];
  const prev = posts[i + 1];
  const next = posts[i - 1];

  return (
    <main className="shell post">
      <a className="label muted post__link" href="/archive">
        ← The Record
      </a>
      <p className="meta muted">
        {post.no} · {fmtDate(post.date)} · {post.pillar} · {post.likes} likes
      </p>

      <figure className="post__figure">
        <img src={imageUrlFull(post)} srcSet={srcSet(post)} sizes="100vw" alt={`Archive post ${post.no}`} />
      </figure>

      <p className="post__caption">{post.caption}</p>

      <div className="post__meta">
        <dl>
          <dt className="label">Likes</dt>
          <dd>{post.likes}</dd>
          <dt className="label">Pillar</dt>
          <dd>{post.pillar}</dd>
          <dt className="label">Date</dt>
          <dd>{fmtDate(post.date)}</dd>
        </dl>
      </div>

      <a className="label post__link" href={post.igUrl} target="_blank" rel="noreferrer noopener">
        View on Instagram ↗
      </a>

      <nav className="post__pager label" aria-label="Adjacent marks">
        {prev ? (
          <a href={`/post/${prev.id}`}>← Previous mark</a>
        ) : (
          <span className="muted">← Start of record</span>
        )}
        {next ? (
          <a href={`/post/${next.id}`}>Next mark →</a>
        ) : (
          <span className="muted">End of record →</span>
        )}
      </nav>
    </main>
  );
}

/* ── shell ──────────────────────────────────────────────────────────── */

export default function App() {
  const { path, search } = useRoute();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts().then(setPosts).catch((e) => setError(e.message));
  }, []);

  const postMatch = path.match(/^\/post\/([\w-]+)$/);
  const shopMatch = path.match(/^\/shop\/([\w-]+)$/);

  const page = error ? (
    <p className="empty t-body">Archive unavailable: {error}</p>
  ) : !posts.length ? (
    <p className="empty t-body">Loading the record…</p>
  ) : shopMatch ? (
    <ProductDetail id={shopMatch[1]} />
  ) : path === '/shop' ? (
    <Shop search={search} />
  ) : postMatch ? (
    <Post posts={posts} id={postMatch[1]} />
  ) : path === '/archive' ? (
    <Archive posts={posts} search={search} />
  ) : (
    <Home posts={posts} />
  );

  return (
    <CartProvider>
      <>
        <Header />
        {page}
        <Footer />
        <CartSheet />
      </>
    </CartProvider>
  );
}
