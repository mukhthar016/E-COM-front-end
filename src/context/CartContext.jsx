import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== Load cart when user changes =====
  useEffect(() => {
    if (user) mergeGuestCart();
    else loadGuestCart();
  }, [user]);

  // ===== Guest Cart Helpers =====
  const loadGuestCart = () => {
    const guestCart = localStorage.getItem("guest_cart");
    setCart(guestCart ? JSON.parse(guestCart) : []);
  };

  const saveGuestCart = (items) => {
    localStorage.setItem("guest_cart", JSON.stringify(items));
  };

  // ===== Fetch User Cart =====
  const fetchCart = useCallback(async () => {
    if (!user) return loadGuestCart();
    try {
      setLoading(true);
      const res = await axios.get("/cart", { withCredentials: true });
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  // ===== Merge Guest Cart =====
  const mergeGuestCart = async () => {
  const guestCart = localStorage.getItem("guest_cart");
  if (!user || !guestCart) return;

  try {
    const guestItems = JSON.parse(guestCart);

    // 1️⃣ Fetch existing user cart first
    const res = await axios.get("/cart", { withCredentials: true });
    const userItems = res.data.items || [];

    // 2️⃣ Build a merged map combining quantities
    const mergedMap = new Map();

    // Add existing user cart items first
    for (const item of userItems) {
      mergedMap.set(item.product._id, { productId: item.product._id, quantity: item.quantity });
    }

    // Add guest items (increase quantity if already exists)
    for (const gItem of guestItems) {
      const pid = gItem.product._id;
      if (mergedMap.has(pid)) {
        mergedMap.get(pid).quantity += gItem.quantity;
      } else {
        mergedMap.set(pid, { productId: pid, quantity: gItem.quantity });
      }
    }

    // 3️⃣ Clear backend cart before re-adding merged version
    await axios.delete("/cart", { withCredentials: true });

    // 4️⃣ Add merged items back
    for (const item of mergedMap.values()) {
      await axios.post("/cart", item, { withCredentials: true });
    }

    // 5️⃣ Clear guest cart
    localStorage.removeItem("guest_cart");

    // 6️⃣ Refresh final cart state
    await fetchCart();
  } catch (err) {
    console.error("Error merging guest cart:", err);
  }
};


  // ===== Add / Update / Remove =====
  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await axios.post("/cart", { productId: product._id, quantity }, { withCredentials: true });
        fetchCart();
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    } else {
      const existing = cart.find((c) => c.product._id === product._id);
      let updatedCart;
      if (existing) {
        updatedCart = cart.map((c) =>
          c.product._id === product._id ? { ...c, quantity: c.quantity + quantity } : c
        );
      } else {
        updatedCart = [...cart, { product, quantity }];
      }
      setCart(updatedCart);
      saveGuestCart(updatedCart);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (user) {
      try {
        await axios.put("/cart", { productId, quantity }, { withCredentials: true });
        fetchCart();
      } catch (err) {
        console.error("Error updating cart:", err);
      }
    } else {
      const updatedCart = cart.map((c) =>
        c.product._id === productId ? { ...c, quantity } : c
      );
      setCart(updatedCart);
      saveGuestCart(updatedCart);
    }
  };

  const removeCartItem = async (productId) => {
    if (user) {
      try {
        await axios.delete("/cart", { data: { productId }, withCredentials: true });
        fetchCart();
      } catch (err) {
        console.error("Error removing cart item:", err);
      }
    } else {
      const updatedCart = cart.filter((c) => c.product._id !== productId);
      setCart(updatedCart);
      saveGuestCart(updatedCart);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await axios.delete("/cart", { withCredentials: true });
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
    setCart([]);
    localStorage.removeItem("guest_cart");
  };

  // ===== Totals =====
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        fetchCart,
        mergeGuestCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
