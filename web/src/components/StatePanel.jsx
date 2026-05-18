import { METRICS, interpret } from "../data/metrics.js";
import { CATEGORY_COLORS } from "../data/categories.js";
import { STORIES } from "../data/stories.js";

const NUMERIC_KEYS = [
  "pressureScore",
  "incarcerationRate",
  "medianOfficerSalary",
  "perPrisonerSpending",
  "occupancyGap",
];

export default function StatePanel({ state, metricKey }) {
  if (!state) {
    return (
      <aside className="card panel">
        <div className="panel-meta">State Analysis</div>
        <p className="panel-empty">
          Select a state on the map, a bar in the rankings chart, or a
          data point on the scatterplots to open its evidence summary here.
        </p>
      </aside>
    );
  }

  const story    = STORIES[state.state];
  const cat      = state.pressureCategory;
  const catColor = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Uncategorized;

  return (
    <aside className="card panel">
      <div className="panel-meta">State Analysis</div>

      {/* State name — large serif headline */}
      <h3>{state.state}</h3>
      <div className="abbr">{state.abbreviation || "—"}</div>

      {/* Category indicator — dot + text, no badge box */}
      <div className="panel-category">
        <span
          className="cat-dot"
          style={{ background: catColor }}
          aria-hidden="true"
        />
        {cat} pressure state
      </div>

      {/* Metric table */}
      <div className="stats">
        {NUMERIC_KEYS.map((key) => {
          const m         = METRICS[key];
          const value     = state[key];
          const formatted = m.format ? m.format(value) : String(value ?? "—");
          const isActive  = metricKey === key;
          return (
            <div
              key={key}
              className={`stat-row${isActive ? " active" : ""}`}
            >
              <span className="stat-label">{m.short}</span>
              <span className="stat-value">{formatted}</span>
            </div>
          );
        })}
      </div>

      {/* Interpretation — italic serif annotation, no background */}
      <div className="interpret">
        {interpret(state, metricKey)}
      </div>

      {/* Story section — shown only for representative states */}
      {story && (
        <div className="story">
          <div className="story-theme-label">{story.theme}</div>
          <p>{story.summary}</p>
          <p className="why-matters">
            <strong>Why it matters:</strong> {story.matters}
          </p>
          <a
            className="story-link"
            href={story.link}
            target="_blank"
            rel="noreferrer"
          >
            Read the source report ↗
          </a>
        </div>
      )}
    </aside>
  );
}
