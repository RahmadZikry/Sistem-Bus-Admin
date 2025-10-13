import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUserPlus, FiSave, FiEdit3, FiTrash2, FiX, FiUsers, FiEye } from "react-icons/fi";
import { timAPI } from "../services/timAPI";
import AlertBox from "../components/AlertBox";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import GenericTable from "../components/GenericTable";

export default function Tim() {
    const [tim, setTim] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({ id: null, nama: "", jabatan: "", foto: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const loadTim = async () => {
        try {
            setLoading(true);
            setError("");
            const dataFromDB = await timAPI.fetchTim();
            const formattedTim = dataFromDB.map(item => ({
                id: item.id,
                nama: item.name,
                jabatan: item.position,
                foto: item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff&size=128`
            }));
            setTim(formattedTim);
        } catch (err) {
            setError("Gagal memuat data tim. Coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTim();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nama || !form.jabatan) {
            setError("Nama dan Jabatan wajib diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const dataToSubmit = { ...form };

        try {
            if (isEditing) {
                await timAPI.updateAnggota(form.id, dataToSubmit);
                setSuccess("Anggota tim berhasil diperbarui!");
            } else {
                await timAPI.createAnggota(dataToSubmit);
                setSuccess("Anggota tim baru berhasil ditambahkan!");
            }
            resetForm();
            setTimeout(() => setSuccess(""), 3000);
            await loadTim();
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus anggota tim ini?")) {
            setLoading(true);
            try {
                await timAPI.deleteAnggota(id);
                setSuccess("Anggota tim berhasil dihapus!");
                setTimeout(() => setSuccess(""), 3000);
                await loadTim();
            } catch (err) {
                setError("Gagal menghapus anggota tim.");
            } finally {
                setLoading(false);
            }
        }
    };

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

    const resetForm = () => {
        setForm({ id: null, nama: "", jabatan: "", foto: "" });
        setIsEditing(false);
    };

    const filteredTim = tim.filter(item => `${item.nama} ${item.jabatan}`.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Manajemen Tim</h1>
                <p className="text-gray-600 mt-1">Kelola semua anggota tim dan karyawan.</p>
            </header>

            <div className="mb-4 min-h-[40px]">
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                    {isEditing ? <FiEdit3 className="mr-2 text-blue-500" /> : <FiUserPlus className="mr-2 text-blue-500" />}
                    {isEditing ? 'Edit Anggota Tim' : 'Tambah Anggota Baru'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input id="nama" name="nama" value={form.nama} onChange={handleChange} placeholder="Contoh: Budi Santoso" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                            <input id="jabatan" name="jabatan" value={form.jabatan} onChange={handleChange} placeholder="Contoh: Supir Utama" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">URL Foto (Opsional)</label>
                        <input id="foto" name="foto" value={form.foto} onChange={handleChange} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        {isEditing && (
                             <button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">Batal</button>
                        )}
                        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md disabled:opacity-60">
                            <FiSave />
                            <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Anggota'}</span>
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><FiUsers /> Daftar Anggota Tim ({filteredTim.length})</h3>
                    <div className="relative w-1/3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Cari anggota..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                </div>
                
                {loading && tim.length === 0 ? (
                    <div className="p-10"><LoadingSpinner text="Memuat data tim..." /></div>
                ) : filteredTim.length > 0 ? (
                    <GenericTable
                        columns={["Anggota", "Jabatan", "Aksi"]}
                        data={filteredTim}
                        renderRow={(item) => (
                            <>
                                <td className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <img src={item.foto} alt={item.nama} className="w-10 h-10 rounded-full object-cover mr-4" />
                                        <span className="font-semibold text-gray-800">{item.nama}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600">{item.jabatan}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(item)} disabled={loading} className="p-2 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition disabled:opacity-50" title="Edit"><FiEdit3 /></button>
                                        <button onClick={() => handleDelete(item.id)} disabled={loading} className="p-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition disabled:opacity-50" title="Delete"><FiTrash2 /></button>
                                        <Link
                                            to={`/tim/${item.id}`}
                                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                                            title="Lihat Detail Profil"
                                        >
                                            <FiEye />
                                        </Link>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                ) : (
                    <EmptyState text={searchTerm ? "Anggota tidak ditemukan." : "Belum ada anggota tim."} />
                )}
            </div>
        </div>
    );
}