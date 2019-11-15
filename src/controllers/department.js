const db = require('../configs/db');

module.exports = {
    getDepartments: (req, res) => {
        db.query('SELECT name FROM departments ORDER BY name')
            .then((results) => {
                res.status(200).json({ status: 'success', data: results.rows });
            }).catch(() => {
                res.status(400).json({ status: 'error', error: 'The departments cannot be retrieved' });
            });
    },
};
