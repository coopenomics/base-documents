export declare const getJobStatus: (jobId: string) => Promise<{
    state: import("bull").JobStatus | "stuck";
    progress: any;
} | null>;
export declare const addFileProcessingJob: (inputDir: string, variablesFile: string) => Promise<string | number>;
//# sourceMappingURL=job.service.d.ts.map