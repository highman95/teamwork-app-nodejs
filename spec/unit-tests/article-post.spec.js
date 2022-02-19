/* eslint-disable no-undef */
const articlePostService = require('../../src/models/article-post');

describe('Article-Post-Service Test Suite', () => {
  describe('Create Article-Post', () => {
    describe('Content is not specified', () => {
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
    describe('Content is not specified', () => {
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
