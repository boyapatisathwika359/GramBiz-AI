import { useState } from "react";
import { useNavigate } from "react-router-dom";
import translations from "../translations";

function Home() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    localStorage.getItem("grambizLanguage") || "English"
  );

  const text = translations[language];

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);

    localStorage.setItem(
      "grambizLanguage",
      selectedLanguage
    );
  };

  return (
    <div className="home-page">

      {/* Language Selection */}
      <div className="language-box">
        <label htmlFor="language">
          {text.chooseLanguage}
        </label>

        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="English">English</option>
          <option value="Telugu">తెలుగు</option>
          <option value="Tamil">தமிழ்</option>
          <option value="Hindi">हिंदी</option>
        </select>
      </div>

      {/* Project Title */}
      <h1>{text.title}</h1>

      {/* Subtitle */}
      <h2>{text.subtitle}</h2>

      {/* Description */}
      <p>{text.description}</p>

      {/* Button */}
      <button onClick={() => navigate("/user-details")}>
        {text.getStarted}
      </button>

    </div>
  );
}

export default Home;