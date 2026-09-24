import { useMemo, useState } from 'react';
import { products, formatPrice, getProduct } from './products.js';
import { ProductCard, SiteNav, SiteFooter, CartDrawer } from './components.jsx';
import { useCart } from './cart.jsx';
import { BASE_URL } from '../lib/base.js';

const art = (f) => `${BASE_URL}assets/shop/${f}`;

export const cartTotal = (items) =>
  items.reduce((s, i) => {
    const p = getProduct(i.slug);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

const shell = (route, children) => (
  <div className="eh">
    <SiteNav route={route} />
    {children}
    <SiteFooter />
    <CartDrawer />
  </div>
);

export function HomePage({ route }) {
  const drop = products.filter((p) => p.pillar === 'SPIRIT').slice(0, 4);
  const core = products.slice(0, 8);
  return shell(
    route,
    <>
      <header className="eh-wrap eh-hero">
        <div>
          <p className="eh-eyebrow">ELITE HUMAN — DROP 001 · BODY / MIND / SPIRIT</p>
          <h1 className="eh-h1">Wear the<br />disci<em>pline.</em></h1>
          <p className="eh-sub">
            Training journal turned uniform. Performance for Body, essentials for Mind,
            limited statements for Spirit. 14 pieces. No noise.
          </p>
          <div className="eh-cta-row">
            <a href="/shop" className="eh-btn eh-btn-primary">SHOP ALL 14</a>
            <a href="/shop?pillar=SPIRIT" className="eh-btn eh-btn-accent">DROP 001 →</a>
            <a href="/journal" className="eh-btn eh-btn-ghost">READ JOURNAL</a>
          </div>
          <div className="eh-hero-meta">
            <span>240–480GSM · GARMENT-DYED</span>
            <span>FREE SHIPPING $150+</span>
          </div>
        </div>
        <div className="eh-hero-img">
          <img src={art('hero.jpg')} alt="Elite Human — Wear the Discipline" />
        </div>
      </header>

      <div className="eh-marquee">
        <div className="eh-marquee-inner">
          TRAIN BODY · DISCIPLINE MIND · ELEVATE SPIRIT · TRAIN BODY · DISCIPLINE MIND · ELEVATE SPIRIT · TRAIN BODY · DISCIPLINE MIND · ELEVATE SPIRIT ·&nbsp;
          TRAIN BODY · DISCIPLINE MIND · ELEVATE SPIRIT · TRAIN BODY · DISCIPLINE MIND · ELEVATE SPIRIT · TRAIN BODY · DISCIPLINE MIND · ELEVATE SPIRIT ·&nbsp;
        </div>
      </div>

      <section className="eh-wrap eh-section">
        <h2 className="eh-h2">Three pillars. One standard.</h2>
        <p className="eh-section-sub">Shop by practice. Body performs, Mind endures, Spirit reminds.</p>
        <div className="eh-pillars">
          {[
            { k: 'BODY', img: art('pillar-body.jpg'), copy: 'Heavy tees, stringers, shorts. Built for sets.' },
            { k: 'MIND', img: art('pillar-mind.jpg'), copy: 'Quiet hoodie, joggers, cap. Daily uniform.' },
            { k: 'SPIRIT', img: art('pillar-spirit.jpg'), copy: 'Numbered Drop 001. From the journal.' },
          ].map((c) => (
            <a key={c.k} href={`/shop?pillar=${c.k}`} className="eh-pillar">
              <img src={c.img} alt={c.k} loading="lazy" />
              <div className="eh-pillar-body">
                <h3>{c.k}</h3>
                <p>{c.copy}</p>
                <span className="eh-pillar-cta">SHOP {c.k} →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="eh-wrap eh-section">
        <h2 className="eh-h2">Drop 001 — Spirit</h2>
        <p className="eh-section-sub">Trinity Tee (300) + Manifesto Hoodie (200). Never restocked. When gone, journal only.</p>
        <div className="eh-grid">{drop.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>

      <section className="eh-wrap eh-section">
        <div className="eh-split">
          <img src={art('craft.jpg')} alt="Cut and cloth — 240, 380, 480gsm fabrics" loading="lazy" />
          <div>
            <h2 className="eh-h2">480gsm. Tonal. No noise.</h2>
            <p className="eh-section-sub">
              Garment-dyed fleece, side-seamed jerseys, flatlock stretch. Embroidery over prints
              where it matters. Designed from 105 journal entries — not moodboards.
            </p>
            <div className="eh-cta-row">
              <a href="/manifesto" className="eh-btn eh-btn-ghost">MANIFESTO</a>
              <a href="/shop?pillar=MIND" className="eh-btn eh-btn-primary">SHOP ESSENTIALS</a>
            </div>
          </div>
        </div>
      </section>

      <section className="eh-wrap eh-section">
        <h2 className="eh-h2">Core rotation</h2>
        <p className="eh-section-sub">The 8 pieces that carry 90% of training + life.</p>
        <div className="eh-grid">{core.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>
    </>,
  );
}

export function ShopPage({ route, initialPillar }) {
  const [pillar, setPillar] = useState(initialPillar || 'ALL');
  const list = useMemo(
    () => (pillar === 'ALL' ? products : products.filter((p) => p.pillar === pillar)),
    [pillar],
  );
  return shell(
    route,
    <section className="eh-wrap eh-section" style={{ borderTop: 0 }}>
      <p className="eh-eyebrow">SHOP — {products.length} PIECES</p>
      <h1 className="eh-h2">Shop all</h1>
      <p className="eh-section-sub">Filter by pillar. Sizes run true. Models wear M/L.</p>
      <div className="eh-filters">
        {['ALL', 'BODY', 'MIND', 'SPIRIT'].map((f) => (
          <button
            key={f}
            className={`eh-filter${pillar === f ? ' active' : ''}`}
            onClick={() => setPillar(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="eh-grid">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
    </section>,
  );
}

export function ProductPage({ route, slug }) {
  const p = getProduct(slug);
  const { add, setOpen } = useCart();
  const [size, setSize] = useState(p?.sizes[Math.min(1, (p?.sizes.length || 1) - 1)] || 'M');
  const [added, setAdded] = useState(false);

  if (!p) {
    return shell(
      route,
      <div className="eh-wrap eh-section">
        <h1 className="eh-h2">Not found</h1>
        <a href="/shop" className="eh-btn eh-btn-primary">BACK TO SHOP</a>
      </div>,
    );
  }
  const related = products.filter((x) => x.pillar === p.pillar && x.slug !== p.slug).slice(0, 4);

  return shell(
    route,
    <>
      <div className="eh-wrap eh-pdp">
        <div className="eh-pdp-img">
          <img src={p.image} alt={p.name} />
        </div>
        <div>
          <div className="eh-card-pillar">{p.pillar} {p.badge ? `· ${p.badge.toUpperCase()}` : ''}</div>
          <h1>{p.name}</h1>
          <div className="eh-price">
            {formatPrice(p.price)}{p.compareAt && <s style={{ color: 'var(--eh-muted)', marginLeft: 10 }}>{formatPrice(p.compareAt)}</s>}
          </div>
          <p className="eh-desc">{p.description}</p>
          <p className="eh-phil">“{p.philosophy}”</p>
          <div className="eh-opt-label">SIZE — {size}</div>
          <div className="eh-sizes">
            {p.sizes.map((s) => (
              <button key={s} className={`eh-size${s === size ? ' active' : ''}`} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
          <div className="eh-opt-label">COLOR — {p.colors.join(' / ')}</div>
          <button
            className="eh-btn eh-btn-primary eh-add"
            onClick={() => {
              add(p.slug, size, 1);
              setAdded(true);
              setTimeout(() => setOpen(true), 250);
              setTimeout(() => setAdded(false), 2000);
            }}
          >
            {added ? 'ADDED ✓' : `ADD TO CART — ${formatPrice(p.price)}`}
          </button>
          <div className="eh-details">
            <div className="eh-opt-label">DETAILS</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {p.details.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <p style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.7rem', color: 'var(--eh-muted)', marginTop: 14 }}>
              FREE SHIPPING OVER $150 · 30-DAY RETURNS · JOURNAL ENTRY PAIRED AFTER PURCHASE
            </p>
          </div>
        </div>
      </div>
      <section className="eh-wrap eh-section">
        <h2 className="eh-h2">Pairs with</h2>
        <div className="eh-grid">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
      </section>
    </>,
  );
}

export function ManifestoPage({ route }) {
  return shell(
    route,
    <section className="eh-wrap eh-section" style={{ borderTop: 0, maxWidth: 900 }}>
      <p className="eh-eyebrow">MANIFESTO</p>
      <h1 className="eh-h1" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)' }}>
        Train body.<br />Discipline mind.<br /><em>Elevate spirit.</em>
      </h1>
      <p className="eh-sub" style={{ maxWidth: '52ch' }}>
        Elite Human started as a training journal — 105 marks on body, mind, spirit.
        The clothing is the same practice, cut into fabric. No seasonal noise. Three
        pillars, restocked cores, numbered Spirit drops.
      </p>
      <div id="size" style={{ marginTop: 40 }}>
        <h2 className="eh-h2" style={{ fontSize: '1.6rem' }}>Size guide</h2>
        <p className="eh-section-sub">Tees/hoodies run true with boxy cut. Size down for fitted. Models: 6'1" wears L, 5'6" wears S.</p>
      </div>
      <div id="shipping" style={{ marginTop: 32 }}>
        <h2 className="eh-h2" style={{ fontSize: '1.6rem' }}>Shipping & returns</h2>
        <p className="eh-section-sub">Ships in 48h. Free over $150. 30-day returns, worn-test allowed on cores (wash once, train once).</p>
      </div>
      <div id="contact" style={{ marginTop: 32 }}>
        <h2 className="eh-h2" style={{ fontSize: '1.6rem' }}>Contact</h2>
        <p className="eh-section-sub">studio@elitehuman.example — wholesale + athletes.</p>
        <a href="/shop" className="eh-btn eh-btn-primary">SHOP THE PRACTICE</a>
      </div>
    </section>,
  );
}

export function CheckoutPage({ route }) {
  const { items, clear } = useCart();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [placed, setPlaced] = useState(null);

  const total = cartTotal(items);
  const shipping = total === 0 ? 0 : total >= 150 ? 0 : 8;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (placed) {
    return shell(
      route,
      <section className="eh-wrap eh-section" style={{ borderTop: 0, maxWidth: 720 }}>
        <p className="eh-eyebrow">ORDER {placed.id}</p>
        <h1 className="eh-h2">Locked in.</h1>
        <p className="eh-section-sub">
          Thanks {placed.name} — {placed.count} item(s), {formatPrice(placed.total)}.
          Confirmation sent to {placed.email} (demo — stored locally only).
        </p>
        <div className="eh-cta-row">
          <a href="/shop" className="eh-btn eh-btn-primary">KEEP SHOPPING</a>
          <a href="/journal" className="eh-btn eh-btn-ghost">READ JOURNAL</a>
        </div>
      </section>,
    );
  }

  if (items.length === 0) {
    return shell(
      route,
      <section className="eh-wrap eh-section" style={{ borderTop: 0 }}>
        <h1 className="eh-h2">Cart is empty</h1>
        <p className="eh-section-sub">Add a piece first — start with the Quiet Hoodie.</p>
        <a href="/shop" className="eh-btn eh-btn-primary">SHOP ALL</a>
      </section>,
    );
  }

  return shell(
    route,
    <section className="eh-wrap eh-section" style={{ borderTop: 0 }}>
      <p className="eh-eyebrow">CHECKOUT — DEMO, NO PAYMENT</p>
      <h1 className="eh-h2">Checkout</h1>
      <div className="eh-checkout">
        <form
          className="eh-form"
          onSubmit={(e) => {
            e.preventDefault();
            const id = `EH-${Date.now().toString(36).toUpperCase()}`;
            const order = { id, ...form, total: total + shipping, count: items.reduce((n, i) => n + i.qty, 0), items, at: new Date().toISOString() };
            try {
              const prev = JSON.parse(localStorage.getItem('eh-orders-v1') ?? '[]');
              localStorage.setItem('eh-orders-v1', JSON.stringify([...prev, order]));
            } catch { /* noop */ }
            clear();
            setPlaced(order);
            window.scrollTo(0, 0);
          }}
        >
          {[
            ['name', 'Full name', 'text'],
            ['email', 'Email', 'email'],
            ['address', 'Address', 'text'],
            ['city', 'City', 'text'],
            ['zip', 'ZIP', 'text'],
          ].map(([k, label, type]) => (
            <label key={k} className="eh-field">
              <span>{label.toUpperCase()}</span>
              <input type={type} required value={form[k]} onChange={set(k)} placeholder={label} />
            </label>
          ))}
          <p style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.68rem', color: 'var(--eh-muted)' }}>
            DEMO ONLY — card fields omitted. No charge, order saved to this browser.
          </p>
          <button className="eh-btn eh-btn-primary eh-add" type="submit">
            PLACE ORDER — {formatPrice(total + shipping)}
          </button>
        </form>
        <aside className="eh-summary">
          <div className="eh-opt-label">ORDER SUMMARY</div>
          {items.map((i) => {
            const p = getProduct(i.slug);
            if (!p) return null;
            return (
              <div key={i.key} className="eh-line-item" style={{ marginBottom: 12 }}>
                <img src={p.image} alt={p.name} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.65rem', color: 'var(--eh-muted)' }}>
                    {i.size} × {i.qty}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.78rem' }}>{formatPrice(p.price * i.qty)}</div>
              </div>
            );
          })}
          <div className="eh-total"><span>SUBTOTAL</span><strong>{formatPrice(total)}</strong></div>
          <div className="eh-total" style={{ color: 'var(--eh-muted)', fontSize: '0.8rem' }}>
            <span>SHIPPING</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className="eh-total"><span>TOTAL</span><strong>{formatPrice(total + shipping)}</strong></div>
        </aside>
      </div>
    </section>,
  );
}
