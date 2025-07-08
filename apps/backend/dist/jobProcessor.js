"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = __importDefault(require("./queue"));
const document_service_1 = require("./services/document.service");
queue_1.default.process(async (job, done) => {
    try {
        const { inputDir, variablesFile } = job.data;
        await (0, document_service_1.processFiles)(inputDir, variablesFile);
        done();
    }
    catch (error) {
        done(error);
    }
});
// Логирование успешных задач
queue_1.default.on('completed', (job) => {
    console.log(`Job with ID ${job.id} completed successfully`);
});
// Логирование ошибок
queue_1.default.on('failed', (job, err) => {
    console.error(`Job with ID ${job.id} failed with error: ${err.message}`);
});
// Логирование зависших задач
queue_1.default.on('stalled', (job) => {
    console.warn(`Job with ID ${job.id} is stalled and will be retried`);
});
//# sourceMappingURL=jobProcessor.js.map