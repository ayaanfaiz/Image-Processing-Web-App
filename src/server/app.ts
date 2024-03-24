import express, { response } from "express";
import sharp from "sharp";
import fs from "fs";
import multer from "multer";

// Types
import { ReadFileReturn } from "./types";

// Utils
import { readFile } from "./utils";
import path from "path";

const app = express();
const upload = multer({ dest: 'uploads/' })

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'images',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()
      + path.extname(file.originalname))
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(null, true)
  }
})

app.get("/image", (request, response) => {
  const {
    query: { imageName, height, width },
  } = request;
  const fileStatus: ReadFileReturn = readFile(String(imageName));
  const convertedImagePath = `${fileStatus.filePath}_resized_${height}_${width}.jpg`;
  if (fileStatus.fileReadStatus) {
    sharp(fileStatus.filePath)
      .resize(Number(height), Number(width))
      .toFile(convertedImagePath)
      .then(() => {
        console.log("file resize success");
        const readStream = fs.createReadStream(convertedImagePath);
        readStream.pipe(response);
        // console.log(convertedImagePath)
        // response.send(convertedImagePath)
      })
      .catch((error) => {
        console.log("file resize failed", error);
        response.end();
      });
  } else {
    console.log("File Read Failed");
    response.end();
  }
});

app.post("/profile", imageUpload.single('avatar'), (req, res) => {
  res.end();
});

app.get("/gallery", (req, res) => {
  const directoryPath = 'images';

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const originalFiles = files.filter((file) => !file.includes('resized'));
    const fileData = originalFiles.map(file => {
      return {
        name: file,
        imageUrl: `/images/${file}` // Assuming images are stored in an 'images' directory
      };
    });

    res.json(fileData);
  });
})

app.get('/images/:filename', (req, res) => {
  const imagePath = path.join('images', req.params.filename);
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error('Error reading image:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'image/png' }); // Adjust content type according to your image type
    res.end(data);
  });
});

app.use(express.static("src/client"))

export default app;
