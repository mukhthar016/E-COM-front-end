// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, token } = useAuth();

  // still loading user from localStorage (token present but user state not set yet)
  if (token && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // if not logged in -> send to login
  if (!user) return <Navigate to="/login" replace />;

  // if route requires admin but user isn't admin -> send to home
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  // allowed
  return children;
}
