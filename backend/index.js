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
app.use(express.json({ limit: '50mb' }));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_hadirin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Berhasil terhubung ke database db_hadirin!');
    connection.release();
  } catch (error) {
    console.error('Gagal terhubung ke database:', error.message);
  }
})();

function generateClassCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function createUniqueClassCode(connection, name, teacherId) {
  const safeName = (name || 'Kelas Baru').toString().trim().slice(0, 120) || 'Kelas Baru';
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = generateClassCode();
    try {
      const [r] = await connection.query(
        'INSERT INTO classes (name, access_code, teacher_id) VALUES (?, ?, ?)',
        [safeName, code, teacherId ?? null]
      );
      return { id: r.insertId, code, name: safeName };
    } catch (e) {
      if (e.code !== 'ER_DUP_ENTRY') throw e;
    }
  }
  throw new Error('Gagal membuat kode kelas yang unik.');
}

async function getClassInfo(user) {
  if (!user) return {};
  if (user.role_id === 3) {
    const [r] = await db.query(
      'SELECT id, name, access_code FROM classes WHERE teacher_id = ? LIMIT 1',
      [user.id]
    );
    return r.length ? { class_id: r[0].id, class_name: r[0].name, class_code: r[0].access_code } : {};
  }
  if (user.class_id) {
    const [r] = await db.query('SELECT id, name FROM classes WHERE id = ? LIMIT 1', [user.class_id]);
    return r.length ? { class_id: r[0].id, class_name: r[0].name } : {};
  }
  return {};
}

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
  }
  try {
    const [rows] = await db.query(
      `SELECT u.*, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? LIMIT 1`,
      [email.trim().toLowerCase()]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Akun Anda sedang dinonaktifkan.' });
    }
    let classPayload = await getClassInfo(user);
    if (user.role_id === 3 && !classPayload.class_id) {
      const created = await createUniqueClassCode(db, 'Kelas ' + (user.full_name || ''), user.id);
      classPayload = { class_id: created.id, class_name: created.name, class_code: created.code };
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name, role_id: user.role_id, role_name: user.role_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id, employee_code: user.employee_code, full_name: user.full_name,
        email: user.email, phone_number: user.phone_number, role_id: user.role_id,
        role_name: user.role_name, avatar_url: user.avatar_url, ...classPayload
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { role, firstName, lastName, email, password, phoneNumber, nisn, kodeKelas, kelasAmampu } = req.body;
  if (!email || !password || !firstName) {
    return res.status(400).json({ success: false, message: 'Data pendaftaran belum lengkap!' });
  }
  try {
    const cleanEmail = email.trim().toLowerCase();
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }
    const roleId = role === 'guru' ? 3 : 4;
    const fullName = `${firstName.trim()} ${lastName ? lastName.trim() : ''}`.trim();
    const passwordHash = await bcrypt.hash(password, 10);
    let employeeCode;
    let classId = null;
    let freshClass = null;
    if (role === 'murid') {
      const code = (kodeKelas || '').trim().toUpperCase();
      if (!code) {
        return res.status(400).json({ success: false, message: 'Kode Kelas wajib diisi. Minta kode dari Wali Kelas Anda.' });
      }
      const [cls] = await db.query('SELECT id FROM classes WHERE access_code = ? LIMIT 1', [code]);
      if (!cls.length) {
        return res.status(400).json({
          success: false,
          message: 'Kode Kelas tidak valid! Harap minta kode kelas yang sesuai dari Wali Kelas Anda.'
        });
      }
      classId = cls[0].id;
      employeeCode = (nisn && nisn.trim()) ? nisn.trim() : `USR-${Date.now().toString().slice(-6)}`;
    } else {
      employeeCode = `USR-${Date.now().toString().slice(-6)}`;
    }
    const [result] = await db.query(
      `INSERT INTO users (role_id, class_id, employee_code, full_name, email, password_hash, phone_number, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [roleId, classId, employeeCode, fullName, cleanEmail, passwordHash, phoneNumber || '']
    );
    const newUserId = result.insertId;
    if (role === 'guru') {
      const className = (kelasAmampu || '').trim() || ('Kelas ' + fullName);
      freshClass = await createUniqueClassCode(db, className, newUserId);
    }
    const [roleRows] = await db.query('SELECT name FROM roles WHERE id = ?', [roleId]);
    const roleName = roleRows.length > 0 ? roleRows[0].name : 'User';
    const token = jwt.sign(
      { id: newUserId, email: cleanEmail, full_name: fullName, role_id: roleId, role_name: roleName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    let classPayload = {};
    if (role === 'guru' && freshClass) {
      classPayload = { class_id: freshClass.id, class_name: freshClass.name, class_code: freshClass.code };
    } else if (role === 'murid' && classId) {
      classPayload = { class_id: classId };
    }
    res.status(201).json({
      success: true, message: 'Pendaftaran berhasil!', token,
      user: { id: newUserId, employee_code: employeeCode, full_name: fullName, email: cleanEmail, phone_number: phoneNumber || '', role_id: roleId, role_name: roleName, ...classPayload }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mendaftar: ' + error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query(
      `SELECT u.id, u.employee_code, u.full_name, u.email, u.phone_number, u.avatar_url, u.status, u.role_id, u.class_id, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`,
      [decoded.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }
    const classInfo = await getClassInfo(rows[0]);
    res.json({ success: true, user: { ...rows[0], ...classInfo } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau token tidak valid.' });
  }
});

app.get('/api/picket/dashboard', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    let classId = null;
    const [tc] = await db.query('SELECT id FROM classes WHERE teacher_id = ? LIMIT 1', [decoded.id]);
    if (tc.length > 0) {
      classId = tc[0].id;
    } else {
      const [u] = await db.query('SELECT class_id FROM users WHERE id = ? LIMIT 1', [decoded.id]);
      if (u.length > 0) classId = u[0].class_id;
    }
    if (!classId) return res.json([]);
    const [rows] = await db.query(`
      SELECT 
        u.id, 
        u.employee_code AS noAbsen,
        u.employee_code AS nis,
        u.full_name, 
        u.picket_day,
        COALESCE(pr.status, '') AS status, 
        pr.notes, 
        pr.proof_url,
        pp.photo_url
      FROM users u
      LEFT JOIN picket_reports pr ON u.id = pr.user_id AND pr.picket_date = CURDATE()
      LEFT JOIN picket_photos pp ON pr.id = pp.picket_report_id
      WHERE u.class_id = ? AND u.role_id = 4 AND u.is_student_entry = 1
      ORDER BY u.id ASC
    `, [classId]);
    const formattedRows = rows.map((r, index) => ({
      ...r,
      noUrut: String(index + 1).padStart(2, '0')
    }));
    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students/create', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }
  const { fullName, nis, jenisKelamin, picketDay } = req.body;
  if (!fullName || !nis) {
    return res.status(400).json({ success: false, message: 'Nama lengkap dan NIS wajib diisi!' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    let classId = null;
    const [gc] = await db.query('SELECT id FROM classes WHERE teacher_id = ? LIMIT 1', [decoded.id]);
    if (gc.length > 0) {
      classId = gc[0].id;
    } else {
      const [u] = await db.query('SELECT class_id, full_name, role_id FROM users WHERE id = ? LIMIT 1', [decoded.id]);
      if (u.length > 0 && u[0].class_id) {
        classId = u[0].class_id;
      } else if (u.length > 0 && u[0].role_id === 3) {
        const created = await createUniqueClassCode(db, 'Kelas ' + (u[0].full_name || ''), decoded.id);
        classId = created.id;
      }
    }
    if (!classId) {
      return res.status(400).json({ success: false, message: 'Kelas tidak ditemukan. Pastikan akun terhubung ke kelas yang valid.' });
    }
    const cleanFullName = fullName.trim();
    const cleanNis = String(nis).trim();
    const cleanEmail = `siswa_${cleanNis}_${Date.now().toString().slice(-4)}@hadirin.co`;
    const defaultPasswordHash = await bcrypt.hash('123456', 10);
    const [existing] = await db.query(
      'SELECT id FROM users WHERE employee_code = ? AND class_id = ? AND is_student_entry = 1 LIMIT 1',
      [cleanNis, classId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: `Siswa dengan NIS ${cleanNis} sudah terdaftar di kelas Anda!` });
    }
    const [result] = await db.query(
      `INSERT INTO users (role_id, class_id, employee_code, full_name, email, password_hash, phone_number, status, is_student_entry, picket_day)
       VALUES (4, ?, ?, ?, ?, ?, '', 'active', 1, ?)`,
      [classId, cleanNis, cleanFullName, cleanEmail, defaultPasswordHash, picketDay || 'Senin']
    );
    const newStudentId = result.insertId;
    const [countRows] = await db.query(
      'SELECT COUNT(*) as total FROM users WHERE class_id = ? AND role_id = 4 AND is_student_entry = 1',
      [classId]
    );
    const noUrut = String(countRows[0].total).padStart(2, '0');
    res.status(201).json({
      success: true,
      message: 'Data siswa berhasil ditambahkan ke tabel users!',
      student: {
        id: newStudentId,
        nis: cleanNis,
        noAbsen: cleanNis,
        noUrut: noUrut,
        full_name: cleanFullName,
        gender: jenisKelamin || 'Laki-laki',
        picketDay: picketDay || 'Senin',
        status: ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan siswa: ' + error.message });
  }
});

// ✅ ENDPOINT BARU: UPDATE PIKET DAY SISWA
app.put('/api/students/:id/update-piket-day', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }
  const { id } = req.params;
  const { picket_day } = req.body;

  if (!picket_day || !['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].includes(picket_day)) {
    return res.status(400).json({ success: false, message: 'Hari piket tidak valid!' });
  }

  try {
    const [result] = await db.query(
      'UPDATE users SET picket_day = ? WHERE id = ? AND role_id = 4',
      [picket_day, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan!' });
    }

    res.json({
      success: true,
      message: `Jadwal piket siswa berhasil diperbarui ke hari ${picket_day}!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui jadwal: ' + error.message });
  }
});

