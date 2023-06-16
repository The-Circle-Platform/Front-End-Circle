import { IDomain } from '../Interfaces/IDomain';

export interface IUser extends IDomain {
    userName: string;
}

export interface DecodedToken {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
    'id': number;
}

// {
//     "originalData": null,
//     "originalList": [
//     {
//         "id": 1,
//         "userName": "Jascha",
//         "isOnline": false
//     }
// ],
//     "publicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBF5zDgUZhEgGwXAgxhQ/TDdjIpYB7+bqTEsBjB8hfygwo5GnkESsAMnWZg6Zt3qNXKCKaBgWmRGBJjQLhsRCpg9z0s/VsQGhefFN/8bO0Q+r6Bpk6GDXBlPfQhJIOAAcUjswxyC1FgaVT8GfBHbFg9uhRCoz541iyhEpq0BeAQQIDAQAB",
//     "randomId": "00000000-0000-0000-0000-000000000000",
//     "signature": "RrpK1x/3FQCvRh5YZX/LrdAUoYNoWNJqVC1yl8RygJ24TJMI0BAlAVsNjDK2Ek1672fBHXXoY0lRUiQmVDq8tLFut8RdZE0JTn2tToa6GWFWWdqq5dG7pme9q4I7GE1yxRhr2FQF/UPdPXaI9hrzmsCB7yjb33Kk2PUd5fXMejo=",
//     "senderUserId": 0
// }

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

export class userDTO {
    originalData: any;
    originalList: User[] | undefined;
    publicKey: string | undefined;
    randomId: string | undefined;
    signature: any;
    senderUserId: number | undefined;
    privKey: any;
    pubKey: any;

}
