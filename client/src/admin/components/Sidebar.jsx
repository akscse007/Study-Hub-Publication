import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaBullhorn,
  FaWhatsapp,
  FaBoxes,
  FaHistory,
  FaCog,
  FaUserShield,
  FaStore,
  FaUsers
} from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo";
import { useAuth } from "../../context/AuthContext";

const ROLE_RANK = { subadmin: 1, superadmin: 2, developer: 3 };

const baseMenu = [
  { path: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  { path: "/admin/books", label: "Books", icon: FaBook },
  { path: "/admin/announcements", label: "Announcements", icon: FaBullhorn },
  { path: "/admin/sellers", label: "Seller Information", icon: FaStore },
  { path: "/admin/whatsapp-leads", label: "WhatsApp Leads", icon: FaWhatsapp },
  { path: "/admin/inventory", label: "Inventory", icon: FaBoxes },
  { path: "/admin/readers", label: "Landing Page", icon: FaUsers },
  { path: "/admin/activity-logs", label: "Activity Logs", icon: FaHistory }
];

const roleMenu = [
  { path: "/admin/users", label: "Admin Users", icon: FaUserShield, minRole: "subadmin" },
  { path: "/admin/settings", label: "Settings", icon: FaCog, minRole: "developer" }
];

const Sidebar = ({ open = false }) => {
  const { role } = useAuth();
  const rank = ROLE_RANK[role] || 0;

  const menu = [
    ...baseMenu,
    ...roleMenu.filter((item) => rank >= ROLE_RANK[item.minRole])
  ];

  return (
    <aside id="admin-sidebar" className={open ? "sidebar sidebar-open" : "sidebar"}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">
          <BrandLogo />
        </span>
        <div>
          <strong>Study-Hub</strong>
          <small className="brand-tagline">Success and Nothing Less</small>
          <small>Admin Panel</small>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
