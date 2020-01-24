const db = require('../configs/db');

module.exports = {
    getRoles: (req, res) => {
        db.query('SELECT name FROM roles ORDER BY name')
            .then((results) => {
                res.status(200).json({ status: 'success', data: results.rows });
            }).catch(() => {
                res.status(400).json({ status: 'error', error: 'The roles could not be retrieved' });
            });
    },
};
