const model = require('../models/department');

module.exports = {
    getDepartments: async (req, res) => {
        const departments = await model.fetchAll();
        res.status(200).json({ status: 'success', data: departments });
    },
};
