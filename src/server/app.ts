import express from "express";
import sharp from "sharp";
import fs from "fs";

// Types
import { ReadFileReturn } from "./types";

// Utils
import { readFile } from "./utils";

const app = express();

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
  
  app.get("/", (request, response) => {
    response.end();
  });

export default app;
