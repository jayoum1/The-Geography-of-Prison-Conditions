export default function Hero() {
  return (
    <header className="hero">
      {/* Dateline — gives the page a publication identity */}
      <div className="dateline">
        Interactive Investigation · U.S. Prison Conditions
      </div>

      <h1>The Geography of<br />Prison Conditions</h1>

      <p className="subtitle">
        An evidence-based look at how incarceration rates, correctional
        officer pay, per-prisoner spending, and facility overcrowding vary
        across every U.S. state — and why those disparities point toward a
        structural argument for conditional federal intervention.
      </p>

      {/* Thesis: horizontal-rule pullquote, no background box */}
      <div className="thesis-block">
        <span className="thesis-label">Central Argument</span>
        <p>
          The federal government should allocate funding to states for
          general prison operation costs — conditional on measurable
          improvements to minimum living standards, staffing, medical care,
          infrastructure, and oversight. Not on expanding incarceration.
        </p>
      </div>

      <p className="disclaimer">
        <strong>A note on framing:</strong> this project does not argue
        for undirected prison spending. The 1994 Crime Bill demonstrated
        how federal money without conditions can deepen incarceration rather
        than improve conditions. Any funding mechanism must be tied to
        enforceable minimum standards — <em>not</em> to population growth.
      </p>
    </header>
  );
}
