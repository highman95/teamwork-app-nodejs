exports.create = async function (postId, comment, userId) {
  if (!comment || !comment.trim()) {
    throw new Error('Comment/statement is missing'); // 400
  }

  if (!postId || Number.isNaN(postId)) {
    throw new ReferenceError('Post does not exist'); // 404
  }

  if (!userId) throw new Error('User identifier is missing'); // 400

  try {
    const inputs = [postId, comment, userId];
    const returnColumns = 'id, created_at';

    // eslint-disable-next-line no-undef
    const result = await db.query(
      `INSERT INTO comments (post_id, comment, user_id) VALUES ($1, $2, $3) RETURNING ${returnColumns}`,
      inputs
    );
    return result.rows[0] || {};
  } catch (e) {
    throw new Error('Comment could not be saved');
  }
};

exports.fetchAll = async (postId) => {
  if (!postId || Number.isNaN(postId))
    throw new ReferenceError('Post does not exist'); // 404

  try {
    // eslint-disable-next-line no-undef
    const results = await db.query(
      'SELECT id, comment, user_id FROM comments WHERE post_id = $1',
      [postId]
    );
    return results.rows;
  } catch (e) {
    throw new Error('Comment(s) could not be retrieved');
  }
};
