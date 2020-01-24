const db = require('../configs/db');

module.exports = {
    getPosts: async (req, res) => {
        const { page = 1, chunk: limit = 10 } = req.query;

        try {
            const resultCount = await db.query(`SELECT COUNT(p.id) as total_count FROM posts p JOIN post_types pt ON pt.id = p.post_type_id`);
            const totalCount = resultCount.rows ? parseInt(resultCount.rows[0].total_count) : 0;

            const currentPage = parseInt(page);
            const offset = ((currentPage < 1 ? 1 : currentPage) - 1) * limit;
            const result = await db.query(`SELECT p.id, title, content, image_url, user_id, post_type_id, created_at, name FROM posts p JOIN post_types pt ON pt.id = p.post_type_id ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);

            const feeds = result.rows ? result.rows.map((row) => {
                const {
                    id, title, content: article, image_url: url, post_type_id: postTypeId,
                    user_id: authorId, created_at: createdOn, name: type,
                } = row;

                return {
                    id,
                    createdOn,
                    title,
                    ...(postTypeId === 1 ? { url } : { article }),
                    authorId,
                    type,
                };
            }) : [];

            const pages = limit < 1 ? 1 : Math.ceil(totalCount / limit)
            const meta = { currentPage, pages, totalCount }
            res.status(200).json({ status: 'success', data: feeds, meta });
        } catch (e) {
            console.error('[Feed] DB-Error', e.message || e.error.message);
            res.status(500).json({ status: 'error', error: 'The article/gif posts could not be retrieved' });
        }
    },
};
