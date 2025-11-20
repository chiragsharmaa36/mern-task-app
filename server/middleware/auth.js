// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function (req, res, next) {
  try {
    const header = req.header('Authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach a minimal user object
    req.user = { id: payload.id, role: payload.role };
    // optional: load full user:
    // req.userDoc = await User.findById(payload.id).select('-password');
    next();
  } catch (err) {
    console.error('Auth error', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
}
