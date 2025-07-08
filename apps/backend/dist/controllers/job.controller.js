"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJobStatus = void 0;
const job_service_1 = require("../services/job.service");
const checkJobStatus = async (req, res) => {
    const jobId = req.params.jobId;
    try {
        const jobStatus = await (0, job_service_1.getJobStatus)(jobId);
        if (!jobStatus) {
            res.status(404).send('Job not found');
            return;
        }
        res.json(jobStatus);
    }
    catch (error) {
        res.status(500).send(`Error fetching job status: ${error}`);
    }
};
exports.checkJobStatus = checkJobStatus;
//# sourceMappingURL=job.controller.js.map