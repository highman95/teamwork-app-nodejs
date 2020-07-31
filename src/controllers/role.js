const model = require('../models/role');

module.exports = {
    getRoles: async (req, res) => {
        const roles = await model.fetchAll();
        res.status(200).json({ status: 'success', data: roles });
    },
};
