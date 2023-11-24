/* eslint-disable no-undef */
const fs = require("fs");
const request = require("request");
const server = require("../../src/index");
const { generateToken } = require("../../src/utils/security");

describe("GifController Test Suite", () => {
  let endPoint;
  let options = {};
  let gifId;

  beforeAll(() => {
    const { address, port } = server.address();
    const hostName = address === "::" ? `http://localhost:${port}` : address;
    endPoint = `${hostName}/api/v1/gifs`;

    options = { headers: { token: generateToken({ id: 1 }) } };
  });

  //* afterAll((done) => server.close(done));

  describe("POST /gifs", () => {
    let testFormData = {
      image: fs.createReadStream("public/images/sample.gif"),
    };

    beforeEach(() => {
      const data = {
        title: "Once upon a time in Tokyo",
        image: fs.createReadStream("public/images/sample.gif"),
      };

      testFormData = { ...data };
    });

    describe("Title is not specified", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            formData: { ...testFormData, title: "" },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 400", () =>
        expect(responseBox.response.statusCode).toBe(400));
      it("should return error status", () =>
        expect(responseBox.body.status).toBe("error"));
      it("should return a relevant error message", () =>
        expect(responseBox.body.error).toBe("Title is missing"));
    });

    describe("Image is not specified/uploaded", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            formData: { ...testFormData, image: "" },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 400", () =>
        expect(responseBox.response.statusCode).toBe(400));
      it("should return error status", () =>
        expect(responseBox.body.status).toBe("error"));
      it("should return a relevant error message", () =>
        expect(responseBox.body.error).toBe("GIF image is missing"));
    });

    describe("Non-GIF image is uploaded", () => {
      let responseBox = {};

      beforeAll((done) => {
        const image = fs.createReadStream("public/images/sample.jpg");

        request.post(
          {
            url: endPoint,
            ...options,
            formData: { ...testFormData, image },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 400", () =>
        expect(responseBox.response.statusCode).toBe(400));
      it("should return error status", () =>
        expect(responseBox.body.status).toBe("error"));
      it("should return a relevant error message", () =>
        expect(responseBox.body.error).toBe("Only GIF images are acceptable"));
    });

    describe("A title and GIF image are specified", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: endPoint,
            ...options,
            formData: testFormData,
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            gifId = responseBox.body.data.gifId;
            done();
          }
        );
      }, 15000);

      it("should return statusCode 201", () => {
        expect(responseBox.response.statusCode).toBe(201);
      });
      it("should return success status", () => {
        expect(responseBox.body.status).toBe("success");
      });
      it("should return a success message", () => {
        expect(responseBox.body.data.message).toBe(
          "GIF image successfully posted"
        );
      });
      it("should return the same title", () => {
        expect(testFormData.title === responseBox.body.data.title).toBeTruthy();
      });
      it("should return the gif's id", () => {
        expect(responseBox.body.data.gifId).toBeDefined();
      });
      it("should return the gif post's imageUrl", () => {
        expect(responseBox.body.data.imageUrl).toBeDefined();
      });
      it("should return the time-created", () => {
        expect(responseBox.body.data.createdOn).toBeDefined();
      });
    });
  });

  describe("GET /gifs/:gifId", () => {
    describe("Invalid gifId is specified", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.get(
          { url: `${endPoint}/0`, ...options, json: true },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 404", () =>
        expect(responseBox.response.statusCode).toBe(404));
      it("should return error status", () =>
        expect(responseBox.body.status).toBe("error"));
      it("should return a relevant error message", () =>
        expect(responseBox.body.error).toBe("Post does not exist"));
    });

    describe("Valid gifId is specified", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.get(
          { url: `${endPoint}/${gifId}`, ...options, json: true },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 200", () =>
        expect(responseBox.response.statusCode).toBe(200));
      it("should return success status", () =>
        expect(responseBox.body.status).toBe("success"));
      it("should return the gif post's title", () =>
        expect(responseBox.body.data.title).toBeDefined());
      it("should return the gif post's imageUrl", () =>
        expect(responseBox.body.data.url).toBeDefined());
      it("should return the gif post's comments", () =>
        expect(responseBox.body.data.comments).toBeDefined());
      it("should return the time-created", () =>
        expect(responseBox.body.data.createdOn).toBeDefined());
    });
  });

  describe("POST /gifs/:gifId/comment", () => {
    const testData = { comment: "it is just a comment" };

    describe("GIF comment is not specified", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: `${endPoint}/${gifId}/comment`,
            ...options,
            form: { ...testData, comment: "" },
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 400", () =>
        expect(responseBox.response.statusCode).toBe(400));
      it("should return error status", () =>
        expect(responseBox.body.status).toBe("error"));
      it("should return a relevant error message", () =>
        expect(responseBox.body.error).toBe("Comment/statement is missing"));
    });

    describe("GIF comment is specified", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.post(
          {
            url: `${endPoint}/${gifId}/comment`,
            ...options,
            form: testData,
            json: true,
          },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 201", () =>
        expect(responseBox.response.statusCode).toBe(201));
      it("should return success status", () =>
        expect(responseBox.body.status).toBe("success"));
      it("should return a success message", () =>
        expect(responseBox.body.data.message).toBe(
          "Comment successfully created"
        ));
      it("should return the same comment", () =>
        expect(
          testData.comment === responseBox.body.data.comment
        ).toBeTruthy());
      it("should return the gif post's title", () =>
        expect(responseBox.body.data.gifTitle).toBeDefined());
      it("should return the time-created", () =>
        expect(responseBox.body.data.createdOn).toBeDefined());
    });
  });

  describe("DELETE /gifs/:gifId", () => {
    describe("GIF id is specified", () => {
      let responseBox = {};

      beforeAll((done) => {
        request.delete(
          { url: `${endPoint}/${gifId}`, ...options, json: true },
          (error, response, body) => {
            responseBox = { error, response, body };
            done();
          }
        );
      });

      it("should return statusCode 200", () => {
        expect(responseBox.response.statusCode).toBe(200);
      });
      it("should return success status", () => {
        expect(responseBox.body.status).toBe("success");
      });
      it("should return a success message", () => {
        expect(responseBox.body.data.message).toBe(
          "GIF post successfully deleted"
        );
      });
    });
  });
});
