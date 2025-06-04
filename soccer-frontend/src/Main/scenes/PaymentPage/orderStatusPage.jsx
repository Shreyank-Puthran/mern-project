import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DotSpinner from "../../components/loading.jsx";

const OrderStatusPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/orders/get-order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <DotSpinner className="mx-auto mt-20" />;

  if (error)
    return (
      <div className="mt-10 max-w-md mx-auto p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  if (!order) return null;

  return (
    <>
      <section className="md:px-20 px-15 py-12 text-[#787878]">
        <div className=" mx-auto ">
          <h1 className="text-3xl font-bold mb-6">Order Details</h1>

          {/* Shipping Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            <p>
              <strong>Address:</strong> {order.shippingInfo.address},{" "}
              {order.shippingInfo.city}, {order.shippingInfo.postalCode},{" "}
              {order.shippingInfo.country}
            </p>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Payment Information</h2>
            <p>
              <strong>Method:</strong> {order.paymentInfo.method}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  order.paymentInfo.status === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {order.paymentInfo.status}
              </span>
            </p>
            <p>
              <strong>Payment ID:</strong> {order.paymentInfo.paymentId}
            </p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Items</h2>
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => (
                  <tr
                    key={item.product._id}
                    className="border-b border-gray-200"
                  >
                    <td className="p-3">{item.product.name}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">£{item.product.price.toFixed(2)}</td>
                    <td className="p-3">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary & Status */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm border border-gray-200 p-6 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span>£{order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Status</span>
                <span
                  className={`font-semibold ${
                    order.orderStatus === "Delivered"
                      ? "text-green-600"
                      : order.orderStatus === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // End
};

export default OrderStatusPage;
