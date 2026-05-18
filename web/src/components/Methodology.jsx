export default function Methodology() {
  return (
    <section className="section card methodology" id="methodology">
      <div className="ed-label">Methodology</div>
      <h2>A note on the data and its limits</h2>

      <p>
        This project groups states using four publicly available indicators:
        incarceration rate (per 100,000 adults, 2023); median correctional
        officer salary (2023); state corrections spending per prisoner
        (inflation-adjusted to FY 2024); and prison occupancy as a percentage
        above or below maximum capacity (Bureau of Justice Statistics, 2023).
        The <strong>experimental pressure score</strong> is a simple average of
        these four indicators, each normalized to a 0–1 scale, with officer
        salary and per-prisoner spending inverted so that lower values increase
        pressure. Missing values are excluded rather than zeroed.
      </p>

      <p>
        The pressure score is a <em>structural pressure index</em>, not a
        verdict on any state's prison conditions. It identifies states where
        incarceration levels, funding, staffing compensation, and capacity may
        combine to create higher risk for poor conditions — it does not measure
        conditions directly. The four-indicator groupings (Severe / High /
        Moderate / Lower) are fixed categories set by this project for
        analytical framing.
      </p>

      <p>
        Some states appear lower-pressure in the data while still having
        documented prison-condition failures — Connecticut and California are
        addressed directly in the case studies for this reason. This is why the
        project pairs quantitative indicators with state-specific investigative
        reporting rather than relying on the score alone.
      </p>

      <p className="sources-note">
        Sources: BJS National Prisoner Statistics; U.S. Bureau of Labor
        Statistics Occupational Employment and Wage Statistics; U.S. Census
        Bureau Annual Survey of State Government Finances; USAFacts prison
        occupancy data. State topology from us-atlas / Mike Bostock.
      </p>
    </section>
  );
}
