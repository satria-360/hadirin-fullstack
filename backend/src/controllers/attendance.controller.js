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

// Export rekap absensi siswa ke Excel — hanya siswa yang diinput wali kelas (is_student_entry=1) dari kelas milik guru
// Terima opsional query param ?date=YYYY-MM-DD (default: hari ini)
const exportExcel = async (req, res) => {
  try {
    // Tanggal ekspor (default: hari ini)
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];

    // Cari class_id & nama kelas milik guru yang sedang login
    const [classRows] = await db.query(
      'SELECT c.id, c.name FROM classes c WHERE c.teacher_id = ? LIMIT 1',
      [req.user.id]
    );
    const classId = classRows.length > 0 ? classRows[0].id : null;
    const className = classRows.length > 0 ? classRows[0].name : 'Kelas';

    if (!classId) {
      return res.status(404).json({ success: false, message: 'Kelas tidak ditemukan untuk akun ini.' });
    }

    const [rows] = await db.query(`
      SELECT
        u.employee_code,
        u.full_name,
        COALESCE(pr.status, 'Belum Absen') AS status
      FROM users u
      LEFT JOIN picket_reports pr ON u.id = pr.user_id AND DATE(pr.picket_date) = ?
      WHERE u.role_id = 4
        AND u.is_student_entry = 1
        AND u.class_id = ?
      ORDER BY u.full_name ASC
    `, [targetDate, classId]);

    const exportDate = new Date(targetDate + 'T00:00:00');
    const dateStr = exportDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const fileName = `Rekap_Absensi_${targetDate}.xlsx`;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Hadirin App';
    workbook.created = today;
    const ws = workbook.addWorksheet('Rekap Absensi', {
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true }
    });

    // ── Lebar kolom
    ws.columns = [
      { key: 'no',     width: 6  },
      { key: 'nis',    width: 20 },
      { key: 'nama',   width: 38 },
      { key: 'status', width: 20 },
    ];

    // ── Helper border
    const border = {
      top:    { style: 'thin', color: { argb: 'FFD0D8E4' } },
      left:   { style: 'thin', color: { argb: 'FFD0D8E4' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D8E4' } },
      right:  { style: 'thin', color: { argb: 'FFD0D8E4' } },
    };
    const thickBorder = {
      top:    { style: 'medium', color: { argb: 'FF082052' } },
      left:   { style: 'medium', color: { argb: 'FF082052' } },
      bottom: { style: 'medium', color: { argb: 'FF082052' } },
      right:  { style: 'medium', color: { argb: 'FF082052' } },
    };

    // ── BARIS 1: Judul utama (merge 4 kolom)
    ws.mergeCells('A1:D1');
    const titleCell = ws.getCell('A1');
    titleCell.value = '📋 REKAP ABSENSI SISWA';
    titleCell.font = { bold: true, size: 16, color: { argb: 'FF082052' }, name: 'Calibri' };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBF5EB' } };
    ws.getRow(1).height = 36;

    // ── BARIS 2: Sub-info kelas & tanggal
    ws.mergeCells('A2:D2');
    const subCell = ws.getCell('A2');
    subCell.value = `${className}   |   ${dateStr}`;
    subCell.font = { italic: true, size: 10, color: { argb: 'FF6B7280' }, name: 'Calibri' };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBF5EB' } };
    ws.getRow(2).height = 22;

    // ── BARIS 3: Pemisah kosong
    ws.mergeCells('A3:D3');
    ws.getRow(3).height = 6;

    // ── BARIS 4: Header kolom
    const headers = ['No', 'NIS', 'Nama Siswa', 'Status Kehadiran'];
    const headerRow = ws.getRow(4);
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = h;
      cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF082052' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false };
      cell.border = thickBorder;
    });
    headerRow.height = 28;

    // ── BARIS DATA
    const statusColorMap = {
      'Hadir':       { bg: 'FFD1FAE5', fg: 'FF065F46' }, // hijau
      'Izin':        { bg: 'FFFEF3C7', fg: 'FF92400E' }, // kuning
      'Sakit':       { bg: 'FFDBEAFE', fg: 'FF1E40AF' }, // biru
      'Alpha':       { bg: 'FFFEE2E2', fg: 'FF991B1B' }, // merah
      'Alpa':        { bg: 'FFFEE2E2', fg: 'FF991B1B' },
      'Belum Absen': { bg: 'FFF3F4F6', fg: 'FF6B7280' }, // abu
    };

    rows.forEach((r, i) => {
      const rowNum = i + 5;
      const dataRow = ws.getRow(rowNum);
      const isEven = i % 2 === 0;
      const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC';
      const statusKey = r.status || 'Belum Absen';
      const statusColor = statusColorMap[statusKey] || statusColorMap['Belum Absen'];

      const values = [
        String(i + 1).padStart(2, '0'),
        r.employee_code || '-',
        r.full_name || '-',
        statusKey,
      ];

      values.forEach((v, j) => {
        const cell = dataRow.getCell(j + 1);
        cell.value = v;
        cell.font = { size: 10, name: 'Calibri', color: { argb: j === 3 ? statusColor.fg : 'FF1F2937' }, bold: j === 3 };
        cell.alignment = { horizontal: j === 0 || j === 3 ? 'center' : 'left', vertical: 'middle' };
        cell.border = border;
        cell.fill = {
          type: 'pattern', pattern: 'solid',
          fgColor: { argb: j === 3 ? statusColor.bg : rowBg }
        };
      });

      dataRow.height = 22;
    });

    // ── BARIS RINGKASAN
    const summaryRowNum = rows.length + 5;
    const counts = rows.reduce((acc, r) => {
      const s = r.status || 'Belum Absen';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    ws.mergeCells(`A${summaryRowNum}:B${summaryRowNum}`); // kolom A-B untuk label
    const sumLabelCell = ws.getCell(`A${summaryRowNum}`);
    sumLabelCell.value = `Total Siswa: ${rows.length}`;
    sumLabelCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    sumLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF082052' } };
    sumLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sumLabelCell.border = thickBorder;

    const summaryParts = [
      `Hadir: ${counts['Hadir'] || 0}`,
      `Izin: ${counts['Izin'] || 0}`,
      `Sakit: ${counts['Sakit'] || 0}`,
      `Alpha: ${counts['Alpha'] || counts['Alpa'] || 0}`,
      `Belum Absen: ${counts['Belum Absen'] || 0}`,
    ];

    ws.mergeCells(`C${summaryRowNum}:D${summaryRowNum}`);
    const sumDetailCell = ws.getCell(`C${summaryRowNum}`);
    sumDetailCell.value = summaryParts.join('   |   ');
    sumDetailCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    sumDetailCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0e3b91' } };
    sumDetailCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sumDetailCell.border = thickBorder;
    ws.getRow(summaryRowNum).height = 24;

    // ── Freeze header
    ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, topLeftCell: 'A5', activeCell: 'A5' }];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
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
