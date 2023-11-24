const multer = require("multer");

const MIME_TYPES = {
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/images");
  },
  filename: (_req, file, cb) => {
    const extension = MIME_TYPES[file.mimetype];
    cb(null, `capstone-${file.fieldname}-${Date.now()}${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const isGif = MIME_TYPES[file.mimetype] !== undefined;
  cb(isGif ? null : new Error("Only GIF images are acceptable"), isGif);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000 },
}).single("image");
