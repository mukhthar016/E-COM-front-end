import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">HOME</Link>

      <div className="flex items-center gap-4">
        {user && (
          <Link to="/cart" className="relative">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </Link>
        )}

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
