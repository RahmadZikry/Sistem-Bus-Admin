// src/components/UpcomingTrips.js

import { Plus, CalendarDays } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { id } from 'date-fns/locale';

// Impor data & helper
import bookingData from '../JSON/booking.json';
import teamData from '../JSON/tim.json';
import { getDestinationImage } from '../utils/imageMapper';

// Data statis untuk kategori & avatar
const tripCategories = ["Romantic Getaway", "Cultural Exploration", "Adventure Tour", "City Highlights"];
const avatarUrls = teamData.map(member => member.foto);

// Komponen untuk satu item perjalanan
function TripItem({ trip, index }) {
    const isHighlighted = index === 1; // Highlight item kedua seperti di gambar
    const destinationName = trip.destination.split(' - ')[1] || trip.destination;
    const imageUrl = getDestinationImage(destinationName);

    // Membuat rentang tanggal untuk contoh
    const endDate = new Date(trip.date);
    const startDate = subDays(endDate, Math.floor(Math.random() * 5) + 3); // Rentang acak 3-8 hari
    const dateRange = `${format(startDate, 'd')} - ${format(endDate, 'd LLLL', { locale: id })}`;
    
    // Tampilkan 3 avatar pertama
    const displayedAvatars = avatarUrls.slice(0, 3);
    const remainingPassengers = trip.passengers > 3 ? `+${trip.passengers - 3}` : '';

    return (
        <div className={`flex items-center p-3 gap-4 rounded-2xl ${isHighlighted ? 'bg-sky-100/70' : ''}`}>
            {/* Gambar Destinasi */}
            <img src={imageUrl} alt={destinationName} className="w-20 h-20 object-cover rounded-xl" />
            
            {/* Detail Perjalanan */}
            <div className="flex-grow">
                <span className="text-xs font-semibold text-blue-600 bg-sky-200/80 px-2 py-1 rounded-md">
                    {tripCategories[index % tripCategories.length]}
                </span>
                <h3 className="font-bold text-gray-800 text-lg mt-1">{destinationName}</h3>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    {/* Avatars */}
                    <div className="flex items-center">
                        <div className="flex -space-x-2">
                            {displayedAvatars.map((url, i) => (
                                <img key={i} src={url} alt={`avatar-${i}`} className="w-6 h-6 rounded-full border-2 border-white" />
                            ))}
                        </div>
                        <span className="ml-2 font-medium">{remainingPassengers}</span>
                    </div>

                    {/* Tanggal */}
                    <div className="flex items-center gap-1.5">
                        <CalendarDays size={16} />
                        <span>{dateRange}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen utama
export default function UpcomingTrips() {
    // Ambil beberapa data 'Confirmed' sebagai contoh
    const upcomingTripsData = bookingData
        .filter(b => b.status === "Confirmed")
        .slice(0, 4); // Ambil 4 perjalanan pertama

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Upcoming Trips</h2>
                <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus size={20} />
                </button>
            </div>

            {/* Daftar Perjalanan */}
            <div className="space-y-2">
                {upcomingTripsData.map((trip, index) => (
                    <TripItem key={trip.id} trip={trip} index={index} />
                ))}
            </div>
        </div>
    );
}