/* eslint-disable no-undef */
const departmentService = require("../../src/models/department");

describe("Department-Service Test Suite", () => {
  describe("Find Department", () => {
    describe("Name is not specified", () => {
      it("should return error message", (done) => {
        departmentService.findByName(null).catch((error) => {
          expect(error.message).toBe("Department cannot be empty");
          done();
        });
      });
    });
  });
});
