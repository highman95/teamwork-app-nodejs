/* eslint-disable no-undef */
const userService = require('../../src/models/user');

describe('User-Service Test Suite', () => {
  const account = {
    firstName: 'Mark',
    lastName: 'Spencer',
    email: `mark.spencer-${Date.now()}@oc.com`,
    password: 'markspencer',
    gender: 'male',
    address: '',
    jobRole: 'staff',
    department: 'Engineering',
  };

  describe('Create User', () => {
    let email = '';

    beforeEach(() => {
      email = `mark.spencer-${Date.now()}@oc.com`;
    });

    describe('E-mail is not specified', () => {
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

    describe('User-details are valid/correct', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(
            account.firstName,
            account.lastName,
            account.email,
            account.password,
            account.gender,
            account.address,
            account.jobRole,
            account.department,
          )
          .then((result) => {
            responseBox = result;
            done();
          });
      });

      it('should return the user-id', () => expect(responseBox.id).toBeDefined());
    });

    describe('First-name is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(null, account.lastName, email, null, null, null, null, null)
          .catch((error) => {
            responseBox = error;
            done();
          });
      });

      it('should return error message', () => expect(responseBox.message).toBe('FirstName cannot be empty (required)'));
    });

    describe('Last-name is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(account.firstName, null, email, null, null, null, null, null)
          .catch((error) => {
            responseBox = error;
            done();
          });
      });

      it('should return error message', () => expect(responseBox.message).toBe('LastName cannot be empty (required)'));
    });

    describe('Password is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(account.firstName, account.lastName, email, '', account.gender, account.address, account.jobRole, account.department)
          .catch((error) => {
            responseBox = error;
            done();
          });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Password cannot be empty (required)'));
    });

    describe('Gender is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(
            account.firstName,
            account.lastName,
            email,
            account.password,
            null,
            account.address,
            null,
            null,
          )
          .catch((error) => {
            responseBox = error;
            done();
          });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Gender cannot be empty (required)'));
    });

    describe('Role is not valid', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(account.firstName, account.lastName, email, account.password, account.gender, account.address, 'enjoyment-officer', null)
          .catch((error) => {
            responseBox = error;
            done();
          });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Role does not exist'));
    });

    describe('Department is not valid', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService
          .create(account.firstName, account.lastName, email, account.password, account.gender, account.address, account.jobRole, 'enjoyment-dept')
          .catch((error) => {
            responseBox = error;
            done();
          });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Department does not exist'));
    });
  });

  describe('Authenticate User', () => {
    describe('Password is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.authenticate(null, null).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Password cannot be blank'));
    });

    describe('Username/E-mail is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.authenticate(null, 'passw3rd').catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Invalid e-mail / password'));
    });

    describe('Password is incorrect', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.authenticate(account.email, `${account.password}12`).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Invalid e-mail / password'));
    });

    describe('Valid credentials are specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.authenticate(account.email, account.password).then((result) => {
          responseBox = result;
          done();
        });
      });

      it('should return the same e-mail', () => expect(responseBox.email).toBe(account.email));
      it('should return the user\'s first-name', () => expect(responseBox.first_name).toBe(account.firstName));
      it('should return the user\'s last-name', () => expect(responseBox.last_name).toBe(account.lastName));
      it('should return the user-id', () => expect(responseBox.id).toBeDefined());
      it('should return the user\'s password', () => expect(responseBox.password).toBeDefined());
    });
  });

  describe('Find User By E-mail', () => {
    describe('E-mail is not valid', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.findByEmail('geek@').catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('E-mail address is invalid'));
    });

    describe('E-mail is not registered', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.findByEmail(`geek-${Date.now()}@getnada.com`).then((result) => {
          responseBox = result;
          done();
        });
      });

      it('should return empty-object', () => expect(responseBox).toEqual({}));
    });

    describe('E-mail is valid/registered', () => {
      let responseBox = {};

      beforeAll((done) => {
        userService.findByEmail(account.email).then((result) => {
          responseBox = result;
          done();
        });
      });

      it('should return same e-mail', () => expect(responseBox.email).toEqual(account.email));
      it('should return the first-name', () => expect(responseBox.first_name).toEqual(account.firstName));
      it('should return the last-name', () => expect(responseBox.last_name).toEqual(account.lastName));
      it('should return the user-id', () => expect(responseBox.id).toBeDefined());
    });
  });
});
