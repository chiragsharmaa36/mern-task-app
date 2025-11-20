import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  body("name").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.statusCode(400).json({ errors: errors.array() });
    const { name, email, password, role } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user)
        return res.status(400).json({ message: "Email already registered" });

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email,
        password: hashed,
        role: role || "TeamMember",
      });

      const payload = { id: user._id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "7d",
      });

      const { password: _p, ...safeUser } = user.toObject();
      res.status(201).json({ token, user: safeUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

      const payload = { id: user._id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

      const { password: _p, ...safeUser } = user.toObject();
      res.json({ token, user: safeUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/auth/me -- protected, returns current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user is populated by middleware
    const user = await User.findById(req.user.id).select('-password').populate('manager manages projects', 'name email role title');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
