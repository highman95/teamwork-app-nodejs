module.exports = {
    fetchAll: async () => {
        const results = await db.query('SELECT id, name FROM departments ORDER BY name');// eslint-disable-line no-undef
        return results.rows;
    },

    findByName: async (name) => {
        if (!name) throw new Error('Department cannot be empty');// 400

        const result = await db.query('SELECT id, name FROM departments WHERE LOWER(name) = $1', [name.toLowerCase()]);// eslint-disable-line no-undef
        return result.rows[0] || {};
    },
};
