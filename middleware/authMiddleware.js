const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally verify admin exists
    const admin = await Admin.findById(decoded.id).select("-passwordHash");
    if (!admin) return res.status(401).json({ message: "Invalid token" });

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
