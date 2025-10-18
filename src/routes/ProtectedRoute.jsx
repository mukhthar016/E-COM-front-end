// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  userOnly = false,
  guestAllowed = false,
}) {
  const { user, token } = useAuth();

  // Wait for user state to load if token exists
  if (token && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // If route allows guests (no login required)
  if (guestAllowed) {
    // Block admins from guest routes like home/cart
    if (user?.isAdmin === true) {
      return <Navigate to="/admin" replace />;
    }
    return children;
  }

  // For all other routes, must be logged in
  if (!user) return <Navigate to="/login" replace />;

  // If admin-only route and user is not admin
  if (adminOnly && user.isAdmin !== true) return <Navigate to="/" replace />;

  // If user-only route and user is admin
  if (userOnly && user.isAdmin === true) return <Navigate to="/admin" replace />;

  // ✅ Allowed
  return children;
}
