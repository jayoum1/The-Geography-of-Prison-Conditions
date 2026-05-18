import { useEffect, useState } from "react";
import SiteHeader   from "../components/SiteHeader.jsx";
import MapFrame     from "../components/MapFrame.jsx";
import StateDossier from "../components/StateDossier.jsx";
import StatsModal   from "../components/StatsModal.jsx";
import MethodModal  from "../components/MethodModal.jsx";
import { loadAllData } from "../data/loadData.js";

export default function MapView() {
  const [states, setStates]                   = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [metricKey, setMetricKey]             = useState("pressureCategory");
  const [selectedState, setSelectedState]     = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [statsOpen, setStatsOpen]             = useState(false);
  const [methodOpen, setMethodOpen]           = useState(false);

  useEffect(() => {
    loadAllData()
      .then(({ states }) => setStates(states))
      .catch((e) => { console.error(e); setError(String(e)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading data…</div>;
  if (error)   return <div className="page-loading error">Error: {error}</div>;

  // Switching metrics clears any active category selection.
  function handleSetMetricKey(key) {
    setMetricKey(key);
    if (key !== "pressureCategory") setSelectedCategory(null);
  }

  // Clicking a chart item closes the stats modal and opens the state dossier.
  function handleStateFromModal(state) {
    setSelectedState(state);
    setStatsOpen(false);
  }

  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="map-stage">
        <MapFrame
          states={states}
          metricKey={metricKey}
          setMetricKey={handleSetMetricKey}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onStatsOpen={() => setStatsOpen(true)}
          onMethodOpen={() => setMethodOpen(true)}
        />
      </main>

      {/* State dossier — slides in from the right */}
      <StateDossier
        state={selectedState}
        metricKey={metricKey}
        onClose={() => setSelectedState(null)}
      />

      {/* Statistics overlay modal */}
      {statsOpen && (
        <StatsModal
          states={states}
          metricKey={metricKey}
          setSelectedState={handleStateFromModal}
          onClose={() => setStatsOpen(false)}
        />
      )}

      {/* Methodology overlay modal */}
      {methodOpen && (
        <MethodModal onClose={() => setMethodOpen(false)} />
      )}
    </div>
  );
}
