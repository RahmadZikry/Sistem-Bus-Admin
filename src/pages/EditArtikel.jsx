// src/pages/EditArtikel.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiArrowLeft, FiImage, FiType } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import artikelData from "../JSON/artikel.json";

export default function EditArtikel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: '',
        konten: '',
        penulis: '',
        status: 'Draft',
        gambar: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [articleExists, setArticleExists] = useState(true);

    // Load article data
    useEffect(() => {
        const articleId = parseInt(id);
        const article = artikelData.find(item => item.id === articleId);
        
        if (article) {
            setFormData({
                judul: article.judul || '',
                konten: article.konten || '',
                penulis: article.penulis || '',
                status: article.status || 'Draft',
                gambar: article.gambar || ''
            });
        } else {
            setArticleExists(false);
        }
        setIsLoading(false);
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi form
        if (!formData.judul.trim() || !formData.konten.trim() || !formData.penulis.trim()) {
            alert('Please fill in all required fields (Title, Content, and Author).');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In real app, you would update the data via API
            console.log('Updating article:', { id: parseInt(id), ...formData });
            
            // Show success message and redirect
            alert('Article updated successfully!');
            navigate('/artikel');
        } catch (error) {
            console.error('Error updating article:', error);
            alert('Error updating article. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
            navigate('/artikel');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!articleExists) {
        return (
            <div className="space-y-6">
                <PageHeader 
                    title="Article Not Found" 
                    breadcrumb={["Dashboard", "Articles", "Edit Article"]}
                >
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/artikel"
                            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            <FiArrowLeft size={18}/>
                            <span>Back to Articles</span>
                        </Link>
                    </div>
                </PageHeader>
                
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
                        <p className="text-gray-600 mb-6">The article you're trying to edit doesn't exist.</p>
                        <Link 
                            to="/artikel"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <FiArrowLeft size={18}/>
                            <span>Back to Articles</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Edit Article" 
                breadcrumb={["Dashboard", "Articles", "Edit Article"]}
            >
                <div className="flex items-center gap-3">
                    <Link 
                        to="/artikel"
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        <FiArrowLeft size={18}/>
                        <span>Back to Articles</span>
                    </Link>
                </div>
            </PageHeader>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Content Card */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <FiType />
                                Article Content
                            </h2>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Title Field */}
                            <div>
                                <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                                    Article Title *
                                </label>
                                <input
                                    type="text"
                                    id="judul"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Enter article title..."
                                />
                            </div>

                            {/* Author Field */}
                            <div>
                                <label htmlFor="penulis" className="block text-sm font-medium text-gray-700 mb-2">
                                    Author *
                                </label>
                                <input
                                    type="text"
                                    id="penulis"
                                    name="penulis"
                                    value={formData.penulis}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Enter author name..."
                                />
                            </div>

                            {/* Image URL Field */}
                            <div>
                                <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiImage />
                                    Featured Image URL
                                </label>
                                <input
                                    type="url"
                                    id="gambar"
                                    name="gambar"
                                    value={formData.gambar}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.gambar && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                                        <img 
                                            src={formData.gambar} 
                                            alt="Preview" 
                                            className="max-w-xs h-auto rounded-lg border border-gray-300"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Content Field */}
                            <div>
                                <label htmlFor="konten" className="block text-sm font-medium text-gray-700 mb-2">
                                    Content *
                                </label>
                                <textarea
                                    id="konten"
                                    name="konten"
                                    value={formData.konten}
                                    onChange={handleInputChange}
                                    required
                                    rows={12}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-vertical"
                                    placeholder="Write your article content here..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Publication Settings
                            </h2>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status Field */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <FiX size={18}/>
                            <span>Cancel</span>
                        </button>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            <FiSave size={18}/>
                            <span>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}