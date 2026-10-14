const { db } = require('../config/database');
const { resolveClassIdForUser } = require('../utils/classHelper');

// Ambil data dashboard absensi hari ini untuk kelas user saat ini
const getDashboard = async (req, res) => {
  try {
    const classId = await resolveClassIdForUser(req.user.id);
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
      ORDER BY u.full_name ASC, u.id ASC
    `, [classId]);

    const formattedRows = rows.map((r, index) => ({
      ...r,
      noUrut: String(index + 1).padStart(2, '0')
    }));

    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Riwayat laporan piket (Bisa dilihat oleh Wali Kelas & Siswa)
const getPicketReports = async (req, res) => {
  try {
    const classId = await resolveClassIdForUser(req.user.id);

    let query = `
      SELECT 
        pr.id,
        pr.user_id,
        pr.picket_date,
        pr.area_name,
        pr.status,
        pr.notes,
        pr.proof_url,
        pr.created_at,
        u.full_name AS student_name,
        u.employee_code AS nis
      FROM picket_reports pr
      JOIN users u ON pr.user_id = u.id
    `;
    const params = [];

    if (classId) {
      query += ' WHERE u.class_id = ? ';
      params.push(classId);
    }

    query += ' ORDER BY pr.id DESC, pr.picket_date DESC LIMIT 50 ';

    const [reports] = await db.query(query, params);

    // Ambil foto-foto pendukung dari picket_photos untuk tiap report
    const formatted = await Promise.all(
      reports.map(async (r) => {
        const [photos] = await db.query(
          'SELECT photo_url FROM picket_photos WHERE picket_report_id = ? ORDER BY id ASC LIMIT 2',
          [r.id]
        );

        const photoOne = photos[0]?.photo_url || r.proof_url || '';
        const photoTwo = photos[1]?.photo_url || '';

        const dateObj = new Date(r.picket_date || r.created_at);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dayDate = `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

        const createdDate = new Date(r.created_at || dateObj);
        const time = `${String(createdDate.getHours()).padStart(2, '0')}:${String(createdDate.getMinutes()).padStart(2, '0')}:${String(createdDate.getSeconds()).padStart(2, '0')} WIB`;

        return {
          id: r.id,
          name: r.student_name,
          nis: r.nis,
          dayDate,
          time,
          statusBadge: r.status === 'completed' || r.status === 'Hadir' ? 'Terkonfirmasi' : 'Dalam Proses',
          roleBadge: 'Piket',
          notes: r.notes || r.area_name || 'Laporan piket harian kelas selesai dikerjakan.',
          photoOne,
          photoTwo
        };
      })
    );

    res.json({ success: true, reports: formatted });
  } catch (error) {
    console.error('Gagal mengambil riwayat laporan piket:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload laporan piket
const uploadPicket = async (req, res) => {
  const { student_id, status, area_name, notes, photo_url, photo_one, photo_two } = req.body;
  const primaryPhoto = photo_one || photo_url || '';
  const secondaryPhoto = photo_two || '';

  try {
    const [existing] = await db.query(
      'SELECT id FROM picket_reports WHERE user_id = ? AND picket_date = CURDATE()',
      [student_id]
    );
    let reportId;
    if (existing.length > 0) {
      reportId = existing[0].id;
      await db.query(
        'UPDATE picket_reports SET status = ?, area_name = ?, notes = ?, proof_url = COALESCE(?, proof_url) WHERE id = ?',
        [status || 'completed', area_name || 'Area Piket Kelas', notes || '', primaryPhoto || null, reportId]
      );
    } else {
      const [insertResult] = await db.query(
        'INSERT INTO picket_reports (user_id, picket_date, area_name, status, notes, proof_url) VALUES (?, CURDATE(), ?, ?, ?, ?)',
        [student_id, area_name || 'Area Piket Kelas', status || 'completed', notes || '', primaryPhoto || null]
      );
      reportId = insertResult.insertId;
    }

    // Bersihkan atau simpan foto ke picket_photos
    if (primaryPhoto) {
      await db.query(
        'INSERT INTO picket_photos (picket_report_id, photo_url, caption) VALUES (?, ?, ?)',
        [reportId, primaryPhoto, 'Gambar Satu']
      );
    }
    if (secondaryPhoto) {
      await db.query(
        'INSERT INTO picket_photos (picket_report_id, photo_url, caption) VALUES (?, ?, ?)',
        [reportId, secondaryPhoto, 'Gambar Dua']
      );
    }

    res.json({ success: true, message: 'Laporan piket berhasil dikirim!' });
  } catch (error) {
    console.error('Error picket upload:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDashboard,
  getPicketReports,
  uploadPicket
};
