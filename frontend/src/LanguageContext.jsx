import { createContext, useContext, useState } from "react";
import translations from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("grambizLanguage") || "English"
  );

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("grambizLanguage", newLanguage);
  };

  const text = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        text
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}