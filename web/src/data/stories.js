// Legacy: representative state story copy (no longer shown in UI).
// Long-form narratives live on category routes only (/category/:slug).

export const STORIES = {
  Mississippi: {
    state: "Mississippi",
    theme: "Highest pressure / unconstitutional conditions",
    summary:
      "Mississippi represents the severe-pressure category: high incarceration, low spending, low officer salary, and documented prison-condition failures. The Mississippi State Penitentiary at Parchman has been the subject of federal scrutiny for violence, mental health failures, suicide prevention failures, and dangerous isolation conditions.",
    matters:
      "Combines three of the four pressure indicators in their worst form, which is the strongest in-data argument for conditional federal support.",
    link: "https://www.justice.gov/archives/opa/pr/justice-department-finds-conditions-mississippi-state-penitentiary-violate-constitution",
  },
  Arkansas: {
    state: "Arkansas",
    theme: "Severe pressure / jail-prison spillover",
    summary:
      "Arkansas represents how prison pressure can spill into the wider correctional system. The story of Larry Eugene Price Jr., who died after severe neglect in a county jail, can be used to connect overcrowding, understaffing, mental health neglect, and low-resource incarceration.",
    matters:
      "Shows that under-resourced state prison systems push people into county jails that are even less equipped to handle medical and mental health needs.",
    link: "https://apnews.com/article/66712b2c053ce23ae83c25e59c60a353",
  },
  Nebraska: {
    state: "Nebraska",
    theme: "Overcrowding / double-bunking",
    summary:
      "Nebraska represents the dangers of overcrowding. Reporting on double-bunking deaths shows how occupancy pressure becomes a daily safety risk when people are placed in cells designed for fewer people.",
    matters:
      "Highlights that occupancy gap is not just an abstract capacity number — it directly maps to documented in-cell violence and death.",
    link: "https://flatwaterfreepress.org/nebraska-prisoners-have-killed-their-cellmates-while-being-double-bunked-lawmakers-have-yet-to-limit-the-practice/",
  },
  Connecticut: {
    state: "Connecticut",
    theme: "Spending does not guarantee good conditions",
    summary:
      "Connecticut is a contrast case: even states that appear lower-pressure in the data can still have serious prison-condition failures, including reported mold, rodents, and staffing problems.",
    matters:
      "Demonstrates why federal funding must be conditional on oversight and enforceable standards, not simply tied to current spending levels.",
    link: "https://www.ctpublic.org/news/investigative/2026-01-20/connecticut-prison-conditions-report-ombudsman",
  },
  California: {
    state: "California",
    theme: "Infrastructure and high-cost systems",
    summary:
      "California represents the infrastructure problem: high spending can reflect old facilities, repair needs, and structural inefficiency rather than humane conditions.",
    matters:
      "Shows why per-prisoner spending alone is a misleading proxy for prison quality — money can be absorbed by aging infrastructure.",
    link: "https://lao.ca.gov/Publications/Report/4186",
  },
};
