import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, LogOut, LogIn, UserPlus, Package } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.isAdmin === true;
  const showCart = !["/login", "/register"].includes(location.pathname);
  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center text-green-800">
        {/* ===== Brand ===== */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="text-xl md:text-2xl font-semibold tracking-tight text-green-800 hover:text-green-600 transition-all"
        >
          {isAdmin ? "Admin Panel" : "E-CART"}
        </Link>

        {/* ===== Links ===== */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* -------- GUEST -------- */}
          {!user && (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all"
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all"
              >
                <UserPlus size={16} />
                Register
              </Link>

              {showCart && (
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-indigo-600 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-medium">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </>
          )}

          {/* -------- USER -------- */}
          {user && !isAdmin && (
            <>
              <button
                onClick={() => navigate("/OrdersPage")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-100 hover:text-green-100 transition-all"
              >
                <Package size={16} />
                Orders
              </button>

              {showCart && (
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-green-500 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-medium">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          {/* -------- ADMIN -------- */}
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
