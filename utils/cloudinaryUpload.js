const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "isiro/others";

    if (req.originalUrl.includes("products")) folder = "isiro/products";
    if (req.originalUrl.includes("news")) folder = "isiro/news";
    if (req.originalUrl.includes("gallery")) folder = "isiro/gallery";

    return {
      folder,
      resource_type: "image",

      allowed_formats: ["jpg", "jpeg", "png", "webp"],

      transformation: [
        {
          width: 1600,
          height: 1600,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 5,
  },
});

module.exports = upload;
