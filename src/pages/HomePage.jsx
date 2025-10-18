import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import ProductList from "../components/ProductList";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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
    <div className="min-h-screen  w-316 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      
  
      

      {/*  Filter & Sort Section */}
      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm border-y border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 px-4 md:px-8 py-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-[260px]">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

         {/* Category Filter */}
<div className="w-full sm:w-[220px] relative">
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-full appearance-none border border-gray-300 rounded-lg p-2 text-sm bg-white hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition"
  >
    <option value="">All Categories</option>
    {categories.map((c) => (
      <option key={c._id} value={c._id} >
        {c.name}
      </option>
    ))}
  </select>

  {/* Custom arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>


          {/* Sort Dropdown */}
          <div className="w-full sm:w-[220px]">
            <select
              value={`${sortField}:${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split(":");
                setSortField(field);
                setSortOrder(order);
              }}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            >
              <option value="price:asc">Price: Low → High</option>
              <option value="price:desc">Price: High → Low</option>
              <option value="name:asc">Name: A → Z</option>
              <option value="name:desc">Name: Z → A</option>
            </select>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <ProductList
          search={search}
          category={selectedCategory}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </main>
    </div>
  );
}
