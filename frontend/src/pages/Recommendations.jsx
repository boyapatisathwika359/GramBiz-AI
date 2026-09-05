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

    const skills = user.skills || [];
    const resources = user.resources || [];
    const budget = Number(user.budget || 0);
    const businessInterest = (user.business || "").toLowerCase();

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
        keywords: ["digital", "computer", "online", "service"]
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
      } else if (budget >= business.investment * 0.6) {
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

    scoredBusinesses.sort((a, b) => b.score - a.score);

    setRecommendations(scoredBusinesses.slice(0, 3));
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

      <div className="recommendations-header">
        <div className="recommendations-icon">💡</div>

        <h1>{text.recommendationsTitle}</h1>

        <p>
          {text.recommendationsDescription}
        </p>
      </div>

      <div className="recommendations-list">

        {recommendations.length === 0 ? (
          <div className="recommendation-card">
            <h2>{text.noRecommendation}</h2>

            <p>
              {text.recommendationHelp}
            </p>
          </div>
        ) : (
          recommendations.map((business, index) => (
            <div
              className="recommendation-card"
              key={business.name}
            >
              <div className="recommendation-rank">
                #{index + 1}
              </div>

              <h2>{business.name}</h2>

              <div className="suitability">
                {getSuitability(business.score)}
              </div>

              <div className="recommendation-details">

                <p>
                  <strong>
                    {text.estimatedInvestment}:
                  </strong>{" "}
                  ₹{business.investment.toLocaleString("en-IN")}
                </p>

                <p>
                  <strong>
                    {text.matchScore}:
                  </strong>{" "}
                  {business.score}%
                </p>

                <p>
                  <strong>
                    {text.whyOption}:
                  </strong>{" "}
                  {text.personalizedRecommendation}
                </p>

              </div>
            </div>
          ))
        )}

      </div>

      <div className="recommendation-note">
        <strong>ℹ️</strong>{" "}
        {text.recommendationNote}
      </div>

      <button
        className="continue-button"
        onClick={() => navigate("/market-analysis")}
      >
        {text.viewMarketAnalysis}
      </button>

    </div>
  );
}

export default Recommendations;