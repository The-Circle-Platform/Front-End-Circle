import {IDomain} from "../Interfaces/IDomain";

export interface IUser extends IDomain{
    userName: string
}

export interface User extends IUser{
    isOnline: boolean
    followCount: number
}
