import { useState } from 'react';
import { findProduct, imageUrl, fmtPrice } from '../shopData.js';
import { useCart } from '../context/CartContext.jsx';

export function ProductDetail({ id }) {
  const { add } = useCart();
  const product = findProduct(id);
  const [size, setSize] = useState(product?.sizes[0] ?? '');

  if (!product) {
    return (
      <main className="shell product-detail">
        <p className="empty t-body">That product is not in the shop.</p>
        <a className="label" href="/shop">← Back to shop</a>
      </main>
    );
  }

  return (
    <main className="product-detail">
      <div className="shell">
        <a className="label muted product-detail__back" href="/shop">
          ← Shop
        </a>

        <article className="product-detail__grid">
          <div className="product-detail__media">
            <img
              src={imageUrl(product)}
              alt={product.name}
              width="1080"
              height="1080"
            />
          </div>

          <div className="product-detail__info">
            <p className="product-detail__pillar label">{product.pillar}</p>
            <h1 className="product-detail__name">{product.name}</h1>
            <p className="product-detail__sub muted">{product.nameSub}</p>
            <p className="product-detail__price">{fmtPrice(product.price)}</p>
            <p className="product-detail__blurb">{product.blurb}</p>

            <fieldset className="product-detail__sizes">
              <legend className="label">Size</legend>
              <div className="size-picker">
                {product.sizes.map((s) => (
                  <label
                    key={s}
                    className={`size-picker__opt ${size === s ? 'is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      checked={size === s}
                      onChange={() => setSize(s)}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              className="btn btn--primary product-detail__add"
              onClick={() => add(product, size)}
            >
              Add to cart
            </button>

            <dl className="product-detail__meta">
              <dt className="label">Stock</dt>
              <dd>{product.stock} available</dd>
              <dt className="label">Pillar</dt>
              <dd>{product.pillar}</dd>
            </dl>
          </div>
        </article>
      </div>
    </main>
  );
}