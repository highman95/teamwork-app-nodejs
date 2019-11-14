const fs = require('fs');
const mediaManager = require('../configs/cloudinary');
const db = require('../configs/db');

module.exports = {
    createPost: async (req, res) => {
        const status = 'error';
        const { body: { title }, file, userId } = req;

        if (title === undefined || title.trim() === '') {
            res.status(400).json({ status, error: 'The title field is mandatory' });
        } else if (file === undefined || file.path.trim() === '') {
            res.status(400).json({ status, error: 'The GIF image is missing' });
        } else {
            await mediaManager.uploadImage(file.path, (error, response) => {
                if (!error) {
                    // delete the file and save the cloudStorage info
                    fs.unlink(file.path, (err2) => {
                        if (!err2) {
                            db.query('INSERT INTO posts (title, image_url, post_type_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, created_at', [title, response.url, 1, userId], (err, result) => {
                                if (err) {
                                    console.log('DB Error:', err.message || err.error.message);
                                    res.status(500).json({ status, error: 'The GIF post could not be saved' });
                                } else {
                                    const { id: gifId, created_at: createdOn } = result.rows[0];

                                    res.status(201).json({
                                        status: 'success',
                                        data: {
                                            message: 'GIF image successfully posted', imageUrl: response.url, gifId, title, createdOn,
                                        },
                                    });
                                }
                            });
                        }
                    });
                }
            }).catch((e) => {
                console.error(e.message || e.error.message);
                res.status(500).json({ status, error: 'The GIF image could not uploaded (Cloud)' });
            });
        }
    },
};
