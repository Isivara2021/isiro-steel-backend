const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  topic: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 2000 },
  images: { type: [String] }, // store filenames
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("News", newsSchema);
