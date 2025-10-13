// src/pages/PromoDiskon.jsx

import React, { useState, useEffect } from 'react';
import AlertBox from "../components/AlertBox";
import { promoAPI } from "../services/promoAPI";
import GenericTable from '../components/GenericTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { AiFillDelete, AiOutlinePlusCircle, AiOutlineEdit, AiOutlineCloseCircle } from 'react-icons/ai';
import { RiPriceTag3Fill } from 'react-icons/ri';

const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

export default function PromoDiskon() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [promoList, setPromoList] = useState([]);

    const [addDataForm, setAddDataForm] = useState({ kode_promo: '', deskripsi: '', jenis_diskon: 'persen', nilai_diskon: '', tanggal_kadaluarsa: '', is_active: true });
    const [editDataForm, setEditDataForm] = useState({ id: null, kode_promo: '', deskripsi: '', jenis_diskon: 'persen', nilai_diskon: '', tanggal_kadaluarsa: '', is_active: true });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (evt, formType) => {
        const { name, value, type, checked } = evt.target;
        const formSetter = formType === 'add' ? setAddDataForm : setEditDataForm;
        const prevForm = formType === 'add' ? addDataForm : editDataForm;
        
        let finalValue = type === 'checkbox' ? checked : value;
        // Membuat kode promo menjadi huruf besar secara otomatis
        if (name === 'kode_promo') {
            finalValue = value.toUpperCase().replace(/\s/g, '');
        }

        formSetter({ ...prevForm, [name]: finalValue });
    };

    useEffect(() => {
        const loadPromo = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await promoAPI.fetchPromo();
                setPromoList(data);
            } catch (err) {
                setError("Gagal memuat data promo. Pastikan tabel 'promo' sudah ada.");
            } finally {
                setLoading(false);
            }
        };
        loadPromo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { kode_promo, deskripsi, nilai_diskon } = addDataForm;
        if (!kode_promo.trim() || !deskripsi.trim() || !nilai_diskon) {
            setError("Kode, Deskripsi, dan Nilai Diskon harus diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true);
            const dataToSubmit = { ...addDataForm, nilai_diskon: parseFloat(nilai_diskon) };
            await promoAPI.createPromo(dataToSubmit);
            setSuccess("Promo berhasil ditambahkan!");
            setAddDataForm({ kode_promo: '', deskripsi: '', jenis_diskon: 'persen', nilai_diskon: '', tanggal_kadaluarsa: '', is_active: true });
            setTimeout(() => setSuccess(""), 3000);
            const data = await promoAPI.fetchPromo();
            setPromoList(data);
        } catch (err) {
            setError(`Kode promo mungkin sudah ada atau terjadi kesalahan lain.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus promo ini?")) return;
        try {
            setLoading(true);
            await promoAPI.deletePromo(id);
            setSuccess("Promo berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            const data = await promoAPI.fetchPromo();
            setPromoList(data);
        } catch (err) {
            setError(`Gagal menghapus: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditModal = (item) => {
        setEditDataForm({
            id: item.id,
            kode_promo: item.kode_promo,
            deskripsi: item.deskripsi,
            jenis_diskon: item.jenis_diskon,
            nilai_diskon: item.nilai_diskon,
            tanggal_kadaluarsa: item.tanggal_kadaluarsa || '',
            is_active: item.is_active
        });
        setIsEditing(true);
    };

    const handleCloseEditModal = () => setIsEditing(false);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { id, ...dataToUpdate } = editDataForm;
            dataToUpdate.nilai_diskon = parseFloat(dataToUpdate.nilai_diskon);
            await promoAPI.updatePromo(id, dataToUpdate);
            setSuccess("Promo berhasil diperbarui!");
            setTimeout(() => setSuccess(""), 3000);
            handleCloseEditModal();
            const data = await promoAPI.fetchPromo();
            setPromoList(data);
        } catch (err) {
            setError(`Gagal memperbarui: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = (formData, handleChangeFn) => (
        <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="kode_promo" className="block text-sm font-medium text-gray-700 mb-1">Kode Promo</label>
                    <input id="kode_promo" type="text" name="kode_promo" value={formData.kode_promo} onChange={handleChangeFn} placeholder="LEBARAN2025" disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border" />
                </div>
                <div>
                    <label htmlFor="tanggal_kadaluarsa" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kadaluarsa (Opsional)</label>
                    <input id="tanggal_kadaluarsa" type="date" name="tanggal_kadaluarsa" value={formData.tanggal_kadaluarsa} onChange={handleChangeFn} disabled={loading} className="w-full p-3 bg-gray-50 rounded-lg border" />
                </div>
            </div>
            <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <input id="deskripsi" type="text" name="deskripsi" value={formData.deskripsi} placeholder="Diskon Spesial Hari Raya" onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Diskon</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center"><input type="radio" name="jenis_diskon" value="persen" checked={formData.jenis_diskon === 'persen'} onChange={handleChangeFn} className="form-radio" /> <span className="ml-2">Persentase (%)</span></label>
                        <label className="flex items-center"><input type="radio" name="jenis_diskon" value="tetap" checked={formData.jenis_diskon === 'tetap'} onChange={handleChangeFn} className="form-radio" /> <span className="ml-2">Jumlah Tetap (Rp)</span></label>
                    </div>
                </div>
                <div>
                    <label htmlFor="nilai_diskon" className="block text-sm font-medium text-gray-700 mb-1">Nilai Diskon</label>
                    <input id="nilai_diskon" type="number" name="nilai_diskon" value={formData.nilai_diskon} placeholder={formData.jenis_diskon === 'persen' ? '10' : '50000'} onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border" />
                </div>
            </div>
             <div>
                <label className="flex items-center cursor-pointer"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChangeFn} className="form-checkbox h-5 w-5" /> <span className="ml-3 text-sm font-medium text-gray-700">Aktifkan Promo</span></label>
            </div>
        </div>
    );
    
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3"><RiPriceTag3Fill /> Promo & Diskon</h1>
                <p className="text-gray-600">Buat dan kelola kode promo untuk pelanggan Anda.</p>
            </header>
            <div className="mb-4 min-h-[40px]">{error && <AlertBox type="error">{error}</AlertBox>}{success && <AlertBox type="success">{success}</AlertBox>}</div>
            {!isEditing && (<div className="bg-white rounded-xl shadow-lg p-6 mb-10"><h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center"><AiOutlinePlusCircle className="mr-2 text-blue-500" size={24} /> Buat Kode Promo Baru</h3><form onSubmit={handleSubmit}>{renderFormFields(addDataForm, (e) => handleChange(e, 'add'))}<button type="submit" disabled={loading} className="mt-6 w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md">{loading ? "Menyimpan..." : "Buat Promo"}</button></form></div>)}
            {isEditing && (<div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-2xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold text-gray-700 flex items-center"><AiOutlineEdit className="mr-2 text-blue-500" size={24} /> Edit Kode Promo</h3><button onClick={handleCloseEditModal} className="p-1 rounded-full hover:bg-gray-200"><AiOutlineCloseCircle size={24} className="text-gray-500" /></button></div><form onSubmit={handleUpdateSubmit}>{renderFormFields(editDataForm, (e) => handleChange(e, 'edit'))}<div className="flex justify-end space-x-3 pt-6"><button type="button" onClick={handleCloseEditModal} disabled={loading} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg">Batal</button><button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md">{loading ? "Memperbarui..." : "Simpan Perubahan"}</button></div></form></div></div>)}
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isEditing ? 'filter blur-sm' : ''}`}>
                <div className="px-6 py-4 border-b"><h3 className="text-xl font-semibold text-gray-700">Daftar Promo Aktif ({promoList.length})</h3></div>
                {loading && promoList.length === 0 && <div className="p-10"><LoadingSpinner text="Memuat daftar promo..." /></div>}
                {!loading && promoList.length === 0 && !error && <div className="p-10"><EmptyState text="Belum ada promo yang dibuat." /></div>}
                {promoList.length > 0 && (<GenericTable columns={["Kode", "Diskon", "Deskripsi", "Kadaluarsa", "Status", "Aksi"]} data={promoList}
                        renderRow={(item) => (
                            <>
                                <td className="px-6 py-4 border-b font-mono font-semibold text-blue-600">{item.kode_promo}</td>
                                <td className="px-6 py-4 border-b font-medium text-black-600">{item.jenis_diskon === 'persen' ? `${item.nilai_diskon}%` : formatCurrency(item.nilai_diskon)}</td>
                                <td className="px-6 py-4 border-b">{item.deskripsi}</td>
                                <td className="px-6 py-4 border-b">{item.tanggal_kadaluarsa || 'Tidak ada'}</td>
                                <td className="px-6 py-4 border-b"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.is_active ? 'bg-blue-100 text-black-800' : 'bg-gray-100 text-gray-800'}`}>{item.is_active ? 'Aktif' : 'Tidak Aktif'}</span></td>
                                <td className="px-6 py-4 border-b text-center"><div className="flex items-center justify-center space-x-2"><button onClick={() => handleOpenEditModal(item)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-blue-100 disabled:opacity-50" title="Edit"><AiOutlineEdit className="text-blue-500 text-xl" /></button><button onClick={() => handleDelete(item.id)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-red-100 disabled:opacity-50" title="Hapus"><AiFillDelete className="text-red-500 text-xl" /></button></div></td>
                            </>
                        )} />
                )}
            </div>
        </div>
    );
}