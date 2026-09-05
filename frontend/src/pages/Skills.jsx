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
      label: text.farming
    },
    {
      key: "Cooking",
      label: text.cooking
    },
    {
      key: "Tailoring",
      label: text.tailoring
    },
    {
      key: "Repair",
      label: text.repair
    },
    {
      key: "Dairy",
      label: text.dairy
    },
    {
      key: "Handicrafts",
      label: text.handicrafts
    },
    {
      key: "Retail",
      label: text.retail
    },
    {
      key: "Digital Services",
      label: text.digitalServices
    }
  ];

  const resources = [
    {
      key: "Land",
      label: text.land
    },
    {
      key: "Shop",
      label: text.shop
    },
    {
      key: "Sewing Machine",
      label: text.sewingMachine
    },
    {
      key: "Livestock",
      label: text.livestock
    },
    {
      key: "Kitchen Equipment",
      label: text.kitchenEquipment
    },
    {
      key: "Vehicle",
      label: text.vehicle
    },
    {
      key: "Storage Space",
      label: text.storageSpace
    },
    {
      key: "Computer",
      label: text.computer
    }
  ];

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((value) => value !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleContinue = () => {
    if (selectedSkills.length === 0) {
      alert(text.selectSkill);
      return;
    }

    if (selectedResources.length === 0) {
      alert(text.selectResource);
      return;
    }

    const previousData =
      JSON.parse(localStorage.getItem("grambizUser")) || {};

    const updatedData = {
      ...previousData,
      skills: selectedSkills,
      resources: selectedResources
    };

    localStorage.setItem(
      "grambizUser",
      JSON.stringify(updatedData)
    );

    navigate("/analysis");
  };

  return (
    <div className="skills-page">

      <h1>{text.skillsTitle}</h1>

      <p>{text.skillsDescription}</p>

      <h2>{text.yourSkills}</h2>

      <div className="selection-container">
        {skills.map((skill) => (
          <button
            key={skill.key}
            className={
              selectedSkills.includes(skill.key)
                ? "selected"
                : ""
            }
            onClick={() =>
              toggleSelection(
                skill.key,
                selectedSkills,
                setSelectedSkills
              )
            }
          >
            {skill.label}
          </button>
        ))}
      </div>

      <h2>{text.yourResources}</h2>

      <div className="selection-container">
        {resources.map((resource) => (
          <button
            key={resource.key}
            className={
              selectedResources.includes(resource.key)
                ? "selected"
                : ""
            }
            onClick={() =>
              toggleSelection(
                resource.key,
                selectedResources,
                setSelectedResources
              )
            }
          >
            {resource.label}
          </button>
        ))}
      </div>

      <button
        className="continue-button"
        onClick={handleContinue}
      >
        {text.analyzeBusiness}
      </button>

    </div>
  );
}

export default Skills;