import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Pastikan useNavigate diimpor dengan benar

export default function Forgot() {
    const navigate = useNavigate(); // Inisialisasi navigate

    return (
        <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center">
                Forgot Your Password?
            </h2>

            <p className="text-sm text-gray-500 mb-6 text-center">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <form>
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400"
                        placeholder="you@example.com"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
                >
                    Send Reset Link
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate("/login")} // Navigasi ke halaman login
                >
                    Login
                </span>
            </div>
        </div>
    );
}
