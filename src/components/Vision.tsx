const targets = ["UNITY", "UNREAL", "IL2CPP", "ANDROID", "CUSTOM ENGINES"];

export function Vision() {
  return (
    <section className="vision section-frame" id="vision" aria-labelledby="vision-title">
      <div className="section-heading">
        <p className="micro-label">[02] / THE VISION</p>
        <span className="section-heading__rule" />
      </div>
      <div className="vision__layout">
        <p className="vision__stamp">SCOPE<br /><span>UNIVERSAL</span></p>
        <div className="vision__main">
          <h2 id="vision-title">ONE EMPIRE.<br /><span>MANY TARGETS.</span></h2>
          <p className="vision__lead">UME is bigger than one game, one engine, or one platform.</p>
          <p className="vision__body">Mods, tools, research, and workflows belong in one shared ecosystem. PUBG and Among Us are projects inside that vision. They are not its limits.</p>
        </div>
        <aside className="hex-inspector" aria-label="Hex inspector example">
          <div className="hex-inspector__top"><span>HEX INSPECTOR</span><span>READ ONLY</span></div>
          <code>
            <span>0000&nbsp;&nbsp;55 4D 45 20 2F 20 50 41</span>
            <span>0008&nbsp;&nbsp;4B 20 2F 20 41 53 53 45</span>
            <span>0010&nbsp;&nbsp;54 53 20 2F 20 54 4F 4F</span>
            <span>0018&nbsp;&nbsp;4C 53 20 2F 20 4D 4F 44</span>
          </code>
          <div className="hex-inspector__footer"><span>.ASSETS</span><span>FORMAT VIEW</span></div>
        </aside>
        <div className="vision__data" aria-label="Modding targets">
          <span>FIELD / 05</span>
          <div className="target-marquee" aria-hidden="true">
            <div className="target-marquee__track">{[...targets, ...targets].map((target, index) => <span key={`${target}-${index}`}>{target}<i> / </i></span>)}</div>
          </div>
          <p>Different targets.<br />Shared direction.</p>
        </div>
      </div>
      <span className="section-number">[02]</span>
    </section>
  );
}
