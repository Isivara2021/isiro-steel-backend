const News = require("../models/News");

// Get all news
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add news
const addNews = async (req, res) => {
  try {
    const { topic, content } = req.body;
    if (!topic || !content)
      return res.status(400).json({ message: "Topic and content required" });

    // ✅ Cloudinary image URLs
    const images = req.files ? req.files.map(f => f.path) : [];

    const news = new News({ topic, content, images });
    const savedNews = await news.save();

    res.status(201).json(savedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update news
const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    const { topic, content, removedImages } = req.body;

    if (topic) news.topic = topic;
    if (content) news.content = content;

    // Parse removed images
    let removed = [];
    if (removedImages) {
      removed = typeof removedImages === "string"
        ? JSON.parse(removedImages)
        : removedImages;
    }

    // Keep images not removed
    const keptImages = news.images.filter(img => !removed.includes(img));

    // Add newly uploaded Cloudinary images
    const newImages = req.files ? req.files.map(f => f.path) : [];

    news.images = [...keptImages, ...newImages];

    const updated = await news.save();
    res.json(updated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete news
const deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews)
      return res.status(404).json({ message: "News not found" });

    // ✅ Only DB delete (Cloudinary remains unless explicitly removed)
    res.status(200).json({ message: "News deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllNews, addNews, updateNews, deleteNews };
