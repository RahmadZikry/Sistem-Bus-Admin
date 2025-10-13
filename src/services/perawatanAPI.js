// src/services/perawatanAPI.js

import axios from 'axios';

const API_URL = "https://xzreueffowxffpznufbb.supabase.co/rest/v1/perawatan" 
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cmV1ZWZmb3d4ZmZwem51ZmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTgwNjAsImV4cCI6MjA2NDkzNDA2MH0.kgMzFT6a4m_gKllaLXLWkoJVdbTUjEItpn9L7p5TlfU"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const perawatanAPI = {
    async fetchPerawatan() {
        const response = await axios.get(`${API_URL}?order=tanggal_servis.desc`, { headers });
        return response.data;
    },

    async createPerawatan(data) {
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    },

    async deletePerawatan(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    async updatePerawatan(id, data) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, data, { headers });
        return response.data[0];
    },
};