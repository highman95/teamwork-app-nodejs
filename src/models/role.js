module.exports = {
  fetchAll: async () => {
    const results = await db.query('SELECT id, name FROM roles ORDER BY name'); // eslint-disable-line no-undef
    return results.rows;
  },

  findByName: async (name) => {
    if (!name || !name.trim()) throw new Error('Role cannot be empty'); // 400

    // eslint-disable-next-line no-undef
    const result = await db.query(
      'SELECT id, name FROM roles WHERE LOWER(name) = $1',
      [name.toLowerCase()]
    );
    return result.rows[0] || {};
  },
};
