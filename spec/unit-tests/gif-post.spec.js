/* eslint-disable no-undef */
const gifPostService = require('../../src/models/gif-post');

describe('Gif-Post-Service Test Suite', () => {
  describe('Create Gif-Post', () => {
    describe('No gif-image is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        gifPostService.create(null, null, 1).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('GIF image is missing'));
    });

    describe('No gif-image path is not specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        gifPostService.create(null, {}, 1).catch((error) => {
          responseBox = error;
          done();
        });
      });

      it('should return error message', () => expect(responseBox.message).toBe('GIF image is missing'));
    });
  });
});
