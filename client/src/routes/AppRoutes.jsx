import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import HomePage from "../pages/HomePage";
import BooksPage from "../pages/BooksPage";
import BookDetailsPage from "../pages/BookDetailsPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import FaqPage from "../pages/FaqPage";
import AnnouncementsPage from "../pages/AnnouncementsPage";
import WriteForUsPage from "../pages/WriteForUsPage";
import MediaPage from "../pages/MediaPage";
import SellerInfoPage from "../pages/SellerInfoPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import DisclaimerPage from "../pages/DisclaimerPage";
import DevelopersPage from "../pages/DevelopersPage";
import NotFoundPage from "../pages/NotFoundPage";

import AdminLayout from "../admin/components/Layout";
import ProtectedRoute from "../admin/components/ProtectedRoute";
import Login from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard";
import Books from "../admin/pages/Books";
import Announcements from "../admin/pages/Announcements";
import WhatsAppLeads from "../admin/pages/WhatsAppLeads";
import Inventory from "../admin/pages/Inventory";
import ActivityLogs from "../admin/pages/ActivityLogs";
import Readers from "../admin/pages/Readers";
import Settings from "../admin/pages/Settings";
import AdminUsers from "../admin/pages/AdminUsers";
import Sellers from "../admin/pages/Sellers";

// Code-split: the landing page ships its own chunk so the main site bundle stays unchanged.
const LandingPage = lazy(() => import("../pages/LandingPage"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={null}>
            <LandingPage />
          </Suspense>
        }
      />
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/write-for-us" element={<WriteForUsPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/seller-information" element={<SellerInfoPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/admin/login" element={<Login />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute minRole="subadmin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="whatsapp-leads" element={<WhatsAppLeads />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="readers" element={<Readers />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route
          path="settings"
          element={
            <ProtectedRoute minRole="developer">
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
