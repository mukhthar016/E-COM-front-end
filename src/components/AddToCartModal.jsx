import { useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

export default function AddToCartModal({ product, onClose, onCartUpdate }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (quantity < 1) return toast.error("Quantity must be at least 1");
    try {
      setLoading(true);
      const res = await axios.post("/cart", {
        productId: product._id,
        quantity,
      });
      toast.success("Added to cart!");
      onCartUpdate(res.data.cart); // send updated cart to parent
      onClose();
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold mb-4">{product.name}</h3>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded mb-4"
        />
        <p className="text-gray-700 mb-2">Price: ₹{product.price}</p>

        <div className="flex items-center gap-2 mb-4">
          <label className="font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-1 w-20 rounded text-center"
          />
        </div>

        <p className="text-gray-800 mb-4">
          Total: ₹{(product.price * quantity).toFixed(2)}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
