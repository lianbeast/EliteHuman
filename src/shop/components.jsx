import { useCart } from './cart.jsx';
import { formatPrice } from './products.js';

export function SiteNav({ route }) {
  const { count, setOpen } = useCart();
  const link = (href, label) => (
    <a key={href} href={href} className={route === href ? 'active' : ''}>{label}</a>
  );
  return (
    <nav className="eh-nav">
      <div className="eh-wrap eh-nav-inner">
        <a href="/" className="eh-logo">ELITE<span>HUMAN</span></a>
        <div className="eh-links">
          {link('/shop', 'SHOP')}
          {link('/shop?pillar=BODY', 'BODY')}
          {link('/shop?pillar=MIND', 'MIND')}
          {link('/shop?pillar=SPIRIT', 'DROP 001')}
          {link('/manifesto', 'MANIFESTO')}
          {link('/journal', 'JOURNAL')}
        </div>
        <button className="eh-cart-btn" onClick={() => setOpen(true)}>
          CART [{count}]
        </button>
      </div>
    </nav>
  );
}

export function ProductCard({ p }) {
  const limited = (p.badge || '').toLowerCase().includes('limited');
  return (
    <a href={`/product/${p.slug}`} className="eh-card">
      <div className="eh-card-img">
        <img src={p.image} alt={p.name} loading="lazy" />
        {p.badge && <span className={`eh-badge${limited ? ' limited' : ''}`}>{p.badge.toUpperCase()}</span>}
      </div>
      <div className="eh-card-body">
        <div className="eh-card-pillar">{p.pillar} · {p.colors[0]?.toUpperCase()}</div>
        <div className="eh-card-name">{p.name}</div>
        <div className="eh-card-price">
          {formatPrice(p.price)}{p.compareAt && <s>{formatPrice(p.compareAt)}</s>}
        </div>
      </div>
    </a>
  );
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear } = useCart();
  if (!open) return null;
  return (
    <>
      <div className="eh-drawer-backdrop" onClick={() => setOpen(false)} />
      <aside className="eh-drawer" role="dialog" aria-label="Cart">
        <div className="eh-drawer-head">
          <strong style={{ letterSpacing: '0.1em', fontFamily: 'var(--eh-mono)', fontSize: '0.75rem' }}>
            CART [{items.reduce((n, i) => n + i.qty, 0)}]
          </strong>
          <button className="eh-filter" onClick={() => setOpen(false)}>CLOSE</button>
        </div>
        <div className="eh-drawer-items">
          {items.length === 0 && (
            <p style={{ color: 'var(--eh-muted)', lineHeight: 1.6 }}>
              Empty. Discipline starts with the first rep — and the first tee.
            </p>
          )}
          {items.map((i) => (
            <CartLine key={i.key} item={i} setQty={setQty} remove={remove} />
          ))}
        </div>
        <div className="eh-drawer-foot">
          <TotalRow items={items} />
          {items.length > 0 ? (
            <a
              href="/checkout"
              className="eh-btn eh-btn-primary eh-add"
              style={{ marginTop: 0, textAlign: 'center' }}
              onClick={() => setOpen(false)}
            >
              CHECKOUT →
            </a>
          ) : (
            <a href="/shop" className="eh-btn eh-btn-ghost eh-add" style={{ marginTop: 0, textAlign: 'center' }} onClick={() => setOpen(false)}>
              SHOP ALL
            </a>
          )}
          {items.length > 0 && (
            <button className="eh-filter" style={{ marginTop: 10 }} onClick={clear}>CLEAR</button>
          )}
          <p style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.65rem', color: 'var(--eh-muted)', letterSpacing: '0.08em', marginTop: 12 }}>
            LOCAL DEMO CHECKOUT — no payment processed. Free shipping over $150.
          </p>
        </div>
      </aside>
    </>
  );
}

import { useState } from 'react';
import { getProduct, formatPrice as fmt } from './products.js';

function CartLine({ item, setQty, remove }) {
  const p = getProduct(item.slug);
  if (!p) return null;
  return (
    <div className="eh-line-item">
      <img src={p.image} alt={p.name} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
        <div style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.68rem', color: 'var(--eh-muted)' }}>
          {item.size} · {fmt(p.price)}
        </div>
        <div className="eh-qty" style={{ marginTop: 8 }}>
          <button onClick={() => setQty(item.key, item.qty - 1)} aria-label="Decrease">−</button>
          <span>{item.qty}</span>
          <button onClick={() => setQty(item.key, item.qty + 1)} aria-label="Increase">+</button>
          <button
            onClick={() => remove(item.key)}
            style={{ width: 'auto', padding: '0 10px', fontSize: '0.65rem' }}
          >
            REMOVE
          </button>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.8rem' }}>{fmt(p.price * item.qty)}</div>
    </div>
  );
}

function TotalRow({ items }) {
  const total = items.reduce((s, i) => {
    const p = getProduct(i.slug);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  const shipping = total === 0 ? 0 : total >= 150 ? 0 : 8;
  return (
    <>
      <div className="eh-total">
        <span>SUBTOTAL</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <div className="eh-total" style={{ color: 'var(--eh-muted)', fontSize: '0.8rem' }}>
        <span>SHIPPING</span>
        <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
      </div>
    </>
  );
}

export function SiteFooter() {
  const [joined, setJoined] = useState(false);
  return (
    <footer className="eh-footer">
      <div className="eh-wrap eh-footer-grid">
        <div>
          <div className="eh-logo" style={{ marginBottom: 12 }}>ELITE<span>HUMAN</span></div>
          <p style={{ maxWidth: '32ch', lineHeight: 1.6, margin: 0 }}>
            Train Body. Discipline Mind. Elevate Spirit. Designed for the practice.
          </p>
          {joined ? (
            <p style={{ fontFamily: 'var(--eh-mono)', fontSize: '0.75rem', color: 'var(--eh-bone)', marginTop: 12 }}>
              SUITED UP — check inbox for Drop 002.
            </p>
          ) : (
            <form className="eh-news" onSubmit={(e) => { e.preventDefault(); setJoined(true); }}>
              <input placeholder="email for Drop 002" aria-label="email" type="email" required />
              <button>JOIN</button>
            </form>
          )}
        </div>
        <div>
          <div className="eh-opt-label">SHOP</div>
          <a href="/shop">All products</a>
          <a href="/shop?pillar=BODY">Body / Performance</a>
          <a href="/shop?pillar=MIND">Mind / Essentials</a>
          <a href="/shop?pillar=SPIRIT">Spirit / Drop 001</a>
        </div>
        <div>
          <div className="eh-opt-label">BRAND</div>
          <a href="/manifesto">Manifesto</a>
          <a href="/journal">Journal</a>
          <a href="/archive">The 105 Marks</a>
        </div>
        <div>
          <div className="eh-opt-label">SUPPORT</div>
          <a href="/manifesto#shipping">Shipping & returns</a>
          <a href="/manifesto#size">Size guide</a>
          <a href="/manifesto#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
