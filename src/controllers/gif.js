const mediaManager = require('../configs/cloudinary');
const db = require('../configs/db');
const postTypeId = 1;

module.exports = {
    createPost: async (req, res) => {
        const status = 'error';
        const { body: { title }, file, userId } = req;

        if (!title || title.trim() === '') {
            res.status(400).json({ status, error: 'The title field is mandatory' });
        } else if (!file || file.path.trim() === '') {
            res.status(400).json({ status, error: 'The GIF image is missing' });
        } else {
            try {
                const response = await mediaManager.uploadImage(file.path);

                try {
                    // delete the file and save the cloudStorage info
                    // await fs.unlink(file.path);

                    const result = await db.query('INSERT INTO posts (title, image_url, post_type_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, created_at', [title, response.url, postTypeId, userId]);
                    const { id: gifId, created_at: createdOn } = result.rows[0];

                    res.status(201).json({
                        status: 'success',
                        data: {
                            message: 'GIF image successfully posted', imageUrl: response.url, gifId, title, createdOn,
                        },
                    });
                } catch (e2) {
                    console.error('DB Error:', e2.message || e2.error.message);
                    res.status(500).json({ status, error: 'The GIF post could not be saved' });
                }
            } catch (e) {
                console.error('[Cloudinary] Error: ', e.message || e.error.message);
                res.status(500).json({ status, error: 'The GIF image could not uploaded (Cloud)' });
            }
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
    createPostComment: async (req, res) => {
        const status = 'error';
        const { params: { gifId }, body: { comment }, userId } = req;

        if (!gifId || gifId === 'undefined' || Number.isNaN(gifId)) {
            res.status(400).json({ status, error: "The gif post's unique-id is missing" });
        } else if (!comment || comment.trim() === '') {
            res.status(400).json({ status, error: "The gif post's comment cannot be blank" });
        } else {
            try {
                const resultP = await db.query(`SELECT title FROM posts WHERE post_type_id = ${postTypeId} AND id = $1`, [gifId]);

                if (resultP.rowCount === 0) {
                    return res.status(404).json({ status, error: 'The gif post was not found' });
                }

                try {
                    const resultC = await db.query('INSERT INTO comments (comment, post_id, user_id) VALUES ($1, $2, $3) RETURNING created_at', [comment, gifId, userId]);
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
                    res.status(500).json({ status, error: 'The comment could not be saved' });
                }
            } catch (eP) {
                console.error('[Post] DB-Error', eP.message || eP.error.message);
                res.status(500).json({ status, error: 'The GIF post could not be retrieved' });
            }
        }
    },

    getPost: async (req, res) => {
        const status = 'error';
        const { params: { gifId } } = req;

        if (!gifId || gifId === 'undefined' || Number.isNaN(gifId)) {
            res.status(400).json({ status, error: "The GIF post's unique-id is missing" });
        } else {
            try {
                const resultP = await db.query(`SELECT p.id, title, image_url, created_at, name FROM posts p JOIN post_types pt ON pt.id = p.post_type_id WHERE post_type_id = ${postTypeId} AND p.id = $1`, [gifId]);

                if (resultP.rowCount === 0) {
                    return res.status(404).json({ status, error: 'The GIF post cannot be found' });
                }

                try {
                    const resultC = await db.query('SELECT id, comment, user_id FROM comments WHERE post_id = $1', [gifId]);

                    const comments = resultC.rows ? resultC.rows.map((row) => {
                        const { id: commentId, comment, user_id: authorId } = row;
                        return { commentId, comment, authorId };
                    }) : [];

                    const {
                        id, title, image_url: url, created_at: createdOn, name: type,
                    } = resultP.rows[0];

                    res.status(200).json({
                        status: 'success',
                        data: {
                            id, createdOn, title, url, comments, type,
                        },
                    });
                } catch (e2) {
                    console.error('[Comments] DB-Error: ', e2.message || e2.error.message);
                    res.status(500).json({ status, error: 'The comments could not be retrieved' });
                }
            } catch (e) {
                console.error('[Posts] DB-Error: ', e.message || e.error.message);
                res.status(500).json({ status, error: 'The GIF post could not be retrieved' });
            }
        }
    },

    deletePost: async (req, res) => {
        const status = 'error';
        const { params: { gifId } } = req;

        if (!gifId || Number.isNaN(gifId)) {
            return res.status(400).json({ status, error: '' });
        }

        try {
            const result = await db.query(`DELETE FROM posts WHERE post_type_id = ${postTypeId} AND id = $1 RETURNING title`, [gifId]);
            const reportMessage = result.rowCount < 0 ? 'not ' : '';

            res.status(200).json({ status: 'success', data: { message: `GIF post ${reportMessage}successfully deleted` } });
        } catch (e) {
            console.log('[Posts-Del] DB-Error: ', e.message || e.error.message);
            res.status(500).json({ status, error: 'The GIF post could not be deleted' });
        }
    },
};
