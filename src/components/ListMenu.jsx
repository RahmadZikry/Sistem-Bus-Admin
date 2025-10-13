// src/components/ListMenu.jsx (Diperbarui untuk Tema Gelap & Terang)

import {
  RiTeamFill, RiListOrdered, RiServiceLine, RiPriceTag3Fill
} from "react-icons/ri";
import { MdArticle, MdOutlineReviews } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import { IoIosContact, IoMdBus } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { BsCalendar2Date } from "react-icons/bs";
import { FiTool, FiBriefcase } from "react-icons/fi";

const menuGroups = [
  {
    title: "Utama",
    menus: [
      { id: "menu-1", to: "/", icon: RxDashboard, label: "Dashboard" },
      { id: "menu-2", to: "/booking", icon: RiListOrdered, label: "Booking" },
      { id: "menu-3", to: "/listbus", icon: IoMdBus, label: "List Bus" },
      { id: "menu-13", to: "/jadwal", icon: BsCalendar2Date, label: "Jadwal Operasional" },
      { id: "menu-15", to: "/promo", icon: RiPriceTag3Fill, label: "Promo & Diskon" },
    ],
  },
  {
    title: "Manajemen",
    menus: [
      { id: "menu-12", to: "/layanan", icon: RiServiceLine, label: "Layanan" },
      { id: "menu-14", to: "/perawatan", icon: FiTool, label: "Perawatan Armada" },
      { id: "menu-9", to: "/tim", icon: RiTeamFill, label: "Tim Karyawan" },
      { id: "menu-5", to: "/testimoni", icon: MdOutlineReviews, label: "Testimoni" },
      { id: "menu-16", to: "/job", icon: FiBriefcase, label: "Lowongan Kerja" },
      { id: "menu-11", to: "/artikel", icon: MdArticle, label: "Artikel" },
      { id: "menu-4", to: "/contact", icon: IoIosContact, label: "Contact" },
      { id: "menu-10", to: "/faq", icon: FaQuestion, label: "FAQ" },
    ],
  },
];


export default function ListMenu({ isSidebarOpen, theme = 'light' }) {
  const navLinkClass = ({ isActive }) => {
    const lightThemeClasses = {
      active: "bg-blue-500 text-white font-semibold shadow-lg hover:bg-blue-600",
      inactive: "text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
    };

 
    const darkThemeClasses = {
      active: "bg-blue-600 text-white font-semibold shadow-lg", 
      inactive: "text-gray-400 hover:text-white hover:bg-white/10 font-medium" 
    };

   
    const currentTheme = theme === 'dark' ? darkThemeClasses : lightThemeClasses;

    return `flex items-center w-full rounded-lg p-3 space-x-4 group
            transition-all duration-300 ease-in-out
            ${isActive ? currentTheme.active : currentTheme.inactive}`;
  };
  
  let menuCounter = 0;

  return (
    <nav className="flex flex-col space-y-4">
      {menuGroups.map((group) => (
        <div key={group.title}>
          <h3
            className={`px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              isSidebarOpen ? "opacity-100 h-auto" : "opacity-0 h-0"
            } ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {group.title}
          </h3>
          
          <ul className="mt-2 space-y-1">
            {group.menus.map((item) => {
              const IconComponent = item.icon;
              const currentDelay = menuCounter++ * 30;

              return (
                <li key={item.id}>
                  <NavLink
                    id={item.id}
                    to={item.to}
                    className={navLinkClass} 
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <IconComponent className="text-xl shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span
                      className={`whitespace-nowrap transition-all duration-200 ease-in-out ${
                        isSidebarOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-3 pointer-events-none"
                      }`}
                      style={{ transitionDelay: `${currentDelay + 50}ms` }}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}