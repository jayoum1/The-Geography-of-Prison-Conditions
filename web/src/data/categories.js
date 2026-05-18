// Pressure category groupings provided in the project outline.
// If a state is missing from every list, we mark it as "Uncategorized"
// rather than crashing the UI.

export const PRESSURE_CATEGORIES = {
  Severe: [
    "Arkansas",
    "Mississippi",
    "Alabama",
    "Oklahoma",
    "Texas",
    "Florida",
    "Georgia",
    "Idaho",
    "Louisiana",
    "Missouri",
    "Kentucky",
    "Iowa",
    "South Dakota",
    "Tennessee",
  ],
  High: [
    "Montana",
    "Indiana",
    "Kansas",
    "Virginia",
    "Ohio",
    "Wisconsin",
    "South Carolina",
    "Arizona",
    "Colorado",
    "North Carolina",
    "Nebraska",
    "North Dakota",
    "Michigan",
    "West Virginia",
  ],
  Moderate: [
    "Wyoming",
    "New Mexico",
    "Nevada",
    "Pennsylvania",
    "Washington",
    "Minnesota",
  ],
  Lower: [
    "Delaware",
    "Hawaii",
    "Connecticut",
    "New Jersey",
    "Maryland",
    "Oregon",
    "California",
    "Illinois",
    "New Hampshire",
    "Maine",
    "Utah",
    "Vermont",
    "Alaska",
    "New York",
    "Rhode Island",
    "Massachusetts",
  ],
};

// Color tokens for each pressure category — oxblood → burnt orange → ochre → olive.
// Used in map fills, legends, badges, and story card stripes.
export const CATEGORY_COLORS = {
  Severe:        "#6b1520",   // deep oxblood
  High:          "#b85a18",   // burnt orange
  Moderate:      "#9e7208",   // dark ochre / mustard
  Lower:         "#4e6638",   // muted olive
  Uncategorized: "#8a8278",   // warm gray
};

export const CATEGORY_ORDER = ["Severe", "High", "Moderate", "Lower", "Uncategorized"];

export function categoryForState(stateName) {
  for (const [cat, list] of Object.entries(PRESSURE_CATEGORIES)) {
    if (list.includes(stateName)) return cat;
  }
  return "Uncategorized";
}

// Lookup maps for state name <-> postal abbreviation. Used when a CSV does
// not provide an abbreviation column.
export const STATE_ABBREV = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  "District of Columbia": "DC",
};

export const NAME_FROM_ABBREV = Object.fromEntries(
  Object.entries(STATE_ABBREV).map(([name, abbr]) => [abbr, name]),
);

// Some CSV files use slight name variations like "Washington state".
export function canonicalStateName(raw) {
  if (!raw) return raw;
  const cleaned = raw.trim();
  if (STATE_ABBREV[cleaned]) return cleaned;
  if (cleaned === "Washington state") return "Washington";
  if (cleaned === "D.C." || cleaned === "DC") return "District of Columbia";
  return cleaned;
}
