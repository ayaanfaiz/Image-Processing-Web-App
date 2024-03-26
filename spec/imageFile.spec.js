const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");

describe("GET /images/:filename", () => {
  let app;

  beforeEach(() => {
    app = express();

    app.get("/images/:filename", (req, res) => {
      const imagePath = path.join(__dirname, "images", req.params.filename);
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          console.error("Error reading image:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      });
    });
  });

  it("should return 500 if image reading fails", (done) => {
    // Simulate an error while reading the image
    const nonExistentImagePath = path.join(
      __dirname,
      "images",
      "nonExistentImage.png",
    );

    request(app).get("/images/nonExistentImage.png").expect(500).end(done);
  });
});
