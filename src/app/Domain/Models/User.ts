import { IDomain } from '../Interfaces/IDomain';

export interface IUser extends IDomain {
    userName: string;
}

export interface User extends IUser {
    isOnline: boolean;
    followCount: number;
}

export interface ILogin {
    emailAddress: string;
    password: string;
}

export interface IRegister {
    emailAddress: string;
    username: string;
}

export type Id = string;
export type ResourceId = { id: Id };
