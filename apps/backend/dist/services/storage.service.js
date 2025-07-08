"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileList = exports.client = void 0;
const nextcloud_link_1 = __importDefault(require("nextcloud-link"));
exports.client = new nextcloud_link_1.default({
    "url": "http://127.0.0.1:8080",
    "password": "Termit_210",
    "username": "ant",
});
const getFileList = async () => {
    const files = await exports.client.getFiles('/');
    console.log(files);
    return;
};
exports.getFileList = getFileList;
//# sourceMappingURL=storage.service.js.map