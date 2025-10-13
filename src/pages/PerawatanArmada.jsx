import React, { useState, useEffect } from 'react';
import AlertBox from "../components/AlertBox";
import { perawatanAPI } from "../services/perawatanAPI";
import { busAPI } from "../services/busAPI";
import GenericTable from '../components/GenericTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { AiFillDelete, AiOutlinePlusCircle, AiOutlineEdit, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaBus, FaDollarSign, FaWrench } from "react-icons/fa";
import { FiTool } from "react-icons/fi";


const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

export default function PerawatanArmada() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [perawatanList, setPerawatanList] = useState([]);
    const [busList, setBusList] = useState([]);

    const [addDataForm, setAddDataForm] = useState({ id_bus: '', tanggal_servis: '', jenis_perawatan: '', biaya: '', vendor: '', odometer: '', catatan: '' });
    const [editDataForm, setEditDataForm] = useState({ id: null, id_bus: '', tanggal_servis: '', jenis_perawatan: '', biaya: '', vendor: '', odometer: '', catatan: '' });
    const [isEditing, setIsEditing] = useState(false);

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
                const [perawatanData, busesData] = await Promise.all([
                    perawatanAPI.fetchPerawatan(),
                    busAPI.fetchBuses()
                ]);
                setPerawatanList(perawatanData);
                setBusList(busesData);
            } catch (err) {
                setError("Gagal memuat data perawatan. Pastikan tabel 'perawatan' sudah ada.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id_bus, tanggal_servis, jenis_perawatan, biaya } = addDataForm;
        if (!id_bus || !tanggal_servis || !jenis_perawatan.trim() || !biaya) {
            setError("Bus, Tanggal, Jenis Perawatan, dan Biaya harus diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true);
            const dataToSubmit = {
                ...addDataForm,
                id_bus: parseInt(addDataForm.id_bus, 10),
                biaya: parseFloat(addDataForm.biaya),
                odometer: addDataForm.odometer ? parseInt(addDataForm.odometer, 10) : null
            };
            await perawatanAPI.createPerawatan(dataToSubmit);
            setSuccess("Catatan perawatan berhasil ditambahkan!");
            setAddDataForm({ id_bus: '', tanggal_servis: '', jenis_perawatan: '', biaya: '', vendor: '', odometer: '', catatan: '' });
            setTimeout(() => setSuccess(""), 3000);
            const data = await perawatanAPI.fetchPerawatan();
            setPerawatanList(data);
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus catatan perawatan ini?")) return;
        try {
            setLoading(true);
            await perawatanAPI.deletePerawatan(id);
            setSuccess("Catatan berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            const data = await perawatanAPI.fetchPerawatan();
            setPerawatanList(data);
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
            tanggal_servis: item.tanggal_servis,
            jenis_perawatan: item.jenis_perawatan,
            biaya: item.biaya,
            vendor: item.vendor || '',
            odometer: item.odometer || '',
            catatan: item.catatan || ''
        });
        setIsEditing(true);
    };

    const handleCloseEditModal = () => setIsEditing(false);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const { id, id_bus, tanggal_servis, jenis_perawatan, biaya } = editDataForm;
        if (!id_bus || !tanggal_servis || !jenis_perawatan.trim() || !biaya) {
            setError("Field yang wajib diisi tidak boleh kosong.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true);
            const dataToUpdate = {
                ...editDataForm,
                id: undefined,
                id_bus: parseInt(id_bus, 10),
                biaya: parseFloat(biaya),
                odometer: editDataForm.odometer ? parseInt(editDataForm.odometer, 10) : null
            };
            await perawatanAPI.updatePerawatan(id, dataToUpdate);
            setSuccess("Catatan berhasil diperbarui!");
            setTimeout(() => setSuccess(""), 3000);
            handleCloseEditModal();
            const data = await perawatanAPI.fetchPerawatan();
            setPerawatanList(data);
        } catch (err) {
            setError(`Terjadi kesalahan saat memperbarui: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = (formData, handleChangeFn) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="id_bus" className="block text-sm font-medium text-gray-700 mb-1">Pilih Bus</label>
                    <select id="id_bus" name="id_bus" value={formData.id_bus} onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <option value="">-- Pilih Bus --</option>
                        {busList.map(bus => (
                            <option key={bus.id_layanan} value={bus.id_layanan}>{`${bus.tipe_bus} - ${bus.operator_bus}`}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="tanggal_servis" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Servis</label>
                    <input id="tanggal_servis" type="date" name="tanggal_servis" value={formData.tanggal_servis} onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300" />
                </div>
            </div>
            <div>
                <label htmlFor="jenis_perawatan" className="block text-sm font-medium text-gray-700 mb-1">Jenis Perawatan</label>
                <input id="jenis_perawatan" type="text" name="jenis_perawatan" value={formData.jenis_perawatan} placeholder="Contoh: Ganti Oli Mesin, Servis Rem" onChange={handleChangeFn} disabled={loading} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="biaya" className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
                    <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input id="biaya" type="number" name="biaya" value={formData.biaya} placeholder="500000" onChange={handleChangeFn} disabled={loading} required className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-gray-300" />
                    </div>
                </div>
                <div>
                    <label htmlFor="odometer" className="block text-sm font-medium text-gray-700 mb-1">Odometer (km)</label>
                    <input id="odometer" type="number" name="odometer" value={formData.odometer} placeholder="150000" onChange={handleChangeFn} disabled={loading} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300" />
                </div>
            </div>
            <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor/Bengkel</label>
                <input id="vendor" type="text" name="vendor" value={formData.vendor} placeholder="Contoh: Bengkel Maju Jaya" onChange={handleChangeFn} disabled={loading} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300" />
            </div>
            <div>
                <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                <textarea id="catatan" name="catatan" value={formData.catatan} placeholder="Ganti filter udara, cek tekanan ban, dll." onChange={handleChangeFn} disabled={loading} rows="3" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 resize-none" />
            </div>
        </div>
    );

    const getBusName = (busId) => {
        const bus = busList.find(b => b.id_layanan === busId);
        return bus ? `${bus.tipe_bus} - ${bus.operator_bus}` : 'Bus Tidak Dikenal';
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3"><FaWrench /> Perawatan Armada</h1>
                <p className="text-gray-600">Catat dan kelola riwayat servis untuk semua kendaraan.</p>
            </header>

            <div className="mb-4 min-h-[40px]">
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}
            </div>

            {/* Form Tambah */}
            {!isEditing && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center"><AiOutlinePlusCircle className="mr-2 text-blue-500" size={24} /> Tambah Catatan Servis</h3>
                    <form onSubmit={handleSubmit}>{renderFormFields(addDataForm, (e) => handleChange(e, 'add'))}<button type="submit" disabled={loading} className="mt-6 w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md">{loading ? "Menyimpan..." : "Simpan Catatan"}</button></form>
                </div>
            )}

            {/* Modal Edit */}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-2xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold text-gray-700 flex items-center"><AiOutlineEdit className="mr-2 text-blue-500" size={24} /> Edit Catatan Servis</h3><button onClick={handleCloseEditModal} className="p-1 rounded-full hover:bg-gray-200"><AiOutlineCloseCircle size={24} className="text-gray-500" /></button></div><form onSubmit={handleUpdateSubmit}>{renderFormFields(editDataForm, (e) => handleChange(e, 'edit'))}<div className="flex justify-end space-x-3 pt-6"><button type="button" onClick={handleCloseEditModal} disabled={loading} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg">Batal</button><button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md">{loading ? "Memperbarui..." : "Simpan Perubahan"}</button></div></form></div></div>
            )}

            {/* Tabel Riwayat */}
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isEditing ? 'filter blur-sm' : ''}`}>
                <div className="px-6 py-4 border-b border-gray-200"><h3 className="text-xl font-semibold text-gray-700">Riwayat Servis ({perawatanList.length})</h3></div>
                {loading && perawatanList.length === 0 && <div className="p-10"><LoadingSpinner text="Memuat riwayat servis..." /></div>}
                {!loading && perawatanList.length === 0 && !error && <div className="p-10"><EmptyState text="Belum ada catatan perawatan." /></div>}
                {perawatanList.length > 0 && (
                    <GenericTable columns={["Bus", "Tgl Servis", "Jenis Perawatan", "Biaya", "Odometer (km)", "Aksi"]} data={perawatanList}
                        renderRow={(item) => (
                            <>
                                <td className="px-6 py-4 border-b font-semibold text-gray-800">{getBusName(item.id_bus)}</td>
                                <td className="px-6 py-4 border-b">{item.tanggal_servis}</td>
                                <td className="px-6 py-4 border-b">{item.jenis_perawatan}</td>
                                <td className="px-6 py-4 border-b font-bold text-blue-600">{formatCurrency(item.biaya)}</td>
                                <td className="px-6 py-4 border-b">{item.odometer ? item.odometer.toLocaleString('id-ID') : '-'}</td>
                                <td className="px-6 py-4 border-b text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(item)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-blue-100 disabled:opacity-50" title="Edit"><AiOutlineEdit className="text-blue-500 text-xl" /></button>
                                        <button onClick={() => handleDelete(item.id)} disabled={loading || isEditing} className="p-2 rounded-full hover:bg-red-100 disabled:opacity-50" title="Hapus"><AiFillDelete className="text-red-500 text-xl" /></button>
                                    </div>
                                </td>
                            </>
                        )} />
                )}
            </div>
        </div>
    );
}