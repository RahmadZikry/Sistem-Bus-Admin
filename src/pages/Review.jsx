// src/pages/Review.jsx (FIXED)

import React, { useState, useMemo } from 'react';
// [PERBAIKAN 1] Impor Link dari react-router-dom
import { Link } from 'react-router-dom'; 
import { FiSearch, FiStar, FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import reviewData from "../JSON/reviews.json";

// Komponen StarRating (tidak ada perubahan)
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <FiStar
                    key={index}
                    size={16}
                    className={`mr-0.5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

export default function Review() {
    // Semua logika state dan filtering Anda sudah bagus, tidak perlu diubah
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredReviews = useMemo(() => {
        return reviewData
            .filter((review) => {
                const search = searchTerm.toLowerCase();
                const matchesSearch =
                    review.customerName.toLowerCase().includes(search) ||
                    review.comment.toLowerCase().includes(search);
                const matchesRating = ratingFilter === "All" || review.rating === parseInt(ratingFilter);
                return matchesSearch && matchesRating;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [searchTerm, ratingFilter]);

    useState(() => {
        setCurrentPage(1);
    }, [searchTerm, ratingFilter]);

    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
    
    return (
        <div className="space-y-6">
            <PageHeader title="Customer Reviews" breadcrumb={["Dashboard", "Review List"]} />

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Bagian Filter (tidak ada perubahan) */}
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="w-full md:w-1/2 lg:w-1/3">
                        <label htmlFor="search" className="text-sm font-medium text-gray-700 block mb-1">Search Reviews</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input id="search" type="text" placeholder="By name or comment..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
                        </div>
                    </div>
                    <div className="w-full md:w-auto md:w-1/4">
                        <label htmlFor="ratingFilter" className="text-sm font-medium text-gray-700 block mb-1">Filter by Rating</label>
                        <select id="ratingFilter" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                            <option value="All">All Ratings</option>
                            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/70 text-left border-y border-gray-200">
                             <tr>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{review.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{review.customerName}</td>
                                    <td className="px-6 py-4"><StarRating rating={review.rating} /></td>
                                    <td className="px-6 py-4 text-gray-600 max-w-md truncate">{review.comment}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    {/* [PERBAIKAN 2 & 3] Menambahkan whitespace-nowrap dan memperbaiki path Link */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <Link to={`/review/${review.id}`}  className="p-2 inline-block text-blue-600 hover:bg-blue-100 rounded-full" title="View Details">
                                            <FiEye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Bagian paginasi (tidak ada perubahan) */}
            </div>
        </div>
    );
}