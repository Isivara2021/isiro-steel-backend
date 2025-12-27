const express = require("express");
const router = express.Router();

const upload = require("../utils/cloudinaryUpload");
const authMiddleware = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const { productValidationRules } = require("../middleware/productValidator");
const validateRequest = require("../middleware/validateRequest");

/* =========================
   PUBLIC ROUTES
========================= */
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

/* =========================
   ADMIN ROUTES (PROTECTED)
========================= */

// CREATE PRODUCT
router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  productValidationRules,
  validateRequest,
  productController.createProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  productValidationRules,
  validateRequest,
  productController.updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  authMiddleware,
  productController.deleteProduct
);

// REMOVE SINGLE IMAGE
router.delete(
  "/:id/images/:index",
  authMiddleware,
  productController.removeProductImage
);

module.exports = router;
