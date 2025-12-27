const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  title: { type: String, default: "" },
  imageUrl: { type: String, required: true },            // Stored file path or external URL

  category: {
    type: String,
    enum: [
      "Furniture",
      "Decorative Items",
      "Outdoor Pieces",
      "Kitchenware",
      "Hand Railings",
      "Other"
    ],
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GalleryImage", gallerySchema);
