/* eslint-disable no-undef */
const request = require('request');
const server = require('../../src/index');
const { generateToken, verifyToken } = require('../../src/utils/security');

describe('UserController Test Suite', () => {
  let baseUrl;
  const testData = {
    firstName: 'Mark',
    lastName: 'Spencer',
    email: `mark.spencer-${Date.now()}@oc.com`,
    password: 'markspencer',
    gender: 'male',
    address: '',
    jobRole: 'staff',
    department: 'Engineering',
  };

  beforeAll(() => {
    const { address, port } = server.address();
    const hostName = address === '::' ? `http://localhost:${port}` : address;
    baseUrl = `${hostName}/api/v1/auth`;
  });

  afterAll((done) => server.close(done));

  describe('POST /auth/create-user', () => {
    let endPoint;
    let options = {};

    beforeAll(() => {
      endPoint = `${baseUrl}/create-user`;
      options = { headers: { token: generateToken({ id: 1 }) } };
    });

    describe('Role is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            form: { ...testData, jobRole: '' },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () =>
        expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Role cannot be empty'));
    });

    describe('Department is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            form: { ...testData, department: '' },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () =>
        expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Department cannot be empty'));
    });

    describe('A non-existing role is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            form: { ...testData, jobRole: 'xyz' },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 404', () =>
        expect(responseBox.response.statusCode).toBe(404));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Role does not exist'));
    });

    describe('A non-existing department is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            form: { ...testData, department: 'xyz' },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 404', () =>
        expect(responseBox.response.statusCode).toBe(404));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Department does not exist'));
    });

    describe('All required parameters are sent', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            form: testData,
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 201', () =>
        expect(responseBox.response.statusCode).toBe(201));
      it('should return success status', () =>
        expect(responseBox.body.status).toBe('success'));
      it('should return success message', () =>
        expect(responseBox.body.data.message).toBeDefined());
      it('should return an authentication token', () =>
        expect(responseBox.body.data.token).toBeDefined());
      it("should return the new user's valid unique-identifier", () => {
        // verify token with expected value
        let isValidNewUser;
        try {
          const decodedToken = verifyToken(responseBox.body.data.token);
          isValidNewUser = decodedToken.userId === responseBox.body.data.userId;
        } catch (e) {
          isValidNewUser = false;
        }

        expect(isValidNewUser).toBeTruthy();
      });
    });
  });

  describe('POST /auth/signin', () => {
    let endPoint;
    const testCredentials = {
      email: testData.email,
      password: testData.password,
    };

    beforeAll(() => {
      endPoint = `${baseUrl}/signin`;
    });

    describe('E-mail input is blank', () => {
      let responseBox;

      beforeAll((done) => {
        request.post(
          endPoint,
          { form: { ...testCredentials, email: '' }, json: true },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () =>
        expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Invalid e-mail / password'));
    });

    describe('An invalid email is supplied', () => {
      let responseBox;

      beforeAll((done) => {
        request.post(
          endPoint,
          {
            form: { ...testCredentials, email: 'i-do-code@me.com' },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () =>
        expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Invalid e-mail / password'));
    });

    describe('Blank password is supplied', () => {
      let responseBox;

      beforeAll((done) => {
        request.post(
          endPoint,
          { form: { ...testCredentials, password: '' }, json: true },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () =>
        expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Password cannot be blank'));
    });

    describe('Incorrect password is supplied', () => {
      let responseBox;

      beforeAll((done) => {
        request.post(
          endPoint,
          {
            form: { ...testCredentials, password: `${testData.password}-xyz` },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () =>
        expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () =>
        expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () =>
        expect(responseBox.body.error).toBe('Invalid e-mail / password'));
    });

    describe('Valid credentials are supplied', () => {
      let responseBox;

      beforeAll((done) => {
        request.post(
          endPoint,
          { form: testCredentials, json: true },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it('should return statusCode 200', () =>
        expect(responseBox.response.statusCode).toBe(200));
      it('should return success status', () =>
        expect(responseBox.body.status).toBe('success'));
      it('should return an authentication token', () =>
        expect(responseBox.body.data.token).toBeDefined());
      it('should return a valid user-id', () => {
        // verify token with expected value
        let isValidUser;
        try {
          const decodedToken = verifyToken(responseBox.body.data.token);
          isValidUser = decodedToken.userId === responseBox.body.data.userId;
        } catch (e) {
          isValidUser = false;
        }

        expect(isValidUser).toBeTruthy();
      });
    });
  });

  describe('GET /auth/undefined (access undefined route)', () => {
    let responseBox;

    beforeAll((done) => {
      request.get(
        { url: `${baseUrl}/undefined`, json: true },
        (error, response, body) => {
          responseBox = { error, response, body };
          done();
        }
      );
    });

    it('should return statusCode 404', () =>
      expect(responseBox.response.statusCode).toBe(404));
    it('should return error status', () =>
      expect(responseBox.body.status).toBe('error'));
    it('should return a relevant error message', () =>
      expect(responseBox.body.error).toBe('Page no longer exists'));
  });
});
