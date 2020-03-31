module.exports = {
    fetchAll: async () => {
        const results = await db.query('SELECT id, name FROM roles ORDER BY name');
        return results.rows;
    },

    findByName: async (name) => {
        if (!name) throw new Error('Role cannot be empty');// 400

        const result = await db.query('SELECT id, name FROM roles WHERE LOWER(name) = $1', [name.toLowerCase()]);
        return result.rows[0] || {};
    },
};
