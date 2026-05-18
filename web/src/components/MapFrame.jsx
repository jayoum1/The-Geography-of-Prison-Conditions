import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { METRICS, FILTER_OPTIONS } from "../data/metrics.js";
import { buildColorFn, MISSING } from "../data/colorScale.js";
import { CATEGORY_COLORS, CATEGORY_ORDER, canonicalStateName } from "../data/categories.js";
import { STORY_BY_CATEGORY_KEY } from "../data/categoryStories.js";

const TOPO_URL = `${import.meta.env.BASE_URL || "/"}data/states-10m.json`;

// Categories shown in the interactive legend (excludes Uncategorized).
const CAT_LEGEND_ORDER = ["Severe", "High", "Moderate", "Lower"];

export default function MapFrame({
  states, metricKey, setMetricKey,
  selectedState, setSelectedState,
  selectedCategory, setSelectedCategory,
  onStatsOpen, onMethodOpen,
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

  const metric   = METRICS[metricKey];
  const isCatMode = metricKey === "pressureCategory";

  // Representative states for the currently selected category.
  const repStates = useMemo(() => {
    if (!isCatMode || !selectedCategory) return [];
    return STORY_BY_CATEGORY_KEY[selectedCategory]?.representativeStates ?? [];
  }, [isCatMode, selectedCategory]);

  return (
    <div className="map-frame">
      {/* ── Frame header: label + utility buttons + metric tabs ── */}
      <div className="map-frame-header">
        <div className="map-frame-titlerow">
          <span className="map-frame-label">Interactive State Map</span>
          <div className="map-utils">
            <button className="map-util-btn" onClick={onStatsOpen}>
              Statistics
            </button>
            <button className="map-util-btn" onClick={onMethodOpen}>
              Method
            </button>
          </div>
        </div>

        {/* ── Metric selector: horizontal scrollable tabs ── */}
        <div className="metric-selector" role="tablist" aria-label="Map metric">
          {FILTER_OPTIONS.map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={metricKey === key}
              className={`metric-btn${metricKey === key ? " active" : ""}`}
              onClick={() => setMetricKey(key)}
            >
              {METRICS[key].short}
            </button>
          ))}
        </div>
      </div>

      {/* ── Map canvas ── */}
      <div className="map-canvas">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          width={980}
          height={540}
          style={{ width: "100%", height: "100%", flex: 1 }}
        >
          <Geographies geography={TOPO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name  = canonicalStateName(geo.properties.name);
                const state = stateByName.get(name);
                const fill  = state ? colorFor(state) : MISSING;
                const isSel = selectedState?.state === name;
                const isRep = repStates.includes(name);

                // When a category is selected, fade states outside that category.
                const isFaded =
                  isCatMode && selectedCategory &&
                  state?.pressureCategory !== selectedCategory;

                const strokeColor = isSel
                  ? "#7d2230"
                  : isRep
                    ? (CATEGORY_COLORS[selectedCategory] ?? "#7d2230")
                    : "#ede7dc";

                const strokeW = isSel ? 1.8 : isRep ? 1.6 : 0.65;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    style={{
                      default: {
                        outline: "none",
                        opacity: isFaded ? 0.22 : 1,
                        transition: "opacity 200ms ease",
                      },
                      hover: {
                        outline: "none",
                        fill,
                        opacity: isFaded ? 0.48 : 0.8,
                        cursor: "pointer",
                        transition: "opacity 120ms ease",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(e) =>
                      setTooltip({ x: e.clientX, y: e.clientY, state, name })
                    }
                    onMouseMove={(e) =>
                      setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : t)
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => state && setSelectedState(state)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Legend — interactive when in category mode */}
        {isCatMode ? (
          <InteractiveCategoryLegend
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ) : (
          <ContinuousLegend metricKey={metricKey} states={states} />
        )}

        {/* Category overview card — floats over map canvas */}
        {isCatMode && selectedCategory && (
          <CategoryOverviewCard
            categoryKey={selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </div>

      {/* Tooltip */}
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
    </div>
  );
}

// ─── Interactive category legend ──────────────────────────────────────────────
// When in category mode each item is clickable to open the overview card.

function InteractiveCategoryLegend({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="map-legend map-legend-interactive">
      {CAT_LEGEND_ORDER.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            className={`legend-cat-btn${isSelected ? " selected" : ""}`}
            onClick={() => setSelectedCategory(isSelected ? null : cat)}
            title={`Explore ${cat} Pressure states`}
          >
            <span
              className="swatch-box"
              style={{ background: CATEGORY_COLORS[cat] }}
            />
            <span className="legend-cat-name">{cat} Pressure</span>
            <span className="legend-cat-arrow">›</span>
          </button>
        );
      })}
      {/* Uncategorized + no data — non-interactive swatches */}
      <span className="swatch">
        <span className="swatch-box" style={{ background: CATEGORY_COLORS.Uncategorized }} />
        Uncategorized
      </span>
      <span className="swatch" style={{ marginLeft: "auto" }}>
        <span className="swatch-box" style={{ background: MISSING }} />
        No data
      </span>
    </div>
  );
}

// ─── Category overview card ────────────────────────────────────────────────────
// Floats over the bottom-left of the map canvas. Opens when a category legend
// item is clicked. "Enter the Story" navigates to the narrative page.

function CategoryOverviewCard({ categoryKey, onClose }) {
  const navigate = useNavigate();
  const story = STORY_BY_CATEGORY_KEY[categoryKey];
  if (!story) return null;

  return (
    <div
      className="category-overview-card"
      style={{ borderLeftColor: story.color }}
    >
      {/* Header row */}
      <div className="coc-header">
        <div className="coc-eyebrow">
          <span
            className="coc-color-dot"
            style={{ background: story.color }}
          />
          {story.categoryKey} Pressure
        </div>
        <button className="coc-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      {/* Subtitle — displayed as the card's primary heading */}
      <div className="coc-title">{story.subtitle}</div>

      {/* Representative state(s) */}
      <div className="coc-reps">
        Representative: {story.representativeStates.join(" & ")}
      </div>

      {/* Description */}
      <p className="coc-desc">{story.description}</p>

      {/* Key theme */}
      <div className="coc-theme">
        <span className="coc-theme-label">Key theme — </span>
        {story.keyTheme}
      </div>

      {/* CTA */}
      <button
        className="coc-enter-btn"
        onClick={() => navigate(`/category/${story.slug}`)}
      >
        Enter the Story →
      </button>
    </div>
  );
}

// ─── Continuous (numeric) legend — used for all non-category metrics ──────────

function ContinuousLegend({ metricKey, states }) {
  const metric = METRICS[metricKey];

  const vals = states
    .map((s) => s[metricKey])
    .filter((v) => v != null && Number.isFinite(v));
  if (!vals.length) return null;

  const fmt   = metric.format || String;
  const min   = Math.min(...vals);
  const max   = Math.max(...vals);
  const note  = metric.higherIsWorse
    ? "lighter = less pressure · darker = more pressure"
    : "lighter = more pressure · darker = less pressure";

  return (
    <div className="map-legend">
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
