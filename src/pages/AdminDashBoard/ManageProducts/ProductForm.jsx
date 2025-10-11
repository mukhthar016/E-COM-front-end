import { useState } from "react";
import axios from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import CategoryForm from "./CategoryForm";

export default function ProductForm({
  product,
  onClose,
  onSave,
  categories,
  refreshCategories,
}) {
  const [form, setForm] = useState(
    product || { name: "", price: "", stock: "", category: "", image: "" }
  );
  const [addingCategory, setAddingCategory] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (product?._id) {
        res = await axios.put(`/products/${product._id}`, form);
        onSave(res.data.product, true);
        toast.success("Product updated!");
      } else {
        res = await axios.post("/products", {
          name: form.name,
          price: form.price,
          stock: form.stock,
          categoryId: form.category,
          image: form.image,
        });
        onSave(res.data.product, false);
        toast.success("Product added!");
      }
    } catch (err) {
      toast.error("Error saving product",err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold mb-4">
          {product ? "Edit Product" : "Add Product"}
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

          <input
            type="number"
            placeholder="Stock Quantity"
            className="w-full border p-2 rounded"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />

          <select
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={(e) => {
              if (e.target.value === "add_new") {
                setAddingCategory(true);
              } else {
                setForm({ ...form, category: e.target.value });
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
            <CategoryForm
              onAdded={() => {
                setAddingCategory(false);
                refreshCategories();
              }}
            />
          )}

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
              {product ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
