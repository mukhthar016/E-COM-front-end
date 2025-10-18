import React from "react";
import  {motion}  from "framer-motion";

export default function OrderCard({ order, onCancel }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border mb-4 p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-3 border-b pb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Order #{order._id.slice(-6)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "Processing"
              ? "bg-blue-100 text-blue-800"
              : order.status === "Shipped"
              ? "bg-indigo-100 text-indigo-800"
              : order.status === "Delivered"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-200 mb-3">
        {order.products.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between items-center py-2"
          >
            <div className="flex items-center gap-3">
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-10 h-10 rounded-md object-cover border"
                />
              )}
              <span className="text-gray-700 font-medium">
                {item.product.name}
              </span>
            </div>
            <span className="text-gray-800 font-semibold">
              {item.quantity} × ₹{item.product.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center pt-2">
        <span className="font-bold text-gray-900 text-lg">
          Total: ₹{order.totalPrice.toFixed(2)}
        </span>

        {order.status === "Pending" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onCancel(order._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            Cancel Order
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
