import { createContext, useContext, useEffect, useState } from "react";
import { settingsApi } from "../services/api";

const defaultSettings = {
  publicationName: "Study-Hub Publication",
  tagline: "Success and Nothing Less",
  address: "15, Shyamacharan Dey Street, Kolkata - 700073",
  phone: "+91 8910464335",
  email: "studyhubpublication@gmail.com",
  facebook: "https://www.facebook.com/share/1bsC3xYt6S/",
  instagram: "",
  youtube: "",
  whatsappNumber: "+91 8697220830",
  readers: "1 Lakh+"
};

const SettingsContext = createContext(defaultSettings);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    let cancelled = false;
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        if (!cancelled) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // Keep defaults if settings cannot be loaded.
      }
    };
    loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
