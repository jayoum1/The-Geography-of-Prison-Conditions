import { STORIES } from "../data/stories.js";
import { CATEGORY_COLORS } from "../data/categories.js";

const ORDER = ["Mississippi", "Arkansas", "Nebraska", "Connecticut", "California"];

export default function StoriesSection({ states, setSelectedState }) {
  const stateByName = new Map(states.map((s) => [s.state, s]));

  return (
    <section className="section" id="stories">
      <div className="ed-label">Section IV · Case Studies</div>
      <h2>Stories behind the numbers</h2>
      <p className="section-sub">
        Statistics describe structural pressure; they cannot describe what
        that pressure produces inside a facility. These five states connect
        the data to documented prison-condition failures, investigative
        reporting, and oversight findings.
      </p>

      <div className="stories-grid">
        {ORDER.map((name) => {
          const story = STORIES[name];
          const state = stateByName.get(name);
          const cat   = state?.pressureCategory || "Uncategorized";
          const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Uncategorized;

          return (
            <article
              key={name}
              className="story-card"
              /* Left border carries the category color — editorial sidebar treatment */
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div className="story-inner">
                <span className="state-tag">{name} · {cat} pressure</span>

                {/* Serif headline = the central argument this case illustrates */}
                <h3>{story.theme}</h3>
                <div className="card-theme">{story.state}</div>

                <p>{story.summary}</p>

                <div className="matters">
                  <strong>Why it matters:</strong> {story.matters}
                </div>

                <div className="story-actions">
                  <button
                    className="panel-btn"
                    onClick={() => state && setSelectedState(state)}
                    disabled={!state}
                  >
                    Open in analysis
                  </button>
                  <a
                    className="source-link"
                    href={story.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source report ↗
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
