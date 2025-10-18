import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import OrderCard from "../components/OrderCard";
import FeedbackModal from "../components/FeedbackModal";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  // filters
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("latest");
  const [dateRange, setDateRange] = useState(""); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, statusFilter, sort, dateRange, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/orders/myorders", {
        withCredentials: true,
        params: {
          status: statusFilter,
          sort,
          range: dateRange,
          startDate: dateRange === "custom" ? startDate : undefined,
          endDate: dateRange === "custom" ? endDate : undefined,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawFeedback = async (orderId) => {
    if (!window.confirm("Are you sure you want to withdraw your feedback?")) return;
    try {
      await axios.delete(`/feedback/${orderId}`, { withCredentials: true });
      toast.success("Feedback withdrawn successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Withdraw feedback error:", err);
      toast.error(err.response?.data?.message || "Failed to withdraw feedback");
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.put(`/orders/${orderId}/cancel`, {}, { withCredentials: true });
      fetchOrders();
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen w-316 flex items-center justify-center text-blue-600 font-semibold text-xl">
        Loading orders...
      </div>
    );

  return (
    <div className="min-h-screen w-316 text-black bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        My Orders
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end justify-center">
        <div>
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">All</option>
            <option value="last6months">Last 6 Months</option>
            <option value="thisyear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {dateRange === "custom" && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
          </>
        )}

        <button
          onClick={fetchOrders}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
        >
          Apply
        </button>
      </div>

      {/* Orders List */}
      <div className="max-w-5xl mx-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
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
        ) : (
          orders.map((order) => (
            <div key={order._id} className="relative">
              <OrderCard order={order} onCancel={handleCancel} />

              {/* === Feedback UI Section === */}
              {order.status === "Delivered" && (
                <div className="absolute bottom-3 right-4 flex items-center space-x-2">
                  {!order.feedbackSubmitted ? (
                    <button
                      onClick={() => setFeedbackOrder(order)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Give Feedback
                    </button>
                  ) : (
                    <>
                      <span className="text-green-600 text-sm font-semibold">
                        Feedback already submitted
                      </span>
                      <button
                        onClick={() => handleWithdrawFeedback(order._id)}
                        className="text-red-500 hover:text-red-600 text-xs underline"
                      >
                        Withdraw
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {feedbackOrder && (
          <FeedbackModal
            order={feedbackOrder}
            onClose={() => setFeedbackOrder(null)}
            onFeedbackSubmitted={fetchOrders}
          />
        )}
      </div>
    </div>
  );
}
