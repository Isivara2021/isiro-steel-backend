const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      max: 10000000,
    },

    category: {
      type: String,
      enum: [
        "Furniture",
        "Decorative Items",
        "Outdoor Pieces",
        "Kitchenware",
        "Hand Railings",
        "Other",
      ],
      default: "Furniture",
    },

    images: {
      type: [String],
      validate: {
        validator: (val) => val.length <= 5,
        message: "Maximum 5 images allowed",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
