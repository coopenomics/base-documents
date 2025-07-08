"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const fileQueue = new bull_1.default('file-processing', {
    redis: {
        host: '127.0.0.1',
        port: 6379,
    },
});
exports.default = fileQueue;
//# sourceMappingURL=queue.js.map