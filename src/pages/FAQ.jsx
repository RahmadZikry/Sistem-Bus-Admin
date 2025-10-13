// src/pages/FAQ.jsx (Lengkap dengan tombol Detail)

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- 1. IMPORT Link
import { FiPlus, FiSave, FiEdit3, FiTrash2, FiSearch, FiHelpCircle, FiEye } from "react-icons/fi"; // <-- 2. IMPORT FiEye
import { faqAPI } from "../services/faqAPI";
import AlertBox from "../components/AlertBox";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import GenericTable from "../components/GenericTable";

export default function FAQ() {
    // ... semua state dan fungsi logika Anda (handleSubmit, handleDelete, dll) tidak berubah ...
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({ id: null, pertanyaan: "", jawaban: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const loadFaqs = async () => {
        try {
            setLoading(true);
            setError("");
            const dataFromDB = await faqAPI.fetchFaqs();
            const formattedFaqs = dataFromDB.map(item => ({
                id: item.id,
                pertanyaan: item.question,
                jawaban: item.answer,
            }));
            setFaqs(formattedFaqs);
        } catch (err) {
            setError("Gagal memuat data FAQ. Coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadFaqs(); }, []);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.pertanyaan.trim() || !form.jawaban.trim()) {
            setError("Pertanyaan dan Jawaban wajib diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (isEditing) {
                await faqAPI.updateFaq(form.id, form);
                setSuccess("FAQ berhasil diperbarui!");
            } else {
                await faqAPI.createFaq(form);
                setSuccess("FAQ baru berhasil ditambahkan!");
            }
            resetForm();
            setTimeout(() => setSuccess(""), 3000);
            await loadFaqs();
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus FAQ ini?")) {
            setLoading(true);
            try {
                await faqAPI.deleteFaq(id);
                setSuccess("FAQ berhasil dihapus!");
                setTimeout(() => setSuccess(""), 3000);
                await loadFaqs();
            } catch (err) {
                setError("Gagal menghapus FAQ.");
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
        setForm({ id: null, pertanyaan: "", jawaban: "" });
        setIsEditing(false);
    };
    const filteredFaqs = faqs.filter(item =>
        item.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jawaban.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Manajemen FAQ</h1>
                <p className="text-gray-600 mt-1">Kelola daftar pertanyaan yang sering diajukan.</p>
            </header>

            <div className="mb-4 min-h-[40px]">
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                    {isEditing ? <FiEdit3 className="mr-2 text-blue-500" /> : <FiPlus className="mr-2 text-blue-500" />}
                    {isEditing ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="pertanyaan" className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                        <input id="pertanyaan" name="pertanyaan" value={form.pertanyaan} onChange={handleChange} placeholder="Apa saja fasilitas yang tersedia?" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="jawaban" className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
                        <textarea id="jawaban" name="jawaban" value={form.jawaban} onChange={handleChange} placeholder="Kami menyediakan WiFi, AC, dan Toilet di setiap bus." required rows="4" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        {isEditing && (
                             <button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">Batal</button>
                        )}
                        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md disabled:opacity-60">
                            <FiSave />
                            <span>{isEditing ? 'Simpan Perubahan' : 'Tambah FAQ'}</span>
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><FiHelpCircle /> Daftar FAQ ({filteredFaqs.length})</h3>
                    <div className="relative w-1/3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Cari FAQ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                </div>
                
                {loading && faqs.length === 0 ? (
                    <div className="p-10"><LoadingSpinner text="Memuat data FAQ..." /></div>
                ) : filteredFaqs.length > 0 ? (
                    <GenericTable
                        columns={["Pertanyaan", "Jawaban", "Aksi"]}
                        data={filteredFaqs}
                        renderRow={(item) => (
                            <>
                                <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800 align-top">{item.pertanyaan}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600 max-w-md align-top whitespace-pre-wrap">{item.jawaban}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center align-top">
                                    {/* --- 3. PERUBAHAN DI SINI --- */}
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(item)} disabled={loading} className="p-2 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition disabled:opacity-50" title="Edit"><FiEdit3 /></button>
                                        <button onClick={() => handleDelete(item.id)} disabled={loading} className="p-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition disabled:opacity-50" title="Delete"><FiTrash2 /></button>
                                        {/* --- TOMBOL DETAIL BARU --- */}
                                        <Link
                                            to={`/faq/${item.id}`}
                                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <FiEye />
                                        </Link>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                ) : (
                    <EmptyState text={searchTerm ? "FAQ tidak ditemukan." : "Belum ada FAQ yang ditambahkan."} />
                )}
            </div>
        </div>
    );
}