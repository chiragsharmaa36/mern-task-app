import express from "express";
import User from "../models/User.js";

const router = express.Router();

// list of all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select("-password").lean();
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
