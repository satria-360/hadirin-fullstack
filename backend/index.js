const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');

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