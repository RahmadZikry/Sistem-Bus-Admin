// src/services/testimoniAPI.js

import axios from 'axios';

// URL menunjuk ke tabel 'testimoni'
const API_URL = "https://zrsoqernuagviwcstnda.supabase.co/rest/v1/testimoni";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc29xZXJudWFndml3Y3N0bmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODkyODgsImV4cCI6MjA2NDc2NTI4OH0.VsRyFUWPhKWFx0ETSpSRu0KJOc92vaKVoaZaLPCmj-o"
const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const testimoniAPI = {
    async fetchTestimoni() {
        // Mengurutkan berdasarkan yang terbaru dibuat
        const response = await axios.get(`${API_URL}?order=created_at.desc`, { headers });
        return response.data;
    },

    async createTestimoni(data) {
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    },

    async deleteTestimoni(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    async updateTestimoni(id, data) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, data, { headers });
        return response.data[0];
    },

    async fetchTestimoniById(id) {

        const response = await axios.get(`${API_URL}?id=eq.${id}&select=*`, {
            headers: {
                ...headers,
                'Accept': 'application/vnd.pgrst.object+json', 
            }
        });
        return response.data;
    },
};