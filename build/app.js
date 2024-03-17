"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
// Utils
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.get("/image", (request, response) => {
    const { query: { imageName, height, width }, } = request;
    const fileStatus = (0, utils_1.readFile)(String(imageName));
    const convertedImagePath = `${fileStatus.filePath}_${height}_${width}.jpg`;
    if (fileStatus.fileReadStatus) {
        (0, sharp_1.default)(fileStatus.filePath)
            .resize(Number(height), Number(width))
            .toFile(convertedImagePath)
            .then(() => {
            console.log("file resize success");
            const readStream = fs_1.default.createReadStream(convertedImagePath);
            readStream.pipe(response);
        })
            .catch((error) => {
            console.log("file resize failed", error);
            response.end();
        });
    }
    else {
        console.log("File Read Failed");
        response.end();
    }
});
app.get("/", (request, response) => {
    response.end();
});
exports.default = app;
