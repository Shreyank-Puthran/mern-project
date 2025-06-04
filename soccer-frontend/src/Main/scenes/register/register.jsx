import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("▶️ handleLogin fired");
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/"); // Homepage
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <>
      <div className="min-h-screen text-[#262626] flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          {/* If the condition is true, the JSX is shown. If it's false, nothing is shown */}
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#aa4344] text-white py-2 rounded cursor-pointer hover:bg-[#aa4344]/90"
          >
            Sign Up
          </button>
          {/* {" "} */}
        </form>
      </div>
    </>
  );
};

export default Register;
