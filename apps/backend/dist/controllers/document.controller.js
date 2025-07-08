"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileProcessing = void 0;
const job_service_1 = require("../services/job.service");
const handleFileProcessing = async (req, res) => {
    const inputDir = 'data/';
    const variablesFile = req.query.variablesFile;
    if (!variablesFile) {
        res.status(400).send('Error: variablesFile query parameter is required.');
        return;
    }
    try {
        const jobId = await (0, job_service_1.addFileProcessingJob)(inputDir, variablesFile);
        res.status(202).json({ jobId });
    }
    catch (error) {
        res.status(500).send(`Error adding task to queue: ${error}`);
    }
};
exports.handleFileProcessing = handleFileProcessing;
//# sourceMappingURL=document.controller.js.map