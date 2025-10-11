import { useState, useEffect } from "react";

export default function AddressModal({ onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {initialData ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="label" placeholder="Label (Home / Work)" className="w-full p-2 border rounded" value={form.label} onChange={handleChange} />
          <input name="line1" placeholder="Address Line 1" className="w-full p-2 border rounded" value={form.line1} onChange={handleChange} />
          <input name="line2" placeholder="Address Line 2" className="w-full p-2 border rounded" value={form.line2} onChange={handleChange} />
          <input name="city" placeholder="City" className="w-full p-2 border rounded" value={form.city} onChange={handleChange} />
          <input name="state" placeholder="State" className="w-full p-2 border rounded" value={form.state} onChange={handleChange} />
          <input name="postalCode" placeholder="Pincode" className="w-full p-2 border rounded" value={form.postalCode} onChange={handleChange} />
          <input name="phone" placeholder="Phone" className="w-full p-2 border rounded" value={form.phone} onChange={handleChange} />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
            Set as default
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
