import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Recommendations() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const analysis =
      JSON.parse(localStorage.getItem("grambizAnalysis")) || {};

    /*
     * Primary source:
     * Use the Top 5 recommendations returned by FastAPI.
     * These recommendations come from GramBiz_Member1_Data.xlsx.
     */
    if (
      Array.isArray(analysis.recommendations) &&
      analysis.recommendations.length > 0
    ) {
      const backendRecommendations = analysis.recommendations.map(
        (business) => ({
          name: business.business,
          investment: Number(business.estimated_investment || 0),
          score: Number(business.match_score || 0),
          demand: business.demand || "Not Available",
          competition: business.competition || "Not Available",
          risk: business.risk || "Not Available",
          requiredSkills: business.required_skills || [],
          requiredResources: business.required_resources || [],
          whySuitable: business.why_suitable || "",
          reasons: business.reasons || [],
          scoreBreakdown: business.score_breakdown || {}
        })
      );

      setRecommendations(backendRecommendations);
      return;
    }

    /*
     * Fallback:
     * If backend recommendations are unavailable,
     * show the single recommendation saved from the backend.
     */
    if (analysis.recommendation) {
      setRecommendations([
        {
          name: analysis.recommendation,
          investment: Number(
            analysis.estimated_investment || 0
          ),
          score: Number(analysis.match_score || 0),
          demand: analysis.demand || "Not Available",
          competition: analysis.competition || "Not Available",
          risk: analysis.risk || "Not Available",
          requiredSkills: [],
          requiredResources: [],
          whySuitable: "",
          reasons: [],
          scoreBreakdown: {}
        }
      ]);
    }
  }, []);

  const getSuitability = (score) => {
    if (score >= 70) {
      return text.highSuitability;
    }

    if (score >= 45) {
      return text.goodSuitability;
    }

    return text.possibleOption;
  };

  return (
    <div className="recommendations-page">

      {/* Header */}
      <div className="recommendations-header">

        <div className="recommendations-icon">
          💡
        </div>

        <div className="recommendations-badge">
          AI-Powered Business Matching
        </div>

        <h1>
          {text.recommendationsTitle}
        </h1>

        <p>
          {text.recommendationsDescription}
        </p>

      </div>

      {/* Recommendations */}
      <div className="recommendations-list">

        {recommendations.length === 0 ? (
          <div className="recommendation-empty">

            <div className="empty-icon">
              🔍
            </div>

            <h2>
              {text.noRecommendation}
            </h2>

            <p>
              {text.recommendationHelp}
            </p>

          </div>
        ) : (
          recommendations.map((business, index) => (

            <div
              className={`recommendation-card ${
                index === 0
                  ? "top-recommendation"
                  : ""
              }`}
              key={`${business.name}-${index}`}
            >

              {/* Top row */}
              <div className="recommendation-top">

                <div className="recommendation-rank">
                  #{index + 1}
                </div>

                {index === 0 && (
                  <div className="best-match">
                    ⭐ Best Match
                  </div>
                )}

              </div>

              {/* Business name */}
              <h2>
                {business.name}
              </h2>

              {/* Suitability */}
              <div className="suitability">
                {getSuitability(business.score)}
              </div>

              {/* Match score */}
              <div className="match-section">

                <div className="match-header">

                  <span>
                    {text.matchScore}
                  </span>

                  <strong>
                    {business.score}%
                  </strong>

                </div>

                <div className="match-bar">

                  <div
                    className="match-fill"
                    style={{
                      width: `${business.score}%`
                    }}
                  />

                </div>

              </div>

              {/* Details */}
              <div className="recommendation-details">

                <div className="detail-box">

                  <span className="detail-icon">
                    💰
                  </span>

                  <div>

                    <small>
                      {text.estimatedInvestment}
                    </small>

                    <strong>
                      ₹
                      {business.investment.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

                <div className="detail-box">

                  <span className="detail-icon">
                    🎯
                  </span>

                  <div>

                    <small>
                      {text.whyOption}
                    </small>

                    <strong>
                      {text.personalizedRecommendation}
                    </strong>

                  </div>

                </div>

              </div>

              {/* Market information */}
              <div className="backend-insights">

                <div>
                  <span>📈 Demand</span>
                  <strong>
                    {business.demand}
                  </strong>
                </div>

                <div>
                  <span>🏪 Competition</span>
                  <strong>
                    {business.competition}
                  </strong>
                </div>

                <div>
                  <span>⚠️ Risk</span>
                  <strong>
                    {business.risk}
                  </strong>
                </div>

              </div>

              {/* Why recommended */}
              {business.whySuitable && (
                <div className="recommendation-reason">

                  <strong>
                    Why this business?
                  </strong>

                  <p>
                    {business.whySuitable}
                  </p>

                </div>
              )}

              {/* Personalized reasons */}
              {business.reasons &&
                business.reasons.length > 0 && (

                <div className="recommendation-reason">

                  <strong>
                    Why GramBiz AI recommends it:
                  </strong>

                  <ul>
                    {business.reasons.map(
                      (reason, reasonIndex) => (
                        <li key={reasonIndex}>
                          {reason}
                        </li>
                      )
                    )}
                  </ul>

                </div>
              )}

            </div>
          ))
        )}

      </div>

      {/* Note */}
      <div className="recommendation-note">

        <span>ℹ️</span>

        <div>

          <strong>
            Decision Support
          </strong>

          <p>
            {text.recommendationNote}
          </p>

        </div>

      </div>

      {/* Continue */}
      <button
        className="recommendations-button"
        onClick={() =>
          navigate("/market-analysis")
        }
      >
        {text.viewMarketAnalysis}
        <span> →</span>
      </button>

    </div>
  );
}

export default Recommendations;