import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { FaUserAlt, FaLock } from "react-icons/fa";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    axios
      .post("https://dummyjson.com/auth/login", {
        username: dataForm.email,
        password: dataForm.password,
      })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message);
          return;
        }

        localStorage.setItem("authToken", response.data.token);

        navigate("/");
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message || "An error occurred");
        } else {
          setError(err.message || "An unknown error occurred");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const errorInfo = error && (
    <div className="bg-red-200 border border-red-400 mb-4 p-4 text-sm text-red-700 rounded-lg shadow-lg flex items-center space-x-3">
      <BsFillExclamationDiamondFill className="text-red-600 text-2xl" />
      <span className="font-medium">{error}</span>
    </div>
  );

  const loadingInfo = loading && (
    <div className="bg-blue-200 border border-blue-400 mb-4 p-4 text-sm text-blue-700 rounded-lg shadow-lg flex items-center space-x-3">
      <ImSpinner2 className="text-blue-600 text-2xl animate-spin" />
      <span className="font-medium">Mohon Tunggu...</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Welcome Back 👋
      </h2>

      {errorInfo}
      {loadingInfo}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="flex items-center border border-blue-300 rounded-lg">
            <FaUserAlt className="text-gray-400 ml-3" />
            <input
              type="text"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              placeholder="Contoh: kminchelle"
              className="w-full px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="flex items-center border border-blue-300 rounded-lg">
            <FaLock className="text-gray-400 ml-3" />
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Forgot your password?{" "}
          <span
            onClick={() => navigate("/forgot")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Reset it here
          </span>
        </p>
      </div>
    </div>
  );
}
