import React, { useState, useEffect, useCallback, memo } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";


const CartItem = memo(function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div
      key={item?.product?._id}
      className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 py-4"
    >
      <div className="flex items-center gap-4 w-full md:w-2/3">
        <img
          src={item?.product?.image || "/placeholder.jpg"}
          alt={item?.product?.name || "Product"}
          className="w-20 h-20 rounded object-cover border"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item?.product?.name || "Unnamed Product"}
          </h3>
          <p className="text-gray-600">
            ₹{item?.product?.price?.toFixed(2) || 0} each
          </p>
          <p className="text-sm text-gray-500">
            Subtotal:{" "}
            <span className="font-semibold text-blue-600">
              ₹{((item?.product?.price || 0) * (item.quantity || 0)).toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 md:mt-0">
        <button
          onClick={() => onUpdate(item.product._id, Math.max(item.quantity - 1, 1))}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-bold transition"
        >
          −
        </button>
        <span className="text-lg font-medium text-black">{item.quantity}</span>
        <button
          onClick={() => onUpdate(item.product._id, item.quantity + 1)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition"
        >
          +
        </button>
        <button
          onClick={() => onRemove(item.product._id)}
          className="ml-4 text-red-600 hover:text-red-700 font-semibold text-sm transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

export default function CartPage() {
  const { cart, totalPrice, updateCartItem, removeCartItem, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🧠 Fetch addresses only when needed
  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get("/addresses");
      setAddresses(res.data);
      if (res.data.length > 0) setSelectedAddress(res.data[0]._id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/addresses", {
        label: "Home",
        line1: formData.street,
        city: formData.city,
        state: formData.state,
        country: "India",
        postalCode: formData.pincode,
        phone: formData.phone,
        isDefault: false,
      });
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleCheckout = () => {
    if (!user) return navigate("/login");
    if (!selectedAddress) return alert("Please select a delivery address!");
    navigate("/checkout", { state: { addressId: selectedAddress } });
  };

  //  Stable callbacks — prevent re-renders in memoized CartItem
  const handleQuantityChange = useCallback(
    (id, qty) => updateCartItem(id, qty),
    [updateCartItem]
  );

  const handleRemoveItem = useCallback(
    (id) => removeCartItem(id),
    [removeCartItem]
  );

  //  UI Rendering
  if (loading)
    return (
      <div className="min-h-screen w-316 flex items-center justify-center text-blue-600 font-semibold text-xl">
        Loading your cart...
      </div>
    );

  if (!cart || cart.length === 0)
    return (
      <div className="min-h-screen w-316 flex flex-col items-center justify-center text-center bg-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">
          Your Cart is Empty 🛒
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="min-h-screen w-316 bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Your Shopping Cart
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* CART ITEMS */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          {cart.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
              onUpdate={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}

          <div className="mt-8 border-t pt-6 text-right">
            <h2 className="text-xl font-bold text-gray-800">
              Total:{" "}
              <span className="text-blue-600">₹{totalPrice.toFixed(2)}</span>
            </h2>
          </div>
        </div>

        {/* ADDRESS SECTION */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-black">
          {user ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Delivery Address
              </h2>

              {addresses.length === 0 && (
                <p className="text-gray-500 mb-3">No saved addresses yet.</p>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`block border p-3 rounded-lg cursor-pointer transition ${
                      selectedAddress === addr._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr._id}
                      onChange={() => setSelectedAddress(addr._id)}
                      className="mr-2"
                    />
                    <span className="font-medium text-gray-800">
                      {addr.fullName}
                    </span>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-sm text-gray-600">📞 {addr.phone}</p>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-red-500 text-xs mt-1 hover:underline"
                    >
                      Delete
                    </button>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
              >
                {showForm ? "Cancel" : "➕ Add New Address"}
              </button>

              {showForm && (
                <form onSubmit={handleAddAddress} className="mt-4 space-y-3">
                  {Object.keys(formData).map((key) => (
                    <input
                      key={key}
                      type="text"
                      required
                      placeholder={
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  ))}
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </>
          ) : (
            <p className="text-gray-600 text-center">
              Please{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                login
              </span>{" "}
              to add a delivery address.
            </p>
          )}

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {user ? "Proceed to Checkout" : "Login to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
