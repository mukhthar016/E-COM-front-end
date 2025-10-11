import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import ProductList from "../components/ProductList";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 text-black">
      <div className="p-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Welcome to E-CART
        </h1>
        <p className="mt-2 text-gray-600">Browse our products and enjoy shopping!</p>
      </div>

      {/* Search + Filter + Sort */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full md:w-1/3"
        />

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded p-2 w-full md:w-1/4 bg-blue-300"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={`${sortField}:${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(":");
            setSortField(field);
            setSortOrder(order);
          }}
          className="border rounded p-2 w-full md:w-1/4 bg-blue-300"
        >
          <option value="price:asc">Price: Low → High</option>
          <option value="price:desc">Price: High → Low</option>
          <option value="name:asc">Name: A → Z</option>
          <option value="name:desc">Name: Z → A</option>
        </select>
      </div>

      {/* Product List */}
      <ProductList
        search={search}
        category={selectedCategory}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </div>
  );
}
