const bcrypt = require('bcrypt');
const db = require('../configs/db');

module.exports = {
    createOne: (req, res) => {
        const { first_name, last_name, email, password, gender, address, role, department } = req.body;

        if (first_name === null || first_name === undefined || first_name.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: first name' });
        } else {
            if (last_name === null || last_name === undefined || last_name.trim() === '') {
                res.status(400).json({ status: 'error', error: 'Missing required parameter: last name' });
            } else {
                if (email === null || email === undefined || email.trim() === '') {
                    res.status(400).json({ status: 'error', error: 'Missing required parameter: email address' });
                } else {
                    if (password === null || password === undefined || password.trim() === '') {
                        res.status(400).json({ status: 'error', error: 'Missing required parameter: password' });
                    } else {
                        if (gender === null || gender === undefined || gender.trim() === '') {
                            res.status(400).json({ status: 'error', error: 'Missing required parameter: gender' });
                        } else {
                            if (role === null || role === undefined || role.trim() === '') {
                                res.status(400).json({ status: 'error', error: 'Missing required parameter: role' });
                            } else {
                                if (department === null || department === undefined || department.trim() === '') {
                                    res.status(400).json({ status: 'error', error: 'Missing required parameter: department' });
                                } else {
                                    db.query('SELECT id FROM roles WHERE LOWER(name) = $1', [role.toLowerCase()]).then(roleDb => {
                                        if (roleDb.rowCount == 0) {
                                            res.status(404).json({ status: 'error', error: 'Role does not exist' });
                                        } else {
                                            db.query('SELECT id FROM departments WHERE LOWER(name) = $1', [department.toLowerCase()]).then(departmentDb => {
                                                if (departmentDb.rowCount == 0) {
                                                    res.status(404).json({ status: 'error', error: 'Department does not exist' });
                                                } else {
                                                    bcrypt.hash(password, 10).then(hashedPassword => {
                                                        const input = [first_name, last_name, email, hashedPassword, gender, address, roleDb.rows[0].id, departmentDb.rows[0].id];

                                                        db.query("INSERT INTO users (first_name, last_name, email, password, gender, address, role_id, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", input).then(result => {
                                                            res.status(201).json({ status: 'success', data: result.rows })
                                                        }).catch(error => {
                                                            res.status(400).json({ status: 'error', error: 'The user information could not be saved' + error.detail });
                                                        });
                                                    }).catch(error => {
                                                        res.status(500).json({ status: 'error', error: 'The password could not be encrpted' });
                                                    });
                                                }
                                            }).catch(() => {
                                                res.status(500).json({ status: 'error', error: 'Department details cannot be retrieved' });
                                            });
                                        }
                                    }).catch(() => {
                                        res.status(500).json({ status: 'error', error: 'Role details cannot be retrieved' });
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
