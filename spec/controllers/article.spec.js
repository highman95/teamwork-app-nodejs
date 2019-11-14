require('dotenv').config();

const request = require('request');
const jwt = require('jsonwebtoken');
const baseUrl = "http://localhost:3500/api/v1";

describe('ArticleController Test Suite', () => {
    let endPoint;
    let options = {};

    beforeAll(() => {
        endPoint = baseUrl + '/articles';

        const token = jwt.sign({ userId: 11 }, process.env.JWT_SECRET);
        options = { headers: { token } };
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

                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
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

                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
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
                request.post({ url: endPoint, ...options, form: testData }, (error, response, body) => {
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


    describe('GET /articles/:articleId', () => {
        describe('invalid articleId is specified', () => {
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

        describe('valid articleId is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.get({ url: `${endPoint}/3`, ...options }, (error, response, body) => {
                    responseBox = { response, body: JSON.parse(body) };
                    done();
                });
            });

            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the article\'s title', () => expect(responseBox.body.data.title).toBeDefined());
            it('should return the article\'s comments', () => expect(responseBox.body.data.comments).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });
});
