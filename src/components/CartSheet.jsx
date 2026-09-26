import { useCart } from '../context/CartContext.jsx';
import { imageUrl, srcSet, fmtPrice } from '../shopData.js';

export function CartSheet() {
  const { items, open, setOpen, updateQty, remove, subtotal, clear } = useCart();

  if (!open) return null;

  const handleScrim = (e) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div
      className="cart-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      onKeyDown={handleKey}
    >
      <div className="cart-sheet__scrim" onClick={handleScrim} />
      <aside className="cart-sheet__panel">
        <header className="cart-sheet__head">
          <h2>Cart ({items.length})</h2>
          <button className="cart-sheet__close" onClick={() => setOpen(false)} aria-label="Close cart">
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-sheet__empty">
            <p>Your cart is empty.</p>
            <a href="/shop" className="cart-sheet__cta" onClick={() => setOpen(false)}>
              Browse the shop
            </a>
          </div>
        ) : (
          <>
            <ul className="cart-sheet__list" role="list">
              {items.map((item) => (
                <li key={item.key} className="cart-sheet__item">
                  <img
                    src={imageUrl(item.product)}
                    srcSet={srcSet(item.product)}
                    sizes="64px"
                    alt=""
                    className="cart-sheet__thumb"
                    loading="lazy"
                  />
                  <div className="cart-sheet__info">
                    <p className="cart-sheet__name">{item.product.name}</p>
                    <p className="cart-sheet__meta">
                      {item.size} · {fmtPrice(item.product.price)}
                    </p>
                    <div className="cart-sheet__qty">
                      <button
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-sheet__remove"
                      onClick={() => remove(item.key)}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-sheet__total">
              <span>Subtotal</span>
              <strong>{fmtPrice(subtotal)}</strong>
            </div>

            <div className="cart-sheet__actions">
              <button
                className="btn btn--primary cart-sheet__checkout"
                disabled={items.length === 0}
                onClick={() => alert('Demo checkout — no real order placed.')}
              >
                Checkout
              </button>
              <button
                className="btn btn--ghost cart-sheet__clear"
                onClick={clear}
                disabled={items.length === 0}
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}