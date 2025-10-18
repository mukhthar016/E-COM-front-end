import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function StatusBadge({ status }) {
  const base =
    "inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize";
  const map = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Dispatched: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`${base} ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: statusFilter || undefined, sort, startDate, endDate },
      });
      setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sort, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">📦 Manage Orders</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm w-40"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

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

        <div>
          <label className="block text-sm font-semibold mb-1">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm w-44"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
        >
          Apply
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        {loading ? (
          <p className="p-6 text-center text-gray-500 animate-pulse">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="p-3 font-mono">{order._id}</td>
                  <td className="p-3">
                    <div className="font-medium">{order.user?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-3 font-semibold">₹{order.totalPrice}</td>
                  <td className="p-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-3 flex gap-2 items-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs transition"
                    >
                      View
                    </button>
                    <select
                      disabled={updatingStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded-md p-1 text-xs"
                    >
                      <option value="">Change...</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 overflow-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-700">
                  Order Details — #{selectedOrder._id}
                </h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                  ✖
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Customer</h4>
                  <p>{selectedOrder.user?.name}</p>
                  <p className="text-gray-500">{selectedOrder.user?.email}</p>

                  <h4 className="font-semibold mt-4 mb-2 text-gray-800">Payment</h4>
                  <p>Method: <strong>{selectedOrder.paymentMethod}</strong></p>
                  <p>Status: <strong>{selectedOrder.paymentStatus}</strong></p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Order Info</h4>
                  <p>Status: <StatusBadge status={selectedOrder.status} /></p>
                  <p>Total: <strong>₹{selectedOrder.totalPrice}</strong></p>
                  <p>Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <hr className="my-4" />

              <h4 className="font-semibold mb-2 text-gray-800">Products</h4>
              <div className="space-y-3">
                {selectedOrder.products.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border p-3 rounded-md bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{p.product?.name}</div>
                      <div className="text-xs text-gray-500">
                        Qty: {p.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ₹{p.product?.price ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
