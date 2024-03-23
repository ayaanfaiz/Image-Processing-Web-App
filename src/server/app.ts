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
  const convertedImagePath = `${fileStatus.filePath}_${height}_${width}.jpg`;
  if (fileStatus.fileReadStatus) {
    sharp(fileStatus.filePath)
      .resize(Number(height), Number(width))
      .toFile(convertedImagePath)
      .then(() => {
        console.log("file resize success");
        const readStream = fs.createReadStream(convertedImagePath);
        readStream.pipe(response);
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
    console.log(req);
    res.end();
})

app.use(express.static("src/client"))

export default app;
