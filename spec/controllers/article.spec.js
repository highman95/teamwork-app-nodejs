/* eslint-disable no-undef */
const request = require('request');
const server = require('../../src/index');
const { generateToken } = require('../../src/utils/security');

describe('ArticleController Test Suite', () => {
  let endPoint;
  let options = {};
  let articleId;

  beforeAll(() => {
    const { address, port } = server.address();
    const hostName = address === '::' ? `http://localhost:${port}` : address;
    endPoint = `${hostName}/api/v1/articles`;

    options = { headers: { token: generateToken({ id: 1 }) } };
  });

  // afterAll((done) => server.close(done));

  describe('POST /articles', () => {
    const testData = {
      title: 'Once upon a time in China',
      article: 'Story Story...Story........Once upon a time....Time Time',
    };

    describe('Title is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            form: { ...testData, title: '' },
            json: true,
          },
          (error, response, body) => {
            responseBox = { response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBe('Title is missing'));
    });

    describe('Article is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            form: { ...testData, article: '' },
            json: true,
          },
          (error, response, body) => {
            responseBox = { response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBe('Content is missing'));
    });

    describe('All required parameters are specified', () => {
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
            responseBox = { response, body };
            articleId = responseBox.body.data.articleId; // set the test article-id
            done();
          }
        );
      });

      it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
      it('should return success status', () => expect(responseBox.body.status).toBe('success'));
      it('should return a success message', () => expect(responseBox.body.data.message).toBe('Article successfully posted'));
      it('should return the same title', () => expect(testData.title === responseBox.body.data.title).toBeTruthy());
      it("should return the article's id", () => expect(responseBox.body.data.articleId).toBeDefined());
      it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
    });
  });

  describe('GET /articles/:articleId', () => {
    describe('Invalid articleId is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.get({ url: `${endPoint}/0`, ...options, json: true }, (error, response, body) => {
          responseBox = { response, body };
          done();
        });
      });

      it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBe('Post does not exist'));
    });

    describe('Valid articleId is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.get(
          { url: `${endPoint}/${articleId}`, ...options, json: true },
          (error, response, body) => {
            responseBox = { response, body };
            done();
          }
        );
      });

      it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
      it('should return success status', () => expect(responseBox.body.status).toBe('success'));
      it("should return the article's title", () => expect(responseBox.body.data.title).toBeDefined());
      it("should return the article's comments", () => expect(responseBox.body.data.comments).toBeDefined());
      it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
    });
  });

  describe('POST /articles/:articleId/comment', () => {
    let testData = {};

    beforeEach(() => {
      const data = { comment: 'it is just a comment' };
      testData = { ...data };
    });

    describe('Article comment is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        testData.comment = '';

        request.post(
          {
            url: `${endPoint}/${articleId}/comment`,
            ...options,
            form: testData,
            json: true,
          },
          (error, response, body) => {
            responseBox = { response, body };
            done();
          }
        );
      });

      it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
      it('should return error status', () => expect(responseBox.body.status).toBe('error'));
      it('should return a relevant error message', () => expect(responseBox.body.error).toBe('Comment/statement is missing'));
    });

    describe('Article comment is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: `${endPoint}/${articleId}/comment`,
            ...options,
            form: testData,
            json: true,
          },
          (error, response, body) => {
            responseBox = { response, body };
            done();
          }
        );
      });

      it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
      it('should return success status', () => expect(responseBox.body.status).toBe('success'));
      it('should return a success message', () => expect(responseBox.body.data.message).toBe('Comment successfully created'));
      it('should return the same comment', () => expect(testData.comment === responseBox.body.data.comment).toBeTruthy());
      it("should return the article post's title", () => expect(responseBox.body.data.articleTitle).toBeDefined());
      it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
    });
  });

  describe('DELETE /articles/:articleId', () => {
    describe('Article-id is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        request.delete(
          { url: `${endPoint}/${articleId}`, ...options, json: true },
          (error, response, body) => {
            responseBox = { response, body };
            done();
          }
        );
      });

      it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
      it('should return success status', () => expect(responseBox.body.status).toBe('success'));
      it('should return a success message', () => expect(responseBox.body.data.message).toBe('Article successfully deleted'));
    });
  });
});
