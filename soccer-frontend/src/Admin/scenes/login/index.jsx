// Peter - pd - alabaster
// Arthur - pd - Morgan
// Trevor - pd - philips
// Discorp - pd - Doombringer

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useCart } from "../../../Main/scenes/CartPage/CartContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setCart } = useCart();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      // localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify({ ...user, token }));

      if (token) {
        try {
          const cartResponse = await api.get("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(cartResponse.data.items || []);
        } catch (error) {
          console.error("Failed to fetch cart", error);
        }
      }

      if (user.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <>
      <div className="min-h-screen flex text-[#262626] items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {/* If the condition is true, the JSX is shown. If it's false, nothing is shown */}
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#aa4344] text-white py-2 hover:bg-[#aa4344]/90 cursor-pointer  rounded"
          >
            Login
          </button>
          <p className="text-lg text-center font-bold mt-5">
            Don't have an account?{" "}
            <a className="hover:text-[#aa4344]" href="/register">
              SignUp now
            </a>
          </p>
          {/* {" "} */}
        </form>
      </div>
    </>
  );
};

export default Login;
