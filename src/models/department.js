module.exports = {
    fetchAll: async () => {
        const results = await db.query('SELECT id, name FROM departments ORDER BY name');
        return results.rows;
    },

    findByName: async (name) => {
        if (!name) throw new Error('Department does not exist');//404

        const result = await db.query('SELECT id, name FROM departments WHERE LOWER(name) = $1', [name.toLowerCase()]);
        return result.rows[0] || null;
    }
};