const model = require('../models/user');
const { generateToken } = require('../utils/security');

module.exports = {
  createOne: async (req, res, next) => {
    const {
      firstName, lastName, email, password, gender, address, jobRole, department,
    } = req.body;

    try {
      const user = await model.create(
        firstName,
        lastName,
        email,
        password,
        gender,
        address,
        jobRole,
        department
      );
      const token = generateToken(user);

      res.status(201).json({
        status: 'success',
        data: {
          message: 'User account successfully created',
          token,
          userId: user.id,
        },
      });
    } catch (e) {
      next(e);
    }
  },

  signIn: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await model.authenticate(email, password);
      const token = generateToken(user);

      res.status(200).json({
        status: 'success',
        data: {
          token,
          userId: user.id,
          firstName: user.first_name,
        },
      });
    } catch (e) {
      next(e);
    }
  },
};
