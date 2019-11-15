require('dotenv').config();

const request = require('request');
const jwt = require('jsonwebtoken');
const baseUrl = "http://localhost:3500/api/v1";

describe('UserController Test Suite', () => {
    let endPoint;

    beforeAll(() => { });

    afterAll(() => { });

    describe('POST /auth/create-user', () => {
        let testData;
        let options = {};

        beforeAll(() => {
            endPoint = baseUrl + '/auth/create-user';

            const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
            options = { headers: { token } };
        });

        beforeEach(() => {
            let data = {
                firstName: 'Mark',
                lastName: 'Spencer',
                email: 'mark.spencer-' + Date.now() + '@oc.com',
                password: 'markspencer',
                gender: 'male',
                address: '',
                jobRole: 'staff',
                department: 'Engineering'
            };

            testData = Object.assign({}, data);
        });

        describe('role is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.jobRole = '';

                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('department is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.department = '';

                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('a non-existing role is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.jobRole = 'xyz';
                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('a non-existing department is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.department = 'xyz';
                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(realBody.status).toBe('error'));
        });

        describe('all required parameters are sent', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
                done();
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the new user\'s unique-identifier', () => expect(responseBox.body.data.userId).toBeDefined());
        });
    });

    describe('POST /auth/signin', () => {
        let testCredentials;

        beforeAll(() => {
            endPoint = baseUrl + '/auth/signin';
        });

        beforeEach(() => {
            data = {
                email: 'mark.spencer-1573098608494@oc.com',
                password: 'markspencer'
            };

            testCredentials = Object.assign({}, data);
        });

        describe('email input is blank', () => {
            let responseBox;

            beforeAll((done) => {
                testCredentials.email = '';

                request.post(endPoint, { form: testCredentials }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('an invalid email is supplied', () => {
            let responseBox;

            beforeAll((done) => {
                testCredentials.email = 'i-do-code@me.com';

                request.post(endPoint, { form: testCredentials }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('blank(invalid) password is supplied', () => {
            let responseBox;

            beforeAll((done) => {
                testCredentials.password = '';

                request.post(endPoint, { form: testCredentials }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('valid credentials are supplied', () => {
            let responseBox;

            beforeAll((done) => {
                request.post(endPoint, { form: testCredentials }, (error, response, body) => {
                    responseBox = { error, response, body: JSON.parse(body) };
                    done();
                });
            });

            const isValidUser;
            try {
                const decodedToken = jwt.verify(responseBox.body.data.token, process.env.JWT_SECRET);
                isValidUser = (decodedToken.userId === realBody.data.userId);
            } catch (e) {
                isValidUser = false;
            }

            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return an authentication token', () => expect(responseBox.body.data.token).toBeDefined());
            it('should return a valid user-id', () => expect(isValidUser).toBeTruthy());// verify token with expected value
        });
    });
});
