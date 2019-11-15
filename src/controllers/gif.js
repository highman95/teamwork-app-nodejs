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

    /**
     * Register a comment for a specific gif post
     *
     * @author Emma Nwamaife
     *
     * @param req The httpRequest Object
     * @param res The httpResponse object
     * @returns The httpResponse object
     */
    createPostComment: (req, res) => {
        const status = 'error';
        const { params: { gifId }, body: { comment }, userId } = req;

        if (gifId === undefined || Number.isSafeInteger(gifId)) {
            res.status(400).json({ status, error: "The gif post's unique-id is missing" });
        } else if (comment === undefined || comment.trim() === '') {
            res.status(400).json({ status, error: "The gif post's comment cannot be blank" });
        } else {
            db.query('SELECT title FROM posts WHERE post_type_id = 1 AND id = $1', [gifId], (errP, resultP) => {
                try {
                    if (errP) {
                        throw errP;
                    }

                    if (resultP.rowCount === 0) {
                        res.status(404).json({ status, error: 'The gif post was not found' });
                    } else {
                        db.query('INSERT INTO comments (comment, post_id, user_id) VALUES ($1, $2, $3) RETURNING created_at', [comment, gifId, userId], (errC, resultC) => {
                            try {
                                if (errC) {
                                    throw errC;
                                }

                                const { title: gifTitle } = resultP.rows[0];
                                const { created_at: createdOn } = resultC.rows[0];

                                res.status(201).json({
                                    status: 'success',
                                    data: {
                                        message: 'Comment successfully created', createdOn, gifTitle, comment,
                                    },
                                });
                            } catch (eC) {
                                console.error('[Comment] DB-Error', eC.message || eC.error.message);
                                res.status(500).json({ status, error: "The GIF post's comment could not be saved" });
                            }
                        });
                    }
                } catch (eP) {
                    console.error('[Post] DB-Error', eP.message || eP.error.message);
                    res.status(500).json({ status, error: 'The GIF post could not be retrieved' });
                }
            });
        }
    },

    getPost: async (req, res) => {
        const status = 'error';
        const { params: { gifId } } = req;

        if (gifId === undefined || Number.isNaN(gifId)) {
            res.status(400).json({ status, error: "The GIF post's unique-id is missing" });
        } else {
            await db.query('SELECT id, title, image_url, created_at FROM posts WHERE post_type_id = 1 AND id = $1', [gifId], (errP, resultP) => {
                try {
                    if (errP) {
                        throw errP;
                    }

                    if (resultP.rowCount === 0) {
                        res.status(404).json({ status, error: 'The GIF post cannot be found' });
                    } else {
                        let comments = [];

                        db.query('SELECT id, comment, user_id FROM comments WHERE post_id = $1', [gifId], (errC, resultC) => {
                            try {
                                if (!errC && resultC.rowCount > 0) {
                                    comments = resultC.rows.map((row) => {
                                        const { id: commentId, comment, user_id: authorId } = row;
                                        return { commentId, comment, authorId };
                                    });
                                }

                                const {
                                    id, title, image_url: imageUrl, created_at: createdOn,
                                } = resultP.rows[0];

                                res.status(200).json({
                                    status: 'success',
                                    data: {
                                        id, createdOn, title, imageUrl, comments,
                                    },
                                });
                            } catch (e) {
                                console.error('[Comments] DB-Error: ', e.message || e.error.message);
                            }
                        });
                    }
                } catch (e2) {
                    console.error('[Posts] DB-Error: ', e2.message || e2.error.message);
                    res.status(500).json({ status, error: 'The GIF post could not be retrieved' });
                }
            });
        }
    },

    deletePost: (req, res) => {
        const status = 'error';
        const { params: { gifId } } = req;

        if (gifId === undefined || Number.isSafeInteger(gifId)) {
            res.status(400).json({ status, error: '' });
        } else {
            db.query('DELETE FROM posts WHERE post_type_id = 1 AND id = $1 RETURNING title', [gifId], (err, result) => {
                try {
                    if (err) {
                        throw err;
                    }

                    const reportMessage = result.rowCount < 0 ? 'not' : '';
                    res.status(200).json({ status: 'success', data: { message: `GIF post ${reportMessage} successfully deleted` } });
                } catch (e) {
                    console.log('[Posts-Del] DB-Error: ', e.message || e.error.message);
                    res.status(500).json({ status, error: 'The GIF post could not be deleted' });
                }
            });
        }
    },
};
