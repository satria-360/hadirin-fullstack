const { db } = require('../config/database');

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
  getClassInfo,
  resolveClassIdForUser
};
