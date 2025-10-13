import axios from 'axios'

const API_URL = "https://xzreueffowxffpznufbb.supabase.co/rest/v1/layanan" 
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cmV1ZWZmb3d4ZmZwem51ZmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTgwNjAsImV4cCI6MjA2NDkzNDA2MH0.kgMzFT6a4m_gKllaLXLWkoJVdbTUjEItpn9L7p5TlfU"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}


export const layananAPI = {
    async fetchLayanan() {
        const response = await axios.get(`${API_URL}?order=nama_layanan.asc`, { headers })
        return response.data
    },

    async createLayanan(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

    async deleteLayanan(id) {
         await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    },

    async updateLayanan(id, data) {
        // Jika tabel Anda tidak punya kolom 'updated_at', baris ini aman untuk dihapus
        const layananData = { ...data, updated_at: new Date().toISOString() };
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, layananData, { headers });
        return response.data[0]; 
    }
}