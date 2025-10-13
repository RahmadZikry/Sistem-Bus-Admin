import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
// import bookingData from '../JSON/booking.json'; // <-- TIDAK DIPERLUKAN LAGI

// Daftarkan semua elemen yang akan kita gunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RevenueChart() {
    // [PEMBARUAN] Menggunakan data dummy statis, tidak lagi memproses booking.json
    const chartDataAndLabels = useMemo(() => {
        const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Data dummy yang membentuk grafik seperti contoh
        const dataPoints = [380, 350, 280, 635, 420, 590, 550]; 

        return { labels, dataPoints };
    }, []); // Dependensi kosong karena data statis

    // Konfigurasi data untuk Chart.js (TIDAK ADA PERUBAHAN DI SINI)
    const data = {
        labels: chartDataAndLabels.labels,
        datasets: [
            {
                label: 'Revenue',
                data: chartDataAndLabels.dataPoints,
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                    return gradient;
                },
                borderColor: '#3B82F6',
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
                pointHoverBorderWidth: 3,
            },
        ],
    };

    // Konfigurasi tampilan (opsi) Chart.js (TIDAK ADA PERUBAHAN DI SINI)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false,
                    color: '#E5E7EB',
                },
                ticks: {
                    callback: (value) => `$${value}`,
                    padding: 10,
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    padding: 10,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#fff',
                titleColor: '#6B7280',
                titleFont: { size: 12, weight: 'normal' },
                bodyColor: '#111827',
                bodyFont: { size: 16, weight: 'bold' },
                padding: 12,
                cornerRadius: 8,
                borderColor: '#E5E7EB',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    title: (tooltipItems) => {
                        // Kustomisasi judul tooltip, misal: '12 Jul 28'
                        const date = new Date();
                        const day = tooltipItems[0].label;
                        return `${day}, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                    },
                    label: (context) => {
                        return new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                        }).format(context.parsed.y);
                    }
                }
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Revenue Overview</h3>
                <select className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                </select>
            </div>
            <div className="h-72"> 
                <Line data={data} options={options} />
            </div>
        </div>
    );
}