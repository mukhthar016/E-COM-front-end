import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, token } = useAuth();

  if (token && user === null) {
    // Loading user
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.isAdmin) return <Navigate to="/admin" />;
  return children;
}
