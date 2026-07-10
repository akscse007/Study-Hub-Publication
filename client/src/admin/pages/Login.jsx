import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaLock, FaUser } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(userId, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-icon">
            <BrandLogo />
          </span>
          <div>
            <strong>Study-Hub</strong>
            <small className="brand-tagline">Success and Nothing Less</small>
            <small>Admin Login</small>
          </div>
        </div>
        {error ? <p className="admin-login-error">{error}</p> : null}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User ID</label>
            <div className="admin-login-input-wrap">
              <FaUser />
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="admin-login-input-wrap">
              <FaLock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary admin-login-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
