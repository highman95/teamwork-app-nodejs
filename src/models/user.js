const bcrypt = require('bcrypt');
const modelDepartment = require('./department');
const modelRole = require('./role');
const { isValidEmail, validateParameters } = require('../utils/validation');

module.exports = {
  async create(firstName, lastName, email, password, gender, address, roleName, departmentName) {
    if ((await this.findByEmail(email)).id) throw new Error('E-mail address already exists');// 409

    const params = ['firstName', 'lastName', 'password', 'gender'];
    validateParameters({
      firstName, lastName, password, gender,
    }, params);

    const role = await modelRole.findByName(roleName);
    if (!role.id) throw new ReferenceError('Role does not exist');// 404

    const department = await modelDepartment.findByName(departmentName);
    if (!department.id) throw new ReferenceError('Department does not exist');// 404

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const input = [
        firstName, lastName, email, hashedPassword, gender, address, role.id, department.id,
      ];

      const result = await db.query('INSERT INTO users (first_name, last_name, email, password, gender, address, role_id, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', input);// eslint-disable-line no-undef
      return result.rows[0] || {};
    } catch (e) {
      throw new Error('User could not be saved');
    }
  },

  async authenticate(email, password) {
    if (!password || !password.trim()) throw new Error('Password cannot be blank');// 400

    try {
      const user = await this.findByEmail(email);
      const same = await bcrypt.compare(password, user.password);
      if (!same) throw new Error('Password does not match');

      return user;
    } catch (e) {
      throw new Error('Invalid e-mail / password');// 401
    }
  },

  findByEmail: async (email) => {
    if (!isValidEmail(email)) throw new Error('E-mail address is invalid');

    // eslint-disable-next-line no-undef
    const result = await db.query('SELECT id, first_name, last_name, email, password FROM users WHERE email = $1', [
      email,
    ]);
    return result.rows[0] || {};
  },
};
