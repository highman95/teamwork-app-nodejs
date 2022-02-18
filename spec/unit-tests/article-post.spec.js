/* eslint-disable no-undef */
const articlePostService = require('../../src/models/article-post');

describe('Article-Service Test Suite', () => {
  beforeAll(() => {});

  describe('Create Article-Post', () => {
    describe('content is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        articlePostService.create(null, null, 1).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Content is missing'));
    });
  });

  describe('Update Article-Post', () => {
    describe('content is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        articlePostService.update(null, null, null).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Content is missing'));
    });
  });
});
