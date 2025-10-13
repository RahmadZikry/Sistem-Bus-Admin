// src/layouts/MainLayout.js (Disempurnakan)

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div id="layout-wrapper" className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div id="main-content" className="flex-1 flex flex-col h-screen overflow-y-hidden">
        <Header />
        
        {/* Area konten yang bisa di-scroll */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
}