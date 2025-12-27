const express = require("express");
const router = express.Router();
const {
  getAllNews,
  addNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const verifyAdmin = require("../middleware/authMiddleware");
const upload = require("../utils/cloudinaryUpload");

// Routes

// Get all news
router.get("/", getAllNews);

// Add news (admin + file upload, max 5 images)
router.post("/", verifyAdmin, upload.array("images", 5), addNews);

// Update news (admin + file upload, max 5 new images)
router.put(
  "/:id",
  verifyAdmin,
  // Only accept new images under field name "images"
  upload.array("images", 5),
  updateNews
);

// Delete news
router.delete("/:id", verifyAdmin, deleteNews);

module.exports = router;
