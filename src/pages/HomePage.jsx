import ProductList from '../components/ProductList'
export default function HomePage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to MyShop</h1>
      <p className="mt-2 text-gray-600">Browse our products and enjoy shopping!</p>
      <ProductList></ProductList>
    </div>
  );
}
