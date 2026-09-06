import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function UserDetails() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    district: "",
    village: "",
    budget: "",
    business: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!formData.state.trim()) {
      alert("Please enter your state.");
      return false;
    }

    if (!formData.district.trim()) {
      alert("Please enter your district.");
      return false;
    }

    if (!formData.village.trim()) {
      alert("Please enter your village or town.");
      return false;
    }

    if (!formData.budget) {
      alert("Please enter your available budget.");
      return false;
    }

    if (Number(formData.budget) <= 0) {
      alert("Please enter a valid budget greater than ₹0.");
      return false;
    }

    if (!formData.business.trim()) {
      alert("Please enter your business interest.");
      return false;
    }

    return true;
  };

  // ==========================================
  // CONTINUE
  // ==========================================

  const handleContinue = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // ========================================
    // CREATE CLEAN USER DATA
    // ========================================

    const userData = {
      name: formData.name.trim(),
      state: formData.state.trim(),
      district: formData.district.trim(),
      village: formData.village.trim(),
      budget: Number(formData.budget),
      business: formData.business.trim(),

      // These will be added by Skills.jsx
      skills: [],
      resources: []
    };

    // ========================================
    // SAVE USER DATA
    // ========================================

    localStorage.setItem(
      "grambizUser",
      JSON.stringify(userData)
    );

    // ========================================
    // REMOVE OLD ANALYSIS
    // ========================================

    localStorage.removeItem("grambizAnalysis");

    // ========================================
    // DEBUG INFORMATION
    // ========================================

    console.log("=================================");
    console.log("GRAMBIZ AI - USER DETAILS");
    console.log("=================================");

    console.log("USER DATA SAVED:");
    console.log(userData);

    console.log("LOCAL STORAGE CHECK:");

    const storedUser = JSON.parse(
      localStorage.getItem("grambizUser") || "{}"
    );

    console.log(storedUser);

    console.log("=================================");

    // ========================================
    // GO TO SKILLS PAGE
    // ========================================

    navigate("/skills");
  };

  return (
    <div className="user-details-page">

      <div className="user-details-container">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="form-header">

          <div className="form-icon">
            👤
          </div>

          <h1>
            {text.userDetailsTitle}
          </h1>

          <p>
            {text.userDetailsDescription}
          </p>

        </div>

        {/* ==================================
            FORM
        ================================== */}

        <form onSubmit={handleContinue}>

          <div className="form-grid">

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={text.namePlaceholder}
                autoComplete="name"
              />

            </div>

            {/* STATE */}

            <div className="form-group">

              <label>
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder={text.statePlaceholder}
                autoComplete="address-level1"
              />

            </div>

            {/* DISTRICT */}

            <div className="form-group">

              <label>
                District
              </label>

              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder={text.districtPlaceholder}
                autoComplete="address-level2"
              />

            </div>

            {/* VILLAGE */}

            <div className="form-group">

              <label>
                Village / Town
              </label>

              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder={text.villagePlaceholder}
                autoComplete="address-line1"
              />

            </div>

            {/* BUDGET */}

            <div className="form-group">

              <label>
                Available Budget (₹)
              </label>

              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder={text.budgetPlaceholder}
                min="1"
                step="1"
              />

            </div>

            {/* BUSINESS */}

            <div className="form-group">

              <label>
                Business Interest
              </label>

              <input
                type="text"
                name="business"
                value={formData.business}
                onChange={handleChange}
                placeholder={text.businessPlaceholder}
              />

            </div>

          </div>

          {/* ==================================
              INFORMATION
          ================================== */}

          <div className="form-info">

            📍 Your location helps GramBiz AI provide
            more relevant local business insights.

          </div>

          {/* ==================================
              CONTINUE BUTTON
          ================================== */}

          <button
            type="submit"
            className="details-continue-button"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? "Saving..."
              : text.continueButton}

            {!isSubmitting && (
              <span>
                →
              </span>
            )}

          </button>

        </form>

      </div>

    </div>
  );
}

export default UserDetails;