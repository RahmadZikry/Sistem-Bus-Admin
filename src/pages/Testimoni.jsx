import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT Link
import AlertBox from "../components/AlertBox";
import { testimoniAPI } from "../services/testimoniAPI";
import GenericTable from '../components/GenericTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { AiFillDelete, AiOutlinePlusCircle, AiOutlineEdit, AiOutlineCloseCircle, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FiEye } from 'react-icons/fi'; // <-- 2. IMPORT IKON MATA

const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
        <div className="flex items-center">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onRatingChange && onRatingChange(star)}
                    className={`cursor-${onRatingChange ? 'pointer' : 'default'} p-1`}
                >
                    {star <= rating ? (
                        <AiFillStar className="text-yellow-400 text-2xl" />
                    ) : (
                        <AiOutlineStar className="text-gray-400 text-2xl" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default function Testimoni() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [testimoniList, setTestimoniList] = useState([]);

    const [addDataForm, setAddDataForm] = useState({ name: '', company: '', comment: '', rating: 0, image: '' });
    const [editDataForm, setEditDataForm] = useState({ id: null, name: '', company: '', comment: '', rating: 0, image: '' });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (evt, formType) => {
        const { name, value } = evt.target;
        const formSetter = formType === 'add' ? setAddDataForm : setEditDataForm;
        const prevForm = formType === 'add' ? addDataForm : editDataForm;
        formSetter({ ...prevForm, [name]: value });
    };

    const handleRatingChange = (newRating, formType) => {
        const formSetter = formType === 'add' ? setAddDataForm : setEditDataForm;
        const prevForm = formType === 'add' ? addDataForm : editDataForm;
        formSetter({ ...prevForm, rating: newRating });
    };

    useEffect(() => {
        const loadTestimoni = async () => {
            try {
                setLoading(true);
                const data = await testimoniAPI.fetchTestimoni();
                setTestimoniList(data);
            } catch (err) {
                setError("Gagal memuat testimoni.");
            } finally {
                setLoading(false);
            }
        };
        loadTestimoni();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!addDataForm.name || !addDataForm.comment || addDataForm.rating === 0) {
            setError("Nama, Komentar, dan Rating wajib diisi.");
            setTimeout(() => setError(""), 3000);
            return;
        }
        try {
            setLoading(true);
            await testimoniAPI.createTestimoni(addDataForm);
            setSuccess("Testimoni berhasil ditambahkan!");
            setAddDataForm({ name: '', company: '', comment: '', rating: 0, image: '' });
            setTimeout(() => setSuccess(""), 3000);
            const data = await testimoniAPI.fetchTestimoni();
            setTestimoniList(data);
        } catch (err) {
            setError(`Gagal menyimpan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus testimoni ini?")) return;
        try {
            setLoading(true);
            await testimoniAPI.deleteTestimoni(id);
            setSuccess("Testimoni berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            const data = await testimoniAPI.fetchTestimoni();
            setTestimoniList(data);
        } catch (err) {
            setError(`Gagal menghapus: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditModal = (item) => {
        setEditDataForm(item);
        setIsEditing(true);
    };

    const handleCloseEditModal = () => setIsEditing(false);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { id, ...dataToUpdate } = editDataForm;
            await testimoniAPI.updateTestimoni(id, dataToUpdate);
            setSuccess("Testimoni berhasil diperbarui!");
            setTimeout(() => setSuccess(""), 3000);
            handleCloseEditModal();
            const data = await testimoniAPI.fetchTestimoni();
            setTestimoniList(data);
        } catch (err) {
            setError(`Gagal memperbarui: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const renderFormFields = (formData, handleChangeFn, handleRatingChangeFn) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                    <input id="name" type="text" name="name" value={formData.name} onChange={handleChangeFn} required className="w-full p-3 bg-gray-50 rounded-lg border" />
                </div>
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Perusahaan (Opsional)</label>
                    <input id="company" type="text" name="company" value={formData.company} onChange={handleChangeFn} className="w-full p-3 bg-gray-50 rounded-lg border" />
                </div>
            </div>
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Opsional)</label>
                <input id="image" type="text" name="image" value={formData.image} placeholder="https://..." onChange={handleChangeFn} className="w-full p-3 bg-gray-50 rounded-lg border" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <StarRating rating={formData.rating} onRatingChange={handleRatingChangeFn} />
            </div>
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                <textarea id="comment" name="comment" value={formData.comment} onChange={handleChangeFn} required rows="4" className="w-full p-3 bg-gray-50 rounded-lg border resize-none" />
            </div>
        </div>
    );
    
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center"><h1 className="text-4xl font-bold text-gray-800">Manajemen Testimoni</h1></header>
            <div className="mb-4 min-h-[40px]">{error && <AlertBox type="error">{error}</AlertBox>}{success && <AlertBox type="success">{success}</AlertBox>}</div>
            {!isEditing && (<div className="bg-white rounded-xl shadow-lg p-6 mb-10"><h3 className="text-xl font-semibold mb-6 flex items-center"><AiOutlinePlusCircle className="mr-2 text-blue-500" size={24} />Tambah Testimoni Baru</h3><form onSubmit={handleSubmit}>{renderFormFields(addDataForm, (e) => handleChange(e, 'add'), (r) => handleRatingChange(r, 'add'))}<button type="submit" disabled={loading} className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md">{loading ? "Menyimpan..." : "Simpan Testimoni"}</button></form></div>)}
            {isEditing && (<div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center"><AiOutlineEdit className="mr-2" />Edit Testimoni</h3><button onClick={handleCloseEditModal}><AiOutlineCloseCircle size={24} /></button></div><form onSubmit={handleUpdateSubmit}>{renderFormFields(editDataForm, (e) => handleChange(e, 'edit'), (r) => handleRatingChange(r, 'edit'))}<div className="flex justify-end space-x-3 pt-6"><button type="button" onClick={handleCloseEditModal} className="px-6 py-3 bg-gray-200 rounded-lg">Batal</button><button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md">{loading ? "Memperbarui..." : "Simpan Perubahan"}</button></div></form></div></div>)}
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isEditing ? 'filter blur-sm' : ''}`}>
                <div className="px-6 py-4 border-b"><h3 className="text-xl font-semibold">Daftar Testimoni ({testimoniList.length})</h3></div>
                {loading && testimoniList.length === 0 && <div className="p-10"><LoadingSpinner text="Memuat testimoni..." /></div>}
                {!loading && testimoniList.length === 0 && !error && <div className="p-10"><EmptyState text="Belum ada testimoni." /></div>}
                {testimoniList.length > 0 && (<GenericTable columns={["Pengirim", "Komentar", "Rating", "Aksi"]} data={testimoniList}
                        renderRow={(item) => (
                            <>
                                <td className="px-6 py-4 border-b">
                                    <div className="flex items-center">
                                        <img src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`} alt={item.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
                                        <div>
                                            <div className="font-semibold">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.company}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b max-w-sm"><p className="text-gray-700 text-sm truncate" title={item.comment}>{item.comment}</p></td>
                                <td className="px-6 py-4 border-b"><StarRating rating={item.rating} /></td>
                                <td className="px-6 py-4 border-b text-center">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(item)} className="p-2 hover:bg-blue-100 rounded-full transition-colors" title="Edit">
                                            <AiOutlineEdit className="text-blue-500 text-xl" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-100 rounded-full transition-colors" title="Hapus">
                                            <AiFillDelete className="text-red-500 text-xl" />
                                        </button>
                                        <Link
                                            to={`/testimoni/${item.id}`}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <FiEye className="text-gray-600 text-xl" />
                                        </Link>
                                    </div>
                                </td>
                            </>
                        )} />
                )}
            </div>
        </div>
    );
}