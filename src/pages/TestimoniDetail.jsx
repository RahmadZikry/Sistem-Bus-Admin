// src/pages/TestimoniDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testimoniAPI } from '../services/testimoniAPI'; // Gunakan testimoniAPI
import PageHeader from '../components/PageHeader';
import { FiArrowLeft, FiUser, FiHome, FiMessageSquare, FiStar, FiThumbsUp } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner'; // Untuk state loading

// Komponen untuk menampilkan rating bintang (read-only)
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar key={star} className={`text-xl ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-gray-600 font-semibold">({rating} / 5)</span>
        </div>
    );
};

export default function TestimoniDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [testimoni, setTestimoni] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTestimoniDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await testimoniAPI.fetchTestimoniById(id);
                setTestimoni(data);
            } catch (err) {
                setError("Gagal memuat detail testimoni.");
            } finally {
                setLoading(false);
            }
        };
        loadTestimoniDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner text="Memuat detail..." />
            </div>
        );
    }

    if (error || !testimoni) {
        return (
            <div className="container mx-auto p-8 text-center">
                <PageHeader title="Error" breadcrumb={["Dashboard", "Testimoni", "Not Found"]} />
                <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                    <FiThumbsUp size={60} className="text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Testimoni Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-8">{error || `Testimoni dengan ID: ${id} tidak dapat ditemukan.`}</p>
                    <button onClick={() => navigate('/testimoni')} className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg">
                        <FiArrowLeft size={20} />
                        <span>Kembali ke Daftar Testimoni</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader 
                title="Detail Testimoni"
                breadcrumb={["Dashboard", "Testimoni", testimoni.name]}
            >
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg">
                    <FiArrowLeft size={20} />
                    <span>Kembali</span>
                </button>
            </PageHeader>

            <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Kolom Kiri: Foto dan Info Pengirim */}
                        <div className="flex-shrink-0 text-center">
                            <img 
                                src={testimoni.image || `https://ui-avatars.com/api/?name=${testimoni.name}&background=random`} 
                                alt={testimoni.name}
                                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-100 shadow-md"
                            />
                            <div className="mt-4">
                                <h2 className="text-xl font-bold text-gray-800">{testimoni.name}</h2>
                                {testimoni.company && (
                                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1">
                                        <FiHome size={14} /> {testimoni.company}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Kolom Kanan: Detail Komentar dan Rating */}
                        <div className="flex-grow">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"><FiStar /> Rating</h3>
                                <StarRating rating={testimoni.rating} />
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FiMessageSquare /> Komentar
                                </h3>
                                <blockquote className="text-gray-700 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-md">
                                    {testimoni.comment}
                                </blockquote>
                            </div>

                             <div className="text-xs text-gray-400 mt-8">
                                <p>Testimoni dibuat pada: {new Date(testimoni.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}