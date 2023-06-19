import { IContent, IOutResponsePayload } from '../Interfaces/IContent';
import { IDomain } from '../Interfaces/IDomain';

export interface IUser extends IDomain {
    userName: string;
}

export interface DecodedToken {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
    id: number;
}

export interface User extends IUser {
    isOnline: boolean;
    followCount: number;
    ImageName: string;
    Base64Image: string;
    Balance: number;
}

export interface IRegister {
    OriginalRegisterData: Register;
}

export interface Register {
    Email: string;
    Username: string;
}

export interface Pfp {
    ImageName: string;
    Base64Image: string;
}

export interface PfpUser {
    Pfp: Pfp;
}

export interface UserResponseList extends IContent {
    OriginalList: User[];
}

export interface UserResponse extends IContent {
    OriginalData: User;
}
export interface LoginResponse extends IOutResponsePayload {
    OriginalLoad: UserAuthResponse;
}

export interface UserAuthResponse {
    WebsiteUser: User;
    PrivKey: string;
    PubKey: string;
    token: string;
    expiration: Date;
}

export type id = string;
export type ResourceId = { id: id };

export class userDTO {
    originalData: undefined | User;
    originalList: User[] | undefined;
    publicKey: string | undefined;
    randomId: string | undefined;
    signature: any;
    senderUserId: number | undefined;
    privKey: any;
    pubKey: any;
}
