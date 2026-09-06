import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function MarketAnalysis() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [business, setBusiness] = useState("Business");
  const [location, setLocation] = useState("Your Location");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    const savedAnalysis =
      JSON.parse(localStorage.getItem("grambizAnalysis")) || {};

    const savedRecommendations =
      JSON.parse(localStorage.getItem("grambizRecommendations")) || [];

    setAnalysis(savedAnalysis);

    if (savedUser.business) {
      setBusiness(savedUser.business);
    } else if (savedRecommendations.length > 0) {
      setBusiness(savedRecommendations[0].name);
    }

    const userLocation = [
      savedUser.village,
      savedUser.district,
      savedUser.state
    ]
      .filter(Boolean)
      .join(", ");

    if (userLocation) {
      setLocation(userLocation);
    }
  }, []);

  /* =============================
     HELPER FUNCTIONS
  ============================= */

  const getDisplayValue = (value, fallback = "Not Available") => {
    if (!value) return fallback;

    const formatted = String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

    return formatted;
  };

  const getOpportunity = () => {
    const demand = String(
      analysis?.local_demand || ""
    ).toLowerCase();

    const competition = String(
      analysis?.local_competition || ""
    ).toLowerCase();

    if (demand === "high" && competition === "low") {
      return "Excellent";
    }

    if (demand === "high" && competition === "medium") {
      return "Good";
    }

    if (demand === "medium" && competition === "low") {
      return "Good";
    }

    if (demand === "high") {
      return "Moderate";
    }

    return "Needs Validation";
  };

  const getRisk = () => {
    const competition = String(
      analysis?.local_competition || ""
    ).toLowerCase();

    const demand = String(
      analysis?.local_demand || ""
    ).toLowerCase();

    if (competition === "high" && demand !== "high") {
      return "High";
    }

    if (competition === "high") {
      return "Medium-High";
    }

    if (competition === "medium") {
      return "Medium";
    }

    if (competition === "low") {
      return "Low";
    }

    return "Needs Validation";
  };

  /* =============================
     BACKEND LOCAL MARKET DATA
  ============================= */

  const marketFactors = [
    {
      icon: "📈",
      title: text.localDemand || "Local Demand",
      value: getDisplayValue(
        analysis?.local_demand,
        "Not Available"
      ),
      description:
        analysis?.local_demand
          ? `The available local market data indicates ${analysis.local_demand.toLowerCase()} demand for ${business}.`
          : "Local demand data is not available. Validate customer demand in your area before starting."
    },

    {
      icon: "🏪",
      title: text.competition || "Competition",
      value: getDisplayValue(
        analysis?.local_competition,
        "Not Available"
      ),
      description:
        analysis?.local_competition
          ? `Competition in the available local market data is ${analysis.local_competition.toLowerCase()}.`
          : "Check nearby businesses, their prices, products and services before starting."
    },

    {
      icon: "🚀",
      title: text.opportunity || "Opportunity",
      value: getOpportunity(),
      description:
        "Opportunity is estimated by considering local demand and competition. It is a decision-support indicator, not a guarantee of success."
    },

    {
      icon: "⚠️",
      title: text.riskLevel || "Risk Level",
      value: getRisk(),
      description:
        "Risk is an indicative assessment based mainly on local demand and competition. Actual business risk may vary with costs, pricing and execution."
    },

    {
      icon: "🚚",
      title: "Transportation",
      value: getDisplayValue(
        analysis?.transportation,
        "Not Available"
      ),
      description:
        analysis?.transportation
          ? `Transportation availability is recorded as ${analysis.transportation.toLowerCase()} in the available local data.`
          : "Check road connectivity, delivery options and transportation costs in your area."
    },

    {
      icon: "📦",
      title: "Raw Material Availability",
      value: getDisplayValue(
        analysis?.raw_material_availability,
        "Not Available"
      ),
      description:
        analysis?.raw_material_availability
          ? `Raw material availability is recorded as ${analysis.raw_material_availability.toLowerCase()} in the available local data.`
          : "Check whether required raw materials are available locally and at reasonable cost."
    },

    {
      icon: "🌦️",
      title: "Seasonal Demand",
      value: getDisplayValue(
        analysis?.seasonal_demand,
        "Not Available"
      ),
      description:
        analysis?.seasonal_demand
          ? `The available data indicates ${analysis.seasonal_demand.toLowerCase()} seasonal variation.`
          : "Consider seasonal changes in customer demand before making investment decisions."
    },

    {
      icon: "💰",
      title: text.pricingGuidance || "Pricing Guidance",
      value:
        text.localValidationRequired ||
        "Local Validation Required",
      description:
        text.pricingDescription ||
        "Compare prices from nearby businesses and consider local customer affordability before finalizing your price."
    }
  ];

  return (
    <div className="market-page">

      {/* =============================
          HEADER
      ============================= */}

      <div className="market-header">

        <div className="market-icon">
          📊
        </div>

        <div className="market-badge">
          📍 Hyper-Local Market Insights
        </div>

        <h1>
          {text.marketAnalysisTitle || "Market Analysis"}
        </h1>

        <p>
          {text.marketAnalysisDescription ||
            "Analyze important local market factors before starting your business."}
        </p>

        <div className="business-highlight">

          <span>
            Business Being Analysed
          </span>

          <strong>
            {business}
          </strong>

        </div>

        <div className="business-highlight">

          <span>
            📍 Location
          </span>

          <strong>
            {location}
          </strong>

        </div>

      </div>


      {/* =============================
          MARKET SCORE
      ============================= */}

      <div className="market-score-card">

        <div className="market-score-icon">
          🎯
        </div>

        <div>

          <span className="market-score-label">
            Hyper-Local Market Score
          </span>

          <div className="market-score-value">
            {analysis?.local_market_score ?? "—"}
            {analysis?.local_market_score !== undefined &&
              "/100"}
          </div>

          <p>
            This score combines local demand, competition,
            transportation, raw material availability and
            seasonal factors.
          </p>

        </div>

      </div>


      {/* =============================
          DATA STATUS
      ============================= */}

      <div className="market-data-status">

        <span>
          {analysis?.market_data_status ===
          "Default estimate"
            ? "ℹ️"
            : "✅"}
        </span>

        <div>

          <strong>
            Market Data Status
          </strong>

          <p>
            {analysis?.market_data_status ||
              "Analysis data loaded from GramBiz AI."}
          </p>

        </div>

      </div>


      {/* =============================
          MARKET FACTORS
      ============================= */}

      <div className="market-grid">

        {marketFactors.map((factor) => (

          <div
            className="market-card"
            key={factor.title}
          >

            <div className="market-card-top">

              <div className="market-card-icon">
                {factor.icon}
              </div>

              <div className="market-card-label">
                Local Factor
              </div>

            </div>

            <h3>
              {factor.title}
            </h3>

            <div className="market-value">
              {factor.value}
            </div>

            <p>
              {factor.description}
            </p>

          </div>

        ))}

      </div>


      {/* =============================
          AI RECOMMENDATION EXPLANATION
      ============================= */}

      {analysis?.recommendation_explanation && (

        <div className="market-note">

          <span>
            🤖
          </span>

          <div>

            <strong>
              Why This Business Was Recommended
            </strong>

            <p>
              {analysis.recommendation_explanation}
            </p>

          </div>

        </div>

      )}


      {/* =============================
          MARKET VALIDATION
      ============================= */}

      <div className="market-note">

        <span>
          ℹ️
        </span>

        <div>

          <strong>
            Important Market Validation
          </strong>

          <p>
            {text.marketNote ||
              "Use this analysis as decision support. Before investing, validate customer demand, competitor pricing, raw material costs and transportation conditions locally."}
          </p>

        </div>

      </div>


      {/* =============================
          DISCLAIMER
      ============================= */}

      <div className="market-note">

        <span>
          ⚠️
        </span>

        <div>

          <strong>
            Decision-Support Disclaimer
          </strong>

          <p>
            {analysis?.disclaimer ||
              "Market insights are estimates based on available data and are not guarantees of business success, demand, profit or income."}
          </p>

        </div>

      </div>


      {/* =============================
          CONTINUE
      ============================= */}

      <button
        className="market-button"
        onClick={() =>
          navigate("/financial-plan")
        }
      >

        {text.viewFinancialPlan ||
          "View Financial Plan"}

        <span>
          →
        </span>

      </button>

    </div>
  );
}

export default MarketAnalysis;