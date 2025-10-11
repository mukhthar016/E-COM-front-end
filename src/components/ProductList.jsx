import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import ProductCard from "./ProductCard";

export default function ProductList({ search, category, sortField, sortOrder }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/products", {
        params: { search, category, sort: sortField, order: sortOrder },
      });
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const handleCartUpdate = (updatedCart) => {
    setCart(updatedCart);
    // Optionally save cart in localStorage or context
    console.log("Updated Cart:", updatedCart);
  };

  // Refetch when search, category, sort changes
  useEffect(() => {
    fetchProducts();
  }, [search, category, sortField, sortOrder]);

  if (loading) {
    return <p className="text-center mt-6">Loading products...</p>;
  }

  if (products.length === 0) {
    return <p className="text-gray-600 text-center mt-6">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((p) => (
        <ProductCard
          key={p._id}
          product={p}
          onCartUpdate={handleCartUpdate}
        />
      ))}
    </div>
  );
}
