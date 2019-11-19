const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db');

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h', subject: 'TeamWork-nodeJS' });

module.exports = {
    createOne: (req, res) => {
        const {
            firstName, lastName, email, password, gender, address, jobRole, department,
        } = req.body;

        if (firstName === null || firstName === undefined || firstName.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: firstName' });
        } else if (lastName === null || lastName === undefined || lastName.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: lastName' });
        } else if (email === null || email === undefined || email.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: email address' });
        } else if (password === null || password === undefined || password.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: password' });
        } else if (gender === null || gender === undefined || gender.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: gender' });
        } else if (jobRole === null || jobRole === undefined || jobRole.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: jobRole' });
        } else if (department === null || department === undefined || department.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Missing required parameter: department' });
        } else {
            db.query('SELECT id FROM roles WHERE LOWER(name) = $1', [jobRole.toLowerCase()]).then((roleDb) => {
                if (roleDb.rowCount === 0) {
                    res.status(404).json({ status: 'error', error: 'Role does not exist' });
                } else {
                    db.query('SELECT id FROM departments WHERE LOWER(name) = $1', [department.toLowerCase()]).then((departmentDb) => {
                        if (departmentDb.rowCount === 0) {
                            res.status(404).json({ status: 'error', error: 'Department does not exist' });
                        } else {
                            bcrypt.hash(password, 10).then((hashedPassword) => {
                                const roleId = roleDb.rows[0].id;
                                const departmentId = departmentDb.rows[0].id;
                                const input = [
                                    firstName, lastName, email, hashedPassword, gender,
                                    address, roleId, departmentId,
                                ];

                                db.query('INSERT INTO users (first_name, last_name, email, password, gender, address, role_id, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', input).then((result) => {
                                    try {
                                        const { id: userId } = result.rows[0];
                                        const token = generateToken({ userId });

                                        res.status(201).json({ status: 'success', data: { message: 'User account successfully created', token, userId } });
                                    } catch (e2) {
                                        console.error(e2.message || e2.error.message);
                                        res.status(500).json({ status: 'error', error: 'The new user-account token could not be generated' });
                                    }
                                }).catch(() => {
                                    res.status(400).json({ status: 'error', error: 'The user information could not be saved' });
                                });
                            }).catch(() => {
                                res.status(500).json({ status: 'error', error: 'The password could not be encrypted' });
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
                } else if (result.rowCount === 0) {
                    res.status(404).json({ status: 'error', error: 'E-mail address cannot be found' });
                } else {
                    bcrypt.compare(password, result.rows[0].password, (err, same) => {
                        if (err) {
                            console.error(err.message || err.error.message);
                            res.status(500).json({ status: 'error', error: 'Password verification failed' });
                        } else if (same) {
                            try {
                                const { id: userId, first_name: firstName } = result.rows[0];
                                const token = generateToken({ userId });

                                res.status(200).json({ status: 'success', data: { token, userId, firstName } });
                            } catch (e2) {
                                console.error('', e2.message || e2.error.message);
                                res.status(500).json({ status: 'error', error: 'Personal information could not be retrieved' });
                            }
                        } else {
                            res.status(401).json({ status: 'error', error: 'Invalid email and/or password' });
                        }
                    });
                }
            });
        }
    },
};
