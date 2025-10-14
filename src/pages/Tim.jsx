import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUserPlus, FiSave, FiEdit3, FiTrash2, FiX, FiUsers, FiEye, FiRefreshCw } from "react-icons/fi";
import AlertBox from "../components/AlertBox";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import GenericTable from "../components/GenericTable";

// Data tim default
const defaultTimData = [
    {
        id: "1",
        nama: "Budi Santoso",
        jabatan: "Supir Utama",
        foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: "2",
        nama: "Sari Indah",
        jabatan: "Admin Operasional",
        foto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: "3",
        nama: "Ahmad Rizki",
        jabatan: "Mekanik",
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: "4",
        nama: "Dewi Lestari",
        jabatan: "Customer Service",
        foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    }
];

// Service untuk mengelola data di localStorage
const timService = {
    // Ambil semua data tim
    fetchTim: () => {
        try {
            const savedData = localStorage.getItem('timData');
            if (savedData) {
                return JSON.parse(savedData);
            } else {
                // Jika belum ada data, simpan data default
                localStorage.setItem('timData', JSON.stringify(defaultTimData));
                return defaultTimData;
            }
        } catch (error) {
            console.error('Error fetching tim data:', error);
            return defaultTimData;
        }
    },

    // Tambah anggota baru
    createAnggota: (anggota) => {
        return new Promise((resolve, reject) => {
            try {
                const currentData = timService.fetchTim();
                const newAnggota = {
                    ...anggota,
                    id: Date.now().toString(), // Generate ID unik
                    foto: anggota.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(anggota.nama)}&background=random&color=fff&size=128`
                };
                
                const updatedData = [...currentData, newAnggota];
                localStorage.setItem('timData', JSON.stringify(updatedData));
                resolve(newAnggota);
            } catch (error) {
                reject(error);
            }
        });
    },

    // Update anggota
    updateAnggota: (id, anggota) => {
        return new Promise((resolve, reject) => {
            try {
                const currentData = timService.fetchTim();
                const updatedData = currentData.map(item => 
                    item.id === id 
                        ? { ...anggota, id, foto: anggota.foto || item.foto }
                        : item
                );
                localStorage.setItem('timData', JSON.stringify(updatedData));
                resolve(anggota);
            } catch (error) {
                reject(error);
            }
        });
    },

    // Hapus anggota
    deleteAnggota: (id) => {
        return new Promise((resolve, reject) => {
            try {
                const currentData = timService.fetchTim();
                const updatedData = currentData.filter(item => item.id !== id);
                localStorage.setItem('timData', JSON.stringify(updatedData));
                resolve({ success: true });
            } catch (error) {
                reject(error);
            }
        });
    },

    // Reset ke data default
    resetData: () => {
        localStorage.setItem('timData', JSON.stringify(defaultTimData));
        return defaultTimData;
    }
};

export default function Tim() {
    const [tim, setTim] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({ id: null, nama: "", jabatan: "", foto: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Load data tim
    const loadTim = async () => {
        try {
            setLoading(true);
            setError("");
            const data = timService.fetchTim();
            setTim(data);
        } catch (err) {
            setError("Gagal memuat data tim. Coba lagi nanti.");
            console.error("Error loading tim:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTim();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission (Create/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi form
        if (!form.nama.trim() || !form.jabatan.trim()) {
            setError("Nama dan Jabatan wajib diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (isEditing) {
                // Update existing anggota
                await timService.updateAnggota(form.id, form);
                setSuccess("Anggota tim berhasil diperbarui!");
            } else {
                // Create new anggota
                await timService.createAnggota(form);
                setSuccess("Anggota tim baru berhasil ditambahkan!");
            }
            
            resetForm();
            setTimeout(() => setSuccess(""), 3000);
            await loadTim(); // Reload data
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan data.");
            console.error("Error saving data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete anggota
    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus anggota tim ini?")) {
            setLoading(true);
            try {
                await timService.deleteAnggota(id);
                setSuccess("Anggota tim berhasil dihapus!");
                setTimeout(() => setSuccess(""), 3000);
                await loadTim();
            } catch (err) {
                setError("Gagal menghapus anggota tim.");
                console.error("Error deleting data:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle edit - buka form dengan data yang ada
    const handleOpenEditModal = (item) => {
        setForm({
            id: item.id,
            nama: item.nama,
            jabatan: item.jabatan,
            foto: item.foto
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset form ke keadaan awal
    const resetForm = () => {
        setForm({ id: null, nama: "", jabatan: "", foto: "" });
        setIsEditing(false);
    };

    // Reset semua data ke default
    const handleResetData = async () => {
        if (window.confirm("Yakin ingin mereset semua data tim ke default? Data yang ada akan hilang.")) {
            setLoading(true);
            try {
                timService.resetData();
                setSuccess("Data tim berhasil direset ke default!");
                setTimeout(() => setSuccess(""), 3000);
                await loadTim();
            } catch (err) {
                setError("Gagal mereset data tim.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Filter data berdasarkan pencarian
    const filteredTim = tim.filter(item => 
        `${item.nama} ${item.jabatan}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Manajemen Tim</h1>
                <p className="text-gray-600 mt-1">Kelola semua anggota tim dan karyawan.</p>
            </header>

            {/* Alert Messages */}
            <div className="mb-4 min-h-[40px]">
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}
            </div>

            {/* Form Tambah/Edit Anggota */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                        {isEditing ? <FiEdit3 className="mr-2 text-blue-500" /> : <FiUserPlus className="mr-2 text-blue-500" />}
                        {isEditing ? 'Edit Anggota Tim' : 'Tambah Anggota Baru'}
                    </h3>
                    {isEditing && (
                        <button 
                            onClick={resetForm}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                        >
                            <FiX size={20} />
                            Batal Edit
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="nama" 
                                name="nama" 
                                value={form.nama} 
                                onChange={handleChange} 
                                placeholder="Contoh: Budi Santoso" 
                                required 
                                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                            />
                        </div>
                        <div>
                            <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-1">
                                Jabatan <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="jabatan" 
                                name="jabatan" 
                                value={form.jabatan} 
                                onChange={handleChange} 
                                placeholder="Contoh: Supir Utama" 
                                required 
                                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
                            URL Foto (Opsional)
                        </label>
                        <input 
                            id="foto" 
                            name="foto" 
                            value={form.foto} 
                            onChange={handleChange} 
                            placeholder="https://example.com/foto.jpg" 
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Kosongkan untuk menggunakan avatar otomatis
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FiSave />
                            <span>{loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Anggota')}</span>
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Daftar Anggota Tim */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <FiUsers /> 
                            Daftar Anggota Tim ({filteredTim.length})
                        </h3>
                        <button
                            onClick={handleResetData}
                            disabled={loading}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition disabled:opacity-50"
                            title="Reset ke data default"
                        >
                            <FiRefreshCw size={14} />
                            Reset
                        </button>
                    </div>
                    <div className="relative w-full sm:w-1/3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Cari nama atau jabatan..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                </div>
                
                {/* Loading State */}
                {loading && tim.length === 0 ? (
                    <div className="p-10">
                        <LoadingSpinner text="Memuat data tim..." />
                    </div>
                ) : filteredTim.length > 0 ? (
                    // Tabel Data
                    <GenericTable
                        columns={["Foto", "Nama", "Jabatan", "Aksi"]}
                        data={filteredTim}
                        renderRow={(item) => (
                            <>
                                <td className="px-6 py-4 border-b border-gray-200">
                                    <img 
                                        src={item.foto} 
                                        alt={item.nama} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama)}&background=random&color=fff&size=128`;
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200">
                                    <span className="font-semibold text-gray-800">{item.nama}</span>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600">
                                    {item.jabatan}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => handleOpenEditModal(item)} 
                                            disabled={loading}
                                            className="p-2 text-yellow-600 bg-yellow-100 hover:bg-yellow-200 rounded-full transition disabled:opacity-50" 
                                            title="Edit"
                                        >
                                            <FiEdit3 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)} 
                                            disabled={loading}
                                            className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-full transition disabled:opacity-50" 
                                            title="Hapus"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                        <Link
                                            to={`/tim/${item.id}`}
                                            className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                                            title="Lihat Detail Profil"
                                        >
                                            <FiEye size={16} />
                                        </Link>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                ) : (
                    // Empty State
                    <EmptyState 
                        text={searchTerm ? "Anggota tidak ditemukan." : "Belum ada anggota tim."}
                        subtext={searchTerm ? "Coba kata kunci lain atau hapus pencarian" : "Mulai dengan menambahkan anggota tim pertama Anda"}
                    />
                )}
            </div>
        </div>
    );
}