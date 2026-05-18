export default function MethodModal({ onClose }) {
  function onBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onBackdrop}>
      <div className="modal-panel small">
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">Note on Data</span>
            <h2 className="modal-title">Methodology</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body method-body">
          <p>
            This project groups states using four publicly available indicators:
            incarceration rate (per 100,000 adults, 2023); median correctional
            officer salary (2023); state corrections spending per prisoner
            (inflation-adjusted to FY 2024); and prison occupancy as a percentage
            above or below maximum rated capacity (Bureau of Justice Statistics, 2023).
          </p>
          <p>
            The <strong>experimental pressure score</strong> is a structural pressure
            index — not a definitive measure of prison conditions. Each indicator is
            min-max normalized to [0, 1]. Officer salary and per-prisoner spending are
            inverted so that lower values increase pressure. The score is the mean of
            all available components; missing values are excluded rather than zeroed.
          </p>
          <p>
            The four pressure groupings (Severe / High / Moderate / Lower) are
            categorical assignments set by this project for analytical framing.
            Some states appear lower-pressure in the data while still having documented
            prison-condition failures — this is why the project pairs statistics with
            investigative reporting on representative states.
          </p>
          <p>
            The central argument is that federal funding must be <em>conditional</em>:
            tied to measurable improvements in living standards, staffing,
            infrastructure, and oversight — not to prison population growth.
          </p>
          <p className="sources-note">
            Sources: BJS National Prisoner Statistics · U.S. Bureau of Labor
            Statistics OEWS · U.S. Census Annual Survey of State Government
            Finances · USAFacts prison occupancy data · us-atlas topojson.
          </p>
        </div>
      </div>
    </div>
  );
}
