// File: Sidebar.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiChevronsLeft } from "react-icons/fi";
import { FaBus } from "react-icons/fa";
import ListMenu from "./ListMenu";
import LogoutModal from "./LogoutModal";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleNavigateToGuest = () => {
    localStorage.removeItem("authToken");

    setIsLogoutModalOpen(false);
    window.location.href = "https://uas-project-peach.vercel.app/";
  };

  const handleNavigateToLogin = () => {
    localStorage.removeItem("authToken");

    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const logoutButtonClass = `
    flex items-center w-full rounded-lg p-3 space-x-4 group
    transition-all duration-300 ease-in-out
    text-gray-400 hover:text-white hover:bg-red-500/80 font-medium
  `;

  return (
    <>
      <aside
        className={`relative flex min-h-screen flex-col bg-gray-800 shadow-xl 
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-6 -right-3 z-20 p-1.5 bg-white text-blue-600
                     rounded-full shadow-lg border-2 border-gray-800
                     hover:bg-blue-100 hover:scale-110 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <div
            className={`transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
          >
            <FiChevronsLeft size={18} />
          </div>
        </button>

        <div className="flex items-center justify-center pt-6 pb-8">
          <FaBus
            className={`text-white drop-shadow-sm transition-all duration-300 ease-in-out
                       ${isSidebarOpen ? "text-4xl mr-3" : "text-3xl"}`}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <span className="text-2xl font-bold text-white tracking-tight">
              Se<span className="font-light">Bus</span>
            </span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto overflow-x-hidden px-4">
          <ListMenu isSidebarOpen={isSidebarOpen} theme="dark" />
        </div>

        <div className="px-4 pb-4 pt-2 border-t border-white/10">
          <button
            id="menu-logout"
            onClick={handleLogoutClick}
            className={logoutButtonClass}
          >
            <FiLogOut className="text-xl shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span
              className={`transition-all duration-200 
                ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-3 pointer-events-none"
                }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmGuest={handleNavigateToGuest}
        onConfirmLogin={handleNavigateToLogin}
      />
    </>
  );
}
