import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Edit, Trash2, Save, X } from "lucide-react";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editing, setEditing] = useState(null); // category id being edited
  const [editValues, setEditValues] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAdd = async () => {
    if (!newCategory.trim()) return toast.error("Enter a name");
    try {
      await axios.post("/categories", { name: newCategory, description: newDescription });
      toast.success("Category added!");
      setNewCategory("");
      setNewDescription("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding category");
    }
  };

  // Update
  const handleUpdate = async (id) => {
    try {
      await axios.put(`/categories/${id}`, editValues);
      toast.success("Category updated!");
      setEditing(null);
      fetchCategories();
    } catch {
      toast.error("Error updating category");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      toast.success("Deleted successfully");
      fetchCategories();
    } catch {
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Manage Categories</h1>

      {/* Add form */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-lg shadow-md border mb-6">
        <input
          type="text"
          placeholder="Category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Description</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">
                  {editing === cat._id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="p-3">
                  {editing === cat._id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editValues.description}
                      onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                    />
                  ) : (
                    cat.description || "-"
                  )}
                </td>
                <td className="p-3 text-right flex justify-end gap-2">
                  {editing === cat._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(cat._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditing(cat._id);
                          setEditValues({ name: cat.name, description: cat.description || "" });
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
