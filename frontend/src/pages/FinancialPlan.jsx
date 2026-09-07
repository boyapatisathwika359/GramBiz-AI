import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API from "../api";

function FinancialPlan() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [user, setUser] = useState({});

  const [form, setForm] = useState({
    equipment: "",
    setup: "",
    workingCapital: "",
    otherExpenses: "",
    ownContribution: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    setUser(savedUser);

    setForm((previous) => ({
      ...previous,
      ownContribution: savedUser.budget || ""
    }));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const calculatePlan = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const equipment = Number(form.equipment) || 0;
    const setup = Number(form.setup) || 0;
    const workingCapital = Number(form.workingCapital) || 0;
    const otherExpenses = Number(form.otherExpenses) || 0;
    const ownContribution = Number(form.ownContribution) || 0;

    const requestData = {
      equipment,
      setup,
      working_capital: workingCapital,
      other_expenses: otherExpenses,
      own_contribution: ownContribution,

      // Optional financial inputs for the backend.
      monthly_expenses: 0,
      estimated_monthly_revenue: 0
    };

    console.log("=================================");
    console.log("GRAMBIZ AI - FINANCIAL PLAN");
    console.log("=================================");
    console.log("REQUEST DATA:", requestData);

    try {
      const response = await API.post(
        "/api/financial-plan",
        requestData
      );

      console.log("FINANCIAL API RESPONSE:", response.data);

      const data = response.data;

      /*
       * Convert backend snake_case response
       * into the names used by this React page.
       */
      const financialData = {
        equipment: Number(
          data.equipment ?? equipment
        ),

        setup: Number(
          data.setup ?? setup
        ),

        workingCapital: Number(
          data.working_capital ?? workingCapital
        ),

        otherExpenses: Number(
          data.other_expenses ?? otherExpenses
        ),

        ownContribution: Number(
          data.own_contribution ?? ownContribution
        ),

        totalProjectCost: Number(
          data.total_project_cost ??
          data.totalProjectCost ??
          equipment +
            setup +
            workingCapital +
            otherExpenses
        ),

        fundingGap: Number(
          data.funding_gap ??
          data.fundingGap ??
          Math.max(
            equipment +
              setup +
              workingCapital +
              otherExpenses -
              ownContribution,
            0
          )
        )
      };

      setResult(financialData);

      localStorage.setItem(
        "grambizFinancial",
        JSON.stringify(financialData)
      );
    } catch (apiError) {
      console.error(
        "GRAMBIZ AI - FINANCIAL API ERROR:",
        apiError
      );

      /*
       * Fallback calculation:
       * If the backend is temporarily unavailable,
       * the user can still see the financial estimate.
       */
      const totalProjectCost =
        equipment +
        setup +
        workingCapital +
        otherExpenses;

      const fundingGap = Math.max(
        totalProjectCost - ownContribution,
        0
      );

      const financialData = {
        equipment,
        setup,
        workingCapital,
        otherExpenses,
        ownContribution,
        totalProjectCost,
        fundingGap
      };

      setResult(financialData);

      localStorage.setItem(
        "grambizFinancial",
        JSON.stringify(financialData)
      );

      setError(
        "Backend financial service is unavailable. Showing a local estimate."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financial-page">

      {/* Header */}
      <div className="financial-header">

        <div className="financial-icon">
          💰
        </div>

        <div className="financial-badge">
          Financial Planning Assistant
        </div>

        <h1>{text.financialPlanTitle}</h1>

        <p>{text.financialPlanDescription}</p>

        {user.business && (
          <div className="financial-business">
            <span>{text.businessInterest}</span>
            <strong>{user.business}</strong>
          </div>
        )}

      </div>

      {/* Financial Form */}
      <form
        className="financial-form"
        onSubmit={calculatePlan}
      >

        <div className="financial-form-header">

          <h2>
            Project Cost Details
          </h2>

          <p>
            Enter approximate costs to estimate your
            financial requirement.
          </p>

        </div>

        <div className="financial-input-grid">

          {/* Equipment */}
          <div className="financial-input-group">

            <label>
              {text.equipmentCost}
            </label>

            <div className="input-with-symbol">

              <span>₹</span>

              <input
                type="number"
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />

            </div>

          </div>

          {/* Setup */}
          <div className="financial-input-group">

            <label>
              {text.setupCost}
            </label>

            <div className="input-with-symbol">

              <span>₹</span>

              <input
                type="number"
                name="setup"
                value={form.setup}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />

            </div>

          </div>

          {/* Working Capital */}
          <div className="financial-input-group">

            <label>
              {text.workingCapital}
            </label>

            <div className="input-with-symbol">

              <span>₹</span>

              <input
                type="number"
                name="workingCapital"
                value={form.workingCapital}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />

            </div>

          </div>

          {/* Other Expenses */}
          <div className="financial-input-group">

            <label>
              {text.otherExpenses}
            </label>

            <div className="input-with-symbol">

              <span>₹</span>

              <input
                type="number"
                name="otherExpenses"
                value={form.otherExpenses}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />

            </div>

          </div>

          {/* Own Contribution */}
          <div className="financial-input-group own-contribution-group">

            <label>
              {text.ownContribution}
            </label>

            <div className="input-with-symbol">

              <span>₹</span>

              <input
                type="number"
                name="ownContribution"
                value={form.ownContribution}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />

            </div>

            <small>
              Based on the budget you entered earlier.
            </small>

          </div>

        </div>

        {/* Error / fallback message */}
        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "8px",
              background: "#fff3cd",
              color: "#664d03"
            }}
          >
            {error}
          </div>
        )}

        {/* Calculate Button */}
        <button
          type="submit"
          className="calculate-button"
          disabled={loading}
        >
          {loading
            ? "Calculating..."
            : text.calculatePlan}

          {!loading && <span> →</span>}
        </button>

      </form>

      {/* Financial Summary */}
      {result && (
        <div className="financial-summary">

          <div className="summary-header">

            <div>

              <span>📊</span>

              <h2>
                {text.financialSummary}
              </h2>

            </div>

          </div>

          <div className="summary-grid">

            {/* Total Project Cost */}
            <div className="summary-card">

              <span>🏗️</span>

              <small>
                {text.totalProjectCost}
              </small>

              <strong>
                ₹
                {result.totalProjectCost.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* Own Contribution */}
            <div className="summary-card">

              <span>👤</span>

              <small>
                {text.ownContribution}
              </small>

              <strong>
                ₹
                {result.ownContribution.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* Funding Gap */}
            <div className="summary-card funding-card">

              <span>🏦</span>

              <small>
                {text.estimatedFundingGap}
              </small>

              <strong>
                ₹
                {result.fundingGap.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          {/* Cost Breakdown */}
          <div className="financial-breakdown">

            <h3>
              Cost Breakdown
            </h3>

            <div className="breakdown-row">

              <span>
                {text.equipmentCost}
              </span>

              <strong>
                ₹
                {result.equipment.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="breakdown-row">

              <span>
                {text.setupCost}
              </span>

              <strong>
                ₹
                {result.setup.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="breakdown-row">

              <span>
                {text.workingCapital}
              </span>

              <strong>
                ₹
                {result.workingCapital.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="breakdown-row">

              <span>
                {text.otherExpenses}
              </span>

              <strong>
                ₹
                {result.otherExpenses.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

        </div>
      )}

      {/* Important Note */}
      <div className="financial-note">

        <span>ℹ️</span>

        <div>

          <strong>
            Financial Estimate
          </strong>

          <p>
            {text.financialNote}
          </p>

        </div>

      </div>

      {/* Continue */}
      <button
        className="financial-button"
        onClick={() =>
          navigate("/schemes")
        }
      >
        {text.viewFinancingOptions}
        <span> →</span>
      </button>

    </div>
  );
}

export default FinancialPlan;