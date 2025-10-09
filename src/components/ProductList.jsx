import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    console.log("Add to cart clicked for:", product.name);
    // Later: add cart logic
  };

  if (products.length === 0) {
    return (
      <p className="text-gray-600 text-center mt-6">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((p) => (
        <ProductCard
          key={p._id}
          product={p}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
