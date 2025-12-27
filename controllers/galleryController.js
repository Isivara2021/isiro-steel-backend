const GalleryImage = require("../models/GalleryImage");

// GET ALL Gallery Images
const getGallery = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ADD Gallery Image
const addGalleryImage = async (req, res) => {
  try {
    let imageUrl = "";

    // Cloudinary file URL
    if (req.file) {
      imageUrl = req.file.path || req.file.url || "";
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl; // allow direct URL from frontend
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "No image provided" });
    }

    if (!req.body.category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const img = new GalleryImage({
      title: req.body.title || "",
      category: req.body.category,
      imageUrl,
    });

    await img.save();
    res.status(201).json(img);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Add gallery image error", error: err.message });
  }
};

// DELETE Gallery Image
const deleteGalleryImage = async (req, res) => {
  try {
    const img = await GalleryImage.findById(req.params.id);
    if (!img) return res.status(404).json({ message: "Image not found" });

    // Note: Cloudinary deletion is optional, only if you want to remove from Cloudinary
    // Currently only deletes DB record

    await img.deleteOne();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete error", error: err.message });
  }
};

module.exports = {
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
};
