import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { METRICS, FILTER_OPTIONS } from "../data/metrics.js";
import { buildColorFn, MISSING } from "../data/colorScale.js";
import {
  CATEGORY_COLORS,
  CATEGORY_ORDER,
  canonicalStateName,
} from "../data/categories.js";

const TOPO_URL = `${import.meta.env.BASE_URL || "/"}data/states-10m.json`;

export default function MapSection({
  states,
  metricKey,
  setMetricKey,
  selectedState,
  setSelectedState,
  rightPanel,
}) {
  const [tooltip, setTooltip] = useState(null);

  const stateByName = useMemo(() => {
    const m = new Map();
    for (const s of states) m.set(s.state, s);
    return m;
  }, [states]);

  const colorFor = useMemo(
    () => buildColorFn(metricKey, states),
    [metricKey, states],
  );

  const metric = METRICS[metricKey];

  return (
    <section className="section" id="map">
      <div className="ed-label">Section I · Interactive Evidence</div>
      <h2>The Map</h2>
      <p className="section-sub">
        Each state is encoded by the selected indicator. Hover for a quick
        reading; click any state to open its full evidence summary in the
        panel on the right.
      </p>

      {/* Filter tab row */}
      <div className="controls" role="tablist" aria-label="Metric filter">
        {FILTER_OPTIONS.map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={metricKey === key}
            className={`filter-btn ${metricKey === key ? "active" : ""}`}
            onClick={() => setMetricKey(key)}
          >
            {METRICS[key].label}
          </button>
        ))}
      </div>

      {/* Dynamic annotation line — updates with the active metric */}
      <div className="metric-note">
        <strong>About this view</strong>
        {metric.description}
      </div>

      <div className="map-layout">
        {/* Map canvas */}
        <div className="map-card">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 1000 }}
            width={980}
            height={560}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={TOPO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = canonicalStateName(geo.properties.name);
                  const state = stateByName.get(name);
                  const fill = state ? colorFor(state) : MISSING;
                  const isSelected =
                    selectedState && selectedState.state === name;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={isSelected ? "#7d2230" : "#ede7dc"}
                      strokeWidth={isSelected ? 1.6 : 0.6}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          outline: "none",
                          fill,
                          opacity: 0.8,
                          cursor: "pointer",
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(e) => {
                        setTooltip({ x: e.clientX, y: e.clientY, state, name });
                      }}
                      onMouseMove={(e) => {
                        setTooltip((t) =>
                          t ? { ...t, x: e.clientX, y: e.clientY } : t,
                        );
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => state && setSelectedState(state)}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          <Legend metricKey={metricKey} states={states} />
        </div>

        {/* State dossier panel */}
        {rightPanel}
      </div>

      {tooltip && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <div className="tt-cat">{metric.short}</div>
          <div className="tt-state">{tooltip.name}</div>
          <div className="tt-value">
            {tooltip.state
              ? metricKey === "pressureCategory"
                ? `${tooltip.state.pressureCategory} pressure`
                : metric.format
                  ? metric.format(tooltip.state[metricKey])
                  : String(tooltip.state[metricKey])
              : "No data"}
          </div>
        </div>
      )}
    </section>
  );
}

function Legend({ metricKey, states }) {
  const metric = METRICS[metricKey];

  if (metric.type === "categorical") {
    return (
      <div className="legend">
        {CATEGORY_ORDER.map((cat) => (
          <span key={cat} className="swatch">
            <span
              className="swatch-box"
              style={{ background: CATEGORY_COLORS[cat] }}
            />
            {cat}
          </span>
        ))}
        <span className="swatch">
          <span className="swatch-box" style={{ background: MISSING }} />
          No data
        </span>
      </div>
    );
  }

  const vals = states
    .map((s) => s[metricKey])
    .filter((v) => v != null && Number.isFinite(v));
  if (vals.length === 0) return null;

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const fmt = metric.format || ((v) => v);
  const note = metric.higherIsWorse
    ? "lighter = less pressure · darker = more pressure"
    : "lighter = more pressure · darker = less pressure";

  return (
    <div className="legend">
      <span>{fmt(min)}</span>
      <span className="gradient" />
      <span>{fmt(max)}</span>
      <span className="legend-note">— {note}</span>
      <span className="swatch" style={{ marginLeft: "auto" }}>
        <span className="swatch-box" style={{ background: MISSING }} />
        No data
      </span>
    </div>
  );
}
