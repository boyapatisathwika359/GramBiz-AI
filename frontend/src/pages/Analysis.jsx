import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Analysis() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) {
          clearInterval(timer);
          return 100;
        }

        return previous + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
    navigate("/recommendations");
  };

  return (
    <div className="analysis-page">
      <div className="analysis-card">

        <div className="ai-icon">🤖</div>

        <h1>{text.analysisTitle}</h1>

        <p>
          {text.analysisDescription}
        </p>

        <div className="analysis-steps">

          <div className="analysis-step completed">
            <span>✓</span>
            <span>{text.userInformation}</span>
          </div>

          <div className="analysis-step completed">
            <span>✓</span>
            <span>{text.skillsResources}</span>
          </div>

          <div
            className={
              progress >= 60
                ? "analysis-step completed"
                : "analysis-step active"
            }
          >
            <span>
              {progress >= 60 ? "✓" : "⏳"}
            </span>

            <span>
              {text.localBusinessFactors}
            </span>
          </div>

          <div
            className={
              progress >= 100
                ? "analysis-step completed"
                : "analysis-step"
            }
          >
            <span>
              {progress >= 100 ? "✓" : "○"}
            </span>

            <span>
              {text.financialRequirements}
            </span>
          </div>

        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="progress-text">
          {progress}% {text.complete}
        </p>

        {progress >= 100 && (
          <button onClick={handleContinue}>
            {text.viewRecommendations}
          </button>
        )}

      </div>
    </div>
  );
}

export default Analysis;