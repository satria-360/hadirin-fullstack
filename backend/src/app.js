require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/database');
const apiRoutes = require('./routes');

const app = express();

// Middlewares
app.use(cors());
// Tingkatkan limit payload untuk mengakomodasi foto base64 yang besar
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend Hadirin API is running smoothly.' });
});

// Register all modular routes under /api
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal pada server.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Inisialisasi koneksi DB dan jalankan server
initDb().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
});

module.exports = app;
