import { useState, useEffect } from 'react';
import { PRODUCTS, imageUrl, srcSet, cardSizes, SHOP_META } from '../shopData.js';
import { useCart } from '../context/CartContext.jsx';
import { BASE } from '../lib/router.js';

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'IRON', label: 'Iron' },
  { key: 'MIND', label: 'Mind' },
];

export function Shop({ search }) {
  const { add } = useCart();
  const [filter, setFilter] = useState(() => {
    const q = new URLSearchParams(search).get('pillar');
    return FILTERS.some((f) => f.key === q) ? q : 'ALL';
  });

  useEffect(() => {
    const url = filter === 'ALL' ? '/shop' : `/shop?pillar=${filter}`;
    window.history.replaceState({}, '', BASE + url.slice(1));
  }, [filter]);

  const products =
    filter === 'ALL' ? PRODUCTS : PRODUCTS.filter((p) => p.pillar === filter);

  return (
    <main className="shop">
      <header className="shop__head">
        <div className="shell">
          <h1 className="t-hero">{SHOP_META.name}</h1>
          <p className="t-lede muted">{SHOP_META.blurb}</p>
        </div>
      </header>

      <div className="shell">
        <div className="filters shop__filters" role="group" aria-label="Filter by pillar">
          {FILTERS.map((f) => {
            const n =
              f.key === 'ALL' ? PRODUCTS.length : PRODUCTS.filter((p) => p.pillar === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                aria-label={`${f.label}, ${n} products`}
              >
                {f.label} <span className="muted">{n}</span>
              </button>
            );
          })}
        </div>

        <ul className="shop__grid" role="list">
          {products.map((product) => (
            <li key={product.id}>
              <article className="product-card">
                <a className="product-card__img" href={`/shop/${product.id}`}>
                  <img
                    src={imageUrl(product)}
                    srcSet={srcSet(product)}
                    sizes={cardSizes}
                    alt={product.name}
                    loading="lazy"
                    width="1080"
                    height="1080"
                  />
                </a>
                <div className="product-card__body">
                  <p className="product-card__pillar label">{product.pillar}</p>
                  <h2 className="product-card__name">
                    <a href={`/shop/${product.id}`}>{product.name}</a>
                  </h2>
                  <p className="product-card__sub muted">{product.nameSub}</p>
                  <div className="product-card__footer">
                    <span className="product-card__price">{`$${product.price}`}</span>
                    <button
                      className="btn btn--primary"
                      onClick={() => add(product, product.sizes[0])}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}