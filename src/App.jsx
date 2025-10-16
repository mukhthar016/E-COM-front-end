import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashBoard from "./pages/AdminDashBoard/AdminDashBoard";
import ProtectedRoute from "./routes/ProtectedRoute";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";

// Wrapper to block login/register for logged in users
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.isAdmin) return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<HomePage />} />
            
            <Route path="/OrdersPage" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashBoard /></ProtectedRoute>} />
          </Routes>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
