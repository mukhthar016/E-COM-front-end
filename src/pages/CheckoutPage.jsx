import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const addressId = location.state?.addressId;

  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Fetch selected address
  useEffect(() => {
    if (addressId) {
      axios
        .get("/addresses")
        .then((res) => {
          const found = res.data.find((a) => a._id === addressId);
          setAddress(found);
        })
        .catch((err) => console.error("Address fetch error:", err));
    }
  }, [addressId]);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return alert("Select a payment method first!");

    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        // Direct order placement
        await axios.post("/orders", {
          addressId,
          paymentMethod: "COD",
          paymentStatus: "Pending",
          items: cart.map((c) => ({
            product: c.product._id,
            quantity: c.quantity,
            price: c.product.price
          })),
          totalAmount: totalPrice
        });

        clearCart();
        alert("Order placed successfully (COD)!");
        navigate("/orders");
      } else {
        // Online payment flow
        const { data } = await axios.post("/payments/razorpay/create-order", {
          amount: totalPrice
        });

        const { order } = data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
          amount: order.amount,
          currency: order.currency,
          name: "Fruit Shop",
          description: "Order Payment",
          order_id: order.id,
         handler: async function (response) {
            console.log("Razorpay response:", response);

  try {
    // ✅ Step 1: Verify payment on backend
    const verifyRes = await axios.post("/payments/razorpay/verify-payment", {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    });

    if (verifyRes.data.success) {
      // ✅ Step 2: Place order only after verification success
       await axios.post("/orders", {
    addressId,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    items: cart.map((c) => ({
      product: c.product._id,
      quantity: c.quantity,
      price: c.product.price
    })),
    totalAmount: totalPrice
  });

      //clearCart();
      alert("Payment successful! Order placed.");
      navigate("/orders");
    } else {
      alert("Payment verification failed.");
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    alert("Error during payment verification.");
  }
},

          theme: {
            color: "#3b82f6"
          }
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!address)
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center text-gray-600">
        Loading address...
      </div>
    );

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 p-6 text-black">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Checkout</h1>

        {/* Address */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-1">Delivery Address</h2>
          <p>{address.line1}, {address.city}</p>
          <p>{address.state} - {address.postalCode}</p>
          <p> {address.phone}</p>
        </div>

        {/* Cart Summary */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-1">
              <span>{item.product.name} × {item.quantity}</span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Select Payment Method</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              UPI / Razorpay
            </label>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-70"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
