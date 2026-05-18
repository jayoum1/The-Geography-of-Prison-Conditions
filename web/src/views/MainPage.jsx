import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_STORIES } from "../data/categoryStories.js";
import BibliographyModal from "../components/BibliographyModal.jsx";

// ─── Footnote source data ─────────────────────────────────────────────────────

const MAIN_FOOTNOTES = {
  "1": {
    text: 'Ofer, Udi. 2019. "How the 1994 Crime Bill Fed the Mass Incarceration Crisis." American Civil Liberties Union, June 4, 2019.',
    url: "https://www.aclu.org/news/smart-justice/how-1994-crime-bill-fed-mass-incarceration-crisis",
  },
  "2": {
    text: 'Equal Justice Initiative. 2014. "St. Clair Correctional Facility." Equal Justice Initiative, May 17, 2014.',
    url: "https://eji.org/cases/st-clair/",
  },
};

// ─── Inline text renderer ─────────────────────────────────────────────────────
// Handles **bold** and [^N] footnote markers.

function InlineText({ text, onFootnote }) {
  const parts = [];
  const pattern = /\*\*(.*?)\*\*|\[\^(\w+)\]/g;
  let last = 0, key = 0, m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={key++}>{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      const fnId = m[2];
      parts.push(
        <sup key={key++} className="fn-sup">
          <button
            className="fn-ref-btn"
            onClick={() => onFootnote(fnId)}
            aria-label={`Open footnote ${fnId}`}
          >
            {fnId}
          </button>
        </sup>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

// ─── Footnote panel ───────────────────────────────────────────────────────────

function FootnotePanel({ fnId, footnotes, onClose }) {
  const isOpen = fnId !== null;
  const fn = isOpen ? footnotes?.[fnId] : null;
  return (
    <aside className={`footnote-panel${isOpen ? " open" : ""}`} aria-label="Source note">
      <div className="fn-panel-header">
        <div className="fn-panel-header-text">
          <span className="fn-panel-eyebrow">Source Note</span>
          <div className="fn-panel-num">{isOpen ? `Footnote ${fnId}` : ""}</div>
        </div>
        <button className="fn-panel-close" onClick={onClose} aria-label="Close footnote">×</button>
      </div>
      <div className="fn-panel-body">
        {fn ? (
          <>
            <p className="fn-panel-text">{fn.text}</p>
            {fn.url && (
              <a className="fn-panel-link" href={fn.url} target="_blank" rel="noopener noreferrer">
                {fn.url}
              </a>
            )}
          </>
        ) : (
          <p className="fn-panel-text fn-panel-placeholder">[Source details to be added here.]</p>
        )}
      </div>
    </aside>
  );
}

// ─── Four category preview cards ─────────────────────────────────────────────

const CATEGORY_TAGLINES = {
  severe:   "Structural underfunding",
  high:     "Overcrowding",
  moderate: "Staffing and allocation",
  lower:    "Oversight and infrastructure",
};

function CategoryCards() {
  return (
    <div className="category-cards-grid">
      {Object.values(CATEGORY_STORIES).map((story) => (
        <Link
          key={story.slug}
          to={`/category/${story.slug}`}
          className="cat-preview-card"
          style={{ borderTopColor: story.color }}
        >
          <div className="cat-card-label">
            <span className="cat-card-dot" style={{ background: story.color }} />
            <span className="cat-card-name">{story.categoryKey} Pressure</span>
          </div>
          <div className="cat-card-tagline">{CATEGORY_TAGLINES[story.slug]}</div>
          <span className="cat-card-arrow">Read the story →</span>
        </Link>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

// The historical context paragraph — stored as a string so [^N] markers are
// processed by InlineText at render time.
const HIST_PARA =
  "Prison systems have been abundantly funded throughout history. An exemplar " +
  "piece of legislation is The 1994 Crime Bill, which provided $12.5 billion in " +
  "grants to fund the construction and expansion of correctional facilities[^1]. " +
  "Yet even with the extensive funding, prisons bearing poor conditions did not " +
  "receive any kind of treatment or repair. A prominent example is St. Clair, " +
  "built in 1983 and notorious for having some of the worst kinds of environments " +
  "for life behind bars[^2]. The reason for this is because the Crime Bill focused " +
  "on expanding prisons, not repairing their problems. It overlapped with the " +
  "tough-on-crime era when people were being incarcerated en masse for the smallest " +
  "of offenses, fueling a prison construction boom. Indeed, half of the Crime Bill's " +
  "funding was earmarked for \u201ctruth-in-sentencing\u201d incentives, rewarding states " +
  "that abolished parole and maintained the prison population high.";

export default function MainPage() {
  const [openFnId, setOpenFnId] = useState(null);
  const [bibOpen, setBibOpen]     = useState(false);
  const handleFootnote = useCallback(
    (id) => setOpenFnId((prev) => (prev === id ? null : id)),
    [],
  );

  return (
    <div className="main-page">

      {/* ── Sticky top nav ── */}
      <nav className="main-nav">
        <span className="main-nav-title">The Geography of Prison Conditions</span>
        <div className="main-nav-actions">
          <button
            type="button"
            className="main-nav-bib"
            onClick={() => setBibOpen(true)}
          >
            Bibliography
          </button>
          <Link to="/map" className="btn-enter-map btn-sm">
            Enter the Map →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="main-hero">
        <span className="hero-eyebrow">Interactive Investigation</span>
        <h1 className="hero-title">The Geography of<br />Prison Conditions</h1>
        <p className="hero-subtitle">
          Funding, overcrowding, staffing, and infrastructure
          across U.S. state prison systems.
        </p>
        <div className="hero-actions">
          <Link to="/map" className="btn-enter-map">Enter the Map</Link>
          <Link to="/category/severe" className="hero-secondary-link">
            View category stories
          </Link>
          <button
            type="button"
            className="hero-secondary-link hero-bib-btn"
            onClick={() => setBibOpen(true)}
          >
            Bibliography
          </button>
        </div>
      </section>

      {/* ── Article body ── */}
      <div className="main-body">

        {/* 1 — Mission Statement */}
        <section className="main-section">
          <span className="section-label">Mission Statement</span>
          <blockquote className="mission-pull">
            <p>
              This project investigates how state prison funding, overcrowding,
              staffing, and infrastructure shape prison conditions across the United
              States. Our mission is to argue for intentional federal funding that
              repairs existing prison systems instead of expanding them.
            </p>
          </blockquote>
        </section>

        <div className="main-section-divider" />

        {/* 2 — Historical Context */}
        <section className="main-section">
          <span className="section-label">Historical Context — Prison Funding</span>
          <p className="main-para">
            The federal government has funded criminal justice before, but much of
            that funding rewarded prison construction, longer sentences, and
            expansion. This project asks what it would look like if federal funding
            were redirected toward repair, oversight, staffing, health, and minimum
            conditions instead.
          </p>
          <p className="main-para">
            <InlineText text={HIST_PARA} onFootnote={handleFootnote} />
          </p>
          <div className="proposal-callout">
            <p>
              The proposal of our initiative is not simply to increase prison
              budgets. It is to create conditional federal support tied to minimum
              living standards, independent oversight, staffing stability, medical
              care, infrastructure repair, and reductions in overcrowding.
            </p>
          </div>
        </section>

        <div className="main-section-divider" />

        {/* 3 — Interactive Map */}
        <section className="main-section">
          <span className="section-label">Interactive Map</span>
          <p className="main-para">
            The map does not claim to measure every aspect of prison life, and is
            not a comprehensive summary of prison conditions across states. Instead,
            it uses four structural indicators to identify patterns of pressure:
            incarceration rate, officer salary, per-prisoner spending, and occupancy.
          </p>
          <p className="main-para">
            States in the map are sorted into one of <strong>four</strong> categories:
            Severe Pressure, High Pressure, Moderate Pressure, and Lower Pressure.
          </p>
          <CategoryCards />
        </section>

      </div>

      {/* ── Bottom CTA ── */}
      <div className="main-cta-bottom">
        <span className="main-cta-label">Explore the Data</span>
        <h2 className="main-cta-title">Enter the Interactive Map</h2>
        <p className="main-cta-sub">
          Click any state to open its data dossier. Select a category in the legend
          to read the full story.
        </p>
        <Link to="/map" className="btn-enter-map">Enter the Map →</Link>
      </div>

      {/* ── Footnote panel ── */}
      <FootnotePanel
        fnId={openFnId}
        footnotes={MAIN_FOOTNOTES}
        onClose={() => setOpenFnId(null)}
      />

      {bibOpen && (
        <BibliographyModal onClose={() => setBibOpen(false)} />
      )}

    </div>
  );
}
