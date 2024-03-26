"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
// Utils
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const imageStorage = multer_1.default.diskStorage({
    // Destination to store image     
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path_1.default.extname(file.originalname));
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});
const imageUpload = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 10000000 // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'));
        }
        cb(null, true);
    }
});
app.get("/image", (request, response) => {
    const { query: { imageName, height, width }, } = request;
    const fileStatus = (0, utils_1.readFile)(String(imageName));
    const convertedImagePath = `${fileStatus.filePath}_resized_${height}_${width}.jpg`;
    if (fileStatus.fileReadStatus) {
        (0, sharp_1.default)(fileStatus.filePath)
            .resize(Number(height), Number(width))
            .toFile(convertedImagePath)
            .then(() => {
            console.log("file resize success");
            const readStream = fs_1.default.createReadStream(convertedImagePath);
            readStream.pipe(response);
            // console.log(convertedImagePath)
            // response.send(convertedImagePath)
        })
            .catch((error) => {
            console.log("file resize failed", error);
            response.status(500).send({
                message: 'Failed to resize image'
            });
        });
    }
    else {
        console.log("File Read Failed");
        response.end();
    }
});
app.post("/profile", imageUpload.single('avatar'), (req, res) => {
    res.end();
});
app.get("/gallery", (req, res) => {
    const directoryPath = 'images';
    fs_1.default.readdir(directoryPath, (err, files) => {
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
});
app.get('/images/:filename', (req, res) => {
    const imagePath = path_1.default.join('images', req.params.filename);
    fs_1.default.readFile(imagePath, (err, data) => {
        if (err) {
            console.error('Error reading image:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'image/png' }); // Adjust content type according to your image type
        res.end(data);
    });
});
app.use(express_1.default.static("src/client"));
exports.default = app;
