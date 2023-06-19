import { IContent, IOutResponsePayload } from '../Interfaces/IContent';
import { IDomain } from '../Interfaces/IDomain';

export interface IUser extends IDomain {
    userName: string;
}

export interface DecodedToken {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
}

export interface User extends IUser {
    isOnline: boolean;
    followCount: number;
    ImageName: string;
    Base64Image: string;
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

export type Id = string;
export type ResourceId = { id: Id };
