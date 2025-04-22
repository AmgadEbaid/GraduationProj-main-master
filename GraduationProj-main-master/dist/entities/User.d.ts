import { Address } from './Address';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    status: boolean;
    phone: string;
    isOAuthUser: boolean;
    addresses: Address[];
}
