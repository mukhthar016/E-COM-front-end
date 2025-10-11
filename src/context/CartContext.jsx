import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 👈 triggers refetch

  // ✅ Centralized cart fetcher
  const fetchCart = useCallback(async () => {
    if (!user) return setCart([]);
    try {
      setLoading(true);
      const res = await axios.get("/cart", { credentials: true });
      setCart(res.data.items || []);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ✅ Fetch cart when user logs in/out or refreshTrigger changes
  useEffect(() => {
    if (user) fetchCart();
    else setCart([]);
  }, [user, refreshTrigger, fetchCart]);

  // ✅ Helper: trigger global cart refresh
  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // ✅ Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post("/cart", { productId, quantity }, { withCredentials: true });
      triggerRefresh(); // re-fetch everywhere
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  // ✅ Update item
  const updateCartItem = async (productId, quantity) => {
    try {
      await axios.put("/cart", { productId, quantity }, { withCredentials: true });
      triggerRefresh();
    } catch (err) {
      console.error("❌ Error updating cart item:", err);
    }
  };

  // ✅ Remove item
  const removeCartItem = async (productId) => {
    try {
      await axios.delete("/cart", { data: { productId }, withCredentials: true });
      triggerRefresh();
    } catch (err) {
      console.error("❌ Error removing item:", err);
    }
  };

  // ✅ Totals with safety checks
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + (item?.product?.price || 0) * (item?.quantity || 0),
    0
  );

  // ✅ (Optional) Sync across multiple tabs
  useEffect(() => {
    const syncCart = () => triggerRefresh();
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  const emitCartUpdate = () => {
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Wrap actions so they also emit update for other tabs/components
  const wrappedActions = {
    addToCart: async (...args) => {
      await addToCart(...args);
      emitCartUpdate();
    },
    updateCartItem: async (...args) => {
      await updateCartItem(...args);
      emitCartUpdate();
    },
    removeCartItem: async (...args) => {
      await removeCartItem(...args);
      emitCartUpdate();
    },
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart: wrappedActions.addToCart,
        updateCartItem: wrappedActions.updateCartItem,
        removeCartItem: wrappedActions.removeCartItem,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
