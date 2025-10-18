// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]); // items: [{ product, quantity }]
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false); // avoid race on first load

  // === Helpers for guest cart ===
  const loadGuestCart = useCallback(() => {
    try {
      const raw = localStorage.getItem("guest_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const saveGuestCart = useCallback((items) => {
    try {
      localStorage.setItem("guest_cart", JSON.stringify(items));
    } catch {}
  }, []);

  // === Fetch backend cart (user only) ===
  const fetchCart = useCallback(async () => {
    if (!user) {
      // for guests, read local storage
      const g = loadGuestCart();
      setCart(g);
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("/cart"); // axiosInstance handles token/withCredentials
      setCart(res.data.items || []);
    } catch (err) {
      console.error("fetchCart error:", err);
      setCart([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user, loadGuestCart]);

  // === Merge guest cart into user cart on login ===
  const mergeGuestCart = useCallback(async () => {
    if (!user) return;
    const raw = localStorage.getItem("guest_cart");
    if (!raw) return;

    const items = JSON.parse(raw);
    // remove guest immediately to avoid duplicate merges
    localStorage.removeItem("guest_cart");

    try {
      // Send once to backend. Backend should merge and return final cart if you implement it.
      await axios.post("/cart/merge", { items });
      // fetch backend cart once to sync final server state
      await fetchCart();
    } catch (err) {
      console.error("Error merging guest cart:", err);
      // if merge fails, restore guest cart so user doesn't lose it
      saveGuestCart(items);
      await fetchCart();
    }
  }, [user, fetchCart, saveGuestCart]);

  // Initial load and user-change handling
  useEffect(() => {
    // on user change: if login -> merge guest cart then fetch
    if (user) {
      mergeGuestCart();
    } else {
      // logout or guest -> read local storage
      const g = loadGuestCart();
      setCart(g);
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // use mergeGuestCart & loadGuestCart inside to avoid dependence loops

  // Make sure we fetch cart on mount or when user changes (fetchCart called in merge or above)
  useEffect(() => {
    // only fetch if not initialized or user state changed externally
    if (!initialized) fetchCart();
  }, [fetchCart, initialized]);

  // ===== Optimistic add/update/remove helpers =====
  const addToCart = useCallback(
    async (product, quantity = 1) => {
      if (user) {
        // optimistic update locally
        setCart((prev) => {
          const idx = prev.findIndex((c) => c.product._id === product._id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
            return next;
          }
          return [...prev, { product, quantity }];
        });

        // fire-and-forget API request (still await to catch failure)
        try {
          await axios.post("/cart", { productId: product._id, quantity });
          // do NOT force a full refetch here — server will be consistent normally.
        } catch (err) {
          console.error("addToCart API failed:", err);
          // Optionally: refetch to reconcile
          fetchCart();
        }
      } else {
        // guest
        setCart((prev) => {
          const idx = prev.findIndex((c) => c.product._id === product._id);
          let next;
          if (idx > -1) {
            next = prev.map((c) =>
              c.product._id === product._id ? { ...c, quantity: c.quantity + quantity } : c
            );
          } else {
            next = [...prev, { product, quantity }];
          }
          saveGuestCart(next);
          return next;
        });
      }
    },
    [user, fetchCart, saveGuestCart]
  );

  const updateCartItem = useCallback(
    async (productId, quantity) => {
      if (user) {
        // optimistic local update
        setCart((prev) => prev.map((c) => (c.product._id === productId ? { ...c, quantity } : c)));
        try {
          await axios.put("/cart", { productId, quantity });
        } catch (err) {
          console.error("updateCartItem API failed:", err);
          // reconcile
          fetchCart();
        }
      } else {
        setCart((prev) => {
          const next = prev.map((c) => (c.product._id === productId ? { ...c, quantity } : c));
          saveGuestCart(next);
          return next;
        });
      }
    },
    [user, fetchCart, saveGuestCart]
  );

  const removeCartItem = useCallback(
    async (productId) => {
      if (user) {
        // optimistic removal
        setCart((prev) => prev.filter((c) => c.product._id !== productId));
        try {
          await axios.delete(`/cart/${productId}`);
        } catch (err) {
          console.error("removeCartItem API failed:", err);
          fetchCart();
        }
      } else {
        setCart((prev) => {
          const next = prev.filter((c) => c.product._id !== productId);
          saveGuestCart(next);
          return next;
        });
      }
    },
    [user, fetchCart, saveGuestCart]
  );

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await axios.delete("/cart");
      } catch (err) {
        console.error("clearCart failed:", err);
      }
    }
    setCart([]);
    localStorage.removeItem("guest_cart");
  }, [user]);

  // totals (recomputed only when cart changes)
  const totalItems = useMemo(() => cart.reduce((s, i) => s + (i.quantity || 0), 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 0), 0), [cart]);

  // stable context value
  const value = useMemo(
    () => ({
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      fetchCart,
      mergeGuestCart, // expose if caller wants explicit refetch
      totalItems,
      totalPrice,
    }),
    [cart, loading, addToCart, updateCartItem, removeCartItem, clearCart, fetchCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
