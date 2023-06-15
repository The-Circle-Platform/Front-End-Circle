import { IDomain } from '../Interfaces/IDomain';

export interface IUser extends IDomain {
    userName: string;
}

export interface DecodedToken {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
    'Id': number;
}

export interface User extends IUser {
    isOnline: boolean;
    followCount: number;
    email: string;
    balance: number;
}

export interface IRegister {
    emailAddress: string;
    username: string;
}

export type Id = string;
export type ResourceId = { id: Id };
