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

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get("/products"),
        axios.get("/categories"),
      ]);
      console.log(prodRes.data)
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("Failed to load products or categories");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Delete failed",err);
    }
  };

  const handleSave = (updatedProduct, isEditing) => {
    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        )
      );
    } else {
      setProducts((prev) => [...prev, updatedProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
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

      {/* Form Modal */}
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
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {products.map((p) => (
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
        ))}
      </div>
    </div>
  );
}
