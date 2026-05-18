// Centralized metric metadata so the map, charts, panels and legend stay in sync.

export const METRICS = {
  pressureCategory: {
    key: "pressureCategory",
    label: "Pressure category",
    short: "Category",
    type: "categorical",
    description:
      "Hard-coded grouping of states into Severe / High / Moderate / Lower pressure based on the project outline.",
  },
  pressureScore: {
    key: "pressureScore",
    label: "Experimental pressure score",
    short: "Pressure score",
    type: "numeric",
    higherIsWorse: true,
    format: (v) => (v == null ? "—" : v.toFixed(2)),
    description:
      "Average of the available normalized indicators (incarceration ↑, occupancy ↑, salary ↓, spending ↓). Not a definitive measure of prison conditions.",
  },
  incarcerationRate: {
    key: "incarcerationRate",
    label: "Incarceration rate",
    short: "Incarceration",
    type: "numeric",
    higherIsWorse: true,
    unit: "per 100k adults",
    format: (v) =>
      v == null ? "—" : `${Math.round(v).toLocaleString()} per 100k`,
    description: "State prisoners per 100,000 adults (2023).",
  },
  medianOfficerSalary: {
    key: "medianOfficerSalary",
    label: "Median officer salary",
    short: "Officer salary",
    type: "numeric",
    higherIsWorse: false,
    unit: "USD",
    format: (v) =>
      v == null ? "—" : `$${Math.round(v).toLocaleString()}`,
    description:
      "Median annual wage for correctional officers and jailers (2023).",
  },
  perPrisonerSpending: {
    key: "perPrisonerSpending",
    label: "Per-prisoner spending",
    short: "Per-prisoner",
    type: "numeric",
    higherIsWorse: false,
    unit: "USD",
    format: (v) =>
      v == null ? "—" : `$${Math.round(v).toLocaleString()}`,
    description:
      "State corrections spending per prisoner, inflation-adjusted to FY 2024.",
  },
  occupancyGap: {
    key: "occupancyGap",
    label: "Prison occupancy vs. capacity",
    short: "Occupancy",
    type: "numeric",
    higherIsWorse: true,
    unit: "% above capacity",
    format: (v) =>
      v == null
        ? "—"
        : `${v > 0 ? "+" : ""}${v.toFixed(1)}% vs. max capacity`,
    description:
      "Percent above (+) or below (-) maximum prison capacity vs. inmates housed among state-run prisons. Values are percentages from USAFacts chart data sourced from U.S. Bureau of Justice Statistics (2023 snapshot). \"No data\" states are shown as missing on the map.",
  },
};

export const FILTER_OPTIONS = [
  "pressureCategory",
  "pressureScore",
  "incarcerationRate",
  "medianOfficerSalary",
  "perPrisonerSpending",
  "occupancyGap",
];

export function metricValue(state, key) {
  return state ? state[key] : null;
}

// Generate an interpretation sentence for the panel based on the active metric.
export function interpret(state, key) {
  if (!state) return "";
  const m = METRICS[key];
  switch (key) {
    case "pressureCategory":
      return state.pressureCategory === "Uncategorized"
        ? `${state.state} is not assigned to a pressure category.`
        : `${state.state} is grouped as a ${state.pressureCategory.toLowerCase()}-pressure state in this project.`;
    case "pressureScore":
      if (state.pressureScore == null) return `No pressure score available for ${state.state}.`;
      if (state.pressureScore > 0.6)
        return `${state.state} sits in the upper end of the experimental pressure score — a flag, not a verdict.`;
      if (state.pressureScore > 0.4)
        return `${state.state} is mid-range on the experimental pressure score.`;
      return `${state.state} is in the lower end of the experimental pressure score, but data alone may understate conditions.`;
    case "incarcerationRate":
      if (state.incarcerationRate == null) return "No incarceration rate available.";
      return state.incarcerationRate > 600
        ? `${state.state} has one of the highest incarceration rates in the country.`
        : state.incarcerationRate < 250
          ? `${state.state} has a comparatively low incarceration rate.`
          : `${state.state} has a mid-range incarceration rate.`;
    case "medianOfficerSalary":
      if (state.medianOfficerSalary == null) return "No salary data available.";
      return state.medianOfficerSalary < 45000
        ? `Officer pay in ${state.state} is on the low end nationally — a staffing pressure signal.`
        : state.medianOfficerSalary > 70000
          ? `${state.state} pays correctional officers comparatively well.`
          : `Officer pay in ${state.state} is mid-range nationally.`;
    case "perPrisonerSpending":
      if (state.perPrisonerSpending == null) return "No spending data available.";
      return state.perPrisonerSpending < 30000
        ? `${state.state} spends very little per incarcerated person.`
        : state.perPrisonerSpending > 100000
          ? `${state.state} spends a lot per incarcerated person — but high spending does not guarantee humane conditions.`
          : `${state.state} sits in the middle of the spending distribution.`;
    case "occupancyGap":
      if (state.occupancyGap == null) return "No occupancy data available.";
      return state.occupancyGap > 0
        ? `${state.state} is operating above maximum capacity — a direct overcrowding signal.`
        : state.occupancyGap > -10
          ? `${state.state} is near maximum capacity.`
          : `${state.state} reports operating well below maximum capacity.`;
    default:
      return m?.description || "";
  }
}
