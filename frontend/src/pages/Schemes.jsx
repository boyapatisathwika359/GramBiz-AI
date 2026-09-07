import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API from "../api";

function Schemes() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [user, setUser] = useState({});
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =============================
     LOAD USER + GOVERNMENT SCHEMES
  ============================= */

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    setUser(savedUser);

    const loadSchemes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/api/schemes");

        console.log(
          "GRAMBIZ AI - GOVERNMENT SCHEMES:",
          response.data
        );

        const backendSchemes =
          Array.isArray(response.data)
            ? response.data
            : response.data.schemes || [];

        const formattedSchemes = backendSchemes.map(
          (scheme, index) => ({
            id:
              scheme.scheme_name
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-") ||
              `scheme-${index}`,

            icon:
              index === 0
                ? "💰"
                : index === 1
                ? "🏭"
                : "🚀",

            name:
              scheme.scheme_name ||
              "Government Scheme",

            tag:
              index === 0
                ? "Micro Business Finance"
                : index === 1
                ? "New Enterprise Support"
                : "Greenfield Enterprise",

            purpose:
              scheme.purpose ||
              "Information not available.",

            suitableFor:
              scheme.suitable_for ||
              "Information not available.",

            eligibility:
              scheme.eligibility ||
              "Eligibility information not available.",

            documents:
              scheme.documents ||
              "Document information not available.",

            officialSource:
              scheme.official_source ||
              "Official source not available.",

            note:
              scheme.warning ||
              "Verify the latest scheme conditions through the official source."
          })
        );

        setSchemes(formattedSchemes);

      } catch (apiError) {
        console.error(
          "GRAMBIZ AI - SCHEMES API ERROR:",
          apiError
        );

        setError(
          "Unable to load government scheme data from the backend."
        );

      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, []);

  /* =============================
     CHECK ELIGIBILITY
  ============================= */

  const checkEligibility = (scheme) => {
    const budget = Number(user.budget || 0);

    let status = "Preliminary Match";

    let message =
      "Your current information suggests that this scheme may be worth considering.";

    let checks = [];

    /* =============================
       PM MUDRA CHECK
    ============================= */

    if (
      scheme.name
        .toLowerCase()
        .includes("mudra")
    ) {
      checks = [
        {
          label: "Business purpose provided",
          passed: Boolean(user.business)
        },
        {
          label: "Available budget provided",
          passed: budget > 0
        },
        {
          label: "Applicant and lender requirements",
          passed: false
        }
      ];

      if (!user.business || budget <= 0) {
        status = "More Information Required";

        message =
          "Please provide complete business and financial information before considering this option.";
      } else {
        status = "Preliminary Match";

        message =
          "Your business information appears relevant for preliminary consideration. Final eligibility must be checked with the lender.";
      }
    }

    /* =============================
       PMEGP CHECK
    ============================= */

    else if (
      scheme.name
        .toLowerCase()
        .includes("pmegp")
    ) {
      checks = [
        {
          label: "Business interest provided",
          passed: Boolean(user.business)
        },
        {
          label: "Budget information provided",
          passed: budget > 0
        },
        {
          label: "New business status",
          passed: false
        },
        {
          label: "Age and other PMEGP conditions",
          passed: false
        }
      ];

      status = "More Information Required";

      message =
        "Some PMEGP-specific information, such as new or existing business status and applicant eligibility details, is not yet available.";
    }

    /* =============================
       STAND-UP INDIA CHECK
    ============================= */

    else if (
      scheme.name
        .toLowerCase()
        .includes("stand-up")
    ) {
      checks = [
        {
          label: "Business information provided",
          passed: Boolean(user.business)
        },
        {
          label: "Budget information provided",
          passed: budget > 0
        },
        {
          label: "Beneficiary category",
          passed: false
        },
        {
          label: "Current scheme availability",
          passed: false
        }
      ];

      status = "Verify Before Applying";

      message =
        "Additional beneficiary information and the current official scheme status must be verified before considering this option.";
    }

    else {
      checks = [
        {
          label: "Business information provided",
          passed: Boolean(user.business)
        },
        {
          label: "Budget information provided",
          passed: budget > 0
        },
        {
          label: "Scheme-specific eligibility",
          passed: false
        }
      ];

      status = "Verify Before Applying";

      message =
        "Please verify the scheme-specific eligibility conditions through the official source.";
    }

    setSelectedScheme({
      ...scheme,
      status,
      message,
      checks
    });
  };

  /* =============================
     CLOSE ELIGIBILITY
  ============================= */

  const closeEligibility = () => {
    setSelectedScheme(null);
  };

  /* =============================
     PAGE
  ============================= */

  return (
    <div className="schemes-page">

      {/* HEADER */}

      <div className="schemes-header">

        <div className="schemes-icon">
          🏦
        </div>

        <div className="schemes-badge">
          💡 Government Financing Guidance
        </div>

        <h1>
          {text.financingTitle ||
            "Financing Options"}
        </h1>

        <p>
          {text.financingDescription ||
            "Explore financing options that may be relevant to your business requirements."}
        </p>

        {user.business && (
          <div className="schemes-business">

            <span>
              {text.businessLabel || "Business"}
            </span>

            <strong>
              {user.business}
            </strong>

          </div>
        )}

      </div>

      {/* LOADING */}

      {loading && (
        <div className="recommendation-empty">

          <div className="empty-icon">
            🏦
          </div>

          <h2>
            Loading financing options...
          </h2>

          <p>
            Fetching government scheme information
            from GramBiz AI.
          </p>

        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="recommendation-empty">

          <div className="empty-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Schemes
          </h2>

          <p>
            {error}
          </p>

        </div>
      )}

      {/* SCHEME CARDS */}

      {!loading && !error && (
        <div className="schemes-list">

          {schemes.map((scheme) => (

            <div
              className="scheme-card"
              key={scheme.id}
            >

              {/* TOP */}

              <div className="scheme-top">

                <div className="scheme-card-icon">
                  {scheme.icon}
                </div>

                <span className="scheme-tag">
                  {scheme.tag}
                </span>

              </div>

              {/* NAME */}

              <h2>
                {scheme.name}
              </h2>

              {/* PURPOSE */}

              <div className="scheme-section">

                <span className="scheme-label">
                  🎯{" "}
                  {text.purpose ||
                    "Purpose"}
                </span>

                <p>
                  {scheme.purpose}
                </p>

              </div>

              {/* SUITABLE FOR */}

              <div className="scheme-section">

                <span className="scheme-label">
                  👥{" "}
                  {text.suitableFor ||
                    "May be suitable for"}
                </span>

                <p>
                  {scheme.suitableFor}
                </p>

              </div>

              {/* DOCUMENTS */}

              <div className="scheme-section">

                <span className="scheme-label">
                  📄{" "}
                  {text.requiredDocuments ||
                    "Typical documents"}
                </span>

                <p>
                  {scheme.documents}
                </p>

              </div>

              {/* ELIGIBILITY */}

              <div className="scheme-section">

                <span className="scheme-label">
                  ✅ Eligibility
                </span>

                <p>
                  {scheme.eligibility}
                </p>

              </div>

              {/* OFFICIAL SOURCE */}

              <div className="scheme-section">

                <span className="scheme-label">
                  🔗 Official Source
                </span>

                <p>
                  {scheme.officialSource}
                </p>

              </div>

              {/* NOTE */}

              <div className="scheme-card-note">
                ℹ️ {scheme.note}
              </div>

              {/* BUTTON */}

              <button
                className="scheme-check-button"
                onClick={() =>
                  checkEligibility(scheme)
                }
              >
                🔎{" "}
                {text.checkEligibility ||
                  "Check Eligibility"}
              </button>

            </div>

          ))}

        </div>
      )}

      {/* ELIGIBILITY POPUP */}

      {selectedScheme && (

        <div className="eligibility-overlay">

          <div className="eligibility-result">

            {/* CLOSE */}

            <button
              className="eligibility-close"
              onClick={closeEligibility}
            >
              ×
            </button>

            {/* HEADER */}

            <div className="eligibility-header">

              <div className="eligibility-big-icon">
                {selectedScheme.icon}
              </div>

              <div>

                <span>
                  🔎 Preliminary Assessment
                </span>

                <h2>
                  {selectedScheme.name}
                </h2>

              </div>

            </div>

            {/* STATUS */}

            <div
              className={
                selectedScheme.status ===
                "Preliminary Match"
                  ? "eligibility-status success"
                  : "eligibility-status warning"
              }
            >

              <strong>
                {selectedScheme.status ===
                "Preliminary Match"
                  ? "✓"
                  : "⚠️"}
              </strong>

              <span>
                {selectedScheme.status}
              </span>

            </div>

            {/* MESSAGE */}

            <p className="eligibility-message">
              {selectedScheme.message}
            </p>

            {/* USER DETAILS */}

            <div className="eligibility-details">

              <div className="eligibility-detail">

                <span>
                  👤 Business
                </span>

                <strong>
                  {user.business ||
                    text.notProvided ||
                    "Not provided"}
                </strong>

              </div>

              <div className="eligibility-detail">

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

            </div>

            {/* PRELIMINARY CHECKS */}

            <div className="eligibility-checks">

              <h3>
                Preliminary Checks
              </h3>

              {selectedScheme.checks.map(
                (check) => (

                  <div
                    className="eligibility-check"
                    key={check.label}
                  >

                    <span
                      className={
                        check.passed
                          ? "check-icon passed"
                          : "check-icon pending"
                      }
                    >
                      {check.passed
                        ? "✓"
                        : "?"}
                    </span>

                    <span>
                      {check.label}
                    </span>

                  </div>

                )
              )}

            </div>

            {/* WARNING */}

            <div className="eligibility-warning">

              <strong>
                ⚠️ Important
              </strong>

              <p>
                This is only a preliminary
                assessment based on the information
                entered in GramBiz AI. It is not a
                loan approval or eligibility
                guarantee. Final eligibility, loan
                amount, subsidy and approval depend
                on the official scheme rules and the
                concerned financial institution.
              </p>

            </div>

            {/* OFFICIAL SOURCE */}

            {selectedScheme.officialSource && (
              <div className="eligibility-warning">

                <strong>
                  🔗 Official Source
                </strong>

                <p>
                  {selectedScheme.officialSource}
                </p>

              </div>
            )}

            {/* CLOSE BUTTON */}

            <button
              className="eligibility-close-button"
              onClick={closeEligibility}
            >
              {text.close || "Close"}
            </button>

          </div>

        </div>

      )}

      {/* IMPORTANT NOTICE */}

      <div className="scheme-note">

        <div className="scheme-note-title">
          ⚠️{" "}
          {text.important ||
            "Important Notice"}
        </div>

        <p>
          {text.schemeNote ||
            "The financing options shown here are for information and decision support only."}
        </p>

        <p>
          Always verify the latest eligibility
          requirements, documents, loan terms and
          application process through official
          government or financial institution
          sources.
        </p>

      </div>

      {/* FINAL REPORT */}

      <button
        className="schemes-final-button"
        onClick={() =>
          navigate("/final-report")
        }
      >
        {text.viewFinalReport ||
          "View Final Report"}

        <span> →</span>
      </button>

    </div>
  );
}

export default Schemes;