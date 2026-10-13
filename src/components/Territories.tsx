import { territories } from "../data/territories";

type TerritoriesProps = {
  hoveredTerritory: string | null;
  focusedTerritory: string | null;
  onHover: (id: string | null) => void;
  onFocus: (id: string | null) => void;
};

export function Territories({ hoveredTerritory, focusedTerritory, onHover, onFocus }: TerritoriesProps) {
  const selected = territories.find((territory) => territory.id === focusedTerritory) ?? null;

  return (
    <section className="territories section-frame" id="territories" aria-labelledby="territories-title">
      <div className="section-heading">
        <p className="micro-label">[04] / TERRITORIES</p>
        <h2 id="territories-title">ONE ECOSYSTEM.<br /><span>MANY TARGETS.</span></h2>
      </div>
      <div className="territories__layout">
        <p className="territories__intro">A connected map of games, engines, runtimes, and platforms. Select a node to focus the scene.</p>
        <ul className="territory-list" aria-label="Territory nodes">
          {territories.map((territory) => {
            const isSelected = focusedTerritory === territory.id;
            return (
              <li key={territory.id}>
                <button
                  className={`territory-node territory-node--${territory.status.toLowerCase()}${hoveredTerritory === territory.id || isSelected ? " is-active" : ""}`}
                  type="button"
                  aria-pressed={isSelected}
                  aria-controls="territory-panel"
                  onMouseEnter={() => onHover(territory.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(territory.id)}
                  onBlur={() => onHover(null)}
                  onClick={() => onFocus(isSelected ? null : territory.id)}
                >
                  <span className="territory-node__symbol" aria-hidden="true" />
                  <span className="territory-node__name">{territory.label}</span>
                  <span className="territory-node__family">{territory.family}</span>
                  <span className="territory-node__status">{territory.status}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <aside className="territory-panel" id="territory-panel" aria-live="polite" aria-label="Selected territory details">
          <span className="micro-label">NODE DETAIL / {selected ? selected.status : "IDLE"}</span>
          {selected ? <>
            <h3>{selected.label}</h3>
            <p>{selected.description}</p>
            <span className="territory-panel__family">{selected.family} / {selected.id.toUpperCase()}</span>
          </> : <p>Select a node to inspect its place in the map.</p>}
        </aside>
      </div>
      <span className="section-number">[04]</span>
    </section>
  );
}
