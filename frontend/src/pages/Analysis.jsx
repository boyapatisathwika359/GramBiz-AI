import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { analyzeBusiness } from "../api";

function Analysis() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const runAnalysis = async () => {
      try {
        setLoading(true);
        setError("");
        setProgress(10);

        // ==========================================
        // 1. GET USER DATA FROM LOCAL STORAGE
        // ==========================================

        const savedUser = JSON.parse(
          localStorage.getItem("grambizUser") || "{}"
        );

        console.log("=================================");
        console.log("GRAMBIZ AI - USER DATA");
        console.log("=================================");
        console.log(savedUser);

        // ==========================================
        // 2. PREPARE DATA FOR FASTAPI
        // ==========================================

        const requestData = {
          location: [
            savedUser.village,
            savedUser.district,
            savedUser.state
          ]
            .filter(Boolean)
            .join(", "),

          budget: Number(savedUser.budget || 0),

          business: savedUser.business || "",

          skills: Array.isArray(savedUser.skills)
            ? savedUser.skills
            : [],

          resources: Array.isArray(savedUser.resources)
            ? savedUser.resources
            : []
        };

        console.log("=================================");
        console.log("DATA SENT TO BACKEND");
        console.log("=================================");
        console.log(requestData);

        setProgress(25);

        // ==========================================
        // 3. VALIDATE DATA BEFORE API CALL
        // ==========================================

        if (!requestData.location) {
          throw new Error("Location information is missing.");
        }

        if (requestData.budget <= 0) {
          throw new Error("Please enter a valid budget.");
        }

        if (!requestData.business) {
          throw new Error("Please enter your business interest.");
        }

        if (requestData.skills.length === 0) {
          throw new Error("Please select at least one skill.");
        }

        if (requestData.resources.length === 0) {
          throw new Error("Please select at least one resource.");
        }

        setProgress(40);

        // ==========================================
        // 4. CALL FASTAPI BACKEND
        // ==========================================

        console.log("Calling FastAPI...");

        const result = await analyzeBusiness(requestData);

        console.log("=================================");
        console.log("BACKEND RESPONSE");
        console.log("=================================");
        console.log(result);

        if (!result) {
          throw new Error("Backend returned an empty response.");
        }

        if (!isMounted) return;

        setProgress(70);

        // ==========================================
        // 5. SAVE BACKEND RESPONSE
        // ==========================================

        localStorage.setItem(
          "grambizAnalysis",
          JSON.stringify(result)
        );

        console.log(
          "Saved backend result to grammBizAnalysis localStorage."
        );

        // ==========================================
        // 6. STORE RESULT IN REACT STATE
        // ==========================================

        setAnalysisResult(result);

        setProgress(85);

        // ==========================================
        // 7. COMPLETE ANALYSIS
        // ==========================================

        setTimeout(() => {
          if (!isMounted) return;

          setProgress(100);
          setLoading(false);

          console.log("=================================");
          console.log("ANALYSIS COMPLETED");
          console.log("=================================");
        }, 700);

      } catch (err) {
        console.error("=================================");
        console.error("GRAMBIZ AI ERROR");
        console.error("=================================");
        console.error(err);

        if (!isMounted) return;

        setError(
          err.message ||
            "Unable to connect to the GramBiz AI backend."
        );

        setLoading(false);
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // CONTINUE TO RECOMMENDATIONS
  // ==========================================

  const handleContinue = () => {
    navigate("/recommendations");
  };

  return (
    <div className="analysis-page">
      <div className="analysis-card">

        {/* AI ICON */}
        <div className="analysis-ai-icon">
          🤖
        </div>

        {/* TITLE */}
        <h1>{text.analysisTitle}</h1>

        <p className="analysis-description">
          {text.analysisDescription}
        </p>

        {/* ERROR */}
        {error ? (
          <div className="analysis-error">
            <h3>⚠️ Analysis Failed</h3>

            <p>{error}</p>

            <div className="error-help">
              <strong>Backend:</strong>
              <br />
              http://127.0.0.1:8000
            </div>

            <button
              className="analysis-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* ==================================
                ANALYSIS STEPS
            ================================== */}

            <div className="analysis-steps">

              {/* USER INFORMATION */}
              <div className="analysis-step completed">

                <div className="step-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    {text.userInformation}
                  </strong>

                  <span>
                    Information collected
                  </span>
                </div>

              </div>

              {/* SKILLS AND RESOURCES */}
              <div
                className={
                  progress >= 40
                    ? "analysis-step completed"
                    : "analysis-step active"
                }
              >

                <div className="step-icon">
                  {progress >= 40 ? "✓" : "⏳"}
                </div>

                <div>
                  <strong>
                    {text.skillsResources}
                  </strong>

                  <span>
                    Skills and resources analyzed
                  </span>
                </div>

              </div>

              {/* LOCAL BUSINESS FACTORS */}
              <div
                className={
                  progress >= 70
                    ? "analysis-step completed"
                    : "analysis-step active"
                }
              >

                <div className="step-icon">
                  {progress >= 70 ? "✓" : "⏳"}
                </div>

                <div>
                  <strong>
                    {text.localBusinessFactors}
                  </strong>

                  <span>
                    Evaluating local market factors
                  </span>
                </div>

              </div>

              {/* FINANCIAL REQUIREMENTS */}
              <div
                className={
                  progress >= 100
                    ? "analysis-step completed"
                    : "analysis-step active"
                }
              >

                <div className="step-icon">
                  {progress >= 100 ? "✓" : "⏳"}
                </div>

                <div>
                  <strong>
                    {text.financialRequirements}
                  </strong>

                  <span>
                    Preparing financial assessment
                  </span>
                </div>

              </div>

            </div>

            {/* ==================================
                PROGRESS BAR
            ================================== */}

            <div className="analysis-progress-section">

              <div className="progress-header">

                <span>
                  AI Analysis Progress
                </span>

                <strong>
                  {progress}%
                </strong>

              </div>

              <div className="progress-container">

                <div
                  className="progress-bar"
                  style={{
                    width: `${progress}%`
                  }}
                />

              </div>

              <p className="progress-text">
                {progress}% {text.complete}
              </p>

            </div>

            {/* ==================================
                BACKEND RESULT
            ================================== */}

            {!loading && analysisResult && (

              <div className="analysis-result">

                <div className="result-header">

                  <div className="result-icon">
                    ✅
                  </div>

                  <div>
                    <h3>
                      AI Analysis Completed
                    </h3>

                    <p>
                      Your personalized business analysis is ready.
                    </p>
                  </div>

                </div>

                <div className="result-grid">

                  {/* BUSINESS */}
                  <div className="result-box">

                    <span>
                      Recommended Business
                    </span>

                    <strong>
                      {analysisResult.recommendation ||
                        "Not available"}
                    </strong>

                  </div>

                  {/* MATCH SCORE */}
                  <div className="result-box">

                    <span>
                      Match Score
                    </span>

                    <strong>
                      {analysisResult.match_score ?? 0}%
                    </strong>

                  </div>

                  {/* INVESTMENT */}
                  <div className="result-box">

                    <span>
                      Estimated Investment
                    </span>

                    <strong>
                      ₹
                      {Number(
                        analysisResult.estimated_investment || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                  {/* DEMAND */}
                  <div className="result-box">

                    <span>
                      Local Demand
                    </span>

                    <strong>
                      {analysisResult.demand ||
                        "Not available"}
                    </strong>

                  </div>

                  {/* COMPETITION */}
                  <div className="result-box">

                    <span>
                      Competition
                    </span>

                    <strong>
                      {analysisResult.competition ||
                        "Not available"}
                    </strong>

                  </div>

                  {/* RISK */}
                  <div className="result-box">

                    <span>
                      Risk Level
                    </span>

                    <strong>
                      {analysisResult.risk ||
                        "Not available"}
                    </strong>

                  </div>

                </div>

                {/* LOCATION */}

                <div className="result-location">

                  📍

                  <strong>
                    Location:
                  </strong>{" "}

                  {analysisResult.location ||
                    "Not available"}

                </div>

              </div>
            )}

            {/* ==================================
                CONTINUE BUTTON
            ================================== */}

            {!loading && analysisResult && (

              <button
                className="analysis-button"
                onClick={handleContinue}
              >
                {text.viewRecommendations}

                <span>
                  →
                </span>

              </button>

            )}

          </>
        )}

      </div>
    </div>
  );
}

export default Analysis;