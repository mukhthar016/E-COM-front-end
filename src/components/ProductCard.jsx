import React, { useState } from "react";
import AddToCartModal from "./AddToCartModal";

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      {/* Product Card */}
      <div
        className="border-none rounded-xl shadow-md p-4 flex flex-col justify-between bg-green-50 
                   hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
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
          className="mt-4 bg-green-100 hover:bg-green-900 text-white py-2 rounded-lg font-medium transition-all"
          onClick={handleOpenModal}
        >
          Add to Cart
        </button>
      </div>

      {/* Modal (Placed outside to avoid layout clipping issues) */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <AddToCartModal product={product} onClose={handleCloseModal} />
        </div>
      )}
    </>
  );
}
