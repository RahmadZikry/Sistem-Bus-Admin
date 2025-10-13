// src/pages/TimDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { timAPI } from '../services/timAPI';
import PageHeader from '../components/PageHeader';
import { FiArrowLeft, FiUser, FiBriefcase, FiMail, FiPhone, FiInfo } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TimDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anggota, setAnggota] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAnggotaDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await timAPI.fetchAnggotaById(id);
                // Langsung gunakan data, karena nama kolom di DB sudah sesuai
                setAnggota(data);
            } catch (err) {
                setError("Gagal memuat detail anggota tim.");
            } finally {
                setLoading(false);
            }
        };
        loadAnggotaDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner text="Memuat profil anggota..." />
            </div>
        );
    }

    if (error || !anggota) {
        return (
            <div className="container mx-auto p-8 text-center">
                <PageHeader title="Error" breadcrumb={["Dashboard", "Tim", "Not Found"]} />
                <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                    <FiUser size={60} className="text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Anggota Tim Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-8">{error || `Anggota tim dengan ID: ${id} tidak dapat ditemukan.`}</p>
                    <button onClick={() => navigate('/tim')} className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg">
                        <FiArrowLeft size={20} />
                        <span>Kembali ke Daftar Tim</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader 
                title="Profil Anggota Tim"
                breadcrumb={["Dashboard", "Tim", anggota.name]}
            >
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg">
                    <FiArrowLeft size={20} />
                    <span>Kembali</span>
                </button>
            </PageHeader>

            <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="px-6 md:px-8 pb-8">
                    {/* Foto Profil dan Nama */}
                    <div className="flex justify-center -mt-16">
                        <img 
                            src={anggota.image || `https://ui-avatars.com/api/?name=${anggota.name}&background=e0e7ff&color=4f46e5`} 
                            alt={anggota.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                    <div className="text-center mt-4">
                        <h2 className="text-3xl font-bold text-gray-800">{anggota.name}</h2>
                        <p className="text-md text-blue-600 font-semibold">{anggota.position}</p>
                    </div>

                    {/* Detail Informasi */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Detail Informasi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="flex items-center">
                                <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800">{anggota.name.toLowerCase().replace(' ', '.')}@bustravelie.com</p>
                                </div>
                            </div>
                             <div className="flex items-center">
                                <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-gray-500">Telepon</p>
                                    <p className="font-medium text-gray-800">+62 812-3456-7890</p>
                                </div>
                            </div>
                             <div className="flex items-center">
                                <FiBriefcase className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-gray-500">Jabatan</p>
                                    <p className="font-medium text-gray-800">{anggota.position}</p>
                                </div>
                            </div>
                             <div className="flex items-center">
                                <FiInfo className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-gray-500">Status</p>
                                    <p className="font-medium text-green-600">Aktif</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="text-xs text-gray-400 mt-8 text-right">
                        <p>Anggota tim ditambahkan pada: {new Date(anggota.created_at).toLocaleString('id-ID', { dateStyle: 'long' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}