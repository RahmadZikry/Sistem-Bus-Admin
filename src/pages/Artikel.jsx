// src/pages/Artikel.jsx (Refactored for new design)

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiPlus, FiChevronLeft, FiChevronRight, FiCheckSquare } from "react-icons/fi";
import PageHeader from "../components/PageHeader"; 
import artikelData from "../JSON/artikel.json"; 

// [REUSABLE COMPONENT] untuk status pill agar lebih rapi dan sesuai desain
const StatusPill = ({ status }) => {
    const baseStyle = "flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full";
    
    const styles = {
        Published: "bg-green-100 text-green-800",
        Draft: "bg-yellow-100 text-yellow-800",
    };

    const icons = {
        Published: <FiCheckSquare />,
        Draft: <FiEdit />,
    };

    return (
        <span className={`${baseStyle} ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {icons[status]}
            {status}
        </span>
    );
};

export default function Artikel() {
    // State management (logika Anda sudah bagus, kita pertahankan)
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Memoized filtering dan sorting (logika Anda dipertahankan)
    const filteredArticles = useMemo(() => 
        artikelData
            .filter((item) => {
                const search = searchTerm.toLowerCase();
                const matchesSearch = 
                    item.judul.toLowerCase().includes(search) ||
                    item.konten.toLowerCase().includes(search) ||
                    item.penulis.toLowerCase().includes(search);
                const matchesStatus = statusFilter === "All" || item.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)),
        [searchTerm, statusFilter]
    );
    
    // Reset halaman saat filter berubah
    useState(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const currentItems = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Dummy delete handler (tidak berubah)
    const handleDeleteArticle = (articleId) => {
        if (window.confirm(`Are you sure you want to delete article ID: ${articleId}?`)) {
            alert(`Article ${articleId} would be deleted (simulation).`);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Article Management" breadcrumb={["Dashboard", "Articles"]}>
                <Link 
                    to="/articles/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105"
                >
                    <FiPlus size={18}/>
                    <span>Create New Article</span>
                </Link>
            </PageHeader>

            {/* [RESTRUCTURED] Filter dan Tabel sekarang ada di dalam satu card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                
                {/* Bagian Filter */}
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="w-full md:w-auto">
                        <label htmlFor="search" className="text-sm font-medium text-gray-700 block mb-1">Search Articles</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="search"
                                type="text"
                                placeholder="By title, content (excerpt)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 block mb-1 text-left md:text-right">Filter by Status</label>
                        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
                            {["All", "Published", "Draft"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors duration-200 ${
                                        statusFilter === status
                                            ? "bg-blue-500 text-white shadow"
                                            : "text-gray-600 hover:bg-white/80"
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabel Artikel */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left border-y border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider w-12">ID</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Excerpt</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.judul}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-sm truncate">{item.konten}</td>
                                        <td className="px-6 py-4 text-gray-500">{item.penulis}</td>
                                        <td className="px-6 py-4"><StatusPill status={item.status} /></td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(item.tanggal).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <Link to={`/articles/${item.id}`} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="View"><FiEye size={16} /></Link>
                                                <Link to={`/articles/edit/${item.id}`} className="p-2 text-green-600 hover:bg-green-100 rounded-full" title="Edit"><FiEdit size={16} /></Link>
                                                <button onClick={() => handleDeleteArticle(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Delete"><FiTrash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-16 text-gray-500">
                                        No articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}