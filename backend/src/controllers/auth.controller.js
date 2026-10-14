const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { db } = require('../config/database');
const { createTransporter } = require('../config/mailer');
const { JWT_SECRET } = require('../middlewares/auth.middleware');
const { createUniqueClassCode, getClassInfo } = require('../utils/classHelper');

// Simpan kode verifikasi reset password sementara di memori
const resetCodes = new Map(); // email -> { code, expiresAt }

const login = async (req, res) => {
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

    // Reset status kehadiran siswa saat user login sehingga dashboard kembali bersih (status kosong)
    try {
      if (classPayload.class_id) {
        await db.query(`
          UPDATE picket_reports pr
          JOIN users u ON pr.user_id = u.id
          SET pr.status = ''
          WHERE u.class_id = ? AND pr.picket_date = CURDATE()
        `, [classPayload.class_id]);
      }
    } catch (resetErr) {
      console.warn('Gagal mereset status absensi saat login:', resetErr.message);
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
};

const register = async (req, res) => {
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
};

const requestResetCode = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email wajib diisi!' });
  }
  try {
    const cleanEmail = email.trim().toLowerCase();
    const [users] = await db.query('SELECT id, full_name FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Email tidak terdaftar di sistem!' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes.set(cleanEmail, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    console.log(`[RESET PASSWORD] Kode OTP verifikasi untuk ${cleanEmail}: ${code}`);

    let previewUrl = null;
    try {
      const transporter = await createTransporter();
      const sender = process.env.SMTP_USER || '"Hadirin App" <no-reply@hadirin.co>';

      const info = await transporter.sendMail({
        from: sender,
        to: cleanEmail,
        subject: `Kode Verifikasi Reset Password: ${code}`,
        text: `Halo,\n\nKode verifikasi Anda untuk mengatur ulang kata sandi akun Hadirin adalah: ${code}\n\nKode ini berlaku selama 15 menit.\nJika Anda tidak meminta reset password, abaikan email ini.`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #082052; padding: 30px; color: #ffffff; border-radius: 12px; max-width: 500px; margin: auto;">
            <h2 style="color: #ffffff; text-align: center; margin-bottom: 20px;">Hadirin - Reset Password</h2>
            <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">
              Halo <strong>${users[0].full_name || 'Pengguna'}</strong>,<br/><br/>
              Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Gunakan kode verifikasi (OTP) berikut:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; background-color: #F5EFEB; color: #082052; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                ${code}
              </span>
            </div>
            <p style="color: #cbd5e1; font-size: 12px; line-height: 1.5; text-align: center;">
              Kode ini berlaku selama <strong>15 menit</strong>.<br/>
              Jangan berikan kode ini kepada siapa pun. Jika Anda tidak merasa melakukan permintaan ini, abaikan pesan ini.
            </p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 25px 0;" />
            <p style="text-align: center; font-size: 11px; color: #94a3b8;">
              &copy; 2026 Hadirin. Seluruh hak cipta dilindungi.
            </p>
          </div>
        `
      });

      if (nodemailer.getTestMessageUrl(info)) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`[MAILER] Preview Email Ethereal: ${previewUrl}`);
      }
    } catch (mailError) {
      console.warn('Gagal mengirim email secara langsung, menggunakan fallback log:', mailError.message);
    }

    res.json({
      success: true,
      message: 'Kode verifikasi OTP berhasil dikirim ke email Anda!',
      email: cleanEmail,
      previewUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan: ' + error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, kode verifikasi, dan password baru wajib diisi!' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim().toUpperCase();

  const record = resetCodes.get(cleanEmail);
  if (!record) {
    return res.status(400).json({ success: false, message: 'Silakan minta kode verifikasi terlebih dahulu!' });
  }

  if (Date.now() > record.expiresAt) {
    resetCodes.delete(cleanEmail);
    return res.status(400).json({ success: false, message: 'Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.' });
  }

  if (record.code !== cleanCode) {
    return res.status(400).json({ success: false, message: 'Kode verifikasi salah!' });
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, cleanEmail]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    resetCodes.delete(cleanEmail);

    res.json({ success: true, message: 'Password berhasil direset! Silakan login dengan password baru Anda.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mereset password: ' + error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.employee_code, u.full_name, u.email, u.phone_number, u.avatar_url, u.status, u.role_id, u.class_id, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }
    const classInfo = await getClassInfo(rows[0]);
    res.json({ success: true, user: { ...rows[0], ...classInfo } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau token tidak valid.' });
  }
};

module.exports = {
  login,
  register,
  requestResetCode,
  resetPassword,
  getMe
};
