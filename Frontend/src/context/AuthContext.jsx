import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Use only deployed backend URL
const backendUrl = "https://ai-newsmenia-2.onrender.com";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCurrentUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (email, password) => {
    const response = await axios.post(`${backendUrl}/api/auth/signup`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    setCurrentUser(response.data.user);
  };

  const login = async (email, password) => {
    const response = await axios.post(`${backendUrl}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    setCurrentUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const value = { currentUser, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
