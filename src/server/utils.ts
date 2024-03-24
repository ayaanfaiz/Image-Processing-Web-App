import fs from "fs";
import path from "path";

// Types
import { ReadFileReturn } from "./types";

export const imageFileSource = path.resolve("images");

export const removeFileExtensionIfExists = (fileName: string): string => {
  const fileExtensions = [".jpg", ".png"];
  if (fileName.length) {
    const extractLastFourCharacters = fileName.substr(-4);
    if (fileExtensions.includes(extractLastFourCharacters)) {
      return fileName.substr(0, fileName.length - 4);
    }
    return fileName;
  }
  return "";
};

export const readFile = (fileName: string): ReadFileReturn => {
  if (fileName) {
    // const modifiedFileName = removeFileExtensionIfExists(fileName);
    try {
      const filePath = `${imageFileSource}/${fileName}`;
      const imageFromFile = fs.readFileSync(filePath);
      if (imageFromFile) {
        console.log("File read successful");
        return { filePath, fileReadStatus: true, fileName: fileName };
      }
    } catch (err) {
      console.log(err);
      console.error(`File doesn't exist`);
      return { fileReadStatus: false };
    }
  }
  return { fileReadStatus: false };
};
