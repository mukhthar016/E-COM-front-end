import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {toast} from "react-toastify";

export default function CheckoutPage() {
  const { user } = useAuth();
  const location = useLocation(); 
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const addressId = location.state?.addressId;

  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  //  Redirect guest users safely
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  //  Fetch address
  useEffect(() => {
    if (user && addressId) {
      const fetchAddress = async () => {
        try {
          const res = await axios.get("/addresses");
          const found = res.data.find((a) => a._id === addressId);
          setAddress(found || null);
        } catch (err) {
          console.error("Address fetch error:", err);
        }
      };
      fetchAddress();
    }
  }, [user, addressId]);

  //  If user is not logged in or address is loading
  if (!user) {
    return (
      <div className="min-h-screen w-316 flex items-center justify-center text-gray-600">
        Redirecting to login...
      </div>
    );
  }

  if (!address) {
    return (
      <div className="min-h-screen w-316 flex items-center justify-center text-gray-600">
        Loading address...
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return alert("Select a payment method first!");
    setLoading(true);

    try {
      const orderPayload = {
        addressId,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
        items: cart.map((c) => ({
          product: c.product._id,
          quantity: c.quantity,
          price: c.product.price,
        })),
        totalAmount: totalPrice,
      };

      if (paymentMethod === "COD") {
        await axios.post("/orders", orderPayload);
        clearCart();
        toast.success("Order placed successfully (COD)!");
        navigate("/", { replace: true });
window.scrollTo({ top: 0, behavior: "smooth" });

      } else {
        // Online payment flow
        const { data } = await axios.post("/payments/razorpay/create-order", {
          amount: totalPrice,
        });
        const { order } = data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Fruit Shop",
          description: "Order Payment",
          order_id: order.id,
          handler: async (response) => {
            try {
              const verifyRes = await axios.post("/payments/razorpay/verify-payment", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                await axios.post("/orders", orderPayload);
                clearCart();
                toast.success("Payment successful! Order placed.");
                navigate("/", { replace: true });
window.scrollTo({ top: 0, behavior: "smooth" });

              } else {
                alert("Payment verification failed.");
              }
            } catch (err) {
              console.error("Payment verification error:", err);
              alert("Error during payment verification.");
            }
          },
          theme: { color: "#3b82f6" },
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

  return (
    <div className="min-h-screen w-316 bg-gray-50 p-6 text-black">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Checkout</h1>

        {/* Address */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-1">Delivery Address</h2>
          <p>{address.line1}, {address.city}</p>
          <p>{address.state} - {address.postalCode}</p>
          <p>{address.phone}</p>
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
            {["COD", "UPI"].map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                {method === "COD" ? "Cash on Delivery" : "UPI / Razorpay"}
              </label>
            ))}
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
