const model = require('../models/role');

exports.getRoles = async (_req, res) => {
  const roles = await model.fetchAll();
  res.status(200).json({ status: 'success', data: roles });
};
