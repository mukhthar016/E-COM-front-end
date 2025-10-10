import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  // Fetch products + categories
  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get("/products"),
        axios.get("/categories"),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("Failed to load products or categories");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error("Enter a category name");
    try {
      const res = await axios.post("/categories", { name: newCategory });
      setCategories((prev) => [...prev, res.data.category || res.data]);
      toast.success("Category added!");
      setNewCategory("");
      setAddingCategory(false);
    } catch (err) {
      toast.error("Error adding category");
      console.log(err);
    }
  };

  // Open edit modal
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category?._id || product.category,
      image: product.image,
    });
    setEditingProduct(product._id);
    setShowForm(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.log(err);
    }
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingProduct) {
        // Update product
        res = await axios.put(`/products/${editingProduct}`, {
          name: form.name,
          price: form.price,
          category: form.category,
          image: form.image,
        });
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct ? res.data.product : p))
        );
        toast.success("Product updated!");
      } else {
        // Add product
        res = await axios.post("/products", {
          name: form.name,
          price: form.price,
          categoryId: form.category,
          image: form.image,
        });
        setProducts((prev) => [...prev, res.data.product]);
        toast.success("Product added!");
      }

      // Reset form
      setForm({ name: "", price: "", category: "", image: "" });
      setEditingProduct(null);
      setShowForm(false);
    } catch (err) {
      toast.error("Error saving product");
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            setForm({ name: "", price: "", category: "", image: "" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative text-black">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border p-2 rounded"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />

              {/* Category Section */}
              <div>
                <select
                  className="w-full border p-2 rounded"
                  value={form.category}
                  onChange={(e) => {
                    if (e.target.value === "add_new") {
                      setAddingCategory(true);
                      setForm({ ...form, category: "" });
                    } else {
                      setForm({ ...form, category: e.target.value });
                      setAddingCategory(false);
                    }
                  }}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="add_new">➕ Add new category</option>
                </select>

                {addingCategory && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="New Category"
                      className="border p-2 rounded flex-1"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Image URL"
                className="w-full border p-2 rounded"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setForm({ name: "", price: "", category: "", image: "" });
                  }}
                  className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-bold text-lg mt-2">{p.name}</h3>
            <p className="text-gray-700">₹{p.price}</p>
            <p className="text-sm text-gray-500">
              {categories.find((c) => c._id === p.category)?.name || "—"}
            </p>
            <div className="mt-3 flex justify-between">
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(p)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
