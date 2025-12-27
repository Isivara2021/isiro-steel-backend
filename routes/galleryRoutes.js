const express = require("express");
const router = express.Router();
const upload = require("../utils/cloudinaryUpload");
const authMiddleware = require("../middleware/authMiddleware");
const galleryController = require("../controllers/galleryController");

router.get("/", galleryController.getGallery);
router.post("/", authMiddleware, upload.single("image"), galleryController.addGalleryImage);
router.delete("/:id", authMiddleware, galleryController.deleteGalleryImage);

module.exports = router;
