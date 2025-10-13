// Header.jsx - Opsi 2: Gradient Halus

import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";

export default function Header() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      {/* Left: Title */}
      <h1 className="text-2xl font-bold tracking-wide">Dashboard Admin</h1>

      {/* Right: Search, Notifications, Profile (Sama seperti Opsi 1 karena background-nya gelap) */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/10 text-white placeholder-blue-200 border border-white/20 rounded-lg 
                                   focus:ring-2 focus:ring-white focus:bg-white/20
                                   focus:outline-none transition-all duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
        </div>

        {/* Notification */}
        <div className="relative cursor-pointer group">
          <FaBell className="text-blue-200 hover:text-white text-xl transition-colors" />
          <span
            className="absolute -top-2 -right-2.5 flex items-center justify-center 
                                     bg-rose-500 text-white text-[10px] font-semibold 
                                     w-5 h-5 rounded-full shadow-md border-2 border-blue-600
                                     group-hover:scale-110 transition-transform"
          >
            3
          </span>
        </div>

        {/* Profile Dropdown Trigger */}
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors group">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-10 h-10 flex items-center justify-center bg-white text-indigo-600 rounded-full shadow-md
                                       group-hover:ring-2 group-hover:ring-blue-300 group-hover:ring-offset-2 group-hover:ring-offset-indigo-700 transition-all"
            >
              <MdOutlineAdminPanelSettings size={22} />
            </div>
            <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>

          {/* Nama dan Role */}
          <div className="text-sm leading-tight">
            <div className="font-semibold">Muhammad Rizky</div>
            <div className="text-xs text-blue-200">Admin</div>
          </div>

          <FaChevronDown className="text-blue-200 text-xs group-hover:text-white" />
        </div>
      </div>
    </div>
  );
}
