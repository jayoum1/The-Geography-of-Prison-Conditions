import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis, CartesianGrid,
} from "recharts";
import { METRICS } from "../data/metrics.js";
import { buildColorFn } from "../data/colorScale.js";
import { CATEGORY_COLORS } from "../data/categories.js";

// Shared editorial chart tokens
const AXIS_CLR  = "#6a6254";
const GRID_CLR  = "#ece6da";
const LABEL_CLR = "#9c9284";
const TT_BG     = "#1a1714";
const TT_BORDER = "#38342c";
const TT_TEXT   = "#f6f2ea";
const TT_DIM    = "#9c9284";

const TOGGLE_KEYS = new Set(["medianOfficerSalary", "perPrisonerSpending"]);

export default function StatsModal({ states, metricKey, setSelectedState, onClose }) {
  // Close on backdrop click
  function onBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onBackdrop}>
      <div className="modal-panel">
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">Statistics &amp; Charts</span>
            <h2 className="modal-title">Data Appendix</h2>
            <p className="modal-sub">
              Rankings mirror the active map metric. Clicking a bar or data point
              closes this window and opens that state's dossier.
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          {/* Rankings bar chart */}
          <RankingBlock
            states={states}
            metricKey={metricKey}
            setSelectedState={setSelectedState}
          />

          {/* Two scatterplots */}
          <div className="modal-charts-row">
            <CompactScatter
              title="Are prisons large enough for the incarcerated population?"
              sub="Incarceration rate vs. occupancy gap"
              xKey="incarcerationRate"
              yKey="occupancyGap"
              states={states}
              onSelect={setSelectedState}
            />
            <CompactScatter
              title="Does spending translate into staff compensation?"
              sub="Officer salary vs. per-prisoner spending"
              xKey="medianOfficerSalary"
              yKey="perPrisonerSpending"
              states={states}
              onSelect={setSelectedState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Rankings ─────────────────────────────────────────────── */

function RankingBlock({ states, metricKey, setSelectedState }) {
  const metric    = METRICS[metricKey];
  const canToggle = TOGGLE_KEYS.has(metricKey);
  const [order, setOrder] = useState("auto");

  const direction = useMemo(() => {
    if (canToggle) return order === "auto" ? "lowest" : order;
    return "highest";
  }, [canToggle, metricKey, order]);

  const colorFor = useMemo(() => buildColorFn(metricKey, states), [metricKey, states]);

  const data = useMemo(() => {
    if (metricKey === "pressureCategory") {
      return states
        .filter((s) => s.pressureScore != null)
        .sort((a, b) => b.pressureScore - a.pressureScore)
        .slice(0, 10)
        .map((s) => ({
          ...s,
          value: s.pressureScore,
          displayValue: s.pressureScore.toFixed(2),
          color: CATEGORY_COLORS[s.pressureCategory],
        }));
    }
    const valid  = states.filter((s) => s[metricKey] != null && Number.isFinite(s[metricKey]));
    const sorted = [...valid].sort((a, b) =>
      direction === "highest" ? b[metricKey] - a[metricKey] : a[metricKey] - b[metricKey],
    );
    return sorted.slice(0, 10).map((s) => ({
      ...s,
      value: s[metricKey],
      displayValue: metric.format ? metric.format(s[metricKey]) : String(s[metricKey]),
      color: colorFor(s),
    }));
  }, [states, metricKey, metric, direction, colorFor]);

  const titlePrefix =
    metricKey === "pressureCategory"
      ? "10 highest experimental pressure scores"
      : direction === "highest"
        ? `10 highest — ${metric.short}`
        : `10 lowest — ${metric.short}`;

  return (
    <div className="modal-ranking">
      <div className="modal-ranking-title">{titlePrefix}</div>
      <div className="modal-ranking-sub">{metric.description}</div>

      {canToggle && (
        <div className="toggle-row">
          <button className={direction === "highest" ? "active" : ""} onClick={() => setOrder("highest")}>Highest</button>
          <button className={direction === "lowest"  ? "active" : ""} onClick={() => setOrder("lowest")}>Lowest</button>
        </div>
      )}

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 4 }}>
            <XAxis type="number" tick={{ fill: AXIS_CLR, fontSize: 11, fontFamily: "Inter, sans-serif" }} axisLine={{ stroke: GRID_CLR }} tickLine={false} />
            <YAxis type="category" dataKey="state" width={124} tick={{ fill: TT_TEXT.replace("f6", "#38"), fontSize: 12.5, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(125,34,48,0.06)" }}
              contentStyle={{ background: TT_BG, border: `1px solid ${TT_BORDER}`, borderRadius: 2, color: TT_TEXT, fontSize: 12.5, fontFamily: "Inter, sans-serif", padding: "8px 12px" }}
              formatter={(_, __, item) => [item.payload.displayValue, metric.short]}
            />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} cursor="pointer"
              onClick={(_, idx) => { const s = data[idx]; if (s) setSelectedState(s); }}
            >
              {data.map((d) => <Cell key={d.state} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Compact scatter plot ─────────────────────────────────── */

function CompactScatter({ title, sub, xKey, yKey, states, onSelect }) {
  const xMeta = METRICS[xKey];
  const yMeta = METRICS[yKey];

  const data = states
    .filter((s) => s[xKey] != null && s[yKey] != null)
    .map((s) => ({ name: s.state, x: s[xKey], y: s[yKey], cat: s.pressureCategory, raw: s }));

  return (
    <div className="modal-chart-card">
      <div className="modal-chart-title">{title}</div>
      <div className="modal-chart-sub">{sub}</div>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 28 }}>
            <CartesianGrid stroke={GRID_CLR} strokeDasharray="3 3" />
            <XAxis
              type="number" dataKey="x"
              tick={{ fill: AXIS_CLR, fontSize: 10, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: GRID_CLR }} tickLine={false}
              label={{ value: xMeta.short, position: "insideBottom", offset: -18, fill: LABEL_CLR, fontSize: 11, fontFamily: "Inter, sans-serif" }}
            />
            <YAxis
              type="number" dataKey="y"
              tick={{ fill: AXIS_CLR, fontSize: 10, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: GRID_CLR }} tickLine={false}
              label={{ value: yMeta.short, angle: -90, position: "insideLeft", offset: 16, fill: LABEL_CLR, fontSize: 11, fontFamily: "Inter, sans-serif" }}
            />
            <ZAxis range={[50, 50]} />
            <Tooltip
              cursor={{ stroke: "#7d2230", strokeDasharray: "3 3", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: TT_BG, border: `1px solid ${TT_BORDER}`, borderRadius: 2, padding: "8px 12px", color: TT_TEXT, fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, fontFamily: "Playfair Display, serif" }}>{d.name}</div>
                    <div style={{ color: TT_DIM, fontSize: 11 }}>{xMeta.short}: {xMeta.format ? xMeta.format(d.x) : d.x}</div>
                    <div style={{ color: TT_DIM, fontSize: 11 }}>{yMeta.short}: {yMeta.format ? yMeta.format(d.y) : d.y}</div>
                  </div>
                );
              }}
            />
            <Scatter data={data} onClick={(p) => p?.raw && onSelect(p.raw)} cursor="pointer">
              {data.map((d) => (
                <Cell
                  key={d.name}
                  fill={CATEGORY_COLORS[d.cat] || CATEGORY_COLORS.Uncategorized}
                  stroke="#f6f2ea"
                  strokeWidth={0.8}
                  fillOpacity={0.88}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
