// src/services/timAPI.js

import axios from 'axios';

// URL menunjuk ke tabel 'team'
const API_URL = "https://zrsoqernuagviwcstnda.supabase.co/rest/v1/team";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc29xZXJudWFndml3Y3N0bmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODkyODgsImV4cCI6MjA2NDc2NTI4OH0.VsRyFUWPhKWFx0ETSpSRu0KJOc92vaKVoaZaLPCmj-o"
const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const timAPI = {
    async fetchTim() {
        const response = await axios.get(`${API_URL}?order=created_at.desc`, { headers });
        return response.data;
    },

    async createAnggota(data) {
        // Mapping dari nama state form (nama, jabatan, foto) ke nama kolom DB (name, position, image)
        const anggotaData = {
            name: data.nama,
            position: data.jabatan,
            image: data.foto,
        };
        const response = await axios.post(API_URL, anggotaData, { headers });
        return response.data;
    },

    async deleteAnggota(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    async updateAnggota(id, data) {
         // Mapping dari nama state form ke nama kolom DB
        const anggotaData = {
            name: data.nama,
            position: data.jabatan,
            image: data.foto,
        };
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, anggotaData, { headers });
        return response.data[0];
    },

     async fetchAnggotaById(id) {
        // Mengambil satu data anggota tim berdasarkan ID
        const response = await axios.get(`${API_URL}?id=eq.${id}&select=*`, {
            headers: {
                ...headers,
                // Meminta Supabase mengembalikan sebagai objek tunggal, bukan array
                'Accept': 'application/vnd.pgrst.object+json', 
            }
        });
        return response.data;
    },
};
