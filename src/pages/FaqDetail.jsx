// src/pages/FaqDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { faqAPI } from '../services/faqAPI';
import PageHeader from '../components/PageHeader';
import { FiArrowLeft, FiHelpCircle, FiMessageSquare, FiInfo } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FaqDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [faq, setFaq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFaqDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await faqAPI.fetchFaqById(id);
                setFaq(data);
            } catch (err) {
                setError("Gagal memuat detail FAQ.");
            } finally {
                setLoading(false);
            }
        };
        loadFaqDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner text="Memuat FAQ..." />
            </div>
        );
    }

    if (error || !faq) {
        return (
            <div className="container mx-auto p-8 text-center">
                <PageHeader title="Error" breadcrumb={["Dashboard", "FAQ", "Not Found"]} />
                <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                    <FiHelpCircle size={60} className="text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! FAQ Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-8">{error || `FAQ dengan ID: ${id} tidak dapat ditemukan.`}</p>
                    <button onClick={() => navigate('/faq')} className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg">
                        <FiArrowLeft size={20} />
                        <span>Kembali ke Daftar FAQ</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader 
                title="Detail FAQ"
                breadcrumb={["Dashboard", "FAQ", `ID: ${faq.id}`]}
            >
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg">
                    <FiArrowLeft size={20} />
                    <span>Kembali</span>
                </button>
            </PageHeader>

            <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 md:p-8">
                    {/* Pertanyaan */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                            {faq.question}
                        </h2>
                    </div>
                    
                    {/* Jawaban */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiMessageSquare /> Jawaban
                        </h3>
                        {/* Menggunakan div dengan whitespace-pre-wrap untuk menjaga format paragraf */}
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-5 rounded-md border">
                            {faq.answer}
                        </div>
                    </div>

                    <div className="text-xs text-gray-400 mt-8 text-right">
                        <p>Dibuat pada: {new Date(faq.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}