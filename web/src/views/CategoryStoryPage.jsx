import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { CATEGORY_STORIES }  from "../data/categoryStories.js";
import { NARRATIVE_CONTENT } from "../data/narrativeContent.js";

// ─────────────────────────────────────────────────────────────────────────────
// INLINE TEXT RENDERER — **bold** and [^N] footnote markers
// ─────────────────────────────────────────────────────────────────────────────

function InlineText({ text, onFootnote }) {
  const parts = [];
  const pattern = /\*\*(.*?)\*\*|\[\^(\w+)\]/g;
  let last = 0;
  let key = 0;
  let m;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
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

// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE — single-column article body
// ─────────────────────────────────────────────────────────────────────────────

function NarrativeBody({ content, onFootnote }) {
  if (!content) return null;

  return (
    <div className="story-narrative">
      {content.articleTitle && (
        <h2 className="narrative-article-title">{content.articleTitle}</h2>
      )}

      {content.paragraphs.map((para, i) => (
        <p key={i} className="narrative-para">
          <InlineText text={para} onFootnote={onFootnote} />
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTNOTE PANEL
// ─────────────────────────────────────────────────────────────────────────────

function FootnotePanel({ fnId, footnotes, onClose }) {
  const isOpen = fnId !== null;
  const fn = fnId !== null ? footnotes?.[fnId] : null;

  return (
    <aside
      className={`footnote-panel${isOpen ? " open" : ""}`}
      aria-label="Source note"
    >
      <div className="fn-panel-header">
        <div className="fn-panel-header-text">
          <span className="fn-panel-eyebrow">Source Note</span>
          <div className="fn-panel-num">
            {fnId !== null ? `Footnote ${fnId}` : ""}
          </div>
        </div>
        <button
          className="fn-panel-close"
          onClick={onClose}
          aria-label="Close footnote"
        >
          ×
        </button>
      </div>

      <div className="fn-panel-body">
        {fn ? (
          <>
            <p className="fn-panel-text">{fn.text}</p>
            {fn.url && (
              <a
                className="fn-panel-link"
                href={fn.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fn.url}
              </a>
            )}
          </>
        ) : (
          <p className="fn-panel-text fn-panel-placeholder">
            [Source details to be added here.]
          </p>
        )}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CategoryStoryPage() {
  const { slug } = useParams();
  const story   = CATEGORY_STORIES[slug];
  const content = NARRATIVE_CONTENT[slug];

  const [openFnId, setOpenFnId] = useState(null);

  const handleFootnote = useCallback((fnId) => {
    setOpenFnId((prev) => (prev === fnId ? null : fnId));
  }, []);

  if (!story) {
    return (
      <div className="story-page">
        <nav className="story-page-nav">
          <Link to="/map" className="back-to-map">← Back to Map</Link>
        </nav>
        <div className="story-page-not-found">
          Category not found. <Link to="/map">Return to map.</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="story-page">

      <nav className="story-page-nav">
        <Link to="/map" className="back-to-map">← Back to Map</Link>
        <span className="story-page-nav-label">Category Story</span>
      </nav>

      <header
        className="story-hero"
        style={{ borderLeftColor: story.color }}
      >
        <div className="story-hero-inner">
          <span className="story-hero-eyebrow" style={{ color: story.color }}>
            Category Story · {story.categoryKey} Pressure
          </span>
          <h1 className="story-hero-title">{story.title}</h1>
          <p className="story-hero-subtitle">{story.subtitle}</p>
          <div className="story-hero-meta">
            <span className="story-hero-meta-label">
              Representative state{story.representativeStates.length > 1 ? "s" : ""}:
            </span>
            {" "}{story.representativeStates.join(" & ")}
          </div>
          <blockquote className="story-hero-description">
            {story.description}
          </blockquote>
          <div className="story-hero-theme">
            <span className="story-hero-theme-label">Key theme — </span>
            {story.keyTheme}
          </div>
        </div>
      </header>

      <article className="story-body-wrap">
        <NarrativeBody content={content} onFootnote={handleFootnote} />
      </article>

      <footer className="story-page-footer">
        <Link to="/map" className="back-to-map">← Return to Map</Link>
      </footer>

      <FootnotePanel
        fnId={openFnId}
        footnotes={content?.footnotes}
        onClose={() => setOpenFnId(null)}
      />

    </div>
  );
}
