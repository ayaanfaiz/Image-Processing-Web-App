const request = require("supertest");
const express = require("express");
const multer = require("multer");

describe("POST /profile", () => {
  let app;

  beforeEach(() => {
    app = express();

    const imageStorage = multer.diskStorage({});

    const imageUpload = multer({
      storage: imageStorage,
      limits: {
        fileSize: 10000000, // 10000000 Bytes = 10 MB
      },
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
          // upload only png and jpg format
          return cb(new Error("Please upload a Image"));
        }
        cb(null, true);
      },
    });

    app.post("/profile", imageUpload.single("avatar"), (req, res) => {
      res.end();
    });
  });

  it("should return 200 with valid image file", (done) => {
    const validImageFile = {
      fieldname: "avatar",
      originalname: "avatar.png",
      mimetype: "image/png",
      buffer: Buffer.from("test image data"),
    };

    request(app)
      .post("/profile")
      .attach("avatar", validImageFile.buffer, {
        filename: validImageFile.originalname,
        contentType: validImageFile.mimetype,
      })
      .expect(200)
      .end(done);
  });

  it("should return 500 with invalid image file", (done) => {
    const invalidImageFile = {
      fieldname: "avatar",
      originalname: "invalidFile.txt", // Non-image file
      mimetype: "text/plain", // Non-image MIME type
      buffer: Buffer.from("invalid file data"), // Non-image data
    };

    request(app)
      .post("/profile")
      .attach("avatar", invalidImageFile.buffer, {
        filename: invalidImageFile.originalname,
        contentType: invalidImageFile.mimetype,
      })
      .expect(500)
      .end(done);
  });
});
