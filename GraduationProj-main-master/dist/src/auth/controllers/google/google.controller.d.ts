import { Response } from 'express';
import { AuthService } from 'src/auth/services/auth/auth.service';
export declare class GoogleController {
    private authService;
    constructor(authService: AuthService);
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
}
