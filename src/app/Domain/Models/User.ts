import {IDomain} from "../Interfaces/IDomain";

export interface IUser extends IDomain{
    UserName: String
}

export interface User extends IUser{
    IsOnline: Boolean
}
