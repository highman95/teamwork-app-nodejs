/* eslint-disable no-undef */
const roleService = require('../../src/models/role');

describe('Role-Service Test Suite', () => {
  describe('Find Role', () => {
    describe('Name is not specified', () => {
      it('should return error message', (done) => {
        roleService.findByName(null).catch((error) => {
          expect(error.message).toBe('Role cannot be empty');
          done();
        });
      });
    });
  });
});
