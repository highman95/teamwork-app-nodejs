const db = require('../configs/db');

const postTypeId = 2;

module.exports = {
    createPost: async (req, res) => {
        const status = 'error';
        const { body: { title, article }, userId } = req;

        if (!title || title.trim() === '') {
            res.status(400).json({ status, error: 'The title field is mandatory' });
        } else if (!article || article.trim() === '') {
            res.status(400).json({ status, error: "The content of the article is missing" });
        } else {
            try {
                const result = await db.query('INSERT INTO posts (title, content, post_type_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, content, created_at', [title, article, postTypeId, userId]);
                const { id: articleId, created_at: createdOn } = await result.rows[0];

                res.status(201).json({
                    status: 'success',
                    data: {
                        message: 'Article successfully posted', articleId, title, createdOn,
                    },
                });
            } catch (e) {
                console.error('DB-Error: ', e.message || e.error.message);
                res.status(500).json({ status, error: 'The article could not be saved' });
            }
        }
    },

    /**
     * Register a comment for a single article post
     *
     * @author Emma Nwamaife
     *
     * @param req The httpRequest Object
     * @param res The httpResponse object
     * @returns The httpResponse object
     */
    createPostComment: async (req, res) => {
        const status = 'error';
        const { params: { articleId }, body: { comment }, userId } = req;

        if (!articleId || Number.isNaN(articleId)) {
            res.status(400).json({ status, error: "The article's unique-id is missing" });
        } else if (!comment || comment.trim() === '') {
            res.status(400).json({ status, error: "The article's comment cannot be blank" });
        } else {
            try {
                const resultP = await db.query(`SELECT title, content FROM posts WHERE post_type_id = ${postTypeId} AND id = $1`, [articleId]);
                if (resultP.rowCount === 0) {
                    return res.status(404).json({ status, error: 'The article was not found' });
                }

                try {
                    const resultC = await db.query('INSERT INTO comments (comment, post_id, user_id) VALUES ($1, $2, $3) RETURNING created_at', [comment, articleId, userId]);
                    const { title: articleTitle, content: article } = resultP.rows[0];
                    const { created_at: createdOn } = resultC.rows[0];

                    res.status(201).json({
                        status: 'success',
                        data: {
                            message: 'Comment successfully created', createdOn, articleTitle, article, comment,
                        },
                    });
                } catch (eC) {
                    console.error('[Comment] DB-Error', eC.message || eC.error.message);
                    res.status(500).json({ status, error: 'The comment could not be saved' });
                }
            } catch (eP) {
                console.error('[Post] DB-Error', eP.message || eP.error.message);
                res.status(500).json({ status, error: 'The article could not be retrieved' });
            }
        }
    },

    updatePost: async (req, res) => {
        const status = 'error';
        const { params: { articleId }, body: { title, article } } = req;

        if (!articleId || Number.isNaN(articleId)) {
            res.status(400).json({ status, error: "The article's unique-id is missing" });
        } else if (!title || title.trim() === '') {
            res.status(400).json({ status, error: 'The title field is mandatory' });
        } else if (!article || article.trim() === '') {
            res.status(400).json({ status, error: "The article's content is missing" });
        } else {
            try {
                const resultP = await db.query(`SELECT id, title, content, created_at FROM posts WHERE post_type_id = ${postTypeId} AND id = $1`, [articleId]);

                if (resultP.rowCount === 0) {
                    return res.status(404).json({ status, error: 'The article no longer exists' });
                }

                try {
                    await db.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING id', [title, article, articleId]);

                    res.status(200).json({
                        status: 'success',
                        data: { message: 'Article successfully updated', title, article },
                    });
                } catch (e) {
                    console.error('[Post-Patch] DB-Error', e.message || e.error.message);
                    res.status(500).json({ status, error: 'The article could not be updated' });
                }
            } catch (e2) {
                console.error('[Posts] DB-Error: ', e2.message || e2.error.message);
                res.status(500).json({ status, error: 'The article could not be retrieved' });
            }
        }
    },

    getPost: async (req, res) => {
        const status = 'error';
        const { params: { articleId } } = req;

        if (!articleId || Number.isNaN(articleId)) {
            res.status(400).json({ status, error: "The article's unique-id is missing" });
        } else {
            try {
                const resultP = await db.query(`SELECT p.id, title, content, created_at, name FROM posts p JOIN post_types pt ON pt.id = p.post_type_id WHERE post_type_id = ${postTypeId} AND p.id = $1`, [articleId]);

                if (resultP.rowCount === 0) {
                    return res.status(404).json({ status, error: 'The article cannot be found' });
                }

                try {
                    const resultC = db.query('SELECT id, comment, user_id FROM comments WHERE post_id = $1', [articleId]);

                    const comments = resultC.rows ? resultC.rows.map((row) => {
                        const { id: commentId, comment, user_id: authorId } = row;
                        return { commentId, comment, authorId };
                    }) : [];

                    const {
                        id, title, content: article, created_at: createdOn, name: type,
                    } = resultP.rows[0];

                    res.status(200).json({
                        status: 'success',
                        data: {
                            id, createdOn, title, article, comments, type,
                        },
                    });
                } catch (e2) {
                    console.error('[Comments] DB-Error: ', e2.message || e2.error.message);
                    res.status(500).json({ status, error: 'The comments could not be retrieved' });
                }
            } catch (e) {
                console.error('[Posts] DB-Error: ', e.message || e.error.message);
                res.status(500).json({ status, error: 'The article could not be retrieved' });
            }
        }
    },

    deletePost: async (req, res) => {
        const status = 'error';
        const { params: { articleId } } = req;

        if (!articleId || Number.isNaN(articleId)) {
            return res.status(400).json({ status, error: "The article's unique-id is missing" });
        }

        try {
            const result = await db.query(`DELETE FROM posts WHERE post_type_id = ${postTypeId} AND id = $1 RETURNING title`, [articleId]);
            const reportMessage = result.rowCount < 0 ? 'not ' : '';

            res.status(200).json({ status: 'success', data: { message: `Article ${reportMessage}successfully deleted` } });
        } catch (e) {
            console.log('[Posts-Del] DB-Error: ', e.message || e.error.message);
            res.status(500).json({ status, error: 'The article could not be deleted' });
        }
    },
};
