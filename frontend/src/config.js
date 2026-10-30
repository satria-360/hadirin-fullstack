// Konfigurasi base URL API
// Saat production (Docker), Nginx akan proxy /api/* ke backend container
// Saat development, gunakan localhost:5000 langsung
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
