/* eslint-disable no-undef */
const departmentService = require('../../src/models/department');

describe('Department-Service Test Suite', () => {
  describe('Find Department', () => {
    describe('Name is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        departmentService.findByName(null).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Department cannot be empty'));
    });
  });
});
