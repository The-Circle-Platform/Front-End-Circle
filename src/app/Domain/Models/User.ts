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
    emailAddress: string;
    username: string;
}

export interface Pfp {
    ImageName: string;
    Base64Image: string;
}

export interface PfpUser {
    Pfp: Pfp;
}

export type Id = string;
export type ResourceId = { id: Id };
