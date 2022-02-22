module.exports = {
  types: {
    GIF_POST: 1,
    ARTICLE_POST: 2,
  },

  async create(postTypeId, title, content, imageUrl, userId) {
    if (!title) throw new Error('Title is missing');// 400
    if (!userId) throw new Error('User identifier is missing');// 400

    try {
      const inputs = [title, content, imageUrl, postTypeId, userId];
      const returnColumns = 'id, title, content, image_url, created_at';

      const result = await db.query(`INSERT INTO posts (title, content, image_url, post_type_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING ${returnColumns}`, inputs);// eslint-disable-line no-undef
      return result.rows[0] || {};
    } catch (e) {
      throw new Error('Post could not be saved');// 500
    }
  },

  update: async (postTypeId, id, title, content) => {
    if (!title) throw new Error('Title is missing');// 400
    if (!id || Number.isNaN(id)) throw new ReferenceError('Post does not exist');// 404

    try {
      const result = await db.query('UPDATE posts SET title = $1, content = $2 WHERE post_type_id = $3 AND id = $4 RETURNING id', [title, content, postTypeId, id]);// eslint-disable-line no-undef
      return result.rows[0] || {};
    } catch (e) {
      throw new Error('Post changes could not be saved');// 500
    }
  },

  delete: async (postTypeId, id) => {
    if (!id || Number.isNaN(id)) throw new ReferenceError('Post does not exist');// 404

    try {
      const result = await db.query(`DELETE FROM posts WHERE post_type_id = ${postTypeId} AND id = $1 RETURNING title`, [id]);// eslint-disable-line no-undef
      return result.rows[0] || {};
    } catch (e) {
      throw new Error('Post could not be deleted');// 500
    }
  },

  fetchAll: async (postTypeId, page = 1, chunk = 10) => {
    const limit = (chunk && Number.isNaN(chunk)) ? 10 : chunk;

    const where = postTypeId ? 'AND post_type_id = $1' : '';
    const filter = postTypeId ? [postTypeId] : [];

    const currentPage = parseInt(page, 10);
    const offset = ((currentPage < 1 ? 1 : currentPage) - 1) * limit;

    try {
      const result = await db.query(`SELECT id, title, content, image_url, user_id, post_type_id, created_at FROM posts WHERE 1 = 1 ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, filter);// eslint-disable-line no-undef
      return result.rows;
    } catch (e) {
      throw new Error('Post(s) could not be retrieved');
    }
  },

  fetchCount: async (postTypeId) => {
    const where = postTypeId ? 'AND post_type_id = $1' : '';
    const filter = postTypeId ? [postTypeId] : [];

    const result = await db.query(`SELECT COUNT(id) as total_count FROM posts WHERE 1 = 1 ${where}`, filter);// eslint-disable-line no-undef
    return result.rows ? parseInt(result.rows[0].total_count, 10) : 0;
  },

  find: async (postTypeId, id) => {
    if (!postTypeId) throw new Error('Post-type identifier is missing');// 400
    if (!id || Number.isNaN(id)) throw new ReferenceError('Post does not exist');// 404

    try {
      const result = await db.query('SELECT id, title, content, image_url, created_at FROM posts WHERE post_type_id = $1 AND id = $2', [postTypeId, id]);// eslint-disable-line no-undef
      return result.rows[0] || {};
    } catch (e) {
      throw new Error('Post could not be retrieved');
    }
  },
};
