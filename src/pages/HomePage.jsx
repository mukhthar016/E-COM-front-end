import React from "react";
import ProductList from "../components/ProductList";

export default function HomePage() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-100">
      <div className="p-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Welcome to MyShop
        </h1>
        <p className="mt-2 text-gray-600">
          Browse our products and enjoy shopping!
        </p>
      </div>
      <ProductList />
    </div>
  );
}
