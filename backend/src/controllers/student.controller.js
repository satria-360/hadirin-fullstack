const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { createUniqueClassCode } = require('../utils/classHelper');

// Tambah siswa baru oleh wali kelas
const createStudent = async (req, res) => {
  const { fullName, nis, jenisKelamin, picketDay } = req.body;
  if (!fullName || !nis) {
    return res.status(400).json({ success: false, message: 'Nama lengkap dan NIS wajib diisi!' });
  }
  try {
    let classId = null;
    const [gc] = await db.query('SELECT id FROM classes WHERE teacher_id = ? LIMIT 1', [req.user.id]);
    if (gc.length > 0) {
      classId = gc[0].id;
    } else {
      const [u] = await db.query('SELECT class_id, full_name, role_id FROM users WHERE id = ? LIMIT 1', [req.user.id]);
      if (u.length > 0 && u[0].class_id) {
        classId = u[0].class_id;
      } else if (u.length > 0 && u[0].role_id === 3) {
        const created = await createUniqueClassCode(db, 'Kelas ' + (u[0].full_name || ''), req.user.id);
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
};

// Update hari piket siswa
const updatePicketDay = async (req, res) => {
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
};

module.exports = {
  createStudent,
  updatePicketDay
};
