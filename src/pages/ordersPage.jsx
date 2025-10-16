import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import OrderCard from "../components/OrderCard";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/orders/myorders", { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.put(`/orders/${orderId}/cancel`, {}, { withCredentials: true });
      fetchOrders(); // refresh orders
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-316 flex items-center justify-center text-blue-600 font-semibold text-xl">
        Loading orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen w-316 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">
          You have no orders yet.
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-316 bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        My Orders
      </h1>
      <div className="max-w-5xl mx-auto">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} onCancel={handleCancel} />
        ))}
      </div>
    </div>
  );
}
