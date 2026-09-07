import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function FinalReport() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [user, setUser] = useState({});
  const [financial, setFinancial] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState({});

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    const savedFinancial =
      JSON.parse(localStorage.getItem("grambizFinancial")) || {};

    const savedRecommendations =
      JSON.parse(
        localStorage.getItem("grambizRecommendations")
      ) || [];

    const savedAnalysis =
      JSON.parse(
        localStorage.getItem("grambizAnalysis")
      ) || {};

    setUser(savedUser);
    setFinancial(savedFinancial);
    setRecommendations(savedRecommendations);
    setAnalysis(savedAnalysis);
  }, []);

  /* =========================================================
     HELPER FUNCTIONS
  ========================================================= */

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const displayValue = (
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

    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  /* =========================================================
     RECOMMENDED BUSINESS
  ========================================================= */

  const recommendedBusiness =
    recommendations.length > 0
      ? recommendations[0]?.name
      : analysis?.recommendation ||
        user.business ||
        text.notProvided ||
        "Not provided";

  const matchScore =
    recommendations.length > 0
      ? Number(
          recommendations[0]?.score || 0
        )
      : Number(
          analysis?.recommendation_score || 0
        );

  const recommendedDetails =
    recommendations.length > 0
      ? recommendations[0]
      : null;

  /* =========================================================
     USER DETAILS
  ========================================================= */

  const userName =
    user.name ||
    text.notProvided ||
    "Not provided";

  const state =
    user.state ||
    text.notProvided ||
    "Not provided";

  const district =
    user.district ||
    text.notProvided ||
    "Not provided";

  const village =
    user.village ||
    text.notProvided ||
    "Not provided";

  const businessInterest =
    user.business ||
    text.notProvided ||
    "Not provided";

  const budget = Number(
    user.budget || 0
  );

  /* =========================================================
     MARKET DATA
  ========================================================= */

  const localDemand = displayValue(
    analysis?.local_demand
  );

  const localCompetition = displayValue(
    analysis?.local_competition
  );

  const localOpportunity = (() => {
    const demand = String(
      analysis?.local_demand || ""
    ).toLowerCase();

    const competition = String(
      analysis?.local_competition || ""
    ).toLowerCase();

    if (
      demand === "high" &&
      competition === "low"
    ) {
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
  })();

  const localRisk = (() => {
    const demand = String(
      analysis?.local_demand || ""
    ).toLowerCase();

    const competition = String(
      analysis?.local_competition || ""
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
  })();

  /* =========================================================
     FINANCIAL DATA
  ========================================================= */

  const totalProjectCost = Number(
    financial.totalProjectCost || 0
  );

  const ownContribution = Number(
    financial.ownContribution || 0
  );

  const fundingGap = Number(
    financial.fundingGap || 0
  );

  const equipment = Number(
    financial.equipment || 0
  );

  const setup = Number(
    financial.setup || 0
  );

  const workingCapital = Number(
    financial.workingCapital || 0
  );

  const otherExpenses = Number(
    financial.otherExpenses || 0
  );

  const monthlyExpenses = Number(
    financial.monthlyExpenses || 0
  );

  const estimatedMonthlyRevenue = Number(
    financial.estimatedMonthlyRevenue || 0
  );

  /* =========================================================
     SCORE DESCRIPTION
  ========================================================= */

  const getScoreDescription = () => {
    if (matchScore >= 80) {
      return "Strong match based on the available profile information.";
    }

    if (matchScore >= 60) {
      return "Good match based on the available profile information.";
    }

    if (matchScore > 0) {
      return "Moderate match. Further local validation is recommended.";
    }

    return "Recommendation score is not available.";
  };

  return (
    <div className="report-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="report-header">

        <div className="report-icon">
          📄
        </div>

        <div className="report-badge">
          🤖 AI-Powered Business Advisory Report
        </div>

        <h1>
          GramBiz AI Final Report
        </h1>

        <p>
          {text.finalReportDescription ||
            "Your personalized business, market and financial guidance summary."}
        </p>

      </div>


      {/* =====================================================
          PROFILE
      ===================================================== */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            👤
          </div>

          <div>
            <h2>
              {text.entrepreneurProfile ||
                "Entrepreneur Profile"}
            </h2>

            <p>
              Entrepreneur and location details
            </p>
          </div>

        </div>

        <div className="profile-grid">

          <div className="profile-item">
            <span>
              👤 {text.name || "Name"}
            </span>

            <strong>
              {userName}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              📍 {text.statePlaceholder || "State"}
            </span>

            <strong>
              {state}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              🏘️ {text.districtPlaceholder || "District"}
            </span>

            <strong>
              {district}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              📌 {text.villagePlaceholder || "Village"}
            </span>

            <strong>
              {village}
            </strong>
          </div>

          <div className="profile-item budget-item">
            <span>
              💰 Available Budget
            </span>

            <strong>
              {formatCurrency(budget)}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              💡 Business Interest
            </span>

            <strong>
              {businessInterest}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          RECOMMENDATION
      ===================================================== */}

      <div className="report-card recommendation-report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            💡
          </div>

          <div>
            <h2>
              {text.personalizedRecommendation ||
                "Personalized Recommendation"}
            </h2>

            <p>
              Best available business opportunity
              based on your profile
            </p>
          </div>

        </div>

        <div className="recommendation-box">

          <div className="recommendation-main">

            <span className="recommendation-label">
              ⭐ Recommended Business
            </span>

            <h3>
              {recommendedBusiness}
            </h3>

            <p>
              {recommendedDetails?.personalized_reasons ||
                recommendedDetails?.why_suitable ||
                text.recommendationBasedOn ||
                "This recommendation considers your budget, skills, resources and business interest."}
            </p>

            <p>
              <strong>
                {getScoreDescription()}
              </strong>
            </p>

          </div>

          {matchScore > 0 && (

            <div className="match-score-box">

              <span>
                Match Score
              </span>

              <strong>
                {matchScore}%
              </strong>

            </div>

          )}

        </div>

        {/* RECOMMENDED BUSINESS DETAILS */}

        {recommendedDetails && (

          <div className="report-grid">

            <div className="report-stat">
              <span>💰</span>

              <small>
                Estimated Investment
              </small>

              <strong>
                {formatCurrency(
                  recommendedDetails.estimated_investment ||
                  recommendedDetails.investment
                )}
              </strong>
            </div>

            <div className="report-stat">
              <span>📈</span>

              <small>
                Demand
              </small>

              <strong>
                {displayValue(
                  recommendedDetails.demand
                )}
              </strong>
            </div>

            <div className="report-stat">
              <span>🏪</span>

              <small>
                Competition
              </small>

              <strong>
                {displayValue(
                  recommendedDetails.competition
                )}
              </strong>
            </div>

            <div className="report-stat">
              <span>⚠️</span>

              <small>
                Risk
              </small>

              <strong>
                {displayValue(
                  recommendedDetails.risk
                )}
              </strong>
            </div>

          </div>

        )}

      </div>


      {/* =====================================================
          MARKET SUMMARY
      ===================================================== */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            📊
          </div>

          <div>
            <h2>
              {text.marketSummary ||
                "Market Summary"}
            </h2>

            <p>
              Available local market indicators
            </p>
          </div>

        </div>

        <div className="report-grid">

          <div className="report-stat">
            <span>📈</span>

            <small>
              {text.localDemand ||
                "Local Demand"}
            </small>

            <strong>
              {localDemand}
            </strong>
          </div>

          <div className="report-stat">
            <span>🏪</span>

            <small>
              {text.competition ||
                "Competition"}
            </small>

            <strong>
              {localCompetition}
            </strong>
          </div>

          <div className="report-stat">
            <span>🚀</span>

            <small>
              {text.opportunity ||
                "Opportunity"}
            </small>

            <strong>
              {localOpportunity}
            </strong>
          </div>

          <div className="report-stat">
            <span>⚠️</span>

            <small>
              {text.riskLevel ||
                "Risk Level"}
            </small>

            <strong>
              {localRisk}
            </strong>
          </div>

        </div>

        <div className="market-report-note">

          📍{" "}
          {analysis?.market_data_status ||
            "Local market information is based on available prototype data."}

        </div>

        <div className="market-report-note">

          ℹ️ Local demand, competition, pricing,
          raw-material availability and
          transportation should be validated
          before investment.

        </div>

      </div>


      {/* =====================================================
          FINANCIAL SUMMARY
      ===================================================== */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            💰
          </div>

          <div>
            <h2>
              {text.financialSummaryReport ||
                "Financial Summary"}
            </h2>

            <p>
              Estimated project funding structure
            </p>
          </div>

        </div>

        <div className="report-grid financial-report-grid">

          <div className="report-stat financial-stat">

            <span>
              🏗️
            </span>

            <small>
              {text.totalProjectCost ||
                "Total Project Cost"}
            </small>

            <strong>
              {formatCurrency(
                totalProjectCost
              )}
            </strong>

          </div>

          <div className="report-stat financial-stat">

            <span>
              👤
            </span>

            <small>
              {text.ownContribution ||
                "Own Contribution"}
            </small>

            <strong>
              {formatCurrency(
                ownContribution
              )}
            </strong>

          </div>

          <div className="report-stat funding-stat">

            <span>
              🏦
            </span>

            <small>
              {text.estimatedFundingGap ||
                "Estimated Funding Gap"}
            </small>

            <strong>
              {formatCurrency(
                fundingGap
              )}
            </strong>

          </div>

        </div>


        {/* COST BREAKDOWN */}

        {totalProjectCost > 0 && (

          <div className="report-cost-breakdown">

            <h3>
              Cost Breakdown
            </h3>

            <div className="cost-row">

              <span>
                Equipment
              </span>

              <strong>
                {formatCurrency(
                  equipment
                )}
              </strong>

            </div>

            <div className="cost-row">

              <span>
                Setup Cost
              </span>

              <strong>
                {formatCurrency(
                  setup
                )}
              </strong>

            </div>

            <div className="cost-row">

              <span>
                Working Capital
              </span>

              <strong>
                {formatCurrency(
                  workingCapital
                )}
              </strong>

            </div>

            <div className="cost-row">

              <span>
                Other Expenses
              </span>

              <strong>
                {formatCurrency(
                  otherExpenses
                )}
              </strong>

            </div>

            <div className="cost-row">

              <span>
                Total Project Cost
              </span>

              <strong>
                {formatCurrency(
                  totalProjectCost
                )}
              </strong>

            </div>

          </div>

        )}


        {/* OPTIONAL MONTHLY FIGURES */}

        {(monthlyExpenses > 0 ||
          estimatedMonthlyRevenue > 0) && (

          <div className="report-grid">

            <div className="report-stat">

              <span>
                📉
              </span>

              <small>
                Estimated Monthly Expenses
              </small>

              <strong>
                {formatCurrency(
                  monthlyExpenses
                )}
              </strong>

            </div>

            <div className="report-stat">

              <span>
                📈
              </span>

              <small>
                Estimated Monthly Revenue
              </small>

              <strong>
                {formatCurrency(
                  estimatedMonthlyRevenue
                )}
              </strong>

            </div>

          </div>

        )}

      </div>


      {/* =====================================================
          FUNDING INTERPRETATION
      ===================================================== */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            🏦
          </div>

          <div>
            <h2>
              Funding Requirement
            </h2>

            <p>
              Understanding your estimated
              financing need
            </p>
          </div>

        </div>

        <div className="market-report-note">

          {fundingGap === 0
            ? "Your estimated project cost is fully covered by the recorded own contribution."
            : `The estimated funding gap is ${formatCurrency(
                fundingGap
              )}. You can review suitable financing options and verify eligibility with the relevant financial institution.`}

        </div>

        <div className="market-report-note">

          ⚠️ GramBiz AI does not approve,
          guarantee or provide loans. Financing
          information is for decision support
          and actual approval depends on the
          relevant lender and applicable rules.

        </div>

      </div>


      {/* =====================================================
          ACTION PLAN
      ===================================================== */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            🚀
          </div>

          <div>
            <h2>
              {text.suggestedNextSteps ||
                "Suggested Next Steps"}
            </h2>

            <p>
              Recommended actions before
              starting the business
            </p>
          </div>

        </div>

        <div className="action-list">

          <div className="action-item">

            <span>
              1
            </span>

            <div>

              <strong>
                Validate Local Demand
              </strong>

              <p>
                {text.verifyDemand ||
                  "Talk to potential customers and validate demand in your target area."}
              </p>

            </div>

          </div>


          <div className="action-item">

            <span>
              2
            </span>

            <div>

              <strong>
                Study Competition
              </strong>

              <p>
                {text.compareCompetitors ||
                  "Compare nearby competitors, prices, products and services."}
              </p>

            </div>

          </div>


          <div className="action-item">

            <span>
              3
            </span>

            <div>

              <strong>
                Prepare Resources
              </strong>

              <p>
                {text.prepareResources ||
                  "Confirm that the required skills, equipment, land, shop and other resources are available."}
              </p>

            </div>

          </div>


          <div className="action-item">

            <span>
              4
            </span>

            <div>

              <strong>
                Review Financing
              </strong>

              <p>
                {text.reviewFinancing ||
                  "Review financing options and verify current eligibility and conditions with official sources."}
              </p>

            </div>

          </div>


          <div className="action-item">

            <span>
              5
            </span>

            <div>

              <strong>
                Start Practically and Scale
              </strong>

              <p>
                {text.practicalScale ||
                  "Start according to your validated resources and gradually scale after gaining customer feedback."}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          OVERALL SUMMARY
      ===================================================== */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            🤖
          </div>

          <div>
            <h2>
              GramBiz AI Advisory Summary
            </h2>

            <p>
              Decision-support overview
            </p>
          </div>

        </div>

        <p>
          GramBiz AI identified{" "}
          <strong>
            {recommendedBusiness}
          </strong>{" "}
          as the top available business
          recommendation based on the provided
          profile information.
        </p>

        <p>
          The estimated project cost is{" "}
          <strong>
            {formatCurrency(
              totalProjectCost
            )}
          </strong>
          , with an own contribution of{" "}
          <strong>
            {formatCurrency(
              ownContribution
            )}
          </strong>
          and an estimated funding gap of{" "}
          <strong>
            {formatCurrency(
              fundingGap
            )}
          </strong>
          .
        </p>

        <p>
          Market conditions should be validated
          locally before making investment
          decisions.
        </p>

      </div>


      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

      <div className="report-note">

        <div className="report-note-icon">
          ⚠️
        </div>

        <div>

          <strong>
            Important Decision-Support Notice
          </strong>

          <p>
            {text.reportNote ||
              "GramBiz AI provides estimates and decision-support guidance based on available information. Market conditions, costs, financing eligibility and business outcomes may vary. Verify important information with official sources and local stakeholders before making financial decisions."}
          </p>

        </div>

      </div>


      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="report-buttons">

        <button
          className="report-home-button"
          onClick={() => navigate("/")}
        >
          ←{" "}
          {text.backToHome ||
            "Back to Home"}
        </button>

      </div>

    </div>
  );
}

export default FinalReport;