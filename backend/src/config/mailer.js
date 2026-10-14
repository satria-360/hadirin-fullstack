const nodemailer = require('nodemailer');

// Konfigurasi transporter email
// Mendukung SMTP Gmail / custom SMTP melalui environment variable,
// serta fallback otomatis ke akun test Ethereal jika SMTP belum disetting.
let testAccount = null;

const createTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback: Ethereal test mailer (gratis, tanpa konfigurasi kredensial pribadi)
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
    console.log('[MAILER] Menggunakan akun tes Ethereal Mail:', testAccount.user);
  }
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

module.exports = {
  createTransporter
};
