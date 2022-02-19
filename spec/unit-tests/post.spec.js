/* eslint-disable no-undef */
const postService = require('../../src/models/post');

describe('Post-Service Test Suite', () => {
  describe('Create Post', () => {
    describe('Title is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        postService.create(2, null, null, 1).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error status', () => expect(responseBox.message).toBe('Title is missing'));
    });

    describe('User-id is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        postService.create(2, 'title', null, undefined).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('User identifier is missing'));
    });
  });

  describe('Update Post', () => {
    describe('Title is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        postService.update(2, null, null, 1).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Title is missing'));
    });

    describe('Post-id is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        postService.update(2, null, 'title', null).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('Post does not exist'));
    });
  });
});
