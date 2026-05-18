import { Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-left">
          <Link to="/" className="site-header-overview">← Overview</Link>
          <span className="site-header-divider" />
          <span className="site-header-eyebrow">Interactive Investigation</span>
          <h1>The Geography of Prison Conditions</h1>
        </div>
        <span className="site-header-meta">U.S. State-Level Data · 2023</span>
      </div>
    </header>
  );
}
