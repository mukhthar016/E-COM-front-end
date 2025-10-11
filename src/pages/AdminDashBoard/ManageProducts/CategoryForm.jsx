import { useState } from "react";
import axios from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function CategoryForm({ onAdded }) {
  const [name, setName] = useState("");

  const handleAddCategory = async () => {
    if (!name.trim()) return toast.error("Enter a category name");
    try {
      await axios.post("/categories", { name });
      toast.success("Category added!");
      setName("");
      onAdded();
    } catch {
      toast.error("Error adding category");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        placeholder="New Category"
        className="border p-2 rounded flex-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="button"
        onClick={handleAddCategory}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add
      </button>
    </div>
  );
}
