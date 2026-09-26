import { useCart } from '../context/CartContext.jsx';
import { IG_URL, MOTTO } from '../data.js';

const LOGO = `${import.meta.env.BASE_URL}brand/logo-640.webp`;

export function Header() {
  const { count, open, setOpen } = useCart();

  return (
    <header className="masthead">
      <div className="shell masthead__row">
        <div className="wordmark">
          <a className="wordmark__home" href="/">
            <img className="wordmark__logo" src={LOGO} alt="Elite Human" width="1444" height="699" />
          </a>
          <span className="wordmark__motto label">{MOTTO}</span>
        </div>
        <nav className="masthead__nav label" aria-label="Primary">
          <a href="/shop">Shop</a>
          <a href="/archive">The Record</a>
          <a href={IG_URL} target="_blank" rel="noreferrer noopener">
            Instagram ↗
          </a>
        </nav>
        <button
          className="masthead__cart"
          onClick={() => setOpen(true)}
          aria-label={`Cart${count ? `, ${count} items` : ', empty'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1 0 8"/>
          </svg>
          {count > 0 && <span className="masthead__cart-badge">{count}</span>}
        </button>
      </div>
    </header>
  );
}