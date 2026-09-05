import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function MarketAnalysis() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [business, setBusiness] = useState("Business");

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    const savedRecommendations =
      JSON.parse(localStorage.getItem("grambizRecommendations")) || [];

    if (savedUser.business) {
      setBusiness(savedUser.business);
    } else if (savedRecommendations.length > 0) {
      setBusiness(savedRecommendations[0].name);
    }
  }, []);

  return (
    <div className="market-page">

      {/* ================= HEADER ================= */}

      <div className="market-header">

        <div className="market-icon">
          📊
        </div>

        <h1>
          {text.marketAnalysisTitle}
        </h1>

        <p>
          {text.marketAnalysisDescription}
        </p>

        <h2>
          {business}
        </h2>

      </div>


      {/* ================= MARKET CARDS ================= */}

      <div className="market-grid">

        {/* LOCAL DEMAND */}

        <div className="market-card">

          <div className="market-card-icon">
            📈
          </div>

          <h3>
            {text.localDemand}
          </h3>

          <div className="market-value">
            {text.high || "High"}
          </div>

          <p>
            {text.demandDescription ||
              "Demand appears promising based on the available business information."}
          </p>

        </div>


        {/* COMPETITION */}

        <div className="market-card">

          <div className="market-card-icon">
            🏪
          </div>

          <h3>
            {text.competition}
          </h3>

          <div className="market-value">
            {text.medium || "Medium"}
          </div>

          <p>
            {text.competitionDescription ||
              "Competition should be checked with local shops and service providers."}
          </p>

        </div>


        {/* OPPORTUNITY */}

        <div className="market-card">

          <div className="market-card-icon">
            🚀
          </div>

          <h3>
            {text.opportunity}
          </h3>

          <div className="market-value">
            {text.good || "Good"}
          </div>

          <p>
            {text.opportunityDescription ||
              "There may be an opportunity if pricing, quality and customer demand are suitable."}
          </p>

        </div>


        {/* RISK LEVEL */}

        <div className="market-card">

          <div className="market-card-icon">
            ⚠️
          </div>

          <h3>
            {text.riskLevel}
          </h3>

          <div className="market-value">
            {text.medium || "Medium"}
          </div>

          <p>
            {text.riskDescription ||
              "Consider demand changes, competition, costs and available resources."}
          </p>

        </div>


        {/* PRICING GUIDANCE */}

        <div className="market-card pricing-card">

          <div className="market-card-icon">
            💰
          </div>

          <h3>
            {text.pricingGuidance}
          </h3>

          <div className="market-value">
            {text.localValidationRequired ||
              "Local Validation Required"}
          </div>

          <p>
            {text.pricingDescription ||
              "Compare prices from nearby businesses before finalizing your selling price."}
          </p>

        </div>

      </div>


      {/* ================= IMPORTANT NOTE ================= */}

      <div className="market-note">

        <strong>ℹ️</strong>{" "}

        {text.marketNote}

      </div>


      {/* ================= CONTINUE BUTTON ================= */}

      <button
        className="continue-button"
        onClick={() => navigate("/financial-plan")}
      >
        {text.viewFinancialPlan}
      </button>

    </div>
  );
}

export default MarketAnalysis;