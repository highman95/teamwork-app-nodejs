/* eslint-disable no-undef */
const roleService = require('../../src/models/role');

describe('Role-Service Test Suite', () => {
  describe('Find Role', () => {
    describe('Name is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        roleService.findByName(null).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Role cannot be empty'));
    });
  });
});
