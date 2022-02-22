/* eslint-disable no-undef */
const postService = require('../../src/models/post');

describe('Post-Service Test Suite', () => {
  let testPost;

  describe('Create Post', () => {
    describe('Title is not specified', () => {
      it('should return error status', (done) => {
        postService
          .create(postService.types.ARTICLE_POST, null, null, null, undefined)
          .catch((error) => {
            expect(error.message).toBe('Title is missing');
            done();
          });
      });
    });

    describe('User-id is not specified', () => {
      it('should return error message', (done) => {
        postService
          .create(postService.types.ARTICLE_POST, 'title', null, null, undefined)
          .catch((error) => {
            expect(error.message).toBe('User identifier is missing');
            done();
          });
      });
    });

    describe('Valid Content is specified', () => {
      let responseBox = {};
      const post = { title: 'title', content: 'content' };

      beforeAll((done) => {
        postService
          .create(postService.types.ARTICLE_POST, post.title, 'content', null, 1)
          .then((result) => {
            responseBox = result;
            testPost = { ...result, post_type_id: postService.types.ARTICLE_POST };
            done();
          });
      });

      it('should return the post-id', () => expect(responseBox.id).toBeDefined());
      it('should return the create-date/time', () => expect(responseBox.created_at).toBeDefined());
      it('should return same title', () => expect(responseBox.title).toBe(post.title));
      it('should return same content', () => expect(responseBox.content).toBe(post.content));
      it('should return null image-url', () => expect(responseBox.image_url).toBeNull());
    });
  });

  describe('Find Post', () => {
    describe('Post-type-id is not specified', () => {
      it('should return error message', (done) => {
        postService.find(undefined, undefined).catch((error) => {
          expect(error.message).toBe('Post-type identifier is missing');
          done();
        });
      });
    });

    describe('Post-id is not specified', () => {
      it('should return error message', (done) => {
        postService.find(postService.types.ARTICLE_POST, undefined).catch((error) => {
          expect(error.message).toBe('Post does not exist');
          done();
        });
      });
    });

    describe('Fake Post-id is specified', () => {
      it('should return empty-object', (done) => {
        postService.find(postService.types.ARTICLE_POST, testPost.id + 1).then((result) => {
          expect(result).toEqual({});
          done();
        });
      });
    });

    describe('Valid Post-id is specified', () => {
      let responseBox = {};

      beforeAll((done) => {
        postService.find(postService.types.ARTICLE_POST, testPost.id).then((result) => {
          responseBox = result;
          done();
        });
      });

      it('should return the correct title', () => expect(responseBox.title).toBe(testPost.title));
      it('should return the correct content', () => expect(responseBox.content).toBe(testPost.content));
      it('should return the create-date/time', () => expect(responseBox.created_at).toBeDefined());
    });
  });

  describe('Update Post', () => {
    describe('Title is not specified', () => {
      it('should return error message', (done) => {
        postService.update(postService.types.ARTICLE_POST, null, null, 1).catch((error) => {
          expect(error.message).toBe('Title is missing');
          done();
        });
      });
    });

    describe('Post-id is not specified', () => {
      it('should return error message', (done) => {
        postService.update(postService.types.ARTICLE_POST, null, 'title', null).catch((error) => {
          expect(error.message).toBe('Post does not exist');
          done();
        });
      });
    });

    describe('Valid Post-id is specified', () => {
      it('should return the post-id', (done) => {
        postService
          .update(
            postService.types.ARTICLE_POST,
            testPost.id,
            `${testPost.title}-x`,
            `${testPost.content}-xtra-gist`
          )
          .then((result) => {
            expect(result.id).toBe(testPost.id);
            done();
          });
      });
    });
  });

  describe('Fetch Posts', () => {
    it('should return a non-empty list of posts', (done) => {
      postService.fetchAll(postService.types.ARTICLE_POST).then((result) => {
        expect(result.length).toBeDefined();
        expect(result.length).toBeGreaterThanOrEqual(1);
        done();
      });
    });
  });

  describe('Fetch Posts Count', () => {
    it('should return a value >= 1', (done) => {
      postService.fetchCount(postService.types.ARTICLE_POST).then((count) => {
        expect(count).toBeGreaterThanOrEqual(1);
        done();
      });
    });
  });

  // must be last on the line for CLEAN-UP purposes
  describe('Delete Post', () => {
    describe('Post-id is not specified', () => {
      it('should return error message', (done) => {
        postService.delete(postService.types.ARTICLE_POST, undefined).catch((error) => {
          expect(error.message).toBe('Post does not exist');
          done();
        });
      });
    });

    describe('Valid Post-id is specified', () => {
      it('should return the title', (done) => {
        postService.delete(postService.types.ARTICLE_POST, testPost.id).then((result) => {
          expect(result.title).toBeDefined();
          done();
        });
      });
    });
  });
});
