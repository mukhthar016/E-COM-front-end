export default function ProductCard({ product, categories, onEdit, onDelete }) {
  const categoryName =
    product.category?.name || // populated category
    categories.find((c) => c._id === product.category)?.name || // fallback
    "—";

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.name || "Product"}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-bold text-lg mt-2 text-black">{product.name || "Unnamed"}</h3>
      <p className="text-gray-700">₹{product.price}</p>
      <p className="text-sm text-gray-500">Category: {categoryName}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>

      <div className="mt-3 flex justify-between">
        <button
          onClick={() => onDelete(product._id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
        <button
          onClick={() => onEdit(product)}
          className="text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
