// src/services/faqAPI.js

import axios from 'axios';

// URL menunjuk ke tabel 'FAQ'
const API_URL = "https://zrsoqernuagviwcstnda.supabase.co/rest/v1/faq";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc29xZXJudWFndml3Y3N0bmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODkyODgsImV4cCI6MjA2NDc2NTI4OH0.VsRyFUWPhKWFx0ETSpSRu0KJOc92vaKVoaZaLPCmj-o"
const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const faqAPI = {
    async fetchFaqs() {
        const response = await axios.get(`${API_URL}?order=created_at.desc`, { headers });
        return response.data;
    },

    async createFaq(data) {
        // Kolom di Supabase: question, answer
        const faqData = {
            question: data.pertanyaan,
            answer: data.jawaban,
        };
        const response = await axios.post(API_URL, faqData, { headers });
        return response.data;
    },

    async deleteFaq(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    async updateFaq(id, data) {
        const faqData = {
            question: data.pertanyaan,
            answer: data.jawaban,
        };
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, faqData, { headers });
        return response.data[0];
    },
     async fetchFaqById(id) {
        // Mengambil satu data FAQ berdasarkan ID
        const response = await axios.get(`${API_URL}?id=eq.${id}&select=*`, {
            headers: {
                ...headers,
                // Meminta Supabase mengembalikan sebagai objek tunggal
                'Accept': 'application/vnd.pgrst.object+json', 
            }
        });
        return response.data;
    },
};
