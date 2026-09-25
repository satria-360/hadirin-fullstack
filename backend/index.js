require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jwt_hadirin_2026';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Koneksi ke MySQL db_hadirin
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Isi password mysql jika ada
  database: 'db_hadirin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tes Koneksi
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Berhasil terhubung ke database db_hadirin!');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terhubung ke database:', error.message);
  }
})();

// ==========================================
// ENDPOINT AUTENTIKASI (LOGIN & REGISTER)
// ==========================================

// 1. POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
  }

  try {
    const [rows] = await db.query(
      `SELECT u.*, r.name AS role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }

    const user = rows[0];

    // Cek password hash menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Akun Anda sedang dinonaktifkan.' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id,
        role_name: user.role_name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        employee_code: user.employee_code,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role_id: user.role_id,
        role_name: user.role_name,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message });
  }
});

// 2. POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const {
    role, // 'murid' atau 'guru'
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    nisn,
    kodeKelas,
    kelasAmampu,
    jurusan
  } = req.body;

  if (!email || !password || !firstName) {
    return res.status(400).json({ success: false, message: 'Data pendaftaran belum lengkap!' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();

    // Periksa apakah email sudah terdaftar
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    // Role mapping:
    // role 'guru' => Supervisor/Wali Kelas (ID: 3)
    // role 'murid' => Employee/Siswa (ID: 4)
    const roleId = role === 'guru' ? 3 : 4;

    const fullName = `${firstName.trim()} ${lastName ? lastName.trim() : ''}`.trim();
    const employeeCode = (role === 'murid' && nisn)
      ? nisn.trim()
      : `USR-${Date.now().toString().slice(-6)}`;

    // Hash password dengan bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      `INSERT INTO users (role_id, employee_code, full_name, email, password_hash, phone_number, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [roleId, employeeCode, fullName, cleanEmail, passwordHash, phoneNumber || '']
    );

    const newUserId = result.insertId;

    // Ambil nama role
    const [roleRows] = await db.query('SELECT name FROM roles WHERE id = ?', [roleId]);
    const roleName = roleRows.length > 0 ? roleRows[0].name : 'User';

    const token = jwt.sign(
      {
        id: newUserId,
        email: cleanEmail,
        full_name: fullName,
        role_id: roleId,
        role_name: roleName
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil!',
      token,
      user: {
        id: newUserId,
        employee_code: employeeCode,
        full_name: fullName,
        email: cleanEmail,
        phone_number: phoneNumber || '',
        role_id: roleId,
        role_name: roleName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mendaftar: ' + error.message });
  }
});

// 3. GET /api/auth/me (Cek info login saat ini)
app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query(
      `SELECT u.id, u.employee_code, u.full_name, u.email, u.phone_number, u.avatar_url, u.status, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau token tidak valid.' });
  }
});

// 2. GET API: Ambil Daftar Siswa & Status Piket Hari Ini
app.get('/api/picket/dashboard', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, 
        u.employee_code AS noAbsen, 
        u.full_name, 
        pr.status,
        pr.notes,
        pp.photo_url
      FROM users u
      LEFT JOIN picket_reports pr 
        ON u.id = pr.user_id AND pr.picket_date = CURDATE()
      LEFT JOIN picket_photos pp 
        ON pr.id = pp.picket_report_id
      ORDER BY u.id ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST API: Update Status Piket / Absen Siswa
app.post('/api/picket/upload', async (req, res) => {
  const { student_id, status, area_name, notes, photo_url } = req.body;

  try {
    // Cek apakah sudah ada rekap piket hari ini
    const [existing] = await db.query(
      'SELECT id FROM picket_reports WHERE user_id = ? AND picket_date = CURDATE()',
      [student_id]
    );

    let reportId;

    if (existing.length > 0) {
      reportId = existing[0].id;
      await db.query(
        'UPDATE picket_reports SET status = ?, area_name = ?, notes = ? WHERE id = ?',
        [status || 'completed', area_name || 'Area Piket Kelas', notes || '', reportId]
      );
    } else {
      const [insertResult] = await db.query(
        'INSERT INTO picket_reports (user_id, picket_date, area_name, status, notes) VALUES (?, CURDATE(), ?, ?, ?)',
        [student_id, area_name || 'Area Piket Kelas', status || 'completed', notes || '']
      );
      reportId = insertResult.insertId;
    }

    // Jika ada foto dikirim, masukkan ke picket_photos (Timestamp otomatis oleh database)
    if (photo_url) {
      await db.query(
        'INSERT INTO picket_photos (picket_report_id, photo_url, caption) VALUES (?, ?, ?)',
        [reportId, photo_url, 'Bukti Piket']
      );
    }

    res.json({ message: 'Data piket berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET API: Ekspor Data Piket ke Excel
app.get('/api/reports/export/excel', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        pr.picket_date, 
        u.employee_code, 
        u.full_name, 
        pr.area_name, 
        pr.status, 
        pr.notes 
      FROM picket_reports pr 
      JOIN users u ON pr.user_id = u.id 
      ORDER BY pr.picket_date DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Piket');

    worksheet.columns = [
      { header: 'Tanggal', key: 'picket_date', width: 15 },
      { header: 'Kode/NIS', key: 'employee_code', width: 15 },
      { header: 'Nama Siswa', key: 'full_name', width: 25 },
      { header: 'Area Piket', key: 'area_name', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Catatan', key: 'notes', width: 30 }
    ];

    worksheet.addRows(rows);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Piket_Bulanan.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});