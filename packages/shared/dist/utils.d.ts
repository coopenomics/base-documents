import { ConnectionPackageData, NewCooperativeData } from './document.types';
export declare function numberToText(num: number): string;
export declare function capitalize(text: string): string;
export declare function processDate(dateString: string): {
    day: string;
    month: string;
    year: string;
    dayAndMonth: string;
    fullDate: string;
    isoDate: string;
};
export declare function processConnectionPackageData(inputData: Partial<ConnectionPackageData>): ConnectionPackageData;
export declare function processNewCooperativeData(inputData: Partial<NewCooperativeData>): NewCooperativeData;
export declare function validateINN(inn: string): boolean;
export declare function validatePassport(series: string, number: string): boolean;
//# sourceMappingURL=utils.d.ts.map