import { ConnectionPackageData, NewCooperativeData } from '@coop/shared';
export interface ProcessResult {
    success: boolean;
    status: number;
    message: string;
    files?: string[];
    downloadUrl?: string;
}
export declare const processConnectionPackage: (inputData: ConnectionPackageData) => Promise<ProcessResult>;
export declare const processNewCooperative: (inputData: NewCooperativeData) => Promise<ProcessResult>;
export declare const processFiles: (inputDir: string, variablesFile: string) => Promise<ProcessResult>;
//# sourceMappingURL=document.service.d.ts.map