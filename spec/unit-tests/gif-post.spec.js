/* eslint-disable no-undef */
const gifPostService = require("../../src/models/gif-post");

describe("Gif-Post-Service Test Suite", () => {
  describe("Create Gif-Post", () => {
    describe("No gif-image is not specified", () => {
      it("should return error message", (done) => {
        gifPostService.create(null, null, 1).catch((error) => {
          expect(error.message).toBe("GIF image is missing");
          done();
        });
      });
    });

    describe("No gif-image path is not specified", () => {
      it("should return error message", (done) => {
        gifPostService.create(null, {}, 1).catch((error) => {
          expect(error.message).toBe("GIF image is missing");
          done();
        });
      });
    });
  });
});
