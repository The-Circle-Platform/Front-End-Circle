import { IDomain } from '../Interfaces/IDomain';

export interface IUser extends IDomain {
    userName: string;
}

export interface User extends IUser {
    isOnline: boolean;
    followCount: number;
}

export interface UserIdentity {
    id: Id;
    username: string;
}

export interface UserInfo extends UserIdentity {
    emailAddress: string;
    isGraduated: boolean;
    token: string;
    role: string;
}

export interface ILogin {
    emailAddress: string;
    password: string;
}

export interface IToken {
    id: string;
    emailAddress: string;
    token: string;
}

export interface IRegister {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    phoneNumber: string;
    isAdmin: boolean;
    role: string;
}

export type Id = string;
export type ResourceId = { id: Id };
