const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { getClassInfo } = require('../utils/classHelper');

// Update data profile user (nama, email, no telp, avatar)
const updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone_number, avatar_url } = req.body;
    await db.query(
      `UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), phone_number = COALESCE(?, phone_number), avatar_url = COALESCE(?, avatar_url) WHERE id = ?`,
      [full_name, email, phone_number, avatar_url, req.user.id]
    );
    const [rows] = await db.query(
      `SELECT u.id, u.employee_code, u.full_name, u.email, u.phone_number, u.avatar_url, u.status, u.role_id, u.class_id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? LIMIT 1`,
      [req.user.id]
    );
    const classInfo = await getClassInfo(rows[0]);
    res.json({ success: true, message: 'Profil berhasil diperbarui!', user: { ...rows[0], ...classInfo } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil: ' + error.message });
  }
};

// Ubah password user yang sedang login
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi!' });
    }
    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah!' });
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);
    res.json({ success: true, message: 'Password berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui password: ' + error.message });
  }
};

module.exports = {
  updateProfile,
  changePassword
};
