import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Recommendations() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    const analysis =
      JSON.parse(localStorage.getItem("grambizAnalysis")) || {};

    /*
     * First priority:
     * Use the recommendation returned by FastAPI.
     */
    if (analysis.recommendation) {
      const backendRecommendation = {
        name: analysis.recommendation,
        investment: Number(
          analysis.estimated_investment || user.budget || 0
        ),
        score: Number(analysis.match_score || 0),
        demand: analysis.demand || "High",
        competition: analysis.competition || "Medium",
        risk: analysis.risk || "Medium"
      };

      setRecommendations([backendRecommendation]);
      return;
    }

    /*
     * Fallback:
     * Existing frontend recommendation logic.
     */
    const skills = user.skills || [];
    const resources = user.resources || [];
    const budget = Number(user.budget || 0);
    const businessInterest = (
      user.business || ""
    ).toLowerCase();

    const businesses = [
      {
        name: "Dairy Farming",
        investment: 80000,
        skills: ["Dairy", "Farming"],
        resources: ["Livestock", "Land"],
        keywords: ["dairy", "milk", "farming"]
      },
      {
        name: "Tailoring Business",
        investment: 50000,
        skills: ["Tailoring"],
        resources: ["Sewing Machine", "Shop"],
        keywords: ["tailoring", "clothes", "stitching"]
      },
      {
        name: "Food / Tiffin Business",
        investment: 40000,
        skills: ["Cooking"],
        resources: ["Kitchen Equipment", "Shop"],
        keywords: ["food", "tiffin", "cooking"]
      },
      {
        name: "Mobile / Electronics Repair",
        investment: 60000,
        skills: ["Repair"],
        resources: ["Shop"],
        keywords: ["repair", "mobile", "electronics"]
      },
      {
        name: "Handicraft Business",
        investment: 35000,
        skills: ["Handicrafts"],
        resources: ["Shop", "Storage Space"],
        keywords: ["handicraft", "craft", "handmade"]
      },
      {
        name: "Small Retail Shop",
        investment: 70000,
        skills: ["Retail"],
        resources: ["Shop", "Storage Space"],
        keywords: ["retail", "shop", "store"]
      },
      {
        name: "Digital Service Center",
        investment: 60000,
        skills: ["Digital Services"],
        resources: ["Computer", "Shop"],
        keywords: [
          "digital",
          "computer",
          "online",
          "service"
        ]
      }
    ];

    const scoredBusinesses = businesses.map((business) => {
      let score = 0;

      business.skills.forEach((skill) => {
        if (skills.includes(skill)) {
          score += 25;
        }
      });

      business.resources.forEach((resource) => {
        if (resources.includes(resource)) {
          score += 15;
        }
      });

      if (budget >= business.investment) {
        score += 20;
      } else if (
        budget >= business.investment * 0.6
      ) {
        score += 10;
      }

      business.keywords.forEach((keyword) => {
        if (businessInterest.includes(keyword)) {
          score += 10;
        }
      });

      return {
        ...business,
        score: Math.min(score, 100)
      };
    });

    scoredBusinesses.sort(
      (a, b) => b.score - a.score
    );

    setRecommendations(
      scoredBusinesses.slice(0, 3)
    );
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
          recommendations.map(
            (business, index) => (

              <div
                className={`recommendation-card ${
                  index === 0
                    ? "top-recommendation"
                    : ""
                }`}
                key={business.name}
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
                  {getSuitability(
                    business.score
                  )}
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

                {/* Backend market information */}
                {business.demand && (
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
                )}

              </div>
            )
          )
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