import { useState, useContext } from "react";
import { useCart } from "../CartPage/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.imageUrls[0],
        price: item.product.price,
        quantity: item.quantity,
      }));

      const orderData = {
        shippingInfo,
        orderItems,
        totalPrice,
      };
      console.log("Cart Items being sent:", cartItems);
      const response = await api.post("/orders/create-order/", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newOrder = response.data;

      navigate("/payment", { state: { orderId: newOrder._id } });
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <section className="md:px-20 px-10 py-12 bg-white text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto">
        {/* Shipping Info Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>

          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="city"
            value={shippingInfo.city}
            onChange={handleChange}
            placeholder="City"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="postalCode"
            value={shippingInfo.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="country"
            value={shippingInfo.country}
            onChange={handleChange}
            placeholder="Country"
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-[#aa4344] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#aa4344]/90"
          >
            Continue to Payment
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <ul className="divide-y">
            {cartItems.map(({ product, quantity }) => (
              <li key={product._id} className="py-2">
                <div className="flex justify-between">
                  <span>
                    {product.name} x {quantity}
                  </span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="font-bold text-lg mt-4 flex justify-between">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
