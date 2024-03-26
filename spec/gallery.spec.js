const request = require("supertest");
const express = require("express");
const fs = require("fs");

describe("GET /gallery", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.get("/gallery", (req, res) => {
      const directoryPath = "images";

      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        const originalFiles = files.filter((file) => !file.includes("resized"));
        const fileData = originalFiles.map((file) => {
          return {
            name: file,
            imageUrl: `/images/${file}`,
          };
        });

        res.json(fileData);
      });
    });
  });

  it("should return 200 with list of images", (done) => {
    // Mock the list of files in the 'images' directory
    const mockedFiles = ["image1.jpg", "image2.png", "image3.jpeg"];
    fs.readdir = jest.fn().mockImplementation((directoryPath, callback) => {
      callback(null, mockedFiles);
    });

    request(app)
      .get("/gallery")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toEqual([
          { name: "image1.jpg", imageUrl: "/images/image1.jpg" },
          { name: "image2.png", imageUrl: "/images/image2.png" },
          { name: "image3.jpeg", imageUrl: "/images/image3.jpeg" },
        ]);
      })
      .end(done);
  });

  it("should return 500 if reading directory fails", (done) => {
    // Simulate an error while reading the directory
    fs.readdir = jest.fn().mockImplementation((directoryPath, callback) => {
      callback(new Error("Error reading directory"));
    });

    request(app).get("/gallery").expect(500).end(done);
  });
});
