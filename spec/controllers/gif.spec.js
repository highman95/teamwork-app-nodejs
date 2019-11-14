const request = require('request');
const baseUrl = "http://localhost:3500/api/v1";

describe('GifController Test Suite', () => {
    let endPoint;
    let options = {};

    beforeAll(() => {
        endPoint = baseUrl + '/gifs';

        const token = jwt.sign({ userId: 11 }, process.env.JWT_SECRET);
        options = { headers: { token } };
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


    describe('GET /gifs/:gifId', () => {
        describe('invalid gifId is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.get({ url: `${endPoint}/0`, ...options }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('valid gifId is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.get({ url: `${endPoint}/24`, ...options }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the gif post\'s title', () => expect(responseBox.body.data.title).toBeDefined());
            it('should return the gif post\'s imageUrl', () => expect(responseBox.body.data.url).toBeDefined());
            it('should return the gif post\'s comments', () => expect(responseBox.body.data.comments).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });


    describe('POST /gifs/:gifId/comment', () => {
        let testData = {};

        beforeEach(() => {
            const data = { comment: 'it is just a comment' };
            testData = Object.assign({}, data);
        });

        describe('GIF comment is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.comment = '';

                request.post({ url: `${endPoint}/0/comment`, ...options, form: testData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('GIF comment is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post({ url: `${endPoint}/3/comment`, ...options, form: testData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the same comment', () => expect(testData.comment === responseBox.body.data.comment).toBeTruthy());
            it('should return the gif post\'s title', () => expect(responseBox.body.data.gifTitle).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });


    describe('DELETE /gifs/:gifId', () => {
        describe('GIF id is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.delete({ url: `${endPoint}/3`, ...options }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return a message', () => expect(responseBox.body.data.message).toBeDefined());
        });
    });
});
