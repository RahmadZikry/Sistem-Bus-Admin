// src/pages/Job.jsx (Lengkap dengan Tombol Detail)

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- 1. IMPORT Link
import { FiPlus, FiSave, FiEdit3, FiTrash2, FiSearch, FiBriefcase, FiEye } from "react-icons/fi"; // <-- 2. IMPORT FiEye
import { jobAPI } from "../services/jobAPI";
import AlertBox from "../components/AlertBox";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import GenericTable from "../components/GenericTable";

export default function Job() {
    // ... semua state dan fungsi logika tidak berubah ...
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({ id: null, title: "", location: "", type: "Full-Time", description: "", image: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError("");
            const dataFromDB = await jobAPI.fetchJobs();
            setJobs(dataFromDB);
        } catch (err) {
            setError("Gagal memuat data lowongan kerja.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadJobs(); }, []);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.location.trim() || !form.description.trim()) {
            setError("Judul, Lokasi, dan Deskripsi wajib diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (isEditing) {
                await jobAPI.updateJob(form.id, form);
                setSuccess("Lowongan berhasil diperbarui!");
            } else {
                await jobAPI.createJob(form);
                setSuccess("Lowongan baru berhasil dipublikasikan!");
            }
            resetForm();
            setTimeout(() => setSuccess(""), 3000);
            await loadJobs();
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus lowongan ini?")) {
            setLoading(true);
            try {
                await jobAPI.deleteJob(id);
                setSuccess("Lowongan berhasil dihapus!");
                setTimeout(() => setSuccess(""), 3000);
                await loadJobs();
            } catch (err) {
                setError("Gagal menghapus lowongan.");
            } finally {
                setLoading(false);
            }
        }
    };
    const handleOpenEditModal = (item) => {
        setForm(item);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const resetForm = () => {
        setForm({ id: null, title: "", location: "", type: "Full-Time", description: "", image: "" });
        setIsEditing(false);
    };
    const filteredJobs = jobs.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Manajemen Lowongan Kerja</h1>
                <p className="text-gray-600 mt-1">Publikasikan dan kelola lowongan pekerjaan di perusahaan Anda.</p>
            </header>

            <div className="mb-4 min-h-[40px]">
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                    {isEditing ? <FiEdit3 className="mr-2 text-blue-500" /> : <FiPlus className="mr-2 text-blue-500" />}
                    {isEditing ? 'Edit Lowongan Kerja' : 'Tambah Lowongan Baru'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Pekerjaan</label>
                            <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Contoh: Supir Bus Pariwisata" required className="w-full p-3 bg-gray-50 rounded-lg border" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                            <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Contoh: Jakarta" required className="w-full p-3 bg-gray-50 rounded-lg border" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipe Pekerjaan</label>
                            <select id="type" name="type" value={form.type} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border">
                                <option>Full-Time</option>
                                <option>Part-Time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Header (Opsional)</label>
                            <input id="image" name="image" value={form.image} onChange={handleChange} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-lg border" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
                        <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows="5" placeholder="Jelaskan tanggung jawab, kualifikasi, dll." className="w-full p-3 bg-gray-50 rounded-lg border resize-y" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        {isEditing && (
                             <button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Batal</button>
                        )}
                        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
                            <FiSave />
                            <span>{isEditing ? 'Simpan Perubahan' : 'Publikasikan'}</span>
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><FiBriefcase /> Daftar Lowongan Kerja ({filteredJobs.length})</h3>
                    <div className="relative w-1/3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Cari lowongan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
                    </div>
                </div>
                
                {loading && jobs.length === 0 ? (
                    <div className="p-10"><LoadingSpinner text="Memuat lowongan..." /></div>
                ) : filteredJobs.length > 0 ? (
                    <GenericTable
                        columns={["Judul Pekerjaan", "Lokasi", "Tipe", "Aksi"]}
                        data={filteredJobs}
                        renderRow={(item) => (
                            <>
                                <td className="px-6 py-4 border-b font-semibold">{item.title}</td>
                                <td className="px-6 py-4 border-b">{item.location}</td>
                                <td className="px-6 py-4 border-b"><span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md">{item.type}</span></td>
                                <td className="px-6 py-4 border-b text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(item)} className="p-2 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full"><FiEdit3 /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-full"><FiTrash2 /></button>
                                        <Link
                                            to={`/job/${item.id}`}
                                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                                            title="Lihat Detail Lowongan"
                                        >
                                            <FiEye />
                                        </Link>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                ) : (
                    <EmptyState text={searchTerm ? "Lowongan tidak ditemukan." : "Belum ada lowongan kerja yang dipublikasikan."} />
                )}
            </div>
        </div>
    );
}