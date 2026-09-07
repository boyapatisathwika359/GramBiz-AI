import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API from "../api";

function MarketAnalysis() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [business, setBusiness] = useState("Business");
  const [location, setLocation] = useState("Your Location");
  const [analysis, setAnalysis] = useState(null);
  const [marketFactorsData, setMarketFactorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD USER DATA + ANALYSIS + MARKET FACTORS
  ========================================================= */

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        setError("");

        const savedUser =
          JSON.parse(localStorage.getItem("grambizUser")) || {};

        const savedAnalysis =
          JSON.parse(localStorage.getItem("grambizAnalysis")) || {};

        const savedRecommendations =
          JSON.parse(
            localStorage.getItem("grambizRecommendations")
          ) || [];

        setAnalysis(savedAnalysis);

        /* -----------------------------
           BUSINESS
        ----------------------------- */

        if (savedUser.business) {
          setBusiness(savedUser.business);
        } else if (savedRecommendations.length > 0) {
          setBusiness(savedRecommendations[0].name);
        } else if (savedAnalysis.recommendation) {
          setBusiness(savedAnalysis.recommendation);
        }

        /* -----------------------------
           LOCATION
        ----------------------------- */

        const userLocation = [
          savedUser.village,
          savedUser.district,
          savedUser.state,
        ]
          .filter(Boolean)
          .join(", ");

        if (userLocation) {
          setLocation(userLocation);
        }

        /* -----------------------------
           FETCH MARKET FACTORS
        ----------------------------- */

        const response = await API.get("/api/market-factors");

        console.log(
          "================================="
        );
        console.log(
          "GRAMBIZ AI - MARKET FACTORS"
        );
        console.log(
          "================================="
        );
        console.log("MARKET FACTORS:", response.data);

        /*
          Backend currently returns the market-factor
          framework from GramBiz_Member1_Data.xlsx.

          Example:
          Local Population
          Customer Demand
          Existing Businesses
          Local Prices
          Raw Material Availability
          Transportation
          Local Resources
          Seasonal Demand
        */

        if (Array.isArray(response.data)) {
          setMarketFactorsData(response.data);
        } else if (
          Array.isArray(response.data?.market_factors)
        ) {
          setMarketFactorsData(
            response.data.market_factors
          );
        } else {
          setMarketFactorsData([]);
        }
      } catch (err) {
        console.error(
          "GRAMBIZ AI - MARKET DATA ERROR:",
          err
        );

        setError(
          "Market factor data could not be loaded from the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, []);

  /* =========================================================
     HELPER FUNCTIONS
  ========================================================= */

  const getDisplayValue = (
    value,
    fallback = "Not Available"
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return fallback;
    }

    const formatted = String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

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

    if (
      demand === "high" &&
      competition === "medium"
    ) {
      return "Good";
    }

    if (
      demand === "medium" &&
      competition === "low"
    ) {
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

    if (
      competition === "high" &&
      demand !== "high"
    ) {
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

  /* =========================================================
     MARKET FACTOR ICONS
  ========================================================= */

  const getFactorIcon = (factorName) => {
    const name = String(
      factorName || ""
    ).toLowerCase();

    if (name.includes("population")) {
      return "👥";
    }

    if (name.includes("demand")) {
      return "📈";
    }

    if (
      name.includes("business") ||
      name.includes("competition")
    ) {
      return "🏪";
    }

    if (name.includes("price")) {
      return "💰";
    }

    if (
      name.includes("raw material") ||
      name.includes("material")
    ) {
      return "📦";
    }

    if (
      name.includes("transport")
    ) {
      return "🚚";
    }

    if (name.includes("resource")) {
      return "🌾";
    }

    if (name.includes("season")) {
      return "🌦️";
    }

    return "📊";
  };

  /* =========================================================
     CREATE MARKET FACTOR CARDS
  ========================================================= */

  const backendFactorCards =
    marketFactorsData.map((factor, index) => {
      const factorName =
        factor.factor ||
        factor.name ||
        factor.title ||
        factor["Factor"] ||
        `Market Factor ${index + 1}`;

      const whatWeCheck =
        factor.what_we_check ||
        factor["What We Check"] ||
        factor.description ||
        "";

      const example =
        factor.example ||
        factor["Example"] ||
        "";

      const whyImportant =
        factor.why_important ||
        factor["Why Important"] ||
        "";

      const dataSource =
        factor.data_source ||
        factor["Data Source"] ||
        "";

      return {
        icon: getFactorIcon(factorName),
        title: factorName,
        value: "Framework Available",
        description:
          whatWeCheck ||
          "This factor is considered when evaluating a local business opportunity.",
        example,
        whyImportant,
        dataSource,
      };
    });

  /* =========================================================
     EXISTING ANALYSIS CARDS
  ========================================================= */

  const analysisCards = [
    {
      icon: "📈",
      title:
        text.localDemand || "Local Demand",
      value: getDisplayValue(
        analysis?.local_demand,
        "Not Available"
      ),
      description: analysis?.local_demand
        ? `The available analysis indicates ${String(
            analysis.local_demand
          ).toLowerCase()} demand for ${business}.`
        : "Local demand data is not currently available for this exact location. Validate customer demand before investing.",
    },

    {
      icon: "🏪",
      title:
        text.competition || "Competition",
      value: getDisplayValue(
        analysis?.local_competition,
        "Not Available"
      ),
      description: analysis?.local_competition
        ? `The available analysis indicates ${String(
            analysis.local_competition
          ).toLowerCase()} competition.`
        : "Competition data for the exact locality is not currently available. Check nearby businesses and their prices.",
    },

    {
      icon: "🚀",
      title:
        text.opportunity || "Opportunity",
      value: getOpportunity(),
      description:
        "Opportunity is an indicative decision-support measure based on available demand and competition information.",
    },

    {
      icon: "⚠️",
      title:
        text.riskLevel || "Risk Level",
      value: getRisk(),
      description:
        "Risk is an indicative assessment. Actual business risk depends on costs, pricing, competition, demand and execution.",
    },

    {
      icon: "🚚",
      title: "Transportation",
      value: getDisplayValue(
        analysis?.transportation,
        "Not Available"
      ),
      description: analysis?.transportation
        ? `Transportation availability is recorded as ${String(
            analysis.transportation
          ).toLowerCase()}.`
        : "Check road connectivity, delivery options and transportation costs in your area.",
    },

    {
      icon: "📦",
      title:
        "Raw Material Availability",
      value: getDisplayValue(
        analysis?.raw_material_availability,
        "Not Available"
      ),
      description:
        analysis?.raw_material_availability
          ? `Raw material availability is recorded as ${String(
              analysis.raw_material_availability
            ).toLowerCase()}.`
          : "Check whether required raw materials are available locally and at reasonable cost.",
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
          ? `The available analysis indicates ${String(
              analysis.seasonal_demand
            ).toLowerCase()} seasonal variation.`
          : "Consider seasonal changes in customer demand before making investment decisions.",
    },

    {
      icon: "💰",
      title:
        text.pricingGuidance ||
        "Pricing Guidance",
      value:
        text.localValidationRequired ||
        "Local Validation Required",
      description:
        text.pricingDescription ||
        "Compare prices from nearby businesses and consider customer affordability before finalizing your price.",
    },
  ];

  /* =========================================================
     DATA COVERAGE
  ========================================================= */

  const dataCoverage = [
    {
      icon: "👥",
      title: "Population",
      status: "Framework Available",
    },
    {
      icon: "📈",
      title: "Customer Demand",
      status: "Local Validation Required",
    },
    {
      icon: "🏪",
      title: "Existing Businesses",
      status: "Local Validation Required",
    },
    {
      icon: "💰",
      title: "Local Prices",
      status: "Local Validation Required",
    },
    {
      icon: "📦",
      title: "Raw Materials",
      status: "Framework Available",
    },
    {
      icon: "🚚",
      title: "Transportation",
      status: "Framework Available",
    },
    {
      icon: "🌾",
      title: "Local Resources",
      status: "User Input Available",
    },
    {
      icon: "🌦️",
      title: "Seasonal Demand",
      status: "Local Validation Required",
    },
  ];

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="market-page">
        <div className="market-header">
          <div className="market-icon">
            📊
          </div>

          <div className="market-badge">
            📍 Hyper-Local Market Insights
          </div>

          <h1>
            {text.marketAnalysisTitle ||
              "Market Analysis"}
          </h1>

          <p>
            Loading market information from
            GramBiz AI...
          </p>
        </div>

        <div className="market-data-status">
          <span>⏳</span>

          <div>
            <strong>
              Loading Market Data
            </strong>

            <p>
              Please wait while GramBiz AI
              retrieves the available market
              factors.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="market-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="market-header">

        <div className="market-icon">
          📊
        </div>

        <div className="market-badge">
          📍 Hyper-Local Market Insights
        </div>

        <h1>
          {text.marketAnalysisTitle ||
            "Market Analysis"}
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


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="market-note">
          <span>⚠️</span>

          <div>
            <strong>
              Market Data Connection Issue
            </strong>

            <p>
              {error}
            </p>

            <p>
              The page will continue using
              available analysis information.
            </p>
          </div>
        </div>
      )}


      {/* =====================================================
          MARKET SCORE
      ===================================================== */}

      <div className="market-score-card">

        <div className="market-score-icon">
          🎯
        </div>

        <div>

          <span className="market-score-label">
            Hyper-Local Market Score
          </span>

          <div className="market-score-value">

            {analysis?.local_market_score ??
              "—"}

            {analysis?.local_market_score !==
              undefined &&
              "/100"}

          </div>

          <p>
            This score is based on available
            market information. It should be
            treated as a decision-support
            indicator, not a guarantee.
          </p>

        </div>

      </div>


      {/* =====================================================
          DATA STATUS
      ===================================================== */}

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
              "Market-factor framework loaded from GramBiz AI backend."}
          </p>

        </div>

      </div>


      {/* =====================================================
          CURRENT BUSINESS ANALYSIS
      ===================================================== */}

      <div className="market-section-title">

        <h2>
          📍 Current Business Analysis
        </h2>

        <p>
          Available indicators for the
          selected business.
        </p>

      </div>

      <div className="market-grid">

        {analysisCards.map((factor) => (

          <div
            className="market-card"
            key={factor.title}
          >

            <div className="market-card-top">

              <div className="market-card-icon">
                {factor.icon}
              </div>

              <div className="market-card-label">
                Market Indicator
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


      {/* =====================================================
          MARKET FACTOR FRAMEWORK FROM EXCEL
      ===================================================== */}

      <div className="market-section-title">

        <h2>
          🔎 Hyper-Local Factors Considered
        </h2>

        <p>
          These are the factors GramBiz AI
          uses to structure local market
          analysis.
        </p>

      </div>

      {backendFactorCards.length > 0 ? (

        <div className="market-grid">

          {backendFactorCards.map(
            (factor) => (

              <div
                className="market-card"
                key={factor.title}
              >

                <div className="market-card-top">

                  <div className="market-card-icon">
                    {factor.icon}
                  </div>

                  <div className="market-card-label">
                    Data Framework
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

                {factor.example && (
                  <p>
                    <strong>
                      Example:
                    </strong>{" "}
                    {factor.example}
                  </p>
                )}

                {factor.whyImportant && (
                  <p>
                    <strong>
                      Why important:
                    </strong>{" "}
                    {factor.whyImportant}
                  </p>
                )}

                {factor.dataSource && (
                  <p>
                    <strong>
                      Source:
                    </strong>{" "}
                    {factor.dataSource}
                  </p>
                )}

              </div>

            )
          )}

        </div>

      ) : (

        <div className="market-data-status">

          <span>ℹ️</span>

          <div>

            <strong>
              Market Factor Framework
            </strong>

            <p>
              No market-factor records were
              returned by the backend.
            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          DATA COVERAGE
      ===================================================== */}

      <div className="market-section-title">

        <h2>
          📊 Data Coverage
        </h2>

        <p>
          This shows what information is
          currently available in the prototype.
        </p>

      </div>

      <div className="market-grid">

        {dataCoverage.map((item) => (

          <div
            className="market-card"
            key={item.title}
          >

            <div className="market-card-top">

              <div className="market-card-icon">
                {item.icon}
              </div>

              <div className="market-card-label">
                Data Status
              </div>

            </div>

            <h3>
              {item.title}
            </h3>

            <div className="market-value">
              {item.status}
            </div>

            <p>
              This status indicates whether
              locality-specific data is currently
              available in the prototype.
            </p>

          </div>

        ))}

      </div>


      {/* =====================================================
          AI RECOMMENDATION EXPLANATION
      ===================================================== */}

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


      {/* =====================================================
          IMPORTANT MARKET VALIDATION
      ===================================================== */}

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
              "Before investing, validate customer demand, competitor pricing, raw material costs, transportation conditions and seasonal demand in your local area."}
          </p>

        </div>

      </div>


      {/* =====================================================
          PROTOTYPE DATA NOTE
      ===================================================== */}

      <div className="market-note">

        <span>
          📚
        </span>

        <div>

          <strong>
            Prototype Data Note
          </strong>

          <p>
            The current prototype contains a
            structured market-analysis framework
            covering population, demand,
            competition, prices, raw materials,
            transportation, resources and
            seasonal demand.
          </p>

          <p>
            Locality-specific values will be
            integrated from reliable government,
            market and local-data sources in the
            next development phase.
          </p>

        </div>

      </div>


      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

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


      {/* =====================================================
          CONTINUE
      ===================================================== */}

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