app.post('/api/picket/upload', async (req, res) => {
  const { student_id, status, area_name, notes, photo_url } = req.body;
  try {
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

app.post('/api/attendance/save-proof', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }
  const { student_id, status, proof_url } = req.body;
  if (!student_id) {
    return res.status(400).json({ success: false, message: 'ID siswa wajib diisi!' });
  }
  try {
    const [existing] = await db.query(
      'SELECT id FROM picket_reports WHERE user_id = ? AND picket_date = CURDATE()',
      [student_id]
    );
    if (existing.length > 0) {
      await db.query(
        'UPDATE picket_reports SET status = COALESCE(?, status), proof_url = ? WHERE id = ?',
        [status || null, proof_url || null, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO picket_reports (user_id, picket_date, area_name, status, notes, proof_url) VALUES (?, CURDATE(), ?, ?, ?, ?)',
        [student_id, 'Presensi Kelas', status || '', 'Bukti Ketidakhadiran', proof_url || null]
      );
    }
    res.json({ success: true, message: 'Bukti kehadiran berhasil disimpan!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan bukti: ' + error.message });
  }
});

app.get('/api/reports/export/excel', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pr.picket_date, u.employee_code, u.full_name, pr.area_name, pr.status, pr.notes
      FROM picket_reports pr JOIN users u ON pr.user_id = u.id ORDER BY pr.picket_date DESC
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

app.get('/api/attendance/export/excel', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT CURDATE() AS tanggal, u.employee_code, u.full_name, COALESCE(pr.status, 'Belum Absen') AS status, COALESCE(pr.area_name, 'Kelas') AS mata_pelajaran
      FROM users u LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN picket_reports pr ON u.id = pr.user_id AND pr.picket_date = CURDATE()
      WHERE LOWER(COALESCE(r.name, '')) IN ('murid', 'siswa', 'employee') OR u.role_id = 4 ORDER BY u.id ASC
    `);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekap Absensi Siswa');
    worksheet.columns = [
      { header: 'Tanggal', key: 'tanggal', width: 15 },
      { header: 'No Absen / NIS', key: 'employee_code', width: 18 },
      { header: 'Nama Siswa', key: 'full_name', width: 30 },
      { header: 'Mata Pelajaran', key: 'mata_pelajaran', width: 25 },
      { header: 'Status Kehadiran', key: 'status', width: 18 }
    ];
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF082052' } };
    worksheet.addRows(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Rekap_Absensi_Siswa.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance/save-all', async (req, res) => {
  const { students, subject } = req.body;
  if (!Array.isArray(students)) {
    return res.status(400).json({ success: false, message: 'Data siswa tidak valid' });
  }
  try {
    for (const student of students) {
      if (student.status) {
        const [existing] = await db.query(
          'SELECT id FROM picket_reports WHERE user_id = ? AND picket_date = CURDATE()',
          [student.id]
        );
        if (existing.length > 0) {
          await db.query(
            'UPDATE picket_reports SET status = ?, area_name = ? WHERE id = ?',
            [student.status, subject || 'Presensi Kelas', existing[0].id]
          );
        } else {
          await db.query(
            'INSERT INTO picket_reports (user_id, picket_date, area_name, status, notes) VALUES (?, CURDATE(), ?, ?, ?)',
            [student.id, subject || 'Presensi Kelas', student.status, 'Presensi Wali Kelas']
          );
        }
      }
    }
    res.json({ success: true, message: 'Seluruh rekap absensi hari ini berhasil disimpan!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan rekap: ' + error.message });
  }
});

app.post('/api/attendance/import-batch', async (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records)) {
    return res.status(400).json({ success: false, message: 'Data import tidak valid' });
  }
  try {
    let importedCount = 0;
    for (const item of records) {
      if (item.name || item.noAbsen) {
        const [users] = await db.query(
          'SELECT id FROM users WHERE employee_code = ? OR full_name LIKE ? LIMIT 1',
          [item.noAbsen || '', `%${item.name || ''}%`]
        );
        if (users.length > 0) {
          const userId = users[0].id;
          const status = item.status || 'Hadir';
          const [existing] = await db.query(
            'SELECT id FROM picket_reports WHERE user_id = ? AND picket_date = CURDATE()',
            [userId]
          );
          if (existing.length > 0) {
            await db.query('UPDATE picket_reports SET status = ? WHERE id = ?', [status, existing[0].id]);
          } else {
            await db.query(
              'INSERT INTO picket_reports (user_id, picket_date, area_name, status, notes) VALUES (?, CURDATE(), ?, ?, ?)',
              [userId, 'Presensi Kelas', status, 'Import Excel']
            );
          }
          importedCount++;
        }
      }
    }
    res.json({ success: true, message: `Berhasil mengimpor ${importedCount} data absensi siswa!` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengimpor: ' + error.message });
  }
});

app.put('/api/users/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { full_name, email, phone_number, avatar_url } = req.body;
    await db.query(
      `UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), phone_number = COALESCE(?, phone_number), avatar_url = COALESCE(?, avatar_url) WHERE id = ?`,
      [full_name, email, phone_number, avatar_url, decoded.id]
    );
    const [rows] = await db.query(
      `SELECT u.id, u.employee_code, u.full_name, u.email, u.phone_number, u.avatar_url, u.status, u.role_id, u.class_id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? LIMIT 1`,
      [decoded.id]
    );
    const classInfo = await getClassInfo(rows[0]);
    res.json({ success: true, message: 'Profil berhasil diperbarui!', user: { ...rows[0], ...classInfo } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil: ' + error.message });
  }
});

app.put('/api/users/change-password', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi!' });
    }
    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [decoded.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah!' });
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, decoded.id]);
    res.json({ success: true, message: 'Password berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui password: ' + error.message });
  }
});

app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});