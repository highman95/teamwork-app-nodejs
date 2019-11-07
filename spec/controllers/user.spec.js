const request = require('request');
const baseUrl = "http://localhost:3500/api/v1";

describe('UserController Test Suite', () => {

    beforeAll(() => { });

    afterAll(() => { });

    describe('POST /auth/create-user', () => {
        let endPoint;
        let testData;

        beforeAll(() => {
            endPoint = baseUrl + '/auth/create-user';
        });
        
        beforeEach(() => {
            const data = {
                first_name: 'Mark',
                last_name: 'Spencer',
                email: 'mark.spencer-' + Date.now() + '@oc.com',
                password: 'markspencer',
                gender: 'male',
                address: '',
                role: 'staff',
                department: 'Engineering'
            };

            testData = Object.assign({}, data);
        });

        it('should return error status if role is not specified', (done) => {
            testData.role = '';

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
            testData.role = 'xyz';

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
});
