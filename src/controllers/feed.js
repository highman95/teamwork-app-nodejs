const db = require('../configs/db');

module.exports = {
    getPosts: async (req, res) => {
        db.query('SELECT id, title, content, image_url, post_type_id, user_id, created_at FROM posts ORDER BY created_at DESC', [], (err, result) => {
            try {
                if (err) {
                    throw err;
                }

                const feeds = result.rows.map((row) => {
                    const {
                        id, title, content: article, image_url: url, post_type_id: postTypeId,
                        user_id: authorId, created_at: createdOn,
                    } = row;

                    return {
                        id,
                        createdOn,
                        title,
                        ...(postTypeId === 1 ? { url } : { article }),
                        authorId,
                    };
                });

                res.status(200).json({ status: 'success', data: feeds });
            } catch (e) {
                console.error('[Feed] DB-Error', e.message || e.error.message);
                res.status(500).json({ status: 'error', error: 'The article/gif posts could not be retrieved' });
            }
        });
    },
};
