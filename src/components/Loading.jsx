import { FaBus } from "react-icons/fa";

export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400">
            <div className="flex items-center justify-center mb-4">
                {/* Icon bus dengan animasi */}
                <FaBus className="text-blue-600 text-6xl animate-bounce" />
            </div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl font-semibold">Sebentar ya ...</p>
        </div>
    );
}
