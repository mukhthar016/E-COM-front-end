import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

export default function AddToCartModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleIncrease = () => {
    if (quantity >= product.stock) {
      toast.warn(`Only ${product.stock} left in stock`);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = async () => {
    if (quantity < 1) return toast.error("Quantity must be at least 1");
    if (quantity > product.stock)
      return toast.error(`Only ${product.stock} available in stock`);

    try {
      setLoading(true);
      await addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
      onClose();
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Smooth fade-in animation
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 
      transition-opacity duration-300 z-50 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm relative animate-fadeInUp 
                   transform transition-transform duration-300 scale-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Product Info */}
        <div className="flex flex-col items-center text-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-40 h-40 object-cover rounded-lg mb-4 shadow-md"
          />
          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
          <p className="text-indigo-600 font-bold mt-1 text-lg">
            ₹{product.price}
          </p>
         
        </div>

        {/* Quantity Selector */}
        <div className="flex justify-center items-center gap-3 mt-5 text-gray-100">
          <button
            onClick={handleDecrease}
            className="bg-gray-200 hover:bg-gray-300 text-xl w-8 h-8 rounded-full flex items-center justify-center"
          >
            −
          </button>
          <span className="text-lg font-semibold text-black">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="bg-gray-200 hover:bg-gray-300 text-xl w-8 h-8 rounded-full flex items-center justify-center"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <p className="text-gray-700 text-center mt-4 font-medium">
          Total:{" "}
          <span className="text-indigo-600 font-bold">
            ₹{(product.price * quantity).toFixed(2)}
          </span>
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock <= 0}
          className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 
                     rounded-lg font-semibold transition disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
