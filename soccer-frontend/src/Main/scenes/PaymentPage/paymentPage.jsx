import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axios";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/cart");
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/orders/payment",
        { orderId, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="md:px-20 px-10 py-12">
        <div className="mx-auto mt-12 bg-white shadow">
          <h2 className="text-2xl font-semibold mb-4">Payment</h2>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <label>
              <span className="block font-medium">Select Payment Method</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-2"
              >
                <option>Cash On Delivery</option>
                <option>Stripe</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-2 px-4 font-semibold text-white rounded ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : "Pay now"}
            </button>
          </form>
        </div>
      </section>
    </>
  );

  // End
};

export default PaymentPage;
