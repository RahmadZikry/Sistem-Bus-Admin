// src/pages/Contact.jsx (FIXED)

import { useState, useMemo } from 'react';
// [PERBAIKAN 1] Pastikan 'Link' diimpor
import { Link } from 'react-router-dom';
import { FiSearch, FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import messagesData from "../JSON/contact.json";

// Komponen StatusPill (tidak ada perubahan)
const StatusPill = ({ status }) => {
    const baseStyle = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const styles = {
        Pending: "bg-yellow-100 text-yellow-800",
        Responded: "bg-green-100 text-green-800",
    };
    return (
        <span className={`${baseStyle} ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};


export default function Contact() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Logika filter dan paginasi (tidak ada perubahan)
    const filteredMessages = useMemo(() => {
        return messagesData
            .filter((message) => {
                const search = searchTerm.toLowerCase();
                const matchesSearch = 
                    message.name.toLowerCase().includes(search) ||
                    message.email.toLowerCase().includes(search) ||
                    message.subject.toLowerCase().includes(search);
                const matchesStatus = statusFilter === "All" || message.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [searchTerm, statusFilter]);
    
    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
    
    useState(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Bagian Filter (tidak ada perubahan) */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200">
                    <div className="w-full md:w-1/2 lg:w-1/3">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="By name, email, or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
                        <span className="text-sm font-medium text-gray-600 px-2 hidden sm:inline">Filter by:</span>
                        {["All", "Pending", "Responded"].map((status) => (
                            <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors duration-200 ${statusFilter === status ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-white/80"}`}>
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabel Pesan */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Date Received</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((message) => (
                                    <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{String(message.id).padStart(2, '0')}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{message.name}</td>
                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{message.email}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-sm truncate">{message.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusPill status={message.status} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(message.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {/* [PERBAIKAN 2] Mengganti <button> kembali menjadi <Link> */}
                                            <Link 
                                                to={`/contact/${message.id}`} 
                                                className="p-2 inline-block text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                                title={`View message from ${message.name}`}
                                            >
                                                <FiEye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-16 text-gray-500">
                                        No messages found for your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginasi (tidak ada perubahan) */}
                {totalPages > 0 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredMessages.length)}</span> of <span className="font-semibold">{filteredMessages.length}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                                <FiChevronLeft size={16} />
                            </button>
                            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}