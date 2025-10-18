import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ManageProducts from "./ManageProducts/ManageProducts";
import ManageUsers from "./ManageUsers";
import ManageOrders from "./ManageOrders";
import CategoryPage from "./CategoryPage";
import ManageFeedback from "./ManageFeedback"

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

//console.log("hello")
  // Handle missing or wrong role
  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-center text-red-600 text-2xl font-semibold">
          🚫 Access Denied: Admins only.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-316 bg-gray-100 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab("products")}
              className={`p-2 rounded text-left text-white ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
            >
              🛍️ Manage Products
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`p-2 rounded text-left text-white ${
                activeTab === "users"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
            >
              👥 Manage Users
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`p-2 rounded text-left  text-white ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
            >
              📦 Manage Orders
            </button>
            <button
              onClick={() => setActiveTab("category")}
              className={`p-2 rounded text-left  text-white ${
                activeTab === "category"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
            >
               Manage category
            </button>
            <button
  onClick={() => setActiveTab("feedbacks")}
  className={`p-2 rounded text-left  text-white ${
    activeTab === "feedbacks"
      ? "bg-blue-600 text-white"
      : "hover:bg-blue-100 text-gray-800"
  }`}
>
  📝 Manage Feedback
</button>

          </nav>
        </div>

        
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "products" && <ManageProducts />}
        {activeTab === "users" && <ManageUsers />}
        {activeTab === "orders" && <ManageOrders />}
        {activeTab === "category" && <CategoryPage />}
        {activeTab === "feedbacks" && <ManageFeedback />}

      </main>
    </div>
  );
}
