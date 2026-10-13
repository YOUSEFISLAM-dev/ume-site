const pillars = [
  {
    title: "Universal game modding",
    copy: "Mods, custom features, interface changes, mechanics, and content across different games.",
    signal: "01 / GAME"
  },
  {
    title: "Modding tools and engineering",
    copy: "Asset explorers, script editors, package analyzers, patchers, and engine-specific tools.",
    signal: "02 / TOOLS"
  },
  {
    title: "One ecosystem, many targets",
    copy: "Shared tools, research, projects, and workflows for games and applications.",
    signal: "03 / SYSTEMS"
  },
  {
    title: "Responsible reverse engineering",
    copy: "Understand formats, engines, protocols, and internals. Respect security and authorization boundaries.",
    signal: "04 / METHOD"
  }
];

type PillarsProps = {
  activePillar: number | null;
  onActivePillar: (value: number | null) => void;
};

export function Pillars({ activePillar, onActivePillar }: PillarsProps) {
  return (
    <section className="pillars section-frame" id="pillars" aria-labelledby="pillars-title">
      <div className="section-heading">
        <p className="micro-label">[03] / THE PILLARS</p>
        <h2 id="pillars-title">THE WORK<br /><span>NEEDS MORE THAN MODS.</span></h2>
      </div>
      <div className="ledger" role="list" aria-label="UME's four pillars">
        {pillars.map((pillar, index) => (
          <article
            className={`ledger-row${activePillar === index ? " is-active" : ""}`}
            key={pillar.title}
            role="listitem"
            tabIndex={0}
            aria-labelledby={`pillar-${index}`}
            onMouseEnter={() => onActivePillar(index)}
            onMouseLeave={() => onActivePillar(null)}
            onFocus={() => onActivePillar(index)}
            onBlur={() => onActivePillar(null)}
          >
            <span className="ledger-row__number">0{index + 1}</span>
            <h3 id={`pillar-${index}`}>{pillar.title}</h3>
            <p>{pillar.copy}</p>
            <span className="ledger-row__signal">{pillar.signal}</span>
            <span className="ledger-row__arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
      <p className="ledger-note"><span className="status-dot" /> FOCUS OR HOVER A ROW TO TRACE ITS SIGNAL</p>
      <span className="section-number">[03]</span>
    </section>
  );
}
