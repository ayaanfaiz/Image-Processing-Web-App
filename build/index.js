"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
console.log(__dirname);
app_1.default.use(express_1.default.static('../app'));
app_1.default.listen("8001", () => {
    console.log("Server running at port 8001 🚀");
});
