// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">MyShop</Link>
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
          </>
        ) : (
          <>
            <span className="font-semibold">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
