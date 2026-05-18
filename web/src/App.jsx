import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage          from "./views/MainPage.jsx";
import MapView           from "./views/MapView.jsx";
import CategoryStoryPage from "./views/CategoryStoryPage.jsx";

export default function App() {
  const base = import.meta.env.BASE_URL ?? '/';
  const basename =
    base === '/' ? undefined : base.replace(/\/+$/, '');

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Landing page */}
        <Route path="/"                element={<MainPage />} />
        {/* Interactive map */}
        <Route path="/map"             element={<MapView />} />
        {/* Category narrative pages */}
        <Route path="/category/:slug"  element={<CategoryStoryPage />} />
        {/* Catch-all → main page */}
        <Route path="*"                element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
