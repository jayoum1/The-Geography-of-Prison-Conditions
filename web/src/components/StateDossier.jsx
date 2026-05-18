import { METRICS, interpret } from "../data/metrics.js";
import { CATEGORY_COLORS } from "../data/categories.js";

// All five metrics shown as compact stat cards.
const STAT_KEYS = [
  { key: "pressureScore",       label: "Pressure Score",   unit: "experimental" },
  { key: "incarcerationRate",   label: "Incarceration",    unit: "per 100k adults" },
  { key: "medianOfficerSalary", label: "Officer Salary",   unit: "median annual" },
  { key: "perPrisonerSpending", label: "Per Prisoner",     unit: "inflation-adj. FY24" },
  { key: "occupancyGap",        label: "Occupancy Gap",    unit: "vs. max capacity" },
];

export default function StateDossier({ state, metricKey, onClose }) {
  const isOpen = !!state;

  return (
    <aside className={`state-dossier${isOpen ? " open" : ""}`} aria-label="State Dossier">
      {/* ── Header: always visible ── */}
      <div className="dossier-header">
        <div className="dossier-header-top">
          <span className="dossier-eyebrow">State Dossier</span>
          <button
            className="dossier-close"
            onClick={onClose}
            aria-label="Close dossier"
          >
            ×
          </button>
        </div>

        {state ? (
          <>
            <h2 className="dossier-state-name">{state.state}</h2>
            <div className="dossier-abbr">{state.abbreviation || "—"}</div>
          </>
        ) : (
          <p className="dossier-empty" style={{ marginTop: 10 }}>
            Click a state on the map to open its dossier and metrics.
          </p>
        )}
      </div>

      {/* ── Scrollable body ── */}
      {state && (
        <div className="dossier-body">
          {/* Category indicator */}
          <div className="dossier-category">
            <span
              className="cat-dot"
              style={{ background: CATEGORY_COLORS[state.pressureCategory] || CATEGORY_COLORS.Uncategorized }}
              aria-hidden="true"
            />
            {state.pressureCategory} pressure state
          </div>

          {/* Stat cards — 2-column grid, 5th spans full width */}
          <div className="stat-cards-grid">
            {STAT_KEYS.map(({ key, label, unit }, i) => {
              const m         = METRICS[key];
              const value     = state[key];
              const formatted = m?.format ? m.format(value) : (value != null ? String(value) : "—");
              const isActive  = metricKey === key;
              const isLast    = i === STAT_KEYS.length - 1;
              const isOddLast = isLast && STAT_KEYS.length % 2 === 1;
              return (
                <div
                  key={key}
                  className={`stat-card${isActive ? " active" : ""}${isOddLast ? " full-width" : ""}`}
                >
                  <span className="sc-label">{label}</span>
                  <div className="sc-value">{formatted}</div>
                  {!isActive && <span className="sc-unit">{unit}</span>}
                </div>
              );
            })}
          </div>

          {/* Interpretation note for the active metric */}
          <div className="dossier-interpret">
            {interpret(state, metricKey)}
          </div>
        </div>
      )}
    </aside>
  );
}
