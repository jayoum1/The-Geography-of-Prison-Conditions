import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { CATEGORY_COLORS } from "../data/categories.js";
import { METRICS } from "../data/metrics.js";

// Shared editorial chart color tokens
const AXIS_COLOR  = "#6b6358";
const GRID_COLOR  = "#e4dfd5";
const LABEL_COLOR = "#9c9387";
const TT_BG       = "#1c1915";
const TT_BORDER   = "#3c3830";
const TT_TEXT     = "#f5f1e9";

export default function ScatterSection({ states, setSelectedState }) {
  return (
    <section className="section">
      <div className="ed-label">Section III · Cross-Indicator Analysis</div>
      <h2>Two questions in the data</h2>
      <p className="section-sub">
        Each point is a state, colored by pressure category. Hover for values;
        click to open the state dossier above.
      </p>

      <div className="scatter-grid">
        <ScatterPlot
          title="Are prisons large enough for the incarcerated population?"
          subtitle="Incarceration rate vs. prison occupancy vs. capacity"
          xKey="incarcerationRate"
          yKey="occupancyGap"
          states={states}
          setSelectedState={setSelectedState}
        />
        <ScatterPlot
          title="Does prison spending translate into staff compensation?"
          subtitle="Median officer salary vs. per-prisoner spending"
          xKey="medianOfficerSalary"
          yKey="perPrisonerSpending"
          states={states}
          setSelectedState={setSelectedState}
        />
      </div>
    </section>
  );
}

function ScatterPlot({ title, subtitle, xKey, yKey, states, setSelectedState }) {
  const xMeta = METRICS[xKey];
  const yMeta = METRICS[yKey];

  const data = states
    .filter((s) => s[xKey] != null && s[yKey] != null)
    .map((s) => ({
      name: s.state,
      x:    s[xKey],
      y:    s[yKey],
      cat:  s.pressureCategory,
      raw:  s,
    }));

  return (
    <div className="card chart-card">
      <h3>{title}</h3>
      <p className="chart-sub">{subtitle}</p>
      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 32 }}>
            <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name={xMeta.label}
              tick={{ fill: AXIS_COLOR, fontSize: 11, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: GRID_COLOR }}
              tickLine={false}
              label={{
                value: xMeta.short,
                position: "insideBottom",
                offset: -18,
                fill: LABEL_COLOR,
                fontSize: 11.5,
                fontFamily: "Inter, sans-serif",
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yMeta.label}
              tick={{ fill: AXIS_COLOR, fontSize: 11, fontFamily: "Inter, sans-serif" }}
              axisLine={{ stroke: GRID_COLOR }}
              tickLine={false}
              label={{
                value: yMeta.short,
                angle: -90,
                position: "insideLeft",
                offset: 16,
                fill: LABEL_COLOR,
                fontSize: 11.5,
                fontFamily: "Inter, sans-serif",
              }}
            />
            <ZAxis range={[55, 55]} />
            <Tooltip
              cursor={{ stroke: "#8b2534", strokeDasharray: "3 3", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div
                    style={{
                      background:   TT_BG,
                      border:       `1px solid ${TT_BORDER}`,
                      borderRadius: 3,
                      padding:      "9px 13px",
                      color:        TT_TEXT,
                      fontSize:     12.5,
                      fontFamily:   "Inter, sans-serif",
                      maxWidth:     200,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 5, fontFamily: "Playfair Display, serif" }}>
                      {d.name}
                    </div>
                    <div style={{ color: "#9c9387", fontSize: 12 }}>
                      {xMeta.short}: {xMeta.format ? xMeta.format(d.x) : d.x}
                    </div>
                    <div style={{ color: "#9c9387", fontSize: 12 }}>
                      {yMeta.short}: {yMeta.format ? yMeta.format(d.y) : d.y}
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              data={data}
              onClick={(p) => p?.raw && setSelectedState(p.raw)}
              cursor="pointer"
            >
              {data.map((d) => (
                <Cell
                  key={d.name}
                  fill={CATEGORY_COLORS[d.cat] || CATEGORY_COLORS.Uncategorized}
                  stroke="#f5f1e9"
                  strokeWidth={0.8}
                  fillOpacity={0.85}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
