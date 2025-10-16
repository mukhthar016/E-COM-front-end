import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); 

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // hide cart on login/register pages
  const showCart = !["/login", "/register"].includes(location.pathname);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo only for user and guest */}
        {!isAdmin && (
          <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">
            E-CART
          </Link>
        )}

        <div className="flex items-center gap-4">
          {/* Guest */}
          {!user && (
            <>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
              <Link to="/register" className="hover:text-indigo-600">Register</Link>

              {showCart && (
                <Link to="/cart" className="relative hover:text-indigo-600">
                  🛒
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.reduce((sum, i) => sum + (i.quantity || 0), 0)}
                    </span>
                  )}
                </Link>
              )}
            </>
          )}

          {/* Logged-in User */}
          {user && !isAdmin && (
            <>
             
              <button onClick={() => navigate("/OrdersPage")} className="hover:text-indigo-600">Orders</button>

              {showCart && (
                <Link to="/cart" className="relative hover:text-indigo-600">
                  🛒
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.reduce((sum, i) => sum + (i.quantity || 0), 0)}
                    </span>
                  )}
                </Link>
              )}

              <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-medium">Logout</button>
            </>
          )}

          {/* Admin */}
          {isAdmin && (
            <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-medium">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}
