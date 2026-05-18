import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { METRICS } from "../data/metrics.js";
import { buildColorFn } from "../data/colorScale.js";
import { CATEGORY_COLORS } from "../data/categories.js";

// For metrics where higher is "better" (salary, spending), show lowest-10 by
// default — those are the structurally significant cases for this project.
const TOGGLE_KEYS = new Set(["medianOfficerSalary", "perPrisonerSpending"]);

// Editorial chart colors
const AXIS_COLOR   = "#6b6358";   // --ink-3
const LABEL_COLOR  = "#3c3830";   // --ink-2
const GRID_COLOR   = "#e4dfd5";   // --rule-light
const TT_BG        = "#1c1915";   // --ink
const TT_BORDER    = "#3c3830";
const TT_TEXT      = "#f5f1e9";   // --paper

export default function RankingChart({ states, metricKey, setSelectedState }) {
  const metric   = METRICS[metricKey];
  const canToggle = TOGGLE_KEYS.has(metricKey);
  const [order, setOrder] = useState("auto");

  const direction = useMemo(() => {
    if (canToggle) return order === "auto" ? "lowest" : order;
    return "highest";
  }, [canToggle, metricKey, order]);

  const colorFor = useMemo(
    () => buildColorFn(metricKey, states),
    [metricKey, states],
  );

  const data = useMemo(() => {
    if (metricKey === "pressureCategory") {
      return states
        .filter((s) => s.pressureScore != null)
        .sort((a, b) => b.pressureScore - a.pressureScore)
        .slice(0, 10)
        .map((s) => ({
          ...s,
          value:        s.pressureScore,
          displayValue: s.pressureScore.toFixed(2),
          color:        CATEGORY_COLORS[s.pressureCategory],
        }));
    }
    const valid = states.filter(
      (s) => s[metricKey] != null && Number.isFinite(s[metricKey]),
    );
    const sorted = [...valid].sort((a, b) =>
      direction === "highest"
        ? b[metricKey] - a[metricKey]
        : a[metricKey] - b[metricKey],
    );
    return sorted.slice(0, 10).map((s) => ({
      ...s,
      value:        s[metricKey],
      displayValue: metric.format ? metric.format(s[metricKey]) : String(s[metricKey]),
      color:        colorFor(s),
    }));
  }, [states, metricKey, metric, direction, colorFor]);

  const chartTitle =
    metricKey === "pressureCategory"
      ? "10 highest experimental pressure scores"
      : direction === "highest"
        ? `10 highest — ${metric.short}`
        : `10 lowest — ${metric.short}`;

  return (
    <div className="card chart-card">
      <h3>{chartTitle}</h3>
      <p className="chart-sub">{metric.description}</p>

      {canToggle && (
        <div className="toggle-row">
          <button
            className={direction === "highest" ? "active" : ""}
            onClick={() => setOrder("highest")}
          >
            Highest
          </button>
          <button
            className={direction === "lowest" ? "active" : ""}
            onClick={() => setOrder("lowest")}
          >
            Lowest
          </button>
        </div>
      )}

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 32, left: 8, bottom: 8 }}
          >
            <XAxis
              type="number"
              tick={{ fill: AXIS_COLOR, fontSize: 11, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: GRID_COLOR }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="state"
              width={126}
              tick={{ fill: LABEL_COLOR, fontSize: 12.5, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(139, 37, 52, 0.06)" }}
              contentStyle={{
                background: TT_BG,
                border: `1px solid ${TT_BORDER}`,
                borderRadius: 3,
                color: TT_TEXT,
                fontSize: 12.5,
                fontFamily: "Inter, sans-serif",
                padding: "8px 12px",
              }}
              formatter={(_, __, item) => [item.payload.displayValue, metric.short]}
            />
            <Bar
              dataKey="value"
              radius={[0, 3, 3, 0]}
              cursor="pointer"
              onClick={(_, idx) => {
                const s = data[idx];
                if (s) setSelectedState(s);
              }}
            >
              {data.map((d) => (
                <Cell key={d.state} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
