const db = require('../configs/db');

module.exports = {
    createOne: async (req, res) => {
        const status = 'error';
        const { body: { title, article }, userId } = req;

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

    getPost: async (req, res) => {
        const status = 'error';
        const { params: { articleId } } = req;

        if (articleId === undefined || Number.isNaN(articleId)) {
            res.status(400).json({ status, error: "The article's unique-id is missing" });
        } else {
            await db.query('SELECT id, title, content, created_at FROM posts WHERE id = $1', [articleId], (err, resultP) => {
                try {
                    if (err) {
                        throw new Error('The article could not be retrieved');
                    }

                    if (resultP.rowCount === 0) {
                        res.status(404).json({ status, error: 'The article cannot be found' });
                    } else {
                        let comments = [];

                        db.query('SELECT id, comment, user_id FROM comments WHERE post_id = $1', [articleId], (errC, resultC) => {
                            try {
                                if (!errC && resultC.rowCount > 0) {
                                    comments = resultC.rows.map((row) => {
                                        const { id: commentId, comment, user_id: authorId } = row;
                                        return { commentId, comment, authorId };
                                    });
                                }

                                const {
                                    id, title, content: article, created_at: createdOn,
                                } = resultP.rows[0];

                                res.status(200).json({
                                    status: 'success',
                                    data: {
                                        id, createdOn, title, article, comments,
                                    },
                                });
                            } catch (e) {
                                console.error('[Comments] DB-Error: ', e.message || e.error.message);
                            }
                        });
                    }
                } catch (e2) {
                    console.error('[Posts] DB-Error: ', e2.message || e2.error.message);
                    res.status(500).json({ status, error: e2.message || e2.error.message });
                }
            });
        }
    },
};
