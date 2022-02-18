/* eslint-disable no-undef */
const userService = require('../../src/models/user');

describe('User-Service Test Suite', () => {
  beforeAll(() => {});

  describe('Create User', () => {
    describe('e-mail is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(null, null, null, null, null, null, null, null)
          .catch((error) => {
            responseBox = error;
            done();
          });
      });

      it('should return error message', () => expect(responseBox.message).toBe('E-mail address is invalid'));
    });
  });

  describe('Authenticate User', () => {
    describe('password is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.authenticate(null, null).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Password cannot be blank'));
    });

    describe('username/e-mail is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.authenticate(null, 'passw3rd').catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Invalid e-mail / password'));
    });
  });
});
