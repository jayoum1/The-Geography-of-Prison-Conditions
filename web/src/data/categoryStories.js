// ─────────────────────────────────────────────────────────────────
// CATEGORY_STORIES — central data structure for the four pressure
// categories.  Drives: interactive legend, overview card, narrative
// pages, and representative-state map markers.
// ─────────────────────────────────────────────────────────────────

export const CATEGORY_STORIES = {
  severe: {
    slug: "severe",
    categoryKey: "Severe",
    title: "Severe Pressure States",
    subtitle: "Structural underfunding pressure",
    representativeStates: ["Mississippi"],
    color: "#6b1520",
    description:
      "States in this group combine high incarceration, low spending, and low officer pay. " +
      "Mississippi introduces the project's central imbalance: states with the highest prison " +
      "pressure are often least equipped to maintain humane conditions.",
    keyTheme: "Funding imbalance and the need for conditional federal support.",
    sections: [
      {
        type: "intro",
        label:
          "Opening paragraph — introduce Mississippi and the severe pressure category",
      },
      {
        type: "text",
        label:
          "Main narrative — the case for federal intervention based on Mississippi's data",
      },
      {
        type: "stats",
        state: "Mississippi",
        label:
          "Mississippi statistics block (incarceration rate, officer salary, per-prisoner spending, occupancy)",
      },
      {
        type: "evidence",
        label:
          "DOJ / Parchman Farm evidence card — federal findings on unconstitutional conditions at Parchman",
      },
      {
        type: "chart",
        label:
          "Graph or state comparison — severe pressure states ranked by per-prisoner spending vs. incarceration rate",
      },
      {
        type: "argument",
        label:
          "Broader argument — how Mississippi's case supports the thesis for conditional federal funding",
      },
      {
        type: "sources",
        label: "Source citations and evidence references",
      },
    ],
  },

  high: {
    slug: "high",
    categoryKey: "High",
    title: "High Pressure States",
    subtitle: "Overcrowding pressure",
    representativeStates: ["Nebraska"],
    color: "#b85a18",
    description:
      "Nebraska shows that prison conditions can fail even when a state is not the lowest-spending " +
      "system. Overcrowding can turn prison capacity into a direct safety problem, especially when " +
      "people are held in spaces not designed for them.",
    keyTheme: "Spending alone is not enough if prison capacity is mismanaged.",
    sections: [
      {
        type: "intro",
        label:
          "Opening paragraph — introduce Nebraska and the high pressure / overcrowding category",
      },
      {
        type: "text",
        label:
          "Main narrative — the double-bunking crisis and what capacity failure looks like in practice",
      },
      {
        type: "stats",
        state: "Nebraska",
        label:
          "Nebraska statistics block (occupancy gap, incarceration rate, per-prisoner spending)",
      },
      {
        type: "evidence",
        label:
          "Double-bunking evidence card — Flatwater Free Press investigation on Nebraska facility overcrowding",
      },
      {
        type: "chart",
        label:
          "Graph or state comparison — occupancy rates across high pressure states",
      },
      {
        type: "argument",
        label:
          "Broader argument — why spending without capacity management fails to protect incarcerated people",
      },
      {
        type: "sources",
        label: "Source citations and evidence references",
      },
    ],
  },

  moderate: {
    slug: "moderate",
    categoryKey: "Moderate",
    title: "Moderate Pressure States",
    subtitle: "Staffing and allocation pressure",
    representativeStates: ["Nevada"],
    color: "#9e7208",
    description:
      "Nevada shows that a system can appear better funded while still facing serious staffing " +
      "problems. High officer spending may reflect overtime, vacancies, and crisis management " +
      "rather than a stable and healthy staffing structure.",
    keyTheme: "Strategic allocation matters more than raw spending.",
    sections: [
      {
        type: "intro",
        label:
          "Opening paragraph — introduce Nevada and the moderate pressure / staffing allocation category",
      },
      {
        type: "text",
        label:
          "Main narrative — staffing vacancies, overtime pay, and what crisis-mode management looks like",
      },
      {
        type: "stats",
        state: "Nevada",
        label:
          "Nevada statistics block (officer salary, per-prisoner spending, staffing vacancy figures)",
      },
      {
        type: "evidence",
        label:
          "Staffing crisis evidence card — investigative reporting on Nevada corrections staffing shortfalls",
      },
      {
        type: "chart",
        label:
          "Graph or state comparison — officer salary vs. reported vacancy rates across moderate pressure states",
      },
      {
        type: "argument",
        label:
          "Broader argument — why strategic allocation and accountability matter more than headline spending figures",
      },
      {
        type: "sources",
        label: "Source citations and evidence references",
      },
    ],
  },

  lower: {
    slug: "lower",
    categoryKey: "Lower",
    title: "Lower Pressure States",
    subtitle: "Oversight and infrastructure failure despite funding",
    representativeStates: ["Connecticut", "California"],
    color: "#485f34",
    description:
      "Connecticut and California show that better-looking numbers do not automatically mean humane " +
      "prison conditions. Even lower-pressure or high-spending systems can have serious failures when " +
      "funding is not tied to oversight, infrastructure repair, and enforceable standards.",
    keyTheme: "Money alone cannot replace accountability and standards.",
    sections: [
      {
        type: "intro",
        label:
          "Opening paragraph — introduce Connecticut and California as counterexamples within the lower pressure group",
      },
      {
        type: "text",
        label:
          "Main narrative — high spending, documented condition failures, and the oversight gap",
      },
      {
        type: "stats",
        state: "Connecticut",
        label:
          "Connecticut statistics block (per-prisoner spending, condition inspection reports, staffing data)",
      },
      {
        type: "evidence",
        label:
          "Connecticut evidence card — CT Public investigative report on documented prison condition failures (2025–2026)",
      },
      {
        type: "stats",
        state: "California",
        label:
          "California statistics block (per-prisoner spending, infrastructure costs, incarceration rate)",
      },
      {
        type: "evidence",
        label:
          "California evidence card — LAO / PPIC report on prison infrastructure and deferred maintenance costs",
      },
      {
        type: "chart",
        label:
          "Graph or state comparison — lower pressure states: per-prisoner spending vs. documented condition failures",
      },
      {
        type: "argument",
        label:
          "Broader argument — why the project thesis requires oversight standards, not just funding increases",
      },
      {
        type: "sources",
        label: "Source citations and evidence references",
      },
    ],
  },
};

// Keyed by categoryKey string (e.g. "Severe") for fast lookup inside MapFrame.
export const STORY_BY_CATEGORY_KEY = Object.fromEntries(
  Object.values(CATEGORY_STORIES).map((s) => [s.categoryKey, s]),
);
