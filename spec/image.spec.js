const request = require("supertest");

const fs = require("fs");
const path = require("path");

const app = require("../build/index");

describe("GET /images/:filename", () => {
  it("should return 200 and the image", (done) => {
    const testImagePath = path.join(__dirname, "avatar.jpg");
    const testImageData = fs.readFileSync(testImagePath);

    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readFile = jest.fn().mockImplementation((path, callback) => {
      callback(null, testImageData);
    });

    request(app)
      .get("/images/avatar")
      .expect(200)
      .expect("Content-Type", "image/png")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(testImageData);
        done();
      });
  });

  it("should return 500 if image reading fails", (done) => {
    // Simulate an error while reading image
    fs.readFile = jest.fn().mockImplementation((path, callback) => {
      callback(new Error("Error reading image"));
    });

    request(app).get("/images/nonexistentImage.png").expect(500).end(done);
  });
});
