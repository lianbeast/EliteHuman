import { IG_URL, MOTTO } from '../data.js';

const LOGO = `${import.meta.env.BASE_URL}brand/logo.png`;

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__inner">
          <p className="footer__mark">
            <img className="footer__logo" src={LOGO} alt="Elite Human" width="1444" height="699" />
          </p>
          <p className="footer__motto label">{MOTTO}</p>
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