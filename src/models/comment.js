module.exports = {
    async create(postId, comment, userId) {
        if (!comment || !comment.trim()) throw new Error('Comment/statement is missing');// 400
        if (!postId || Number.isNaN(postId)) throw new ReferenceError('Post does not exist');// 404
        if (!userId) throw new Error('User identifier is missing');// 400

        try {
            const inputs = [postId, comment, userId];
            const returnColumns = 'id, created_at';

            const result = await db.query(`INSERT INTO comments (post_id, comment, user_id) VALUES ($1, $2, $3) RETURNING ${returnColumns}`, inputs);// eslint-disable-line no-undef
            return result.rows[0] || {};
        } catch (e) {
            throw new Error('Comment could not be saved');
        }
    },

    fetchAll: async (postId) => {
        if (!postId || Number.isNaN(postId)) throw new ReferenceError('Post does not exist');// 404

        try {
            const results = await db.query('SELECT id, comment, user_id FROM comments WHERE post_id = $1', [postId]);// eslint-disable-line no-undef
            return results.rows;
        } catch (e) {
            throw new Error('Comment(s) could not be retrieved');
        }
    },
};
