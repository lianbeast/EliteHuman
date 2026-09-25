import { IG_URL } from '../data.js';

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__inner">
          <p className="footer__mark">Elite Human</p>
          <p className="footer__line">Wear Discipline. Train Body. Discipline Mind. Elevate Spirit.</p>
        </div>
        <div className="footer__bar meta">
          <span>105 Marks · 2015 — 2018</span>
          <a href={IG_URL} target="_blank" rel="noreferrer noopener">
            Instagram ↗
          </a>
        </div>
      </div>
    </footer>
  );
}