import React, { useState } from "react";
import AddToCartModal from "./AddToCartModal";

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    if (product.stock > 0) setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5; // 👈 low stock condition

  return (
    <>
      <div className="relative">
        {/* Product Card */}
        <div
          className={`border-none rounded-xl shadow-md p-4 flex flex-col justify-between bg-green-50 transition-all duration-200 ${
            isOutOfStock
              ? "opacity-50 blur-[1px] pointer-events-none"
              : "hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-36 object-cover rounded-md"
            />
            <h3 className="font-semibold mt-3 text-green-900 text-lg line-clamp-1">
              {product.name}
            </h3>
            <p className="text-green-600 font-medium mt-1 text-base">
              ₹{product.price}
            </p>

            
            
          </div>

          <button
            className={`mt-4 py-2 rounded-lg font-medium transition-all ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-green-700 hover:bg-green-800 text-white"
            }`}
            onClick={handleOpenModal}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* Overlay Label */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
            <span className="text-white text-xl font-bold uppercase tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <AddToCartModal product={product} onClose={handleCloseModal} />
        </div>
      )}
    </>
  );
}
