import Papa from "papaparse";
import {
  STATE_ABBREV,
  canonicalStateName,
  categoryForState,
  NAME_FROM_ABBREV,
} from "./categories.js";

// Vite serves /public at the root in dev and at BASE_URL in prod.
const BASE = import.meta.env.BASE_URL || "/";

const FILES = {
  incarceration: `${BASE}data/incarceration_rate.csv`,
  salary: `${BASE}data/median_officer_salary.csv`,
  spending: `${BASE}data/per-prisoner_spending.csv`,
  occupancy: `${BASE}data/prison_ocupancy.csv`,
};

// Strip $, commas, percent signs, whitespace and turn the result into a number.
// Returns null if the cleaned string is empty or not numeric.
function toNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const cleaned = String(value).replace(/[$,%+\s]/g, "").trim();
  if (cleaned === "" || cleaned.toLowerCase() === "no data") return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

async function fetchCsv(url, parseOptions = {}) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const text = await res.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    ...parseOptions,
  });
  return parsed.data;
}

// The occupancy file has 8 metadata lines before the actual header. Skip them.
async function fetchOccupancyCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const raw = await res.text();
  const lines = raw.split(/\r?\n/);
  const headerIdx = lines.findIndex((l) => l.startsWith("State Abb"));
  const trimmed = headerIdx >= 0 ? lines.slice(headerIdx).join("\n") : raw;
  const parsed = Papa.parse(trimmed, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
}

// Find a column key in a row that matches any of the candidate substrings
// (case-insensitive). Lets us be flexible about exact CSV headers.
function findKey(row, ...candidates) {
  const keys = Object.keys(row);
  for (const cand of candidates) {
    const lc = cand.toLowerCase();
    const hit = keys.find((k) => k.toLowerCase().includes(lc));
    if (hit) return hit;
  }
  return null;
}

export async function loadAllData() {
  const [incRows, salRows, spendRows, occRows] = await Promise.all([
    fetchCsv(FILES.incarceration),
    fetchCsv(FILES.salary),
    fetchCsv(FILES.spending),
    fetchOccupancyCsv(FILES.occupancy),
  ]);

  // Build per-state records keyed by canonical state name.
  const byState = new Map();

  function ensure(name) {
    const canonical = canonicalStateName(name);
    if (!canonical) return null;
    if (!byState.has(canonical)) {
      byState.set(canonical, {
        state: canonical,
        abbreviation: STATE_ABBREV[canonical] || null,
        incarcerationRate: null,
        medianOfficerSalary: null,
        perPrisonerSpending: null,
        totalPrisoners: null,
        occupancyGap: null,
        pressureCategory: categoryForState(canonical),
        pressureScore: null,
      });
    }
    return byState.get(canonical);
  }

  // --- Incarceration rate ----------------------------------------------------
  if (incRows.length) {
    const sample = incRows[0];
    const nameKey = findKey(sample, "state");
    const valKey = findKey(sample, "per 100", "rate");
    const abbrKey = findKey(sample, "abbrev");
    for (const row of incRows) {
      const rec = ensure(row[nameKey]);
      if (!rec) continue;
      rec.incarcerationRate = toNumber(row[valKey]);
      if (abbrKey && row[abbrKey]) rec.abbreviation = row[abbrKey].trim();
    }
  }

  // --- Median officer salary -------------------------------------------------
  if (salRows.length) {
    const sample = salRows[0];
    const nameKey = findKey(sample, "state");
    const valKey = findKey(sample, "median", "salary");
    const abbrKey = findKey(sample, "abbrev");
    for (const row of salRows) {
      const rec = ensure(row[nameKey]);
      if (!rec) continue;
      rec.medianOfficerSalary = toNumber(row[valKey]);
      if (abbrKey && row[abbrKey]) rec.abbreviation ||= row[abbrKey].trim();
    }
  }

  // --- Per-prisoner spending -------------------------------------------------
  if (spendRows.length) {
    const sample = spendRows[0];
    const nameKey = findKey(sample, "state");
    // Prefer the inflation-adjusted column when present.
    const valKey =
      findKey(sample, "Spending per prisoner, 2023 Inflation") ||
      findKey(sample, "inflation adjusted") ||
      findKey(sample, "spending per prisoner");
    const totalPrisonersKey = findKey(sample, "total prisoners");
    const abbrKey = findKey(sample, "abbrev");
    for (const row of spendRows) {
      const rec = ensure(row[nameKey]);
      if (!rec) continue;
      rec.perPrisonerSpending = toNumber(row[valKey]);
      if (totalPrisonersKey) rec.totalPrisoners = toNumber(row[totalPrisonersKey]);
      if (abbrKey && row[abbrKey]) rec.abbreviation ||= row[abbrKey].trim();
    }
  }

  // --- Prison occupancy / overcrowding (USAFacts: % vs. maximum capacity) -----
  // CSV columns: State Abb, State, Intuitive, Intuitive_popup
  // IMPORTANT: Do not use findKey(_, "state") — it wrongly matches "State Abb"
  // before "State". We need the full state name column for ensure().
  if (occRows.length) {
    for (const row of occRows) {
      const nameRaw = (row.State || "").trim();
      const abbrRaw = (row["State Abb"] || "").trim();
      let canonical = null;
      if (nameRaw) canonical = canonicalStateName(nameRaw);
      else if (abbrRaw && NAME_FROM_ABBREV[abbrRaw])
        canonical = canonicalStateName(NAME_FROM_ABBREV[abbrRaw]);
      if (!canonical) continue;
      const rec = ensure(canonical);
      if (!rec) continue;
      let v = toNumber(row.Intuitive);
      if (v == null || !Number.isFinite(v))
        v = toNumber(row.Intuitive_popup);
      rec.occupancyGap = v;
    }
  }

  // Ensure we have a record for every state in our abbrev map (so the map can
  // still color uncovered states with the "missing" treatment instead of
  // silently dropping them).
  for (const name of Object.keys(STATE_ABBREV)) {
    ensure(name);
  }

  const states = Array.from(byState.values()).sort((a, b) =>
    a.state.localeCompare(b.state),
  );

  // --- Experimental pressure score ------------------------------------------
  // Each available metric is min-max normalized to 0..1 across all states.
  // Salary and per-prisoner spending are inverted because *lower* values
  // indicate more pressure. Final score = mean of the available components.
  const stats = {
    incarcerationRate: extent(states, "incarcerationRate"),
    medianOfficerSalary: extent(states, "medianOfficerSalary"),
    perPrisonerSpending: extent(states, "perPrisonerSpending"),
    occupancyGap: extent(states, "occupancyGap"),
  };

  for (const s of states) {
    const components = [];
    if (s.incarcerationRate != null) {
      components.push(norm(s.incarcerationRate, stats.incarcerationRate));
    }
    if (s.occupancyGap != null) {
      components.push(norm(s.occupancyGap, stats.occupancyGap));
    }
    if (s.medianOfficerSalary != null) {
      components.push(1 - norm(s.medianOfficerSalary, stats.medianOfficerSalary));
    }
    if (s.perPrisonerSpending != null) {
      components.push(1 - norm(s.perPrisonerSpending, stats.perPrisonerSpending));
    }
    s.pressureScore =
      components.length > 0
        ? components.reduce((a, b) => a + b, 0) / components.length
        : null;
  }

  return { states, stats };
}

function extent(rows, key) {
  let min = Infinity;
  let max = -Infinity;
  for (const r of rows) {
    const v = r[key];
    if (v == null || !Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 1 };
  return { min, max };
}

function norm(value, { min, max }) {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}
