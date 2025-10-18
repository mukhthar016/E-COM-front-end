import { useEffect, useState } from "react";
import axios from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();

      if (search) query.append("search", search);
      if (sort) query.append("sort", sort);
      if (order) query.append("order", order);

      const [prodRes, catRes] = await Promise.all([
        axios.get(`/products?${query.toString()}`),
        axios.get("/categories"),
      ]);

      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("Failed to load products or categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, sort, order]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Delete failed", err);
    }
  };

  const handleSave = (updatedProduct, isEditing) => {
    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
    } else {
      setProducts((prev) => [...prev, updatedProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search products or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Sort by Dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Sort by</option>
          <option value="price">Price</option>
          
        </select>

        {/* Order Dropdown */}
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setSearch("");
            setSort("");
            setOrder("asc");
          }}
          className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          product={editingProduct}
          categories={categories}
          refreshCategories={fetchData}
        />
      )}

      {/* Product List */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading products...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                categories={categories}
                onEdit={(prod) => {
                  setEditingProduct(prod);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-gray-600 text-center col-span-3">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
