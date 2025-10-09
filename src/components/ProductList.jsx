import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products"); // Axios baseURL
        setProducts(res.data); // adjust if backend wraps in { products: [...] }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  if (!products.length)
    return (
      <p className="text-gray-500 text-center mt-6 text-lg">
        No products found.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
        >
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={p.image}
              alt={p.name}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-gray-800 text-lg">{p.name}</h3>
            <p className="text-green-600 font-bold mt-1 text-md">₹{p.price}</p>
            <p className="text-gray-500 mt-2 text-sm flex-grow">
              {/* Optional: add description if available */}
            </p>
            <button
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm transition-colors"
              // onClick={() => handleAddToCart(p)} // future cart logic
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
