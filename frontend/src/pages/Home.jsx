import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Home() {
  const navigate = useNavigate();
  const { language, changeLanguage, text } = useLanguage();

  return (
    <div className="home-page">

      {/* Top Navigation */}
      <header className="home-header">
        <div className="brand">
          <span className="brand-icon">🌱</span>
          <span>GramBiz AI</span>
        </div>

        <div className="language-selector">
          <label htmlFor="language">{text.chooseLanguage}</label>

          <select
            id="language"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Telugu">తెలుగు</option>
            <option value="Tamil">தமிழ்</option>
            <option value="Hindi">हिंदी</option>
          </select>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">

        <div className="hero-badge">
          🤖 AI-Powered Rural Business Advisory
        </div>

        <h1>
          {text.title}
        </h1>

        <h2>
          {text.subtitle}
        </h2>

        <p className="hero-description">
          {text.description}
        </p>

        <button
          className="hero-button"
          onClick={() => navigate("/user-details")}
        >
          {text.getStarted}
          <span> →</span>
        </button>

      </main>

      {/* Features */}
      <section className="features-section">

        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>Hyper-Local Insights</h3>
          <p>
            Get business guidance based on your local area,
            customer demand and market conditions.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💡</div>
          <h3>Personalized Recommendations</h3>
          <p>
            Discover business opportunities based on your
            budget, skills and available resources.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Financial Structuring</h3>
          <p>
            Understand project costs, funding gaps and
            possible financing options.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          GramBiz AI • Smart Business Guidance for Rural Entrepreneurs
        </p>
      </footer>

    </div>
  );
}

export default Home;