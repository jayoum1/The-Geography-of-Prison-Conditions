import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import bibliographyMd from "../data/bibliography.md?raw";

function onBackdrop(e, onClose) {
  if (e.target === e.currentTarget) onClose();
}

const mdLink = ({ children, href, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
);

export default function BibliographyModal({ onClose }) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => onBackdrop(e, onClose)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bib-modal-title"
    >
      <div className="modal-panel bib-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">Sources &amp; References</span>
            <h2 id="bib-modal-title" className="modal-title">Bibliography</h2>
            <p className="modal-sub bib-modal-sub">
              Works cited for this investigation. Links open in a new tab.
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close bibliography">
            ×
          </button>
        </div>

        <div className="modal-body bib-modal-body method-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ a: mdLink }}
          >
            {bibliographyMd.trim()}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
