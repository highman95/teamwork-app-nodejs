const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db');

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h', subject: 'TeamWork-nodeJS' });

module.exports = {
    createOne: async (req, res) => {
        const {
            firstName, lastName, email, password, gender, address, jobRole, department,
        } = req.body;

        if (!firstName || firstName.trim() === '') {
            res.status(400).json({ status: 'error', error: 'FirstName is missing' });
        } else if (!lastName || lastName.trim() === '') {
            res.status(400).json({ status: 'error', error: 'LastName is missing' });
        } else if (!email || email.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Email-address is missing' });
        } else if (!password || password.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Password is missing' });
        } else if (!gender || gender.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Gender is missing' });
        } else if (!jobRole || jobRole.trim() === '') {
            res.status(400).json({ status: 'error', error: 'JobRole is missing' });
        } else if (!department || department.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Department is missing' });
        } else {
            try {
                const resultR = await db.query('SELECT id FROM roles WHERE LOWER(name) = $1', [jobRole.toLowerCase()]);

                if (resultR.rowCount === 0) {
                    return res.status(404).json({ status: 'error', error: 'Role does not exist' });
                }

                try {
                    const resultD = await db.query('SELECT id FROM departments WHERE LOWER(name) = $1', [department.toLowerCase()]);

                    if (resultD.rowCount === 0) {
                        return res.status(404).json({ status: 'error', error: 'Department does not exist' });
                    }

                    try {
                        const roleId = resultR.rows[0].id;
                        const departmentId = resultD.rows[0].id;

                        const hashedPassword = await bcrypt.hash(password, 10);
                        const input = [
                            firstName, lastName, email, hashedPassword, gender,
                            address, roleId, departmentId,
                        ];

                        try {
                            const result = await db.query('INSERT INTO users (first_name, last_name, email, password, gender, address, role_id, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', input);
                            
                            try {
                                const { id: userId } = result.rows[0];
                                const token = generateToken({ userId });

                                res.status(201).json({ status: 'success', data: { message: 'User account successfully created', token, userId } });
                            } catch (e5) {
                                console.error(e5.message || e5.error.message);
                                res.status(500).json({ status: 'error', error: 'The new user-account token could not be generated' });
                            }
                        } catch (e4) {
                            console.error(e4.message || e4.error.message);
                            res.status(500).json({ status: 'error', error: 'The user information could not be saved' });
                        }
                    } catch (e3) {
                        console.error(e3.message || e3.error.message);
                        res.status(500).json({ status: 'error', error: 'The password could not be encrypted' });
                    }
                } catch (e2) {
                    console.error(e2.message || e2.error.message);
                    res.status(500).json({ status: 'error', error: 'Department details cannot be retrieved' });
                }
            } catch (e) {
                res.status(500).json({ status: 'error', error: 'Role details cannot be retrieved' });
            }
        }
    },

    signIn: async (req, res) => {
        const { email, password } = req.body;

        if (!email || email.trim() === '') {
            res.status(400).json({ status: 'error', error: 'E-mail address cannot be blank' });
        } else if (!password || password.trim() === '') {
            res.status(400).json({ status: 'error', error: 'Password cannot be blank' });
        } else {
            try {
                const result = await db.query('SELECT id, first_name, password FROM users WHERE email = $1', [email]);

                if (result.rowCount === 0) {
                    return res.status(404).json({ status: 'error', error: 'E-mail address cannot be found' });
                }

                try {
                    const same = await bcrypt.compare(password, result.rows[0].password);

                    if (!same) {
                        return res.status(401).json({ status: 'error', error: 'Invalid email and/or password' });
                    }

                    const { id: userId, first_name: firstName } = result.rows[0];
                    const token = generateToken({ userId });

                    res.status(200).json({ status: 'success', data: { token, userId, firstName } });
                } catch (e2) {
                    console.error('', e2.message || e2.error.message);
                    res.status(500).json({ status: 'error', error: 'Password verification failed' });
                }
            } catch (error) {
                res.status(500).json({ status: 'error', error: 'E-mail address verification failed' });
            }
        }
    },
};
