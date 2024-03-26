"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.removeFileExtensionIfExists = exports.imageFileSource = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.imageFileSource = path_1.default.resolve("images");
const removeFileExtensionIfExists = (fileName) => {
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
exports.removeFileExtensionIfExists = removeFileExtensionIfExists;
const readFile = (fileName) => {
    if (fileName) {
        // const modifiedFileName = removeFileExtensionIfExists(fileName);
        try {
            const filePath = `${exports.imageFileSource}/${fileName}`;
            const imageFromFile = fs_1.default.readFileSync(filePath);
            if (imageFromFile) {
                console.log("File read successful");
                return { filePath, fileReadStatus: true, fileName: fileName };
            }
        }
        catch (err) {
            console.log(err);
            console.error(`File doesn't exist`);
            return { fileReadStatus: false };
        }
    }
    return { fileReadStatus: false };
};
exports.readFile = readFile;
