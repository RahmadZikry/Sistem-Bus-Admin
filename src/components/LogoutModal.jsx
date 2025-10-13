import { FiX } from "react-icons/fi";
import { FaSignInAlt, FaDoorOpen } from "react-icons/fa";

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirmGuest,
  onConfirmLogin,
}) {
  if (!isOpen) return null;

  return (
    // Backdrop (latar belakang gelap)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      {/* Konten Modal */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative transform transition-all duration-300 ease-out scale-95 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam konten
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        {/* Header Modal */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Konfirmasi Logout
          </h2>
          <p className="text-gray-600">
            Anda yakin ingin keluar? Pilih tujuan Anda selanjutnya.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onConfirmGuest}
            className="flex-1 flex items-center justify-center gap-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            <FaDoorOpen />
            <span>Ke Halaman Guest</span>
          </button>
          <button
            onClick={onConfirmLogin}
            className="flex-1 flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            <FaSignInAlt />
            <span>Ke Halaman Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
