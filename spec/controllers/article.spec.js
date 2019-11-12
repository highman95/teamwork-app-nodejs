const request = require('request');
const baseUrl = "http://localhost:3500/api/v1";

describe('ArticleController Test Suite', () => {
    let endPoint;

    beforeAll(() => {
        endPoint = baseUrl + '/articles';
    });

    describe('POST /articles', () => {
        let testData = {};

        beforeEach(() => {
            let data = {
                title: 'Once upon a time in China',
                article: 'Story Story...Story........Once upon a time....Time Time',
            };

            testData = Object.assign({}, data);
        });

        describe('title is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.title = '';

                request.post(endPoint, { form: testData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('article is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.article = '';

                request.post(endPoint, { form: testData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
        });

        describe('all required parameters are specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post(endPoint, { form: testData }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the same title', () => expect(testData.title === responseBox.body.data.title).toBeTruthy());
            it('should return the article\'s id', () => expect(responseBox.body.data.articleId).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });
});
