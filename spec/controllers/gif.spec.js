const request = require('request');
const baseUrl = "http://localhost:3500/api/v1";

describe('GifController Test Suite', () => {
    let endPoint;

    beforeAll(() => {
        endPoint = baseUrl + '/gifs';
    });

    describe('POST /gifs', () => {
        let testFormData = {};

        beforeEach(() => {
            let data = new FormData();
            data.append('title', 'Once upon a time in Tokyo');
            data.append('image', Buffer.from('public/images/sample.gif'));

            testFormData = Object.assign({}, data);
        });

        describe('title is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testFormData.append('title', '');

                request.post(endPoint, { formData: testFormData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('image is not specified/uploaded', () => {
            let responseBox = {};

            beforeAll((done) => {
                testFormData.append('image', '');

                request.post(endPoint, { formData: testFormData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('non-GIF image is uploaded', () => {
            let responseBox = {};

            beforeAll((done) => {
                testFormData.append('image', Buffer.from('public/images/sample.jpg'));

                request.post(endPoint, { formData: testFormData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('a title and GIF image are specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post(endPoint, { formData: testFormData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the same title', () => expect(testFormData.title === responseBox.body.data.title).toBeTruthy());
            it('should return the gif\'s id', () => expect(responseBox.body.data.gifId).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });
});
