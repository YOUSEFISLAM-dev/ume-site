import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href="#top" aria-label="Return to top"><Logo /><span>UNIVERSAL MODDING EMPIRE</span></a>
      <a className="footer-github" href="https://github.com/YOUSEFISLAM-dev" target="_blank" rel="noreferrer" aria-label="Open UME on GitHub in a new tab">GITHUB <span aria-hidden="true">↗</span></a>
      <span className="footer-copyright">© 2026 UME</span>
      <span className="footer-domain">ume.qd.je</span>
    </footer>
  );
}
