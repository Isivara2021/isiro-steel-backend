const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/admin/register
// Danger: allow only if correct setup key provided in body or env
const registerAdmin = async (req, res) => {
  try {
    const setupKey = req.body.setupKey || "";
    if (!process.env.ADMIN_SETUP_KEY || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Setup key invalid or not provided" });
    }

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = new Admin({ username, passwordHash });
    await admin.save();
    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: admin._id, username: admin.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

module.exports = { registerAdmin, loginAdmin };
  