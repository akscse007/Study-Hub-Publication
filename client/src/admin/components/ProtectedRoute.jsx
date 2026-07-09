import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLE_RANK = { subadmin: 1, superadmin: 2, developer: 3 };

const ProtectedRoute = ({ children, minRole = "subadmin" }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="empty-state">Checking session...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (ROLE_RANK[user.role] < ROLE_RANK[minRole]) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
