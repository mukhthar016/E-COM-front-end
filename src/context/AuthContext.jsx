// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect,useNavigate } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";

// Create Auth context
const AuthContext = createContext();

//navigation
const Navigate = useNavigate;

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Load user from localStorage on mount
  useEffect(() => {
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("/users/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      await axios.post("/users/register", { name, email, password });
      toast.success("Registration successful! Please login.");
      Navigate('/login')

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);

