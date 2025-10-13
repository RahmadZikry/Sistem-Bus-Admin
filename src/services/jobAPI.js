// src/services/jobAPI.js

import axios from 'axios';


// URL menunjuk ke tabel 'job'
const API_URL = "https://zrsoqernuagviwcstnda.supabase.co/rest/v1/job";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc29xZXJudWFndml3Y3N0bmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODkyODgsImV4cCI6MjA2NDc2NTI4OH0.VsRyFUWPhKWFx0ETSpSRu0KJOc92vaKVoaZaLPCmj-o"
const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const jobAPI = {
    async fetchJobs() {
        const response = await axios.get(`${API_URL}?order=created_at.desc`, { headers });
        return response.data;
    },

    async createJob(data) {
        // Data yang dikirim sudah sesuai dengan nama kolom di DB
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    },

    async deleteJob(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    async updateJob(id, data) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, data, { headers });
        return response.data[0];
    },

    async fetchJobById(id) {
        // Mengambil satu data lowongan kerja berdasarkan ID
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