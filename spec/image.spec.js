const request = require('supertest');

const fs = require('fs');
const path = require('path');

const app = require('../src/server/app');

describe('GET /images/:filename', () => {
  it('should return 200 and the image', (done) => {
    const testImagePath = path.join(__dirname, 'testImage.png'); // Assuming you have a test image in the same directory as this test file
    const testImageData = fs.readFileSync(testImagePath);

    // Assuming the test image exists, you may need to adjust this accordingly
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readFile = jest.fn().mockImplementation((path, callback) => {
      callback(null, testImageData);
    });

    request(app)
      .get('/images/testImage.png') // Replace with your test image filename
      .expect(200)
      .expect('Content-Type', 'image/png')
      .end((err, res) => {
        if (err) return done(err);
        // Compare response data with test image data if needed
        expect(res.body).toEqual(testImageData);
        done();
      });
  });

  it('should return 500 if image reading fails', (done) => {
    // Simulate an error while reading image
    fs.readFile = jest.fn().mockImplementation((path, callback) => {
      callback(new Error('Error reading image'));
    });

    request(app)
      .get('/images/nonexistentImage.png') // Assuming this image does not exist
      .expect(500)
      .end(done);
  });
});
