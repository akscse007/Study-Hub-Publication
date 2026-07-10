import { FaEnvelope } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";

// Shared email contact block (Contact Us + Write For Us). Email comes from
// Admin Settings; renders nothing if unset. `chip` renders a fully-clickable
// premium pill instead of the plain text line.
const ContactEmail = ({ chip = false }) => {
  const settings = useSettings();
  if (!settings.email) return null;
  if (chip) {
    return (
      <a className="chip-link email-chip" href={`mailto:${settings.email}`}>
        <FaEnvelope /> {settings.email}
      </a>
    );
  }
  return (
    <p>
      <FaEnvelope /> <a href={`mailto:${settings.email}`}>{settings.email}</a>
    </p>
  );
};

export default ContactEmail;
