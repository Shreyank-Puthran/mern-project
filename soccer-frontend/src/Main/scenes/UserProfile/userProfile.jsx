import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/orders/get-user-order", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <section className="md:px-20 px-10 py-12">
        {/* {console.log(orders)} */}
        <div className=" mx-auto ">
          {/* User Info Section */}
          <div className="bg-white text-[#393939] rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
            <p className="text-lg">
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p className="text-lg">
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>

          {/* Orders Section */}
          <div className="bg-white shadow-md p-6 ">
            <h2 className="text-xl text-[#393939] font-semibold mb-4">Your Orders</h2>

            {orders.length === 0 ? (
              <p className="text-[#393939] italic">
                You have not placed any orders yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100 text-[#393939]">
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Date Placed</th>
                      <th className="px-4 py-2 text-left">Total Price</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-[#787878]">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm break-all">
                          {order._id}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {order.orderStatus}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Link
                            // href={`/orders/${order._id}`}
                            to={`/order/${order._id}`}
                            className="text-[#aa4344] hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
