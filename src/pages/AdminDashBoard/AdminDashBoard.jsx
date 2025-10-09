import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ManageProducts from "./ManageProducts";
import ManageUsers from "./ManageUsers";
import ManageOrders from "./ManageOrders";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

console.log("hello")
  // Handle missing or wrong role
  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center text-red-600 text-2xl font-semibold">
          🚫 Access Denied: Admins only.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Admin Panel
          </h2>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab("products")}
              className={`p-2 rounded text-left ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
            >
              🛍️ Manage Products
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`p-2 rounded text-left ${
                activeTab === "users"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
            >
              👥 Manage Users
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`p-2 rounded text-left ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
            >
              📦 Manage Orders
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "products" && <ManageProducts />}
        {activeTab === "users" && <ManageUsers />}
        {activeTab === "orders" && <ManageOrders />}
      </main>
    </div>
  );
}
