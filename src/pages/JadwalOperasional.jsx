import React, { useState, useEffect } from 'react';
import AlertBox from "../components/AlertBox";
import { jadwalAPI } from "../services/jadwalAPI";
import { busAPI } from "../services/busAPI"; 
import GenericTable from '../components/GenericTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { AiFillDelete, AiOutlinePlusCircle, AiOutlineEdit, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaBus, FaMapMarkerAlt, FaRegUserCircle } from "react-icons/fa";



const statusOptions = ["Direncanakan", "Berjalan", "Selesai", "Dibatalkan"];

export default function JadwalOperasional() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [jadwalList, setJadwalList] = useState([]);
    const [busList, setBusList] = useState([]); 

    const handleChange = (evt, formType) => {
        const { name, value } = evt.target;
        const formSetter = formType === 'add' ? setAddDataForm : setEditDataForm;
        const prevForm = formType === 'add' ? addDataForm : editDataForm;
        formSetter({ ...prevForm, [name]: value });
    };

   
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError("");

                const [jadwalData, busesData] = await Promise.all([
                    jadwalAPI.fetchJadwal(),
                    busAPI.fetchBuses()
                ]);
                setJadwalList(jadwalData);
                setBusList(busesData);
            } catch (err) {
                setError("Gagal memuat data awal. Coba lagi nanti.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

   
    const [addDataForm, setAddDataForm] = useState({ id_bus: '', nama_pelanggan: '', tanggal_mulai: '', tanggal_selesai: '', tujuan: '', status: 'Direncanakan', catatan: '' });
    const [editDataForm, setEditDataForm] = useState({ id: null, id_bus: '', nama_pelanggan: '', tanggal_mulai: '', tanggal_selesai: '', tujuan: '', status: '', catatan: '' });
    const [isEditing, setIsEditing] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id_bus, nama_pelanggan, tanggal_mulai, tanggal_selesai } = addDataForm;
        if (!id_bus || !nama_pelanggan.trim() || !tanggal_mulai || !tanggal_selesai) {
            setError("Bus, Nama Pelanggan, dan Tanggal harus diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true);
            await jadwalAPI.createJadwal({ ...addDataForm, id_bus: parseInt(addDataForm.id_bus, 10) });
            setSuccess("Jadwal berhasil ditambahkan!");
            setAddDataForm({ id_bus: '', nama_pelanggan: '', tanggal_mulai: '', tanggal_selesai: '', tujuan: '', status: 'Direncanakan', catatan: '' });
            setTimeout(() => setSuccess(""), 3000);
          
            const data = await jadwalAPI.fetchJadwal();
            setJadwalList(data);
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
        try {
            setLoading(true);
            await jadwalAPI.deleteJadwal(id);
            setSuccess("Jadwal berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            const data = await jadwalAPI.fetchJadwal();
            setJadwalList(data);
        } catch (err) {
            setError(`Terjadi kesalahan saat menghapus: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditModal = (item) => {
        setEditDataForm({
            id: item.id,
            id_bus: item.id_bus,
            nama_pelanggan: item.nama_pelanggan,
            tanggal_mulai: item.tanggal_mulai,
            tanggal_selesai: item.tanggal_selesai,
            tujuan: item.tujuan,
            status: item.status,
            catatan: item.catatan,
        });
        setIsEditing(true);
    };

    const handleCloseEditModal = () => setIsEditing(false);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const { id, id_bus, nama_pelanggan, tanggal_mulai, tanggal_selesai } = editDataForm;
        if (!id_bus || !nama_pelanggan.trim() || !tanggal_mulai || !tanggal_selesai) {
            setError("Field yang wajib diisi tidak boleh kosong.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true);
            const dataToUpdate = { ...editDataForm, id: undefined, id_bus: parseInt(id_bus, 10) };
            await jadwalAPI.updateJadwal(id, dataToUpdate);
            setSuccess("Jadwal berhasil diperbarui!");
            setTimeout(() => setSuccess(""), 3000);
            handleCloseEditModal();
            const data = await jadwalAPI.fetchJadwal();
            setJadwalList(data);
        } catch (err) {
            setError(`Terjadi kesalahan saat memperbarui: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };



    const renderFormFields = (formData, handleChangeFn) => (
        <div className="space-y-4">
            <div>
                <label htmlFor="id_bus" className="block text-sm font-medium text-gray-700 mb-1">Pilih Bus</label>
                <div className="relative">
                    <FaBus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select id="id_bus" name="id_bus" value={formData.id_bus} onChange={handleChangeFn} disabled={loading} required className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Pilih Bus --</option>
                        {busList.map(bus => (
                            <option key={bus.id_layanan} value={bus.id_layanan}>
                                {`${bus.tipe_bus} - ${bus.operator_bus} (${bus.kapasitas_tempat_duduk} kursi)`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* ... sisa form tetap sama ... */}
            <div>
                <label htmlFor="nama_pelanggan" className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan</label>
                <div className="relative">
                    <input id="nama_pelanggan" type="text" name="nama_pelanggan" value={formData.nama_pelanggan} placeholder="Nama penyewa" onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="tanggal_mulai" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                    <input id="tanggal_mulai" type="date" name="tanggal_mulai" value={formData.tanggal_mulai} onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="tanggal_selesai" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                    <input id="tanggal_selesai" type="date" name="tanggal_selesai" value={formData.tanggal_selesai} onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div>
                <label htmlFor="tujuan" className="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
                <div className="relative">
                    <input id="tujuan" type="text" name="tujuan" value={formData.tujuan} placeholder="Contoh: Jakarta - Bandung PP" onChange={handleChangeFn} disabled={loading} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                <textarea id="catatan" name="catatan" value={formData.catatan} placeholder="Informasi tambahan..." onChange={handleChangeFn} disabled={loading} rows="3" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
        </div>
    );
    

    const getBusName = (busId) => {
        const bus = busList.find(b => b.id_layanan === busId);
        return bus ? `${bus.tipe_bus} - ${bus.operator_bus}` : 'Bus Tidak Dikenal';
    };
    
 
    const getStatusClass = (status) => {
        switch (status) {
            case 'Selesai': return 'bg-blue-100 text-black-800';
            case 'Berjalan': return 'bg-blue-100 text-blue-800';
            case 'Direncanakan': return 'bg-yellow-100 text-yellow-800';
            case 'Dibatalkan': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Jadwal Operasional</h1>
                <p className="text-gray-600">Kelola dan pantau semua jadwal penyewaan bus.</p>
            </header>
            <div className="mb-4 min-h-[40px]">
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}
            </div>
            {!isEditing && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                        <AiOutlinePlusCircle className="mr-2 text-blue-500" size={24} /> Tambah Jadwal Baru
                    </h3>
                    <form onSubmit={handleSubmit}>
                        {renderFormFields(addDataForm, (e) => handleChange(e, 'add'))}
                        <button type="submit" disabled={loading} className="mt-6 w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg focus:outline-none shadow-md flex items-center justify-center">
                            {loading ? "Menambahkan..." : "Tambah Jadwal"}
                        </button>
                    </form>
                </div>
            )}
            {isEditing && (
                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                                <AiOutlineEdit className="mr-2 text-blue-500" size={24} /> Edit Jadwal
                            </h3>
                            <button onClick={handleCloseEditModal} className="p-1 rounded-full hover:bg-gray-200">
                                <AiOutlineCloseCircle size={24} className="text-gray-500"/>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            {renderFormFields(editDataForm, (e) => handleChange(e, 'edit'))}
                            <div className="flex justify-end space-x-3 pt-6">
                                <button type="button" onClick={handleCloseEditModal} disabled={loading} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg">Batal</button>
                                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center">
                                    {loading ? "Memperbarui..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isEditing ? 'filter blur-sm' : ''}`}>
                 <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700">Daftar Jadwal ({jadwalList.length})</h3>
                </div>
                {loading && jadwalList.length === 0 && <div className="p-10"><LoadingSpinner text="Memuat jadwal..." /></div>}
                {!loading && jadwalList.length === 0 && !error && <div className="p-10"><EmptyState text="Belum ada jadwal. Tambah jadwal pertama Anda!" /></div>}
                {jadwalList.length > 0 && (
                    <GenericTable
                        columns={["Bus", "Pelanggan", "Periode", "Tujuan", "Status", "Aksi"]}
                        data={jadwalList}
                        renderRow={(item, index) => (
                            <>
                                <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">{getBusName(item.id_bus)}</td>
                                <td className="px-6 py-4 border-b border-gray-200">{item.nama_pelanggan}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm">{item.tanggal_mulai} s/d {item.tanggal_selesai}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm">{item.tujuan || '-'}</td>
                                <td className="px-6 py-4 border-b border-gray-200">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(item.status)}`}>{item.status}</span>
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(item)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-blue-100 disabled:opacity-50" title="Edit Jadwal">
                                            <AiOutlineEdit className="text-blue-500 text-xl" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-red-100 disabled:opacity-50" title="Hapus Jadwal">
                                            <AiFillDelete className="text-red-500 text-xl" />
                                        </button>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                )}
            </div>
        </div>
    );
}