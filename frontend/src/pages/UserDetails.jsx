import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function UserDetails() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    state: "",
    district: "",
    village: "",
    budget: "",
    business: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.state ||
      !form.district ||
      !form.village ||
      !form.budget ||
      !form.business
    ) {
      alert(text.fillDetails);
      return;
    }

    localStorage.setItem(
      "grambizUser",
      JSON.stringify(form)
    );

    navigate("/skills");
  };

  return (
    <div className="form-page">

      <h1>{text.userDetailsTitle}</h1>

      <p>
        {text.userDetailsDescription}
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder={text.namePlaceholder}
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="state"
          placeholder={text.statePlaceholder}
          value={form.state}
          onChange={handleChange}
        />

        <input
          type="text"
          name="district"
          placeholder={text.districtPlaceholder}
          value={form.district}
          onChange={handleChange}
        />

        <input
          type="text"
          name="village"
          placeholder={text.villagePlaceholder}
          value={form.village}
          onChange={handleChange}
        />

        <input
          type="number"
          name="budget"
          placeholder={text.budgetPlaceholder}
          value={form.budget}
          onChange={handleChange}
          min="1"
        />

        <input
          type="text"
          name="business"
          placeholder={text.businessPlaceholder}
          value={form.business}
          onChange={handleChange}
        />

        <button type="submit">
          {text.continueButton}
        </button>

      </form>

    </div>
  );
}

export default UserDetails;