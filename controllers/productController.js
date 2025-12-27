const Product = require("../models/Product");

const ALLOWED_CATEGORIES = [
  "Furniture",
  "Decorative Items",
  "Outdoor Pieces",
  "Kitchenware",
  "Hand Railings",
  "Other"
];

// Public: GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Public: GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, shortDescription, description, price, category } = req.body;

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`
      });
    }

    // ✅ ONLY Cloudinary URLs
    const images = [];

    if (req.files && req.files.length) {
      req.files.forEach(file => {
        images.push(file.path); // Cloudinary URL
      });
    }

    const product = new Product({
      name,
      shortDescription,
      description,
      price,
      category,
      images
    });

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create error", error: err.message });
  }
};

// Admin: PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const { name, shortDescription, description, price, category } = req.body;

    if (name !== undefined) prod.name = name;
    if (shortDescription !== undefined) prod.shortDescription = shortDescription;
    if (description !== undefined) prod.description = description;
    if (price !== undefined) prod.price = price;

    if (category !== undefined) {
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`
        });
      }
      prod.category = category;
    }

    // ✅ Add new Cloudinary images
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        prod.images.push(file.path);
      });
    }

    await prod.save();
    res.json(prod);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update error", error: err.message });
  }
};

// Admin: DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    // ❌ NO local file deletion (Cloudinary handles storage)
    await prod.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
};

// Admin: DELETE /api/products/:id/images/:index
const removeProductImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    const prod = await Product.findById(id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const imgIndex = parseInt(index);
    if (isNaN(imgIndex) || imgIndex < 0 || imgIndex >= prod.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    // ✅ Just remove URL from DB
    prod.images.splice(imgIndex, 1);
    await prod.save();

    res.json({ message: "Image removed", images: prod.images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Remove image error", error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImage
};
