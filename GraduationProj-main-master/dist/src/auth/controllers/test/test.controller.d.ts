import { Request } from 'express';
export declare class TestController {
    getPublicData(): {
        message: string;
        timestamp: string;
    };
    getProtectedData(request: Request): {
        message: string;
        user: {
            id: string;
            username: string;
        };
        timestamp: string;
    };
}
