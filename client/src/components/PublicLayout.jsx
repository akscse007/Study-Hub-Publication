import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { SettingsProvider } from "../context/SettingsContext";

const PublicLayout = () => {
  return (
    <SettingsProvider>
      <div className="app-shell">
        <TopBar />
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </SettingsProvider>
  );
};

export default PublicLayout;
