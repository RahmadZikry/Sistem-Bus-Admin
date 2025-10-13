import React, { useState, useEffect } from 'react';
import AlertBox from "../components/AlertBox"; 
import { layananAPI } from "../services/layananAPI"; 
import GenericTable from '../components/GenericTable'; 
import EmptyState from '../components/EmptyState'; 
import LoadingSpinner from '../components/LoadingSpinner'; 
import { AiFillDelete, AiOutlinePlusCircle, AiOutlineEdit, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaDollarSign } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";


const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

export default function Layanan() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [layanan, setLayanan] = useState([]); 

    const [addDataForm, setAddDataForm] = useState({ nama_layanan: "", kategori: "", biaya: "", deskripsi: "" });
  
    const [editDataForm, setEditDataForm] = useState({ id: null, nama_layanan: "", kategori: "", biaya: "", deskripsi: "" });
    const [isEditing, setIsEditing] = useState(false); 

  
    const handleChange = (evt, formType) => {
        const { name, value } = evt.target;
        if (formType === 'add') {
            setAddDataForm({ ...addDataForm, [name]: value });
        } else {
            setEditDataForm({ ...editDataForm, [name]: value });
        }
    };

    const loadLayanan = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await layananAPI.fetchLayanan();
            setLayanan(data);
        } catch (err) {
            setError("Gagal memuat data layanan. Coba lagi nanti.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLayanan();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!addDataForm.nama_layanan.trim() || !addDataForm.kategori.trim() || !addDataForm.biaya) {
            setError("Nama Layanan, Kategori, dan Biaya tidak boleh kosong.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true);
            setError("");
            setSuccess("");
 
            await layananAPI.createLayanan({ ...addDataForm, biaya: parseFloat(addDataForm.biaya) });
            setSuccess("Layanan berhasil ditambahkan!");
            setAddDataForm({ nama_layanan: "", kategori: "", biaya: "", deskripsi: "" }); 
            setTimeout(() => setSuccess(""), 3000);
            loadLayanan();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
            setTimeout(() => setError(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const konfirmasi = window.confirm("Yakin ingin menghapus layanan ini?");
        if (!konfirmasi) return;
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            await layananAPI.deleteLayanan(id);
            setSuccess("Layanan berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            loadLayanan();
        } catch (err) {
            setError(`Terjadi kesalahan saat menghapus: ${err.message}`);
            setTimeout(() => setError(""), 5000);
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenEditModal = (item) => {
        setEditDataForm({
            id: item.id,
            nama_layanan: item.nama_layanan,
            kategori: item.kategori,
            biaya: item.biaya,
            deskripsi: item.deskripsi
        });
        setIsEditing(true);
        setError(""); 
        setSuccess("");
    };
    
    const handleCloseEditModal = () => {
        setIsEditing(false);
        setEditDataForm({ id: null, nama_layanan: "", kategori: "", biaya: "", deskripsi: "" }); 
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        // Validasi
        if (!editDataForm.nama_layanan.trim() || !editDataForm.kategori.trim() || !editDataForm.biaya) {
            setError("Field yang wajib diisi tidak boleh kosong saat mengedit.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        if (!editDataForm.id) {
            setError("ID layanan tidak ditemukan untuk diedit.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true); 
            setError("");
            setSuccess("");
            const dataToUpdate = {
                nama_layanan: editDataForm.nama_layanan,
                kategori: editDataForm.kategori,
                biaya: parseFloat(editDataForm.biaya),
                deskripsi: editDataForm.deskripsi
            };
            await layananAPI.updateLayanan(editDataForm.id, dataToUpdate);
            setSuccess("Layanan berhasil diperbarui!");
            setTimeout(() => setSuccess(""), 3000);
            handleCloseEditModal();
            loadLayanan();
        } catch (err) {
            setError(`Terjadi kesalahan saat memperbarui: ${err.message}`);
            setTimeout(() => setError(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = (formData, handleChangeFn) => (
        <>
            <div>
                <label htmlFor="nama_layanan" className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan</label>
                <input id="nama_layanan" type="text" name="nama_layanan" value={formData.nama_layanan} placeholder="Contoh: Sewa Bus 1 Hari" disabled={loading} onChange={handleChangeFn}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <div className="relative">
                        <BiCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        <input id="kategori" type="text" name="kategori" value={formData.kategori} placeholder="Contoh: Transportasi" disabled={loading} onChange={handleChangeFn}
                            className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" required/>
                    </div>
                </div>
                <div>
                    <label htmlFor="biaya" className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
                    <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input id="biaya" type="number" name="biaya" value={formData.biaya} placeholder="Contoh: 5000000" disabled={loading} onChange={handleChangeFn}
                            className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} placeholder="Detail layanan..." onChange={handleChangeFn} disabled={loading} rows="3"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
            </div>
        </>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Manajemen Layanan</h1>
                <p className="text-gray-600">Kelola semua layanan keuangan yang tersedia.</p>
            </header>

            <div className="mb-4 min-h-[40px]">
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}
            </div>

            {/* Form Tambah Layanan Card */}
            {!isEditing && ( 
                <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                        <AiOutlinePlusCircle className="mr-2 text-blue-500" size={24} />
                        Tambah Layanan Baru
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {renderFormFields(addDataForm, (e) => handleChange(e, 'add'))}
                        <button type="submit" disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center justify-center">
                            {loading ? "Menambahkan..." : "Tambah Layanan"}
                        </button>
                    </form>
                </div>
            )}

            {/* Modal Form Edit Layanan */}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                                <AiOutlineEdit className="mr-2 text-blue-500" size={24} />
                                Edit Layanan
                            </h3>
                            <button onClick={handleCloseEditModal} className="p-1 rounded-full hover:bg-gray-200">
                                <AiOutlineCloseCircle size={24} className="text-gray-500"/>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="space-y-5">
                            {renderFormFields(editDataForm, (e) => handleChange(e, 'edit'))}
                            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                                <button type="button" onClick={handleCloseEditModal} disabled={loading}
                                    className="w-full sm:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg">
                                    Batal
                                </button>
                                <button type="submit" disabled={loading}
                                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center">
                                    {loading ? "Memperbarui..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Daftar Layanan Card */}
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isEditing ? 'filter blur-sm' : ''}`}>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700">Daftar Layanan ({layanan.length})</h3>
                </div>

                {loading && layanan.length === 0 && <div className="p-10"><LoadingSpinner text="Memuat layanan..." /></div>}
                {!loading && layanan.length === 0 && !error && <div className="p-10"><EmptyState text="Belum ada layanan. Tambah layanan pertama Anda!" /></div>}
                {!loading && layanan.length === 0 && error && <div className="p-10"><EmptyState text={error} type="error" /></div>}

                {layanan.length > 0 && (
                    <GenericTable
                        columns={["No", "Nama Layanan", "Kategori", "Biaya", "Deskripsi", "Aksi"]}
                        data={layanan}
                        renderRow={(item, index) => (
                            <>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-600">{index + 1}.</td>
                                <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">{item.nama_layanan}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm"><span className="bg-white-100 text-black-700 px-2 py-1 rounded-md">{item.kategori}</span></td>
                                <td className="px-6 py-4 border-b border-gray-200 font-medium text-black-600">{formatCurrency(item.biaya)}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-black-600 max-w-xs truncate" title={item.deskripsi}>{item.deskripsi || '-'}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(item)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-blue-100 disabled:opacity-50" title="Edit Layanan">
                                            <AiOutlineEdit className="text-blue-500 text-xl hover:text-blue-700" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-red-100 disabled:opacity-50" title="Hapus Layanan">
                                            <AiFillDelete className="text-red-500 text-xl hover:text-red-700" />
                                        </button>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                )}
            </div>
            <footer className="text-center mt-12 py-4">
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} BusTravelie. All rights reserved.</p>
            </footer>
        </div>
    );
}