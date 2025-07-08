"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFileProcessingJob = exports.getJobStatus = void 0;
const queue_1 = __importDefault(require("../queue"));
const getJobStatus = async (jobId) => {
    const job = await queue_1.default.getJob(jobId);
    if (!job) {
        return null;
    }
    const state = await job.getState(); // "completed", "failed", "delayed", "waiting", "active"
    const progress = job.progress(); // Процент выполнения (если установлен)
    return { state, progress };
};
exports.getJobStatus = getJobStatus;
const addFileProcessingJob = async (inputDir, variablesFile) => {
    const job = await queue_1.default.add({ inputDir, variablesFile });
    return job.id;
};
exports.addFileProcessingJob = addFileProcessingJob;
//# sourceMappingURL=job.service.js.map