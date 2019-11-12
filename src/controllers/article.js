const db = require('../configs/db');

module.exports = {
    createOne: async (req, res) => {
        const status = 'error';
        const { body: { title, article }, userId = 15 } = req;

        if (title === undefined || title.trim() === '') {
            res.status(400).json({ status, error: 'The title field is mandatory' });
        } else if (article === undefined || article.trim() === '') {
            res.status(400).json({ status, error: "The article's content is missing" });
        } else {
            await db.query('INSERT INTO posts (title, content, post_type_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, content, created_at', [title, article, 2, userId], (err, result) => {
                try {
                    if (err) {
                        throw new Error('The article could not be saved...');
                    }

                    const { id: articleId, created_at: createdOn } = result.rows[0];

                    res.status(201).json({
                        status: 'success',
                        data: {
                            message: 'Article successfully posted', articleId, title, createdOn,
                        },
                    });
                } catch (error) {
                    res.status(500).json({ status, error: error.message });
                }
            });
        }
    },
};
