const db = require('../configs/db');

module.exports = {
    getPosts: async (req, res) => {
        db.query('SELECT p.id, title, content, image_url, user_id, post_type_id, created_at, name FROM posts p JOIN post_types pt ON pt.id = p.post_type_id ORDER BY created_at DESC', [], (err, result) => {
            try {
                if (err) {
                    throw err;
                }

                const feeds = result.rows.map((row) => {
                    const {
                        id, title, content: article, image_url: url, post_type_id: postTypeId,
                        user_id: authorId, created_at: createdOn, name: type,
                    } = row;

                    return {
                        id,
                        createdOn,
                        title,
                        ...(postTypeId === 1 ? { url } : { article }),
                        authorId, type,
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
