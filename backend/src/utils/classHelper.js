const { db } = require('../config/database');
const crypto = require('crypto');

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

/**
 * Generate invite token baru untuk kelas.
 * Token berlaku 24 jam. Token lama otomatis digantikan.
 * @param {number} classId
 * @returns {{ token: string, expiresAt: Date }}
 */
async function generateInviteToken(classId) {
  const token = crypto.randomBytes(20).toString('hex'); // 40-char hex
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // +5 menit
  await db.query(
    'UPDATE classes SET invite_token = ?, invite_expires_at = ? WHERE id = ?',
    [token, expiresAt, classId]
  );
  return { token, expiresAt };
}

/**
 * Validasi invite token. Return class_id jika valid, null jika tidak.
 * @param {string} token
 * @returns {Promise<number|null>}
 */
async function validateInviteToken(token) {
  if (!token) return null;
  const [rows] = await db.query(
    'SELECT id, invite_expires_at FROM classes WHERE invite_token = ? LIMIT 1',
    [token.trim()]
  );
  if (!rows.length) return null;
  const cls = rows[0];
  if (!cls.invite_expires_at || new Date(cls.invite_expires_at) < new Date()) return null;
  return cls.id;
}

async function getClassInfo(user) {
  if (!user) return {};
  if (user.role_id === 3) {
    const [r] = await db.query(
      'SELECT id, name, access_code, invite_token, invite_expires_at FROM classes WHERE teacher_id = ? LIMIT 1',
      [user.id]
    );
    if (!r.length) return {};
    const cls = r[0];
    // Hitung apakah invite token masih aktif
    const inviteActive = cls.invite_token && cls.invite_expires_at && new Date(cls.invite_expires_at) > new Date();
    return {
      class_id: cls.id,
      class_name: cls.name,
      class_code: cls.access_code,
      invite_token: inviteActive ? cls.invite_token : null,
      invite_expires_at: inviteActive ? cls.invite_expires_at : null,
    };
  }
  if (user.class_id) {
    const [r] = await db.query('SELECT id, name FROM classes WHERE id = ? LIMIT 1', [user.class_id]);
    return r.length ? { class_id: r[0].id, class_name: r[0].name } : {};
  }
  return {};
}

async function resolveClassIdForUser(userId) {
  const [tc] = await db.query('SELECT id FROM classes WHERE teacher_id = ? LIMIT 1', [userId]);
  if (tc.length > 0) {
    return tc[0].id;
  }
  const [u] = await db.query('SELECT class_id FROM users WHERE id = ? LIMIT 1', [userId]);
  if (u.length > 0 && u[0].class_id) {
    return u[0].class_id;
  }
  return null;
}

module.exports = {
  generateClassCode,
  createUniqueClassCode,
  generateInviteToken,
  validateInviteToken,
  getClassInfo,
  resolveClassIdForUser
};
