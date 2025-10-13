// src/pages/JobDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/jobAPI';
import PageHeader from '../components/PageHeader';
import { FiArrowLeft, FiBriefcase, FiMapPin, FiClock, FiFileText, FiInfo } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadJobDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await jobAPI.fetchJobById(id);
                setJob(data);
            } catch (err) {
                setError("Gagal memuat detail lowongan kerja.");
            } finally {
                setLoading(false);
            }
        };
        loadJobDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner text="Memuat detail lowongan..." />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container mx-auto p-8 text-center">
                <PageHeader title="Error" breadcrumb={["Dashboard", "Lowongan Kerja", "Not Found"]} />
                <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                    <FiBriefcase size={60} className="text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Lowongan Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-8">{error || `Lowongan dengan ID: ${id} tidak dapat ditemukan.`}</p>
                    <button onClick={() => navigate('/job')} className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg">
                        <FiArrowLeft size={20} />
                        <span>Kembali ke Daftar Lowongan</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader 
                title="Detail Lowongan Kerja"
                breadcrumb={["Dashboard", "Lowongan Kerja", job.title]}
            >
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg">
                    <FiArrowLeft size={20} />
                    <span>Kembali</span>
                </button>
            </PageHeader>

            <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
                {/* Header Gambar (jika ada) */}
                {job.image && (
                    <img src={job.image} alt={job.title} className="w-full h-48 md:h-64 object-cover" />
                )}
                
                <div className="p-6 md:p-8">
                    {/* Judul dan Info Singkat */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div>
                            <span className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">{job.type}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">{job.title}</h2>
                        </div>
                        <div className="text-sm text-gray-500 flex flex-col items-start sm:items-end gap-2">
                             <div className="flex items-center">
                                <FiMapPin className="mr-2" /> {job.location}
                            </div>
                            <div className="flex items-center">
                                <FiClock className="mr-2" /> Dipublikasikan pada {new Date(job.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Deskripsi Pekerjaan */}
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiFileText /> Deskripsi Pekerjaan
                        </h3>
                        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}