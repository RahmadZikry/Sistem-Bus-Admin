// src/pages/ReviewDetail.jsx (FIXED)

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import reviewData from '../JSON/reviews.json';
import PageHeader from '../components/PageHeader';
import { FiArrowLeft, FiUser, FiStar, FiMessageSquare, FiCalendar } from 'react-icons/fi';

// Komponen StarRating (bisa dipertahankan)
const StarRating = ({ rating, size = 20 }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <FiStar key={index} size={size} className={`mr-0.5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    );
};

export default function ReviewDetail() {
    const { id: reviewId } = useParams();
    const navigate = useNavigate();

    // [PERBAIKAN] Menggunakan '==' (loose equality) untuk membandingkan string dari URL dengan number/string dari JSON.
    // Ini cara yang lebih aman jika Anda tidak yakin tipe data ID di JSON.
    const review = reviewData.find(rev => rev.id == reviewId);

    if (!review) {
        // Halaman Not Found (tidak ada perubahan)
        return (
            <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
                <PageHeader title="Review Not Found" breadcrumb={["Dashboard", "Reviews", "Not Found"]} />
                <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                    <FiMessageSquare size={60} className="text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Review Not Found</h2>
                    <p className="text-gray-500 mb-8">
                        The review with ID: <span className="font-semibold">{reviewId}</span> could not be found.
                    </p>
                    {/* [PERBAIKAN] Pastikan link kembali juga ke path jamak '/reviews' */}
                    <Link to="/reviews" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg">
                        <FiArrowLeft size={20} />
                        <span>Back to Reviews</span>
                    </Link>
                </div>
            </div>
        );
    }
    
    // Tampilan detail (tidak ada perubahan)
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader title={`Review from: ${review.customerName}`} breadcrumb={["Dashboard", "Reviews", `ID: ${review.id}`]}>
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow hover:shadow-md">
                    <FiArrowLeft size={20} />
                    <span>Back</span>
                </button>
            </PageHeader>
            <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-4 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 flex items-center"><FiUser className="mr-3 text-gray-400"/> {review.customerName}</h2>
                            <div className="text-sm text-gray-500 flex items-center mt-1"><FiCalendar className="mr-1.5 text-gray-400"/> Reviewed on: {new Date(review.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div className="mt-3 sm:mt-0 flex flex-col items-start sm:items-end">
                            <StarRating rating={review.rating} size={24} />
                            <p className="text-xs text-gray-400 mt-1">{review.rating} out of 5 stars</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FiMessageSquare className="mr-2 text-gray-500"/> Customer's Comment</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200">{review.comment}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}