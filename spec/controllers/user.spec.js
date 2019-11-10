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

        beforeAll(() => {
            endPoint = baseUrl + '/auth/create-user';
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

        it('should return error status if role is not specified', (done) => {
            testData.jobRole = '';

            request.post(endPoint, { form: testData }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(400);
                expect(realBody.status).toBe('error');
                done();
            });
        });

        it('should return error status if department is not specified', (done) => {
            testData.department = '';

            request.post(endPoint, { form: testData }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(400);
                expect(realBody.status).toBe('error');
                done();
            });
        });

        it('should return error status if a non-existing role is specified', (done) => {
            testData.jobRole = 'xyz';

            request.post(endPoint, { form: testData }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(404);
                expect(realBody.status).toBe('error');
                done();
            });
        });

        it('should return error status if a non-existing department is specified', (done) => {
            testData.department = 'xyz';

            request.post(endPoint, { form: testData }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(404);
                expect(realBody.status).toBe('error');
                done();
            });
        });

        it('should return success status if all required parameters are sent', (done) => {
            request.post(endPoint, { form: testData }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(201);
                expect(realBody.status).toBe('success');
                done();
            });
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

        it('should fail authentication if email input is blank', (done) => {
            testCredentials.email = '';

            request.post(endPoint, { form: testCredentials }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(400);
                expect(realBody.status).toBe('error');
                done();
            });
        });

        it('should fail authentication if an invalid email is supplied', (done) => {
            testCredentials.email = 'i-do-code@me.com';

            request.post(endPoint, { form: testCredentials }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(404);
                expect(realBody.status).toBe('error');
                done();
            });
        });

        it('should fail authentication if blank(invalid) password is supplied', (done) => {
            testCredentials.password = '';

            request.post(endPoint, { form: testCredentials }, (error, response, body) => {
                const realBody = JSON.parse(body);

                expect(response.statusCode).toBe(400);
                expect(realBody.status).toBe('error');
                done();
            });
        });

        it('should pass authentication if valid credentials are supplied', (done) => {
            request.post(endPoint, { form: data }, (error, response, body) => {
                const realBody = JSON.parse(body);
                const decodedToken = jwt.verify(realBody.data.token, process.env.JWT_SECRET);

                expect(response.statusCode).toBe(200);
                expect(realBody.status).toBe('success');
                expect(realBody.data.token).not.toBe(undefined);
                expect((decodedToken.userId === realBody.data.userId)).toBeTruthy();// verify token with expected value
                done();
            });
        });
    });
});
