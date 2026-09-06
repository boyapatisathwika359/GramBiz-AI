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

  const marketFactors = [
    {
      icon: "📈",
      title: text.localDemand,
      value: text.high || "High",
      description:
        text.demandDescription ||
        "Demand appears promising based on the available business information."
    },
    {
      icon: "🏪",
      title: text.competition,
      value: text.medium || "Medium",
      description:
        text.competitionDescription ||
        "Competition should be checked with local shops and service providers."
    },
    {
      icon: "🚀",
      title: text.opportunity,
      value: text.good || "Good",
      description:
        text.opportunityDescription ||
        "There may be an opportunity if pricing, quality and customer demand are suitable."
    },
    {
      icon: "⚠️",
      title: text.riskLevel,
      value: text.medium || "Medium",
      description:
        text.riskDescription ||
        "Consider demand changes, competition, costs and available resources."
    },
    {
      icon: "💰",
      title: text.pricingGuidance,
      value: text.localValidationRequired || "Local Validation Required",
      description:
        text.pricingDescription ||
        "Compare prices from nearby businesses before finalizing your selling price."
    }
  ];

  return (
    <div className="market-page">

      {/* Header */}
      <div className="market-header">

        <div className="market-icon">
          📊
        </div>

        <div className="market-badge">
          📍 Hyper-Local Market Insights
        </div>

        <h1>{text.marketAnalysisTitle}</h1>

        <p>{text.marketAnalysisDescription}</p>

        <div className="business-highlight">
          <span>Business Being Analysed</span>
          <strong>{business}</strong>
        </div>

      </div>

      {/* Market Factors */}
      <div className="market-grid">

        {marketFactors.map((factor) => (
          <div className="market-card" key={factor.title}>

            <div className="market-card-top">
              <div className="market-card-icon">
                {factor.icon}
              </div>

              <div className="market-card-label">
                Local Factor
              </div>
            </div>

            <h3>{factor.title}</h3>

            <div className="market-value">
              {factor.value}
            </div>

            <p>{factor.description}</p>

          </div>
        ))}

      </div>

      {/* Validation Note */}
      <div className="market-note">

        <span>ℹ️</span>

        <div>
          <strong>Important Market Validation</strong>

          <p>{text.marketNote}</p>
        </div>

      </div>

      {/* Continue */}
      <button
        className="market-button"
        onClick={() => navigate("/financial-plan")}
      >
        {text.viewFinancialPlan}
        <span> →</span>
      </button>

    </div>
  );
}

export default MarketAnalysis;