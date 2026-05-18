import { scaleLinear } from "d3-scale";
import { CATEGORY_COLORS } from "./categories.js";
import { METRICS } from "./metrics.js";

// Editorial continuous ramp: muted olive → ochre → burnt orange → oxblood.
// This matches the category palette so the map reads consistently whether
// the user is viewing categorical or continuous data.
const EDITORIAL_RAMP = ["#4e6638", "#9e7208", "#c4621d", "#6b1520"];

// Warm parchment fill for states with missing data.
const MISSING_COLOR = "#d0c9bc";

export function buildColorFn(metricKey, states) {
  const metric = METRICS[metricKey];
  if (!metric) return () => MISSING_COLOR;

  if (metric.type === "categorical") {
    return (state) =>
      CATEGORY_COLORS[state?.pressureCategory] || MISSING_COLOR;
  }

  const values = states
    .map((s) => s[metricKey])
    .filter((v) => v != null && Number.isFinite(v));

  if (values.length === 0) return () => MISSING_COLOR;

  const min = Math.min(...values);
  const max = Math.max(...values);

  // For "higher is worse" metrics (incarceration, occupancy, pressure score):
  //   low value → olive end, high value → oxblood end.
  // For "higher is better" metrics (salary, spending):
  //   the domain is reversed so *low* values still map to the red end,
  //   meaning the map always reads "darker = more structural pressure."
  const spread = (max - min) / 6;
  const domain = metric.higherIsWorse
    ? [min, min + spread * 2, min + spread * 4, max]
    : [max, min + spread * 4, min + spread * 2, min];

  const scale = scaleLinear().domain(domain).range(EDITORIAL_RAMP).clamp(true);

  return (state) => {
    const v = state?.[metricKey];
    if (v == null || !Number.isFinite(v)) return MISSING_COLOR;
    return scale(v);
  };
}

export const MISSING = MISSING_COLOR;
