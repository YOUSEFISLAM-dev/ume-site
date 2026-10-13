import { Logo } from "./Logo";
import { ScrambleText } from "./ScrambleText";

type HeroProps = {
  reducedMotion: boolean;
};

const links = [
  ["Vision", "#vision"],
  ["Pillars", "#pillars"],
  ["Territories", "#territories"],
  ["Projects", "#projects"],
  ["Principles", "#rules"]
];

export function Hero({ reducedMotion }: HeroProps) {
  return (
    <section className="hero section-frame" id="top" aria-labelledby="hero-title">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="UME home">
          <Logo />
          <span>UNIVERSAL MODDING EMPIRE</span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <span className="header-index">SYSTEM / 001</span>
      </header>

      <div className="hero__grid">
        <div className="hero__copy">
          <p className="micro-label"><span className="status-dot" /> MODDING TOOLS / RESEARCH / PROJECTS</p>
          <h1 id="hero-title"><ScrambleText text="UME" reducedMotion={reducedMotion} /></h1>
          <p className="hero__thesis">MOD<br />EVERYTHING<span className="signal-period">.</span></p>
          <p className="hero__description">One empire for modding across games, engines, and platforms.</p>
          <a className="text-link" href="#vision">EXPLORE THE SYSTEM <span aria-hidden="true">↘</span></a>
        </div>
        <div className="hero__coordinates" aria-hidden="true">
          <span>FILE STACK / 06</span>
          <span>ALL TARGETS</span>
          <span>STUDIO VIEW / 001</span>
        </div>
      </div>
      <a className="scroll-cue" href="#vision"><span>SCROLL TO EXPLORE</span><b aria-hidden="true">↓</b></a>
      <span className="section-number">[01]</span>
    </section>
  );
}
