import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function FinalReport() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [user, setUser] = useState({});
  const [financial, setFinancial] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    const savedFinancial =
      JSON.parse(localStorage.getItem("grambizFinancial")) || {};

    const savedRecommendations =
      JSON.parse(
        localStorage.getItem("grambizRecommendations")
      ) || [];

    setUser(savedUser);
    setFinancial(savedFinancial);
    setRecommendations(savedRecommendations);
  }, []);

  const recommendedBusiness =
    recommendations.length > 0
      ? recommendations[0].name
      : user.business || text.notProvided || "Not provided";

  const matchScore =
    recommendations.length > 0
      ? recommendations[0].score || 0
      : 0;

  const totalProjectCost =
    Number(financial.totalProjectCost || 0);

  const ownContribution =
    Number(financial.ownContribution || 0);

  const fundingGap =
    Number(financial.fundingGap || 0);

  return (
    <div className="report-page">

      {/* =================================
          HEADER
      ================================= */}

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


      {/* =================================
          PROFILE
      ================================= */}

      <div className="report-card">

        <div className="report-section-title">
          <div className="section-title-icon">
            👤
          </div>

          <div>
            <h2>
              {text.entrepreneurProfile}
            </h2>

            <p>
              Entrepreneur and location details
            </p>
          </div>
        </div>

        <div className="profile-grid">

          <div className="profile-item">
            <span>
              👤 {text.name}
            </span>

            <strong>
              {user.name ||
                text.notProvided ||
                "Not provided"}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              📍 {text.statePlaceholder}
            </span>

            <strong>
              {user.state ||
                text.notProvided ||
                "Not provided"}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              🏘️ {text.districtPlaceholder}
            </span>

            <strong>
              {user.district ||
                text.notProvided ||
                "Not provided"}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              📌 {text.villagePlaceholder}
            </span>

            <strong>
              {user.village ||
                text.notProvided ||
                "Not provided"}
            </strong>
          </div>

          <div className="profile-item budget-item">
            <span>
              💰 Available Budget
            </span>

            <strong>
              ₹
              {Number(
                user.budget || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="profile-item">
            <span>
              💡 Business Interest
            </span>

            <strong>
              {user.business ||
                text.notProvided ||
                "Not provided"}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================
          RECOMMENDATION
      ================================= */}

      <div className="report-card recommendation-report-card">

        <div className="report-section-title">
          <div className="section-title-icon">
            💡
          </div>

          <div>
            <h2>
              {text.personalizedRecommendation}
            </h2>

            <p>
              Best business opportunity identified
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
              {text.recommendationBasedOn ||
                "This recommendation is based on your available budget, skills, resources and stated business interest."}
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

      </div>


      {/* =================================
          MARKET SUMMARY
      ================================= */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            📊
          </div>

          <div>
            <h2>
              {text.marketSummary}
            </h2>

            <p>
              Key local market indicators
            </p>
          </div>

        </div>

        <div className="report-grid">

          <div className="report-stat">
            <span>📈</span>

            <small>
              {text.localDemand}
            </small>

            <strong>
              High
            </strong>
          </div>

          <div className="report-stat">
            <span>🏪</span>

            <small>
              {text.competition}
            </small>

            <strong>
              Medium
            </strong>
          </div>

          <div className="report-stat">
            <span>🚀</span>

            <small>
              {text.opportunity}
            </small>

            <strong>
              Good
            </strong>
          </div>

          <div className="report-stat">
            <span>⚠️</span>

            <small>
              {text.riskLevel}
            </small>

            <strong>
              Medium
            </strong>
          </div>

        </div>

        <div className="market-report-note">
          📍 Local market conditions should be validated
          with nearby customers, competitors, suppliers
          and current local prices.
        </div>

      </div>


      {/* =================================
          FINANCIAL SUMMARY
      ================================= */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            💰
          </div>

          <div>
            <h2>
              {text.financialSummaryReport}
            </h2>

            <p>
              Estimated project funding structure
            </p>
          </div>

        </div>

        <div className="report-grid financial-report-grid">

          <div className="report-stat financial-stat">
            <span>🏗️</span>

            <small>
              {text.totalProjectCost}
            </small>

            <strong>
              ₹
              {totalProjectCost.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="report-stat financial-stat">
            <span>👤</span>

            <small>
              {text.ownContribution}
            </small>

            <strong>
              ₹
              {ownContribution.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="report-stat funding-stat">
            <span>🏦</span>

            <small>
              {text.estimatedFundingGap}
            </small>

            <strong>
              ₹
              {fundingGap.toLocaleString(
                "en-IN"
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
                ₹
                {Number(
                  financial.equipment || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="cost-row">
              <span>
                Setup Cost
              </span>

              <strong>
                ₹
                {Number(
                  financial.setup || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="cost-row">
              <span>
                Working Capital
              </span>

              <strong>
                ₹
                {Number(
                  financial.workingCapital || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="cost-row">
              <span>
                Other Expenses
              </span>

              <strong>
                ₹
                {Number(
                  financial.otherExpenses || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        )}

      </div>


      {/* =================================
          ACTION PLAN
      ================================= */}

      <div className="report-card">

        <div className="report-section-title">

          <div className="section-title-icon">
            🚀
          </div>

          <div>
            <h2>
              {text.suggestedNextSteps}
            </h2>

            <p>
              Recommended actions before starting
            </p>
          </div>

        </div>

        <div className="action-list">

          <div className="action-item">
            <span>1</span>

            <div>
              <strong>
                Validate Local Demand
              </strong>

              <p>
                {text.verifyDemand}
              </p>
            </div>
          </div>

          <div className="action-item">
            <span>2</span>

            <div>
              <strong>
                Study Competition
              </strong>

              <p>
                {text.compareCompetitors}
              </p>
            </div>
          </div>

          <div className="action-item">
            <span>3</span>

            <div>
              <strong>
                Prepare Resources
              </strong>

              <p>
                {text.prepareResources}
              </p>
            </div>
          </div>

          <div className="action-item">
            <span>4</span>

            <div>
              <strong>
                Review Financing
              </strong>

              <p>
                {text.reviewFinancing}
              </p>
            </div>
          </div>

          <div className="action-item">
            <span>5</span>

            <div>
              <strong>
                Start Practically and Scale
              </strong>

              <p>
                {text.practicalScale}
              </p>
            </div>
          </div>

        </div>

      </div>


      {/* =================================
          DISCLAIMER
      ================================= */}

      <div className="report-note">

        <div className="report-note-icon">
          ℹ️
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


      {/* =================================
          BUTTONS
      ================================= */}

      <div className="report-buttons">

        <button
          className="report-home-button"
          onClick={() => navigate("/")}
        >
          ← {text.backToHome}
        </button>

      </div>

    </div>
  );
}

export default FinalReport;