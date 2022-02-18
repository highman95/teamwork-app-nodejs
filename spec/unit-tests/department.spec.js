/* eslint-disable no-undef */
const departmentService = require('../../src/models/department');

describe('Gif-Service Test Suite', () => {
  beforeAll(() => {});

  describe('Find Department', () => {
    describe('name is not specified', () => {
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
