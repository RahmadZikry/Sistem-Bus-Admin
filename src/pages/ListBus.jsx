// src/pages/ListBus.jsx (Updated with JSON initial data)

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';

// Data JSON default (bisa diimpor dari file atau didefinisikan di sini)
const defaultBusData = [
  {
    "id_layanan": "1",
    "tipe_bus": "Executive AC",
    "rute_perjalanan": "Jakarta - Bandung",
    "operator_bus": "PT Sinar Jaya",
    "url_gambar": "https://images.unsplash.com/photo-1544627871-5d6d13f97e0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "jadwal": {
      "waktu_berangkat": "08:00",
      "waktu_tiba": "12:00"
    },
    "fasilitas": {
      "wifi": true,
      "ac": true,
      "toilet": true
    },
    "harga": {
      "mata_uang": "IDR",
      "harga_tiket": 150000
    }
  },
  {
    "id_layanan": "2",
    "tipe_bus": "Business Class",
    "rute_perjalanan": "Surabaya - Malang",
    "operator_bus": "PT Handoyo",
    "url_gambar": "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "jadwal": {
      "waktu_berangkat": "14:00",
      "waktu_tiba": "16:30"
    },
    "fasilitas": {
      "wifi": true,
      "ac": true,
      "toilet": false
    },
    "harga": {
      "mata_uang": "IDR",
      "harga_tiket": 75000
    }
  },
  {
    "id_layanan": "3",
    "tipe_bus": "Economy",
    "rute_perjalanan": "Yogyakarta - Semarang",
    "operator_bus": "PT Rosalia Indah",
    "url_gambar": "https://images.unsplash.com/photo-1506468203959-a06c860af8f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "jadwal": {
      "waktu_berangkat": "06:30",
      "waktu_tiba": "10:00"
    },
    "fasilitas": {
      "wifi": false,
      "ac": true,
      "toilet": true
    },
    "harga": {
      "mata_uang": "IDR",
      "harga_tiket": 60000
    }
  },
  {
    "id_layanan": "4",
    "tipe_bus": "Sleeper Bus",
    "rute_perjalanan": "Jakarta - Bali",
    "operator_bus": "PT Gunung Harta",
    "url_gambar": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "jadwal": {
      "waktu_berangkat": "21:00",
      "waktu_tiba": "06:00"
    },
    "fasilitas": {
      "wifi": true,
      "ac": true,
      "toilet": true
    },
    "harga": {
      "mata_uang": "IDR",
      "harga_tiket": 300000
    }
  },
  {
    "id_layanan": "5",
    "tipe_bus": "Double Decker",
    "rute_perjalanan": "Bandung - Surabaya",
    "operator_bus": "PT Laju Prima",
    "url_gambar": "https://images.unsplash.com/photo-1544627871-5d6d13f97e0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "jadwal": {
      "waktu_berangkat": "09:00",
      "waktu_tiba": "18:00"
    },
    "fasilitas": {
      "wifi": true,
      "ac": true,
      "toilet": true
    },
    "harga": {
      "mata_uang": "IDR",
      "harga_tiket": 200000
    }
  }
];

