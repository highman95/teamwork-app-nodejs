/* eslint-disable no-undef */
const request = require('request');
const jwt = require('jsonwebtoken');
const server = require('../../src/index');

describe('UserController Test Suite', () => {
  let baseUrl;
  let testCredentialsX = {};

  beforeAll(() => {
    const { address, port } = server.address();
    const hostName = address === '::' ? `http://localhost:${port}` : '';
    baseUrl = `${hostName}/api/v1/auth`;

    testCredentialsX = {
      email: `mark.spencer-${Date.now()}@oc.com`,
      password: 'markspencer',
    };
  });

  afterAll((done) => server.close(done));

  describe('POST /auth/create-user', () => {
    let testData = {};
    let options = {};

    beforeAll(() => {
      endPoint = `${baseUrl}/create-user`;

      const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
      options = { headers: { token } };
    });

    beforeEach(() => {
      const data = {
        firstName: 'Mark',
        lastName: 'Spencer',
        ...testCredentialsX,
        gender: 'male',
        address: '',
        jobRole: 'staff',
        department: 'Engineering',
      };

      testData = { ...data };
    });

    describe('role is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        testData.jobRole = '';

        request.post({
          url: endPoint, ...options, form: testData, json: true,
        }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
    });

    describe('department is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        testData.department = '';

        request.post({
          url: endPoint, ...options, form: testData, json: true,
        }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
    });

    describe('a non-existing role is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        testData.jobRole = 'xyz';

        request.post({
          url: endPoint, ...options, form: testData, json: true,
        }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
    });

    describe('a non-existing department is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        testData.department = 'xyz';

        request.post({
          url: endPoint, ...options, form: testData, json: true,
        }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
    });

    describe('all required parameters are sent', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post({
          url: endPoint, ...options, form: testData, json: true,
        }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
      it('should return success status', () => expect(responseBox.body.status).toBe('success'));
      it('should return success message', () => expect(responseBox.body.data.message).toBeDefined());
      it('should return an authentication token', () => expect(responseBox.body.data.token).toBeDefined());
      it('should return the new user\'s valid unique-identifier', () => { // verify token with expected value
        let isValidNewUser;
        try {
          const decodedToken = jwt.verify(responseBox.body.data.token, process.env.JWT_SECRET);
          isValidNewUser = (decodedToken.userId === responseBox.body.data.userId);
        } catch (e) {
          isValidNewUser = false;
        }

        expect(isValidNewUser).toBeTruthy();
      });
    });
  });

  describe('POST /auth/signin', () => {
    let testCredentials = {};

    beforeAll(() => {
      endPoint = `${baseUrl}/signin`;
    });

    beforeEach(() => {
      testCredentials = { ...testCredentialsX };
    });

    describe('email input is blank', () => {
      let responseBox;

      beforeAll((done) => {
        testCredentials.email = '';

        request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
    });

    describe('an invalid email is supplied', () => {
      let responseBox;

      beforeAll((done) => {
        testCredentials.email = 'i-do-code@me.com';

        request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
    });

    describe('blank(invalid) password is supplied', () => {
      let responseBox;

      beforeAll((done) => {
        testCredentials.password = '';

        request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
    });

    describe('valid credentials are supplied', () => {
      let responseBox;

      beforeAll((done) => {
        request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
          responseBox = { error, response, body };
          done();
        });
      });


      it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
      it('should return success status', () => expect(responseBox.body.status).toBe('success'));
      it('should return an authentication token', () => expect(responseBox.body.data.token).toBeDefined());
      it('should return a valid user-id', () => { // verify token with expected value
        let isValidUser;
        try {
          const decodedToken = jwt.verify(responseBox.body.data.token, process.env.JWT_SECRET);
          isValidUser = (decodedToken.userId === responseBox.body.data.userId);
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
      request.get({ url: `${baseUrl}/undefined`, json: true }, (error, response, body) => {
        responseBox = { error, response, body };
        done();
      });
    });

    it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
    it('should return error status', () => expect(responseBox.body.status).toBe('error'));
    it('should return a relevant error message', () => expect(responseBox.body.error).toBe('Page no longer exists'));
  });
});
