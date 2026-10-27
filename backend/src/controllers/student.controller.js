const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { createUniqueClassCode } = require('../utils/classHelper');

/**
 * Impor siswa secara bulk dari data yang sudah di-parse frontend (dari Excel/CSV).
 * Body: { students: [{ fullName, nis, jenisKelamin, picketDay }] }
 */
const importStudents = async (req, res) => {
  const { students } = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ success: false, message: 'Data siswa tidak boleh kosong.' });
  }
  if (students.length > 200) {
    return res.status(400).json({ success: false, message: 'Maksimal 200 siswa per sekali impor.' });
  }
  try {
    // Cari class_id milik guru ini
    let classId = null;
    const [gc] = await db.query('SELECT id FROM classes WHERE teacher_id = ? LIMIT 1', [req.user.id]);
    if (gc.length > 0) {
      classId = gc[0].id;
    } else {
      const [u] = await db.query('SELECT class_id FROM users WHERE id = ? LIMIT 1', [req.user.id]);
      if (u.length > 0 && u[0].class_id) classId = u[0].class_id;
    }
    if (!classId) {
      return res.status(400).json({ success: false, message: 'Kelas tidak ditemukan.' });
    }

    const defaultPasswordHash = await bcrypt.hash('123456', 10);
    const results = { inserted: 0, skipped: 0, errors: [] };

    for (const [idx, row] of students.entries()) {
      const rowNum = idx + 1;
      const fullName = (row.fullName || row['Nama Lengkap'] || row['nama'] || '').toString().trim();
      const nis = (row.nis || row['NIS'] || row['nis'] || '').toString().trim();
      const jenisKelamin = (row.jenisKelamin || row['Jenis Kelamin'] || row['jenis_kelamin'] || 'Laki-laki').toString().trim();
      const picketDay = (row.picketDay || row['Hari Piket'] || 'Senin').toString().trim();

      if (!fullName || !nis) {
        results.errors.push({ row: rowNum, nis, reason: 'Nama atau NIS kosong, dilewati.' });
        results.skipped++;
        continue;
      }

      // Cek duplikat NIS di kelas yang sama
      const [existing] = await db.query(
        'SELECT id FROM users WHERE employee_code = ? AND class_id = ? AND is_student_entry = 1 LIMIT 1',
        [nis, classId]
      );
      if (existing.length > 0) {
        results.errors.push({ row: rowNum, nis, reason: `NIS ${nis} sudah terdaftar, dilewati.` });
        results.skipped++;
        continue;
      }

      const cleanEmail = `siswa_${nis}_${Date.now().toString().slice(-4)}@hadirin.co`;
      const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
      const safeDay = validDays.includes(picketDay) ? picketDay : 'Senin';

      try {
        await db.query(
          `INSERT INTO users (role_id, class_id, employee_code, full_name, email, password_hash, phone_number, status, is_student_entry, picket_day)
           VALUES (4, ?, ?, ?, ?, ?, '', 'active', 1, ?)`,
          [classId, nis, fullName, cleanEmail, defaultPasswordHash, safeDay]
        );
        results.inserted++;
      } catch (insertErr) {
        results.errors.push({ row: rowNum, nis, reason: insertErr.message });
        results.skipped++;
      }
    }

    res.status(201).json({
      success: true,
      message: `Impor selesai: ${results.inserted} siswa berhasil ditambahkan, ${results.skipped} dilewati.`,
      inserted: results.inserted,
      skipped: results.skipped,
      errors: results.errors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal impor: ' + error.message });
  }
};


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
  updatePicketDay,
  importStudents
};
