export interface UserIdentity {
    id: string;
    username: string;
}

export interface UserInfo extends UserIdentity {
    emailAddress: string;
    token: string;
    role: string;
}

export interface IToken {
    id: string;
    emailAddress: string;
    username: string;
    role: string;
    token: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface UserRegister {
    username: string;
    password: string;
    emailAddress: string;
    role: string;
}
