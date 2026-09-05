import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Schemes() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [user, setUser] = useState({});
  const [selectedScheme, setSelectedScheme] = useState(null);

  /* ============================= */
  /* LOAD USER DATA */
  /* ============================= */

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    setUser(savedUser);
  }, []);

  /* ============================= */
  /* FINANCING SCHEMES */
  /* ============================= */

  const schemes = [
    {
      id: "mudra",
      icon: "💰",
      name: text.mudraName || "PM MUDRA Yojana",
      purpose:
        text.mudraPurpose ||
        "Provides credit support for eligible micro and small business activities.",
      suitableFor:
        text.mudraSuitable ||
        "Small businesses, service activities and micro-enterprises.",
      documents:
        text.mudraDocuments ||
        "Identity proof, address proof, business-related documents and other documents required by the lender."
    },

    {
      id: "pmegp",
      icon: "🏭",
      name: text.pmegpName || "PMEGP",
      purpose:
        text.pmegpPurpose ||
        "Supports eligible new micro-enterprises through a credit-linked subsidy structure.",
      suitableFor:
        text.pmegpSuitable ||
        "Eligible entrepreneurs planning to establish a new micro-enterprise.",
      documents:
        text.pmegpDocuments ||
        "Identity proof, project details, business documents and other required documents."
    },

    {
      id: "standup",
      icon: "🚀",
      name: text.standupName || "Stand-Up India",
      purpose:
        text.standupPurpose ||
        "Provides eligible bank loans for setting up greenfield enterprises.",
      suitableFor:
        text.standupSuitable ||
        "Eligible entrepreneurs from the scheme's specified beneficiary categories.",
      documents:
        text.standupDocuments ||
        "Identity proof, business plan, project details and other required documents."
    }
  ];

  /* ============================= */
  /* CHECK ELIGIBILITY */
  /* ============================= */

  const checkEligibility = (scheme) => {
    setSelectedScheme(scheme);
  };

  /* ============================= */
  /* CLOSE ELIGIBILITY RESULT */
  /* ============================= */

  const closeEligibility = () => {
    setSelectedScheme(null);
  };

  return (
    <div className="schemes-page">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div className="schemes-header">

        <div className="schemes-icon">
          🏦
        </div>

        <h1>
          {text.financingTitle}
        </h1>

        <p>
          {text.financingDescription}
        </p>

        {user.business && (
          <h2>
            {text.businessLabel || "Business"}:{" "}
            {user.business}
          </h2>
        )}

      </div>


      {/* ============================= */}
      {/* SCHEME CARDS */}
      {/* ============================= */}

      <div className="schemes-list">

        {schemes.map((scheme) => (

          <div
            className="scheme-card"
            key={scheme.id}
          >

            {/* Scheme Icon */}

            <div className="scheme-card-icon">
              {scheme.icon}
            </div>

            {/* Scheme Name */}

            <h2>
              {scheme.name}
            </h2>

            {/* Purpose */}

            <p>
              <strong>
                {text.purpose || "Purpose"}:
              </strong>{" "}
              {scheme.purpose}
            </p>

            {/* Suitable For */}

            <p>
              <strong>
                {text.suitableFor || "May be suitable for"}:
              </strong>{" "}
              {scheme.suitableFor}
            </p>

            {/* Documents */}

            <p>
              <strong>
                {text.requiredDocuments ||
                  "Typical information/documents"}:
              </strong>{" "}
              {scheme.documents}
            </p>

            {/* Eligibility Button */}

            <button
              onClick={() => checkEligibility(scheme)}
            >
              {text.checkEligibility}
            </button>

          </div>

        ))}

      </div>


      {/* ============================= */}
      {/* ELIGIBILITY RESULT */}
      {/* ============================= */}

      {selectedScheme && (

        <div className="eligibility-result">

          <h2>
            🔎 {text.eligibilityCheck}
          </h2>

          <h3>
            {selectedScheme.name}
          </h3>

          <p>
            {text.preliminaryMessage ||
              "Based on the information currently provided, this scheme may be worth considering for your business."}
          </p>


          {/* Business */}

          <p>
            <strong>
              {text.businessLabel || "Business"}:
            </strong>{" "}
            {user.business || text.notProvided || "Not provided"}
          </p>


          {/* Budget */}

          <p>
            <strong>
              {text.availableBudget || "Available Budget"}:
            </strong>{" "}
            ₹
            {Number(user.budget || 0).toLocaleString("en-IN")}
          </p>


          {/* Preliminary Match */}

          <div className="eligibility-status">

            <span className="eligibility-icon">
              ⚠️
            </span>

            <span>
              {text.preliminaryMatch ||
                "Preliminary Match"}
            </span>

          </div>


          {/* Final Eligibility Message */}

          <p>
            {text.finalEligibility ||
              "Final eligibility depends on the official scheme rules and the concerned financial institution."}
          </p>


          {/* Close */}

          <button
            onClick={closeEligibility}
          >
            {text.close || "Close"}
          </button>

        </div>

      )}


      {/* ============================= */}
      {/* IMPORTANT NOTICE */}
      {/* ============================= */}

      <div className="scheme-note">

        <div className="scheme-note-title">
          ⚠️{" "}
          {text.important || "Important Notice"}
        </div>

        <p>
          {text.schemeNote ||
            "The financing options shown here are for information and decision support only."}
        </p>

        <p>
          Eligibility, loan amount, subsidy, interest rate
          and approval depend on the applicable scheme
          guidelines and the concerned financial institution.
        </p>

        <p>
          Please verify the latest requirements and
          documents through official sources before applying.
        </p>

      </div>


      {/* ============================= */}
      {/* FINAL REPORT BUTTON */}
      {/* ============================= */}

      <button
        className="continue-button"
        onClick={() => navigate("/final-report")}
      >
        {text.viewFinalReport}
      </button>

    </div>
  );
}

export default Schemes;