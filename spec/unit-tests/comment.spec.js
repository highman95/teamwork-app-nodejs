/* eslint-disable no-undef */
const commentService = require('../../src/models/comment');

describe('Comment Test Suite', () => {
  describe('Create Comment', () => {
    describe('Comment/Statement is not specified', () => {
      it('should return error message', (done) => {
        commentService.create(null, null, 1).catch((error) => {
          expect(error.message).toBe('Comment/statement is missing');
          done();
        });
      });
    });

    describe('Post-id is invalid', () => {
      it('should return error message', (done) => {
        commentService.create(0, 'comment', 1).catch((error) => {
          expect(error.message).toBe('Post does not exist');
          done();
        });
      });
    });

    describe('User-id is not specified', () => {
      it('should return error message', (done) => {
        commentService.create(1, 'comment', undefined).catch((error) => {
          expect(error.message).toBe('User identifier is missing');
          done();
        });
      });
    });
  });

  describe('Fetch-all Comment(s)', () => {
    describe('Post-id is invalid', () => {
      it('should return error message', (done) => {
        commentService.fetchAll(0).catch((error) => {
          expect(error.message).toBe('Post does not exist');
          done();
        });
      });
    });
  });
});