// [REUSABLE COMPONENT] untuk badge fasilitas
const FacilityBadge = ({ facility, color }) => (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color}`}>
        {facility}
    </span>
);

// [MODAL COMPONENT] untuk form tambah/edit bus
const BusModal = ({ isOpen, onClose, onSubmit, initialData, isEdit = false }) => {
    const [formData, setFormData] = useState(initialData || {
        tipe_bus: '',
        rute_perjalanan: '',
        operator_bus: '',
        url_gambar: '',
        jadwal: {
            waktu_berangkat: '',
            waktu_tiba: ''
        },
        fasilitas: {
            wifi: false,
            ac: false,
            toilet: false
        },
        harga: {
            mata_uang: 'IDR',
            harga_tiket: ''
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEdit ? 'Edit Bus' : 'Add New Bus'}
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
                            <input
                                type="text"
                                name="tipe_bus"
                                value={formData.tipe_bus}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                            <input
                                type="text"
                                name="rute_perjalanan"
                                value={formData.rute_perjalanan}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                            <input
                                type="text"
                                name="operator_bus"
                                value={formData.operator_bus}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                name="url_gambar"
                                value={formData.url_gambar}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                            <input
                                type="time"
                                name="jadwal.waktu_berangkat"
                                value={formData.jadwal.waktu_berangkat}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                            <input
                                type="time"
                                name="jadwal.waktu_tiba"
                                value={formData.jadwal.waktu_tiba}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                name="harga.harga_tiket"
                                value={formData.harga.harga_tiket}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                        <div className="flex gap-4">
                            {[
                                { name: 'wifi', label: 'WiFi' },
                                { name: 'ac', label: 'AC' },
                                { name: 'toilet', label: 'Toilet' }
                            ].map(facility => (
                                <label key={facility.name} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={`fasilitas.${facility.name}`}
                                        checked={formData.fasilitas[facility.name]}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{facility.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {isEdit ? 'Update Bus' : 'Add Bus'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// [DELETE CONFIRMATION MODAL]
const DeleteModal = ({ isOpen, onClose, onConfirm, busData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-red-600">Delete Bus</h2>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to delete <strong>{busData?.tipe_bus}</strong> operating on <strong>{busData?.rute_perjalanan}</strong>?
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        This action cannot be undone.
                    </p>
                    
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Delete Bus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ListBus() {
    // Load initial data from localStorage or use default JSON
    const [dataBus, setDataBus] = useState(() => {
        const savedData = localStorage.getItem('busData');
        return savedData ? JSON.parse(savedData) : defaultBusData;
    });

    // State management
    const [filters, setFilters] = useState({
        searchTerm: "",
        facility: "All Facilities",
        departureTime: "All Times",
        price: "All Prices"
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingBus, setEditingBus] = useState(null);
    const [deletingBus, setDeletingBus] = useState(null);
    const itemsPerPage = 10;

    // Save to localStorage whenever dataBus changes
    React.useEffect(() => {
        localStorage.setItem('busData', JSON.stringify(dataBus));
    }, [dataBus]);

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
    }, [dataBus, filters]);

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
        setCurrentPage(1);
    };

    // CRUD Operations
    const handleAddBus = () => {
        setEditingBus(null);
        setModalOpen(true);
    };

    const handleEditBus = (bus) => {
        setEditingBus(bus);
        setModalOpen(true);
    };

    const handleDeleteBus = (bus) => {
        setDeletingBus(bus);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setDataBus(prev => prev.filter(bus => bus.id_layanan !== deletingBus.id_layanan));
        setDeleteModalOpen(false);
        setDeletingBus(null);
    };

    const handleSubmitBus = (busData) => {
        if (editingBus) {
            // Update existing bus
            setDataBus(prev => prev.map(bus => 
                bus.id_layanan === editingBus.id_layanan 
                    ? { ...busData, id_layanan: editingBus.id_layanan }
                    : bus
            ));
        } else {
            // Add new bus
            const newBus = {
                ...busData,
                id_layanan: Date.now().toString(), // Generate unique ID
                harga: {
                    ...busData.harga,
                    harga_tiket: Number(busData.harga.harga_tiket)
                }
            };
            setDataBus(prev => [...prev, newBus]);
        }
    };

    // Reset to default data
    const handleResetData = () => {
        if (window.confirm('Are you sure you want to reset all bus data to default? This cannot be undone.')) {
            setDataBus(defaultBusData);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Bus Fleet Management" breadcrumb={["Dashboard", "Bus List"]} />

            {/* Action Header */}
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={handleAddBus}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <FiPlus size={18} />
                        Add New Bus
                    </button>
                    <button
                        onClick={handleResetData}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    >
                        Reset to Default
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Bagian Filter */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="searchTerm" className="text-sm font-medium text-gray-700 block mb-1">Search Bus</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                id="searchTerm" 
                                name="searchTerm" 
                                type="text" 
                                placeholder="Type, route, or operator..." 
                                value={filters.searchTerm} 
                                onChange={handleChange} 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition" 
                            />
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
                            <select 
                                id={filter.name} 
                                name={filter.name} 
                                value={filters[filter.name]} 
                                onChange={handleChange} 
                                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition appearance-none"
                                style={{ 
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, 
                                    backgroundPosition: 'right 0.5rem center', 
                                    backgroundRepeat: 'no-repeat', 
                                    backgroundSize: '1.5em 1.5em' 
                                }}
                            >
                                {filter.options.map(opt => (
                                    <option key={opt} value={opt}>
                                        {filter.format ? filter.format(opt) : opt}
                                    </option>
                                ))}
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
                                    <td className="px-6 py-2">
                                        <img 
                                            src={bus.url_gambar} 
                                            alt={bus.tipe_bus} 
                                            className="w-20 h-14 object-cover rounded-md" 
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80x56?text=No+Image';
                                            }}
                                        />
                                    </td>
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
                                    <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">
                                        {bus.harga.mata_uang} {Number(bus.harga.harga_tiket).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex justify-center items-center gap-2">
                                            <Link 
                                                to={`/listbus/${bus.id_layanan}`} 
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition" 
                                                title="View"
                                            >
                                                <FiEye size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleEditBus(bus)}
                                                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition" 
                                                title="Edit"
                                            >
                                                <FiEdit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteBus(bus)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition" 
                                                title="Delete"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {currentItems.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No buses found</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {dataBus.length === 0 
                                    ? "Get started by adding your first bus" 
                                    : "Try adjusting your filters to see more results"
                                }
                            </p>
                            {dataBus.length === 0 && (
                                <button
                                    onClick={handleAddBus}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                >
                                    Add Your First Bus
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredBuses.length)}</span> of <span className="font-semibold">{filteredBuses.length}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <BusModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmitBus}
                initialData={editingBus}
                isEdit={!!editingBus}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                busData={deletingBus}
            />
        </div>
    );
}