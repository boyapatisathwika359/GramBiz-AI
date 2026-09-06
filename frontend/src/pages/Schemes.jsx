import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Schemes() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [user, setUser] = useState({});
  const [selectedScheme, setSelectedScheme] = useState(null);

  /* =============================
     LOAD USER DATA
  ============================= */

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    setUser(savedUser);
  }, []);

  /* =============================
     FINANCING SCHEMES
  ============================= */

  const schemes = [
    {
      id: "mudra",
      icon: "💰",
      name: text.mudraName || "PM MUDRA Yojana",
      tag: "Micro Business Finance",

      purpose:
        text.mudraPurpose ||
        "Provides institutional credit support for eligible micro and small business activities.",

      suitableFor:
        text.mudraSuitable ||
        "Small businesses, service activities, artisans and other eligible income-generating activities.",

      documents:
        text.mudraDocuments ||
        "Identity proof, address proof, business or project details and documents requested by the lender.",

      note:
        "Loan eligibility and amount depend on the applicant, business activity, lender assessment and applicable rules."
    },

    {
      id: "pmegp",
      icon: "🏭",
      name: text.pmegpName || "PMEGP",
      tag: "New Enterprise Support",

      purpose:
        text.pmegpPurpose ||
        "Supports eligible new micro-enterprises through a credit-linked subsidy structure.",

      suitableFor:
        text.pmegpSuitable ||
        "Eligible individuals planning to establish a new micro-enterprise.",

      documents:
        text.pmegpDocuments ||
        "Identity proof, project report, applicable certificates, education or skill documents and other required documents.",

      note:
        "PMEGP has specific eligibility conditions for new units, project size and other applicant requirements."
    },

    {
      id: "standup",
      icon: "🚀",
      name: text.standupName || "Stand-Up India",
      tag: "Greenfield Enterprise",

      purpose:
        text.standupPurpose ||
        "Provides bank finance for eligible greenfield enterprises under the applicable scheme framework.",

      suitableFor:
        text.standupSuitable ||
        "Eligible entrepreneurs covered by the scheme's specified beneficiary categories.",

      documents:
        text.standupDocuments ||
        "Identity proof, business plan, project details and other documents required by the lending institution.",

      note:
        "Current scheme availability and applicable replacement arrangements should be verified through official government sources before applying."
    }
  ];

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

    if (scheme.id === "mudra") {
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

    if (scheme.id === "pmegp") {
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

    if (scheme.id === "standup") {
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

      {/* =============================
          HEADER
      ============================= */}

      <div className="schemes-header">

        <div className="schemes-icon">
          🏦
        </div>

        <div className="schemes-badge">
          💡 Government Financing Guidance
        </div>

        <h1>
          {text.financingTitle || "Financing Options"}
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


      {/* =============================
          SCHEME CARDS
      ============================= */}

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
                🎯 {text.purpose || "Purpose"}
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


      {/* =============================
          ELIGIBILITY POPUP
      ============================= */}

      {selectedScheme && (

        <div className="eligibility-overlay">

          <div className="eligibility-result">

            {/* CLOSE ICON */}

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


      {/* =============================
          IMPORTANT NOTICE
      ============================= */}

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


      {/* =============================
          FINAL REPORT BUTTON
      ============================= */}

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