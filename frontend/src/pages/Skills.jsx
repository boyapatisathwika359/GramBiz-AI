import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Skills() {
  const navigate = useNavigate();
  const { text } = useLanguage();

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);

  const skills = [
    {
      key: "Farming",
      label: text.farming,
      icon: "🌾"
    },
    {
      key: "Cooking",
      label: text.cooking,
      icon: "🍳"
    },
    {
      key: "Tailoring",
      label: text.tailoring,
      icon: "🧵"
    },
    {
      key: "Repair",
      label: text.repair,
      icon: "🔧"
    },
    {
      key: "Dairy",
      label: text.dairy,
      icon: "🐄"
    },
    {
      key: "Handicrafts",
      label: text.handicrafts,
      icon: "🧶"
    },
    {
      key: "Retail",
      label: text.retail,
      icon: "🛒"
    },
    {
      key: "Digital Services",
      label: text.digitalServices,
      icon: "💻"
    }
  ];

  const resources = [
    {
      key: "Land",
      label: text.land,
      icon: "🌱"
    },
    {
      key: "Shop",
      label: text.shop,
      icon: "🏪"
    },
    {
      key: "Sewing Machine",
      label: text.sewingMachine,
      icon: "🪡"
    },
    {
      key: "Livestock",
      label: text.livestock,
      icon: "🐄"
    },
    {
      key: "Kitchen Equipment",
      label: text.kitchenEquipment,
      icon: "🍳"
    },
    {
      key: "Vehicle",
      label: text.vehicle,
      icon: "🚚"
    },
    {
      key: "Storage Space",
      label: text.storageSpace,
      icon: "📦"
    },
    {
      key: "Computer",
      label: text.computer,
      icon: "🖥️"
    }
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((previousSkills) => {
      if (previousSkills.includes(skill)) {
        return previousSkills.filter(
          (item) => item !== skill
        );
      }

      return [...previousSkills, skill];
    });
  };

  const toggleResource = (resource) => {
    setSelectedResources((previousResources) => {
      if (previousResources.includes(resource)) {
        return previousResources.filter(
          (item) => item !== resource
        );
      }

      return [...previousResources, resource];
    });
  };

  const handleContinue = () => {
    console.log("=================================");
    console.log("GRAMBIZ AI - SKILLS PAGE");
    console.log("=================================");

    // Check selected skills
    if (selectedSkills.length === 0) {
      alert(
        text.selectSkill ||
          "Please select at least one skill."
      );
      return;
    }

    // Check selected resources
    if (selectedResources.length === 0) {
      alert(
        text.selectResource ||
          "Please select at least one resource."
      );
      return;
    }

    // Get User Details saved from UserDetails.jsx
    const storedUser = localStorage.getItem("grambizUser");

    console.log(
      "USER DATA BEFORE ADDING SKILLS:"
    );
    console.log(storedUser);

    if (!storedUser) {
      alert(
        "User details were not found. Please enter your details again."
      );

      navigate("/user-details");
      return;
    }

    let previousData;

    try {
      previousData = JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "Unable to read grammBizUser:",
        error
      );

      alert(
        "Saved user data is invalid. Please enter your details again."
      );

      localStorage.removeItem("grambizUser");
      navigate("/user-details");
      return;
    }

    // Create final user data
    const updatedData = {
      ...previousData,

      name: previousData.name || "",
      state: previousData.state || "",
      district: previousData.district || "",
      village: previousData.village || "",

      budget: Number(previousData.budget || 0),

      business: previousData.business || "",

      skills: [...selectedSkills],

      resources: [...selectedResources]
    };

    // Save final data
    localStorage.setItem(
      "grambizUser",
      JSON.stringify(updatedData)
    );

    // Verify saved data
    const verifyData = JSON.parse(
      localStorage.getItem("grambizUser") || "{}"
    );

    console.log(
      "================================="
    );
    console.log(
      "FINAL USER DATA BEFORE ANALYSIS"
    );
    console.log(
      "================================="
    );

    console.log(verifyData);

    console.log(
      "Location:",
      `${verifyData.village}, ${verifyData.district}, ${verifyData.state}`
    );

    console.log(
      "Budget:",
      verifyData.budget
    );

    console.log(
      "Business:",
      verifyData.business
    );

    console.log(
      "Skills:",
      verifyData.skills
    );

    console.log(
      "Resources:",
      verifyData.resources
    );

    console.log(
      "================================="
    );

    // Go to Analysis page
    navigate("/analysis");
  };

  return (
    <div className="skills-page">
      <div className="skills-container">

        {/* Header */}
        <div className="skills-header">

          <div className="skills-icon">
            🛠️
          </div>

          <h1>
            {text.skillsTitle}
          </h1>

          <p>
            {text.skillsDescription}
          </p>

        </div>

        {/* Skills */}
        <section className="skills-section">

          <div className="section-title">
            <span>💡</span>

            <h2>
              {text.yourSkills}
            </h2>
          </div>

          <div className="selection-container">

            {skills.map((skill) => (

              <button
                type="button"
                key={skill.key}
                className={
                  selectedSkills.includes(skill.key)
                    ? "skill-card selected"
                    : "skill-card"
                }
                onClick={() =>
                  toggleSkill(skill.key)
                }
              >

                <span className="selection-icon">
                  {skill.icon}
                </span>

                <span className="selection-label">
                  {skill.label}
                </span>

                {selectedSkills.includes(
                  skill.key
                ) && (
                  <span className="selection-check">
                    ✓
                  </span>
                )}

              </button>

            ))}

          </div>

        </section>

        {/* Resources */}
        <section className="skills-section">

          <div className="section-title">
            <span>📦</span>

            <h2>
              {text.yourResources}
            </h2>
          </div>

          <div className="selection-container">

            {resources.map((resource) => (

              <button
                type="button"
                key={resource.key}
                className={
                  selectedResources.includes(
                    resource.key
                  )
                    ? "resource-card selected"
                    : "resource-card"
                }
                onClick={() =>
                  toggleResource(resource.key)
                }
              >

                <span className="selection-icon">
                  {resource.icon}
                </span>

                <span className="selection-label">
                  {resource.label}
                </span>

                {selectedResources.includes(
                  resource.key
                ) && (
                  <span className="selection-check">
                    ✓
                  </span>
                )}

              </button>

            ))}

          </div>

        </section>

        {/* Selection Summary */}
        <div className="selection-summary">

          <div>
            <strong>
              {selectedSkills.length}
            </strong>

            <span>
              {" "}
              Skills Selected
            </span>
          </div>

          <div>
            <strong>
              {selectedResources.length}
            </strong>

            <span>
              {" "}
              Resources Selected
            </span>
          </div>

        </div>

        {/* Continue */}
        <button
          type="button"
          className="continue-button"
          onClick={handleContinue}
        >
          {text.analyzeBusiness}

          <span>
            {" "}
            →
          </span>
        </button>

      </div>
    </div>
  );
}

export default Skills;