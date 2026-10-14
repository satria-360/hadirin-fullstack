const ExcelJS = require('exceljs');
const { db } = require('../config/database');
const { resolveClassIdForUser } = require('../utils/classHelper');

// Riwayat absensi per tanggal spesifik
const getHistoryByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const classId = await resolveClassIdForUser(req.user.id);
    if (!classId) return res.json([]);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Format tanggal tidak valid (YYYY-MM-DD)' });
    }

    const [rows] = await db.query(`
      SELECT 
        u.id, 
        u.employee_code AS noAbsen, 
        u.full_name, 
        COALESCE(pr.status, '') AS status, 
        pr.notes,
        pr.proof_url
      FROM users u
      LEFT JOIN picket_reports pr ON u.id = pr.user_id AND pr.picket_date = ?
      WHERE u.class_id = ? AND u.role_id = 4 AND u.is_student_entry = 1
      ORDER BY u.full_name ASC, u.id ASC
    `, [date, classId]);

    const formattedRows = rows.map((r, index) => ({
      ...r,
      noUrut: String(index + 1).padStart(2, '0')
    }));

    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Simpan bukti ketidakhadiran (Izin / Sakit / dll)
const saveProof = async (req, res) => {
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
        'UPDATE picket_reports SET status = COALESCE(?, status), proof_url = COALESCE(?, proof_url) WHERE id = ?',
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
    console.error('Error saving proof:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan bukti: ' + error.message });
  }
};

// Simpan seluruh rekap absensi harian
const saveAll = async (req, res) => {
  const { students, subject } = req.body;
  if (!Array.isArray(students)) {
    return res.status(400).json({ success: false, message: 'Data siswa tidak valid' });
  }
  try {
    for (const student of students) {
      if (!student.id) continue;

      const currentStatus = student.status || '';

      const [existing] = await db.query(
        'SELECT id, proof_url FROM picket_reports WHERE user_id = ? AND picket_date = CURDATE()',
        [student.id]
      );

      if (existing.length > 0) {
        await db.query(
          'UPDATE picket_reports SET status = ?, area_name = ? WHERE id = ?',
          [currentStatus || 'Belum Absen', subject || 'Presensi Kelas', existing[0].id]
        );
      } else {
        await db.query(
          'INSERT INTO picket_reports (user_id, picket_date, area_name, status, notes) VALUES (?, CURDATE(), ?, ?, ?)',
          [student.id, subject || 'Presensi Kelas', currentStatus || 'Belum Absen', 'Presensi Wali Kelas']
        );
      }
    }
    res.json({ success: true, message: 'Seluruh rekap absensi hari ini berhasil disimpan!' });
  } catch (error) {
    console.error('Error save-all:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan rekap: ' + error.message });
  }
};

// Impor massal data kehadiran siswa
const importBatch = async (req, res) => {
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
};

// Export rekap absensi siswa ke Excel
const exportExcel = async (req, res) => {
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
};

module.exports = {
  getHistoryByDate,
  saveProof,
  saveAll,
  importBatch,
  exportExcel
};
