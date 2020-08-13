/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Test Title"
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "commentcount",
                "Book should contain commentcount"
              );
              assert.property(res.body, "title", "Book should contain title");
              assert.property(res.body, "_id", "Book should contain _id");
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "" // empty title
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isString(res.text, "response text should be a string");
              assert.equal(res.text, "No title provided");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/123")
          .end(function(err, res) {
            // response 'no book exists'
            assert.equal(res.status, 200);
            assert.isString(res.text, "response text should be a string");
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        // WORKING
        // create a new book (need a guaranteed db entry)
        chai
          .request(server)
          .post("/api/books")
          .send({
            title: "GET valid id test"
          })
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            // Save the id
            const id_to_check = res.body._id;
            // request the book with that id
            chai
              .request(server)
              .get(`/api/books/${id_to_check}`)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, id_to_check);
                done();
              });
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          // create a new book
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "POST comment test book"
            })
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              // Save the id
              const id_to_check = res.body._id;
              // post a comment to the book with that id
              chai
                .request(server)
                .post(`/api/books/${id_to_check}`)
                .send({
                  comment: "This book now has a comment."
                })
                .end(function(err, res) {
                  if (err) {
                    return done(err);
                  }
                  // check the response commentcount nad comments array
                  assert.equal(res.status, 200);
                  assert.equal(res.body._id, id_to_check);
                  assert.equal(res.body.commentcount, 1); 
                  assert.include(
                    res.body.comments,
                    "This book now has a comment.",
                    "array contains our comment string"
                  );
                  done();
                });
            });
        });
      }
    );
  });
});
