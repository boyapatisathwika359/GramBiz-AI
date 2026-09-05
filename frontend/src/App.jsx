import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";
import Skills from "./pages/Skills";
import Analysis from "./pages/Analysis";
import Recommendations from "./pages/Recommendations";
import MarketAnalysis from "./pages/MarketAnalysis";
import FinancialPlan from "./pages/FinancialPlan";
import FinalReport from "./pages/FinalReport";
import Schemes from "./pages/Schemes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/user-details"
          element={<UserDetails />}
        />

        <Route
          path="/skills"
          element={<Skills />}
        />

        <Route
          path="/analysis"
          element={<Analysis />}
        />

        <Route
          path="/recommendations"
          element={<Recommendations />}
        />

        <Route
          path="/market-analysis"
          element={<MarketAnalysis />}
        />

        <Route
          path="/financial-plan"
          element={<FinancialPlan />}
        />

        <Route
          path="/schemes"
          element={<Schemes />}
        />

        <Route
          path="/final-report"
          element={<FinalReport />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;