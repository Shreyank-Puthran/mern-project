import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isLoggedIn = !!token && !!user;

  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (product, qty) => {
    addToCart(
      product,
      qty -
        (cartItems.find((i) => i.product._id === product._id)?.quantity || 0)
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <section className="md:px-20 px-10 py-12 bg-white text-gray-800">
      <div className="max-w-full mx-auto py-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-xl">
            Your cart is empty.{" "}
            <a href="/shop" className="text-red-600 underline">
              Go to Shop
            </a>
          </p>
        ) : (
          <>
            {/* Cart Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-[#aa4344] text-white">
                  <tr className="text-left">
                    <th className="p-4"></th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(({ product, quantity }) => (
                    <tr key={product._id} className="border-b border-gray-200">
                      <td className="p-4">
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="text-red-500 cursor-pointer text-xl font-bold"
                        >
                          ×
                        </button>
                      </td>
                      <td className="p-4 flex items-center gap-4">
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover border"
                        />
                        <span>{product.name}</span>
                      </td>
                      <td className="p-4">${product.price.toFixed(2)}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={quantity}
                          min="1"
                          onChange={(e) =>
                            handleQuantityChange(
                              product,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-16 border px-2 py-1"
                        />
                      </td>
                      <td className="p-4">
                        ${(product.price * quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mt-10 flex justify-end">
              <div className="w-full max-w-md border border-gray-200 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Cart Totals</h2>
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {isLoggedIn ? (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="mt-6 cursor-pointer w-full bg-[#aa4344] text-white py-3 uppercase font-semibold hover:opacity-90"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-6 w-full bg-gray-300 text-gray-600 py-3 uppercase font-semibold cursor-not-allowed"
                  >
                    Login to Checkout
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
