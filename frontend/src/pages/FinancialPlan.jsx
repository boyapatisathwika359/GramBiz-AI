import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

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
  };

  const calculatePlan = (event) => {
    event.preventDefault();

    const equipment = Number(form.equipment) || 0;
    const setup = Number(form.setup) || 0;
    const workingCapital = Number(form.workingCapital) || 0;
    const otherExpenses = Number(form.otherExpenses) || 0;
    const ownContribution = Number(form.ownContribution) || 0;

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
  };

  return (
    <div className="financial-page">

      <div className="financial-header">
        <div className="financial-icon">💰</div>

        <h1>{text.financialPlanTitle}</h1>

        <p>{text.financialPlanDescription}</p>

        {user.business && (
          <h2>
            {text.businessInterest}: {user.business}
          </h2>
        )}
      </div>

      <form
        className="financial-form"
        onSubmit={calculatePlan}
      >

        <div className="financial-input-group">
          <label>
            {text.equipmentCost}
          </label>

          <input
            type="number"
            name="equipment"
            value={form.equipment}
            onChange={handleChange}
            min="0"
            placeholder="₹ 0"
          />
        </div>

        <div className="financial-input-group">
          <label>
            {text.setupCost}
          </label>

          <input
            type="number"
            name="setup"
            value={form.setup}
            onChange={handleChange}
            min="0"
            placeholder="₹ 0"
          />
        </div>

        <div className="financial-input-group">
          <label>
            {text.workingCapital}
          </label>

          <input
            type="number"
            name="workingCapital"
            value={form.workingCapital}
            onChange={handleChange}
            min="0"
            placeholder="₹ 0"
          />
        </div>

        <div className="financial-input-group">
          <label>
            {text.otherExpenses}
          </label>

          <input
            type="number"
            name="otherExpenses"
            value={form.otherExpenses}
            onChange={handleChange}
            min="0"
            placeholder="₹ 0"
          />
        </div>

        <div className="financial-input-group">
          <label>
            {text.ownContribution}
          </label>

          <input
            type="number"
            name="ownContribution"
            value={form.ownContribution}
            onChange={handleChange}
            min="0"
            placeholder="₹ 0"
          />
        </div>

        <button
          type="submit"
          className="continue-button"
        >
          {text.calculatePlan}
        </button>

      </form>

      {result && (
        <div className="financial-summary">

          <h2>{text.financialSummary}</h2>

          <div className="summary-item">
            <span>
              {text.totalProjectCost}
            </span>

            <strong>
              ₹
              {result.totalProjectCost.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="summary-item">
            <span>
              {text.ownContribution}
            </span>

            <strong>
              ₹
              {result.ownContribution.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="summary-item">
            <span>
              {text.estimatedFundingGap}
            </span>

            <strong>
              ₹
              {result.fundingGap.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

        </div>
      )}

      <div className="financial-note">
        <strong>ℹ️</strong>{" "}
        {text.financialNote}
      </div>

      <button
        className="continue-button"
        onClick={() => navigate("/schemes")}
      >
        {text.viewFinancingOptions}
      </button>

    </div>
  );
}

export default FinancialPlan;