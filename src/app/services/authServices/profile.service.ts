import { Injectable } from '@angular/core';
import { UserService } from '../userServices/user.service';
import { User } from 'src/app/Domain/Models/User';
import { securityService } from './security';

@Injectable({ providedIn: 'root' })
export class profileService {
    tokenKey: string;

    constructor(
        private userService: UserService,
        private secureService: securityService
    ) {
        this.tokenKey = 'local';
    }

    DeleteLocalToken() {
        localStorage.clear();
    }

    StoreToken(authToken: string) {
        localStorage.setItem(this.tokenKey, authToken);
    }

    GetToken(): string | undefined {
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
            return token;
        } else {
            return undefined;
        }
    }
}
