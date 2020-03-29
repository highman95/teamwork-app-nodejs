const modelPost = require('../models/post');

module.exports = {
    getPosts: async (req, res, next) => {
        const { page = 1, chunk: limit = 10 } = req.query;

        try {
            const totalCount = await modelPost.fetchCount();
            let feeds = await modelPost.fetchAll(null, page, limit);

            feeds = feeds ? feeds.map(row => {
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
            const meta = { page, pages, totalCount }
            res.status(200).json({ status: 'success', data: feeds, meta });
        } catch (e) {
            next(e)
        }
    },
};
