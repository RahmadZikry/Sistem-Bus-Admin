import { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa"; // Adding icons to input fields
import { useNavigate } from "react-router-dom"; // Navigate to login after successful registration

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        // Mock API call (simulate registration success)
        setTimeout(() => {
            setLoading(false);
            navigate("/login"); // Redirect to login page on success
        }, 2000);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center mb-8">
                <span className="text-4xl font-bold text-blue-600">Create Account</span>
            </div>

            {error && (
                <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div className="flex items-center border border-blue-300 rounded-lg bg-blue-50 focus-within:ring-2 focus-within:ring-blue-400">
                        <FaUserAlt className="text-gray-400 ml-3" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-r-lg focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="flex items-center border border-blue-300 rounded-lg bg-blue-50 focus-within:ring-2 focus-within:ring-blue-400">
                        <FaLock className="text-gray-400 ml-3" />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-r-lg focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                            placeholder="********"
                        />
                    </div>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <div className="flex items-center border border-blue-300 rounded-lg bg-blue-50 focus-within:ring-2 focus-within:ring-blue-400">
                        <FaLock className="text-gray-400 ml-3" />
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-r-lg focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                            placeholder="********"
                        />
                    </div>
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                >
                    Login
                </span>
            </div>
        </div>
    );
}
