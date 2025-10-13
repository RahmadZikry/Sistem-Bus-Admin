// src/pages/DashboardPage.js

import { useMemo } from "react";
import { FaCalendarCheck, FaUserPlus, FaDollarSign } from 'react-icons/fa';

// Impor semua komponen yang akan ditampilkan di dashboard
import TopDestinationsChart from '../components/TopDestinationsChart';
import RevenueChart from '../components/RevenueChart';
import TripsSummaryCard from '../components/TripsSummaryCard';
import Calendar from '../components/Calendar';
import UpcomingTrips from '../components/UpcomingTrips';
import TravelPackages from '../components/TravelPackages';

// Komponen Card Statistik (menggunakan data dummy sesuai desain baru)
function DashboardCard({ icon, title, value, growth }) {
    const isNegative = growth.startsWith('-');
    const growthStyle = isNegative ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700';
    
    return (
        <div className="bg-sky-100/60 p-5 rounded-2xl flex items-center space-x-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">{icon}</div>
            <div className="flex-grow flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                {growth && (
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${growthStyle}`}>
                        {growth}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    // Data dummy untuk kartu statistik agar sesuai dengan desain gambar
    const dashboardStats = useMemo(() => [
        { id: 1, icon: <FaCalendarCheck className="text-2xl text-blue-500" />, title: "Total Booking", value: "1,200", growth: "+2.98%" },
        { id: 2, icon: <FaUserPlus className="text-2xl text-blue-500" />, title: "Total New Customers", value: "2,845", growth: "-1.45%" },
        { id: 3, icon: <FaDollarSign className="text-2xl text-blue-500" />, title: "Total Earnings", value: "$12,890", growth: "+3.75%" },
    ], []);

    return (
        // Ini adalah grid utama HANYA untuk konten dashboard
        <div className="space-y-6">
            {/* Baris Pertama: 3 Kartu Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardStats.map((stat) => (
                    <DashboardCard key={stat.id} {...stat} />
                ))}
            </div>

            {/* Grid Kompleks untuk sisa konten (menggunakan sistem 12 kolom) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Kolom Kiri yang lebih besar (mengambil 8 dari 12 kolom) */}
                <div className="lg:col-span-8 space-y-6">
                    <RevenueChart />
                    <TripsSummaryCard />
                    <TravelPackages />
                </div>

                {/* Kolom Kanan yang lebih kecil (mengambil 4 dari 12 kolom) */}
                <div className="lg:col-span-4 space-y-6">
                    <TopDestinationsChart />
                    <Calendar />
                    <UpcomingTrips />
                    {/* Anda bisa menambahkan komponen Messages di sini nanti */}
                </div>

            </div>
        </div>
    );
}