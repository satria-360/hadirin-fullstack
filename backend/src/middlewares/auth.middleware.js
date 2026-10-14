const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jwt_hadirin_2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan!' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau token tidak valid.' });
  }
};

module.exports = {
  JWT_SECRET,
  authenticateToken
};
