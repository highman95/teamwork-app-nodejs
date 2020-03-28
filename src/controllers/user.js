const model = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h', subject: 'TeamWork-nodeJS' });

module.exports = {
    createOne: async (req, res, next) => {
        const {
            firstName, lastName, email, password, gender, address, jobRole, department,
        } = req.body;

        try {
            const user = await model.create(firstName, lastName, email, password, gender, address, jobRole, department);
            const token = generateToken({ userId: user.id });

            res.status(201).json({ status: 'success', data: { message: 'User account successfully created', token, userId: user.id } });
        } catch (e) {
            // console.error('Error:', e.message || e.error.message);
            next(e)
        }
    },

    signIn: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await model.verify(email, password);
            const { id: userId, first_name: firstName } = user;
            const token = generateToken({ userId });

            res.status(200).json({ status: 'success', data: { token, userId, firstName } });
        } catch (e) {
            e.message = e.message || 'E-mail address verification failed';
            next(e)
        }
    },
};
