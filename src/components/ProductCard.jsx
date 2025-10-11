import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddToCartModal from "./AddToCartModal";

export default function ProductCard({ product, onCartUpdate }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCartClick = () => {
    if (!user) return;
    setShowModal(true);
  };

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col justify-between bg-white hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 md:h-40 object-cover rounded"
      />
      <h3 className="font-bold mt-2 text-gray-800">{product.name}</h3>
      <p className="text-gray-600 mt-1">₹{product.price}</p>
      <button
        className={`mt-4 py-2 rounded text-white ${
          user
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!user}
        onClick={handleAddToCartClick}
      >
        {user ? "Add to Cart" : "Login to add"}
      </button>

      {showModal && (
        <AddToCartModal
          product={product}
          onClose={() => setShowModal(false)}
          onCartUpdate={onCartUpdate}
        />
      )}
    </div>
  );
}
