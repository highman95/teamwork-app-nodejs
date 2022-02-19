/* eslint-disable no-undef */
const commentService = require('../../src/models/comment');

describe('Comment Test Suite', () => {
  beforeAll(() => {});

  describe('Create Comment', () => {
    describe('Comment/Statement is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        commentService.create(null, null, 1).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Comment/statement is missing'));
    });

    describe('Post-id is invalid', () => {
      let responseBox = {};

      beforeAll((done) => {
        commentService.create(0, 'comment', 1).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Post does not exist'));
    });

    describe('User-id is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        commentService.create(1, 'comment', undefined).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('User identifier is missing'));
    });
  });

  describe('Fetch-all Comment(s)', () => {
    describe('Post-id is invalid', () => {
      let responseBox = {};

      beforeAll((done) => {
        commentService.fetchAll(0).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Post does not exist'));
    });
  });
});
