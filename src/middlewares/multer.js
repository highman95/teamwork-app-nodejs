const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const filename = `capstone-${file.fieldname}-${Date.now()}`;
        cb(null, `${filename}.gif`);
    },
});

const fileFilter = (req, file, cb) => {
    const isGif = (file.mimetype === 'image/gif');
    cb(isGif ? null : new TypeError('Only GIF images are acceptable'), isGif);
};

const multerConfig = multer({ storage, fileFilter }).single('image');

module.exports = (req, res, next) => {
    multerConfig(req, res, (err) => {
        try {
            if (err) {
                throw err;
            }

            next();
        } catch (e) {
            console.error('MulterConfigError:\n', e.message || e.error.message);

            const isTypeError = (e instanceof TypeError);
            const statusCode = isTypeError ? 400 : 500;
            const errorMessage = isTypeError ? (e.message || e.error.message) : 'The image upload operation failed';

            res.status(statusCode).json({ status: 'error', error: errorMessage });
        }
    });
};
