"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileList = void 0;
const services_1 = require("../services");
const getFileList = async (req, res) => {
    const files = await services_1.storageService.getFileList();
    res.status(200).send(files);
};
exports.getFileList = getFileList;
//# sourceMappingURL=storage.controller.js.map