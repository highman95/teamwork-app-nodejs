const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    },

    signIn: async (req, res) => {
        const { email, password } = req.body;

        if (email === undefined || email.trim() === '') {
            res.status(400).json({ status: 'error', error: 'E-mail address cannot be blank' });
        } else if (password === undefined || password.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Password cannot be blank' });
        } else {
            await db.query('SELECT id, first_name, password FROM users WHERE email = $1', [email], (error, result) => {
                if (error) {
                    res.status(500).json({ status: 'error', error: 'E-mail address verification failed' });
                } else if (result.rowCount == 0) {
                    res.status(404).json({ status: 'error', error: 'E-mail address cannot be found' });
                } else {
                    bcrypt.compare(password, result.rows[0].password, (err, same) => {
                        if (err) {
                            res.status(500).json({ status: 'error', error: 'Password verification failed' });
                        } else if (same) {
                            try {
                                const { id: userId, first_name: firstName } = result.rows[0];
                                const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h', subject: 'TeamWork-nodeJS' });

                                res.status(200).json({ status: 'success', data: { token, userId, firstName } });
                            } catch (error) {
                                res.status(401).json({ status: 'error', error });
                            }
                        } else {
                            res.status(401).json({ status: 'error', error: 'Invalid email and/or password' });
                        }
                    });
                }

                db.end();
            });
        }
    },
};
