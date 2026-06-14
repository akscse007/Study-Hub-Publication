import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = (token) => {
    if (token) {
      localStorage.setItem("sh_token", token);
    } else {
      localStorage.removeItem("sh_token");
    }
  };

  const getToken = () => localStorage.getItem("sh_token");

  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Invalid token");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (userId, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // ignore
      }
    }
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    getToken,
    loading,
    refreshProfile: fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
