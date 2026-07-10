import { createContext, useContext, useEffect, useState } from "react";
import { settingsApi } from "../services/api";

const defaultSettings = {
  publicationName: "Study-Hub Publication",
  tagline: "Success and Nothing Less",
  address: "123 College Street, Kolkata — 700073",
  phone: "+91 00000 00000",
  email: "hello@studyhubpublication.com",
  facebook: "https://facebook.com",
  instagram: "",
  youtube: "",
  whatsappNumber: "919876543210",
  readers: ""
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
