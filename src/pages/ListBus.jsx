// src/pages/ListBus.jsx (Refactored for new design)

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';
import dataBus from "../JSON/databus.json";

// [REUSABLE COMPONENT] untuk badge fasilitas
const FacilityBadge = ({ facility, color }) => (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color}`}>
        {facility}
    </span>
);

export default function ListBus() {
    // State management (logika Anda sudah bagus)
    const [filters, setFilters] = useState({
        searchTerm: "",
        facility: "All Facilities",
        departureTime: "All Times",
        price: "All Prices"
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Memoized filtering logic
    const filteredBuses = useMemo(() => {
        return dataBus.filter((bus) => {
            const search = filters.searchTerm.toLowerCase();
            const matchesSearch =
                bus.tipe_bus.toLowerCase().includes(search) ||
                bus.rute_perjalanan.toLowerCase().includes(search) ||
                bus.operator_bus.toLowerCase().includes(search);

            const matchesFacility = filters.facility === "All Facilities" || (
                filters.facility === 'Wifi' && bus.fasilitas.wifi) ||
                (filters.facility === 'AC' && bus.fasilitas.ac) ||
                (filters.facility === 'Toilet' && bus.fasilitas.toilet);

            const matchesTime = filters.departureTime === "All Times" || bus.jadwal.waktu_berangkat === filters.departureTime;
            const matchesPrice = filters.price === "All Prices" || bus.harga.harga_tiket.toString() === filters.price;

            return matchesSearch && matchesFacility && matchesTime && matchesPrice;
        });
    }, [filters]);

    // Opsi untuk filter dropdown
    const facilityOptions = ["All Facilities", "Wifi", "AC", "Toilet"];
    const timeOptions = ["All Times", ...new Set(dataBus.map(bus => bus.jadwal.waktu_berangkat))].sort();
    const priceOptions = ["All Prices", ...new Set(dataBus.map(bus => bus.harga.harga_tiket.toString()))].sort((a,b) => (a === "All Prices" ? -1 : b === "All Prices" ? 1 : Number(a) - Number(b)));

    // Pagination
    const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
    const currentItems = filteredBuses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset halaman saat filter berubah
    };
    
    return (
        <div className="space-y-6">
            <PageHeader title="Bus Fleet Management" breadcrumb={["Dashboard", "Bus List"]} />

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Bagian Filter */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="searchTerm" className="text-sm font-medium text-gray-700 block mb-1">Search Bus</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input id="searchTerm" name="searchTerm" type="text" placeholder="Type, route, or operator..." value={filters.searchTerm} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
                        </div>
                    </div>
                    {/* Filter Dropdowns */}
                    {[
                        { label: 'Facility', name: 'facility', options: facilityOptions },
                        { label: 'Departure Time', name: 'departureTime', options: timeOptions },
                        { label: 'Price', name: 'price', options: priceOptions, format: (p) => p === "All Prices" ? p : `IDR ${Number(p).toLocaleString('id-ID')}` }
                    ].map(filter => (
                        <div key={filter.name}>
                            <label htmlFor={filter.name} className="text-sm font-medium text-gray-700 block mb-1">{filter.label}</label>
                            <select id={filter.name} name={filter.name} value={filters[filter.name]} onChange={handleChange} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                                {filter.options.map(opt => <option key={opt} value={opt}>{filter.format ? filter.format(opt) : opt}</option>)}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Tabel Bus */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left border-y border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Photo</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Bus Type</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Operator</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Departure</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Facilities</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.map(bus => (
                                <tr key={bus.id_layanan} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-2"><img src={bus.url_gambar} alt={bus.tipe_bus} className="w-20 h-14 object-cover rounded-md" /></td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{bus.tipe_bus}</td>
                                    <td className="px-6 py-4 text-gray-600">{bus.rute_perjalanan}</td>
                                    <td className="px-6 py-4 text-gray-600">{bus.operator_bus}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{bus.jadwal.waktu_berangkat}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {bus.fasilitas.wifi && <FacilityBadge facility="Wifi" color="bg-blue-100 text-blue-800" />}
                                            {bus.fasilitas.ac && <FacilityBadge facility="AC" color="bg-green-100 text-green-800" />}
                                            {bus.fasilitas.toilet && <FacilityBadge facility="Toilet" color="bg-purple-100 text-purple-800" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">{bus.harga.mata_uang} {Number(bus.harga.harga_tiket).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex justify-center items-center gap-2">
                                            <Link to={`/listbus/${bus.id_layanan}`} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="View"><FiEye size={16} /></Link>
                                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-full" title="Edit"><FiEdit size={16} /></button>
                                            <button className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Delete"><FiTrash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredBuses.length)}</span> of <span className="font-semibold">{filteredBuses.length}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"><FiChevronLeft size={16} /></button>
                            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"><FiChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}