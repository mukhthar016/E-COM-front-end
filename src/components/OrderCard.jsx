import React from "react";

export default function OrderCard({ order, onCancel }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4 border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">
          Order #{order._id.slice(-6)}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "Dispatched"
              ? "bg-blue-100 text-blue-800"
              : order.status === "Delivered"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mb-3">
        {order.products.map((item) => (
          <div key={item.product._id} className="flex justify-between py-1">
            <span className="text-gray-700">{item.product.name}</span>
            <span className="text-gray-800 font-semibold">
              {item.quantity} × ₹{item.product.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800">
          Total: ₹{order.totalPrice.toFixed(2)}
        </span>
        {order.status === "Pending" && (
          <button
            onClick={() => onCancel(order._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
