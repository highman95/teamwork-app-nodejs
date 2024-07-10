const model = require("../models/department");

exports.getDepartments = async (_req, res) => {
  const departments = await model.fetchAll();
  res.status(200).json({ status: "success", data: departments });
};
