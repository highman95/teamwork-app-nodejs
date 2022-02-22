/* eslint-disable no-undef */
const articlePostService = require('../../src/models/article-post');

describe('Article-Post-Service Test Suite', () => {
  describe('Create Article-Post', () => {
    describe('Content is not specified', () => {
      it('should return error message', (done) => {
        articlePostService.create(null, null, 1).catch((error) => {
          expect(error.message).toBe('Content is missing');
          done();
        });
      });
    });
  });

  describe('Update Article-Post', () => {
    describe('Content is not specified', () => {
      it('should return error message', (done) => {
        articlePostService.update(null, null, null).catch((error) => {
          expect(error.message).toBe('Content is missing');
          done();
        });
      });
    });
  });
});
