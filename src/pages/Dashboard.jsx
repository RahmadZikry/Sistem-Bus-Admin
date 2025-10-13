// pages/Dashboard.js (Updated for side-by-side layout)

import { useMemo } from "react";
import { LuCalendarCheck2, LuUserPlus, LuDollarSign } from "react-icons/lu"; 
import bookingData from "../JSON/booking.json";

// Impor komponen-komponen lainnya
import TopDestinationsChart from '../components/TopDestinationsChart';
import RevenueChart from '../components/RevenueChart';
import TripsSummaryCard from '../components/TripsSummaryCard';
// [PEMBARUAN] Impor komponen Kalender yang baru
import Calendar from '../components/Calendar'; 

// Komponen DashboardCard tetap sama
function DashboardCard({ icon, title, value, growth }) {
    const isNegative = growth.startsWith('-');
    
    const growthStyle = isNegative
        ? 'bg-red-100 text-red-600'
        : 'bg-green-100 text-green-700';

    return (
        <div className="bg-sky-100/60 p-5 rounded-2xl flex items-center space-x-4">
            <div className="bg-white p-3 rounded-lg">
                {icon}
            </div>
            <div className="flex-grow flex justify-between items-end">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                {growth && (
                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${growthStyle}`}>
                        {growth}
                    </div>
                )}
            </div>
        </div>
    );
}


export default function Dashboard() {
   
    const dashboardStats = useMemo(() => {
        const totalBookings = bookingData.length;
        const totalContacts = new Set(bookingData.map(b => b.customerName)).size;
        const totalEarnings = bookingData
            .filter(b => b.status === "Confirmed" && b.totalPrice)
            .reduce((sum, b) => sum + b.totalPrice, 0);

        const formattedEarnings = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(totalEarnings);
        
        return [
            { 
                id: 1, 
                icon: <LuCalendarCheck2 className="text-2xl text-blue-500" />, 
                title: "Total Booking", 
                value: totalBookings.toLocaleString('id-ID'), 
                growth: "+2.98%", 
            },
            { 
                id: 2, 
                icon: <LuUserPlus className="text-2xl text-blue-500" />, 
                title: "Total New Customers", 
                value: totalContacts.toLocaleString('id-ID'), 
                growth: "-1.45%", 
            },
            { 
                id: 3, 
                icon: <LuDollarSign className="text-2xl text-blue-500" />, 
                title: "Total Earnings", 
                value: formattedEarnings.replace('Rp', 'Rp '), 
                growth: "+3.75%", 
            },
        ];
    }, []);

    return (
        <div id="dashboard-container" className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome Back!</h1>
                <p className="text-gray-500">Here's a summary of your activities.</p>
            </div>
            
            <div id="dashboard-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {dashboardStats.map((stat) => (
                    <DashboardCard 
                        key={stat.id}
                        icon={stat.icon}
                        title={stat.title}
                        value={stat.value}
                        growth={stat.growth}
                    />
                ))}
            </div>

            {/* [PEMBARUAN UTAMA] Perubahan Tata Letak di sini */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Kolom Kiri untuk Revenue Chart (mengambil 2 dari 4 kolom) */}
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                
                {/* Kolom tengah untuk Top Destinations (mengambil 1 dari 4 kolom) */}
                <div className="lg:col-span-1">
                    <TopDestinationsChart />
                </div>

                {/* Kolom Kanan untuk Kalender (mengambil 1 dari 4 kolom) */}
                <div className="lg:col-span-1">
                    <Calendar />
                </div>
            </div>

            <div className="mt-6">
                <TripsSummaryCard />
            </div>
        </div>
    );
}