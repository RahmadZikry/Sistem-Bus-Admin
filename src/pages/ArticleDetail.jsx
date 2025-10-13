// src/pages/ArticleDetail.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import artikelData from '../JSON/artikel.json'; // Pastikan path ini benar
import PageHeader from '../components/PageHeader'; // Pastikan path ini benar
import { FiArrowLeft, FiUser, FiCalendar, FiEdit3, FiCheckSquare, FiEdit, FiTag, FiFileText } from 'react-icons/fi';

// Fungsi untuk mendapatkan style status (tetap sama)
const getStatusInfo = (status) => {
    switch (status) {
        case "Published":
            return { text: "Published", icon: <FiCheckSquare className="mr-1.5 text-green-500" />, badgeClass: "bg-green-100 text-green-700 border border-green-200" };
        case "Draft":
            return { text: "Draft", icon: <FiEdit className="mr-1.5 text-yellow-500" />, badgeClass: "bg-yellow-100 text-yellow-700 border border-yellow-200" };
        default:
            return { text: "Unknown", icon: <FiTag className="mr-1.5 text-gray-500" />, badgeClass: "bg-gray-100 text-gray-700 border border-gray-200" };
    }
};

export default function ArticleDetail() {
    const { id: articleIdFromUrl } = useParams(); // id dari URL selalu string
    const navigate = useNavigate();

    // Cari artikel berdasarkan ID. ID di JSON adalah number.
    // Konversi articleIdFromUrl (string) ke number untuk perbandingan.
    const article = artikelData.find(art => art.id.toString() === articleIdFromUrl);

    if (!article) {
        return (
            <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
                <PageHeader title="Article Not Found" breadcrumb={["Dashboard", "Articles", "Not Found"]} />
                <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                    <FiFileText size={60} className="text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Article Not Found</h2>
                    <p className="text-gray-500 mb-8">
                    The article with ID: <span className="font-semibold">{articleIdFromUrl}</span> could not be found.
                    </p>
                    <Link
                        to="/artikel" // Sesuaikan dengan path list artikel Anda
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back to Articles</span>
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(article.status);
    // Penanganan url_gambar_thumbnail jika field ini mungkin tidak ada di semua item JSON
    const imageUrl = article.url_gambar_thumbnail 
        ? (article.url_gambar_thumbnail.startsWith('./') 
            ? `/${article.url_gambar_thumbnail.substring(2)}` 
            : article.url_gambar_thumbnail)
        : null; // Set ke null jika tidak ada

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader 
                title="Article Detail"
                breadcrumb={["Dashboard", "Articles", article.judul.length > 30 ? article.judul.substring(0,30) + "..." : article.judul ]}
            >
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow hover:shadow-md transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <Link 
                        to={`/articles/edit/${article.id}`} // Path ke halaman edit
                        className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow hover:shadow-md transition-colors"
                    >
                        <FiEdit3 size={18}/>
                        <span>Edit Article</span>
                    </Link>
                </div>
            </PageHeader>

            <article className="mt-8 max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                {/* Gambar Thumbnail Artikel (hanya jika imageUrl ada) */}
                {imageUrl && (
                    <div className="w-full h-56 md:h-72 lg:h-80 bg-gray-200 flex items-center justify-center text-gray-400"> {/* Background placeholder */}
                        <img 
                            src={imageUrl} // imageUrl sudah di-handle pathnya
                            alt={`Thumbnail for ${article.judul}`}
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<p>Image not available</p>'; }} // Fallback jika gambar error
                        />
                    </div>
                )}

                <div className="p-6 md:p-8 lg:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                        {article.judul}
                    </h1>

                    <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 space-y-2 sm:space-y-0 sm:space-x-6 border-b pb-4">
                        <div className="flex items-center">
                            <FiUser className="mr-2 text-gray-400" />
                            <span>By: <span className="font-medium text-gray-700">{article.penulis}</span></span>
                        </div>
                        <div className="flex items-center">
                            <FiCalendar className="mr-2 text-gray-400" />
                            <span>Published: <span className="font-medium text-gray-700">
                                {new Date(article.tanggal).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span></span>
                        </div>
                        <div className="flex items-center">
                            {statusInfo.icon}
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.badgeClass}`}>
                                {statusInfo.text}
                            </span>
                        </div>
                    </div>
                    
                    <div 
                        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-700 leading-relaxed article-content"
                    >
                        {article.konten.split('\n').map((paragraph, index) => (
                            <p key={index} className={index > 0 ? "mt-4" : ""}>{paragraph || <> </>}</p>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
}