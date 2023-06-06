import {IDomain} from "../Interfaces/IDomain";

export interface IUser extends IDomain{
    userName: String
}

export interface User extends IUser{
    isOnline: Boolean
}
