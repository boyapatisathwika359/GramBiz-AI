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
      : user.business || text.notProvided;

  return (
    <div className="report-page">

      {/* HEADER */}
      <div className="report-header">

        <div className="report-icon">
          📄
        </div>

        <h1>
          GramBiz AI Final Report
        </h1>

        <p>
          {text.finalReportDescription}
        </p>

      </div>

      {/* USER INFORMATION */}
      <div className="report-card">

        <h2>
          👤 {text.entrepreneurProfile}
        </h2>

        <div className="profile-grid">

          <div>
            <span>{text.name}</span>
            <strong>
              {user.name || text.notProvided}
            </strong>
          </div>

          <div>
            <span>{text.statePlaceholder}</span>
            <strong>
              {user.state || text.notProvided}
            </strong>
          </div>

          <div>
            <span>{text.districtPlaceholder}</span>
            <strong>
              {user.district || text.notProvided}
            </strong>
          </div>

          <div>
            <span>{text.villagePlaceholder}</span>
            <strong>
              {user.village || text.notProvided}
            </strong>
          </div>

        </div>

      </div>

      {/* RECOMMENDATION */}
      <div className="report-card">

        <h2>
          💡 {text.personalizedRecommendation}
        </h2>

        <div className="recommendation-box">

          <h3>
            {recommendedBusiness}
          </h3>

          <p>
            {text.recommendationBasedOn}
          </p>

        </div>

      </div>

      {/* MARKET SUMMARY */}
      <div className="report-card">

        <h2>
          📊 {text.marketSummary}
        </h2>

        <div className="report-grid">

          <div>
            <span>{text.localDemand}</span>
            <strong>High</strong>
          </div>

          <div>
            <span>{text.competition}</span>
            <strong>Medium</strong>
          </div>

          <div>
            <span>{text.opportunity}</span>
            <strong>Good</strong>
          </div>

        </div>

      </div>

      {/* FINANCIAL SUMMARY */}
      <div className="report-card">

        <h2>
          💰 {text.financialSummaryReport}
        </h2>

        <div className="report-grid">

          <div>
            <span>
              {text.totalProjectCost}
            </span>

            <strong>
              ₹
              {Number(
                financial.totalCost || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>
              {text.ownContribution}
            </span>

            <strong>
              ₹
              {Number(
                financial.ownContribution || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>
              {text.estimatedFundingGap}
            </span>

            <strong>
              ₹
              {Number(
                financial.fundingGap || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

      </div>

      {/* ACTION PLAN */}
      <div className="report-card">

        <h2>
          🚀 {text.suggestedNextSteps}
        </h2>

        <ol className="action-list">

          <li>
            {text.verifyDemand}
          </li>

          <li>
            {text.compareCompetitors}
          </li>

          <li>
            {text.prepareResources}
          </li>

          <li>
            {text.reviewFinancing}
          </li>

          <li>
            {text.practicalScale}
          </li>

        </ol>

      </div>

      {/* IMPORTANT NOTE */}
      <div className="report-note">

        <strong>
          ℹ️ {text.reportNote}
        </strong>

      </div>

      {/* BUTTON */}
      <div className="report-buttons">

        <button
          onClick={() => navigate("/")}
        >
          {text.backToHome}
        </button>

      </div>

    </div>
  );
}

export default FinalReport;