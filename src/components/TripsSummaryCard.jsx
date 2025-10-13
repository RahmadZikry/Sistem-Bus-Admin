import { useMemo } from 'react';
import { FaBus } from 'react-icons/fa'; 
import bookingData from '../JSON/booking.json';

export default function TripsSummaryCard() {
    
    const summaryData = useMemo(() => {
        const totalTrips = bookingData.length;

        // Jika tidak ada data, kembalikan nilai default
        if (totalTrips === 0) {
            return { 
                totalTrips: 0, 
                statuses: [
                    { name: 'Done', count: 0, percentage: 0, colorClass: 'bg-green-500' },
                    { name: 'Booked', count: 0, percentage: 0, colorClass: 'bg-blue-500' },
                    { name: 'Canceled', count: 0, percentage: 0, colorClass: 'bg-orange-500' },
                ]
            };
        }

        // Mapping status dari JSON ke nama yang ditampilkan
        const doneCount = bookingData.filter(b => b.status === 'Confirmed').length;
        const bookedCount = bookingData.filter(b => b.status === 'Pending').length;
        const canceledCount = bookingData.filter(b => b.status === 'Cancelled').length;

        const statuses = [
            {
                name: 'Done',
                count: doneCount,
                percentage: (doneCount / totalTrips) * 100,
                // [PEMBARUAN] Warna sesuai desain baru
                colorClass: 'bg-green-500', 
            },
            {
                name: 'Booked',
                count: bookedCount,
                percentage: (bookedCount / totalTrips) * 100,
                colorClass: 'bg-blue-500',
            },
            {
                name: 'Canceled',
                count: canceledCount,
                percentage: (canceledCount / totalTrips) * 100,
                colorClass: 'bg-orange-500',
            },
        ];

        return { totalTrips, statuses };
    }, []);

    return (
        // [PEMBARUAN] Container utama dengan layout dan style baru
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">
                
                {/* Bagian Kiri: Ikon Bus dan Total Trips */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <FaBus className="text-blue-500 text-2xl" /> 
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Trips</p>
                        <p className="text-3xl font-bold text-gray-800">
                            {summaryData.totalTrips.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex-grow w-full">
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm mb-3">
                        {summaryData.statuses.map(status => (
                            <div key={status.name} className="flex items-center space-x-2">
                                <span className={`w-3 h-3 rounded-full ${status.colorClass}`}></span>
                                <span className="text-gray-600">{status.name}</span>
                                <span className="font-semibold text-gray-800">{status.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div title={`Done: ${summaryData.statuses[0].count}, Booked: ${summaryData.statuses[1].count}, Canceled: ${summaryData.statuses[2].count}`} 
                         className="flex w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        {summaryData.statuses.map(status => (
                            <div
                                key={status.name}
                                className={`${status.colorClass} transition-all duration-500`}
                                style={{ width: `${status.percentage}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}