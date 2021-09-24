const multer = require('multer');

const storage = multer.diskStorage({
  // destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => {
    cb(null, `capstone-${file.fieldname}-${Date.now()}.gif`);
  },
});

const fileFilter = (req, file, cb) => {
  const isGif = (file.mimetype === 'image/gif');
  cb(isGif ? null : new Error('Only GIF images are acceptable'), isGif);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 1000000 } }).single('image');
