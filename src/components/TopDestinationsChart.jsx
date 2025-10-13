import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import bookingData from '../JSON/booking.json';
import { FaChevronDown } from 'react-icons/fa';

// Daftarkan elemen yang dibutuhkan oleh Chart.js. Ini penting!
Chart.register(ArcElement, Tooltip, Legend);

// Palet warna yang sesuai dengan gambar
const CHART_COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

export default function TopDestinationsChart() {

    // Gunakan useMemo untuk memproses data hanya sekali
    const processedChartData = useMemo(() => {
        // 1. Hitung total peserta untuk setiap destinasi
        const destinationCounts = bookingData
            .filter(b => b.status === 'Confirmed' && b.destination) // Hanya booking terkonfirmasi yang punya destinasi
            .reduce((acc, booking) => {
                acc[booking.destination] = (acc[booking.destination] || 0) + (booking.participants || 1);
                return acc;
            }, {});

        // 2. Urutkan destinasi dari yang paling populer dan ambil 4 teratas
        const topDestinations = Object.entries(destinationCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 4);

        // 3. Hitung total peserta dari 4 destinasi teratas untuk kalkulasi persentase
        const totalParticipantsInTop = topDestinations.reduce((sum, [, count]) => sum + count, 0);
        
        // 4. Siapkan data untuk chart dan legenda
        return topDestinations.map(([name, participants], index) => ({
            name,
            participants,
            percentage: totalParticipantsInTop > 0 ? ((participants / totalParticipantsInTop) * 100).toFixed(0) : 0,
            color: CHART_COLORS[index % CHART_COLORS.length],
        }));
    }, []); // Dependensi kosong karena data statis

    // Konfigurasi data untuk komponen Doughnut dari react-chartjs-2
    const chartData = {
        labels: processedChartData.map(d => d.name),
        datasets: [
            {
                label: 'Participants',
                data: processedChartData.map(d => d.participants),
                backgroundColor: processedChartData.map(d => d.color),
                borderColor: '#FFFFFF',
                borderWidth: 2,
                cutout: '70%', // Ini yang membuatnya menjadi donut chart
            },
        ],
    };

    // Opsi untuk kustomisasi tampilan chart
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Kita akan membuat legenda kustom sendiri
            },
            tooltip: {
                enabled: false, // Tooltip juga bisa dikustomisasi atau dinonaktifkan
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Top Destinations</h3>
                <button className="flex items-center space-x-2 text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors">
                    <span>This Month</span>
                    <FaChevronDown size={12} />
                </button>
            </div>
            
            {/* Body: Chart dan Legenda */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Chart */}
                <div className="relative w-36 h-36 md:w-40 md:h-40 flex-shrink-0">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>

                {/* Legenda Kustom */}
                <div className="flex-grow w-full">
                    <ul className="space-y-3">
                        {processedChartData.map((dest) => (
                            <li key={dest.name} className="flex items-center space-x-3">
                                <span className="block w-4 h-4 rounded-sm" style={{ backgroundColor: dest.color }}></span>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-800">
                                        {dest.name} ({dest.percentage}%)
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {dest.participants.toLocaleString()} Participants
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}