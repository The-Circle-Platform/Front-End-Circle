import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { IRegister, Register, User } from '../../Domain/Models/User';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { SecurityService } from './security';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public currentPrivKey$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly CURRENT_USER = 'Pop';
    private readonly CURRENT_PRIVATE_KEY = 'privKey';
    private readonly CURRENT_PUBLIC_KEY = 'pubKey';
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    private siteEndpoint: string;

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private router: Router,
        private securityService: SecurityService
    ) {
        this.siteEndpoint = `${
            this.configService.getConfig().apiEndpoint
        }api/auth`;

        this.getUserFromLocalStorage()
            .pipe(
                switchMap((user: string | undefined) => {
                    if (user) {
                        this.currentPrivKey$.next(user);
                        return of(user);
                    } else {
                        return of(undefined);
                    }
                })
            )
            .subscribe();
    }

    login(
        userName: string,
        privateKey: string
    ): Observable<string | undefined> {
        localStorage.setItem('privKey', privateKey);
        const timesTamp = Date.now();
        const request = {
            userName: userName,
            timeStamp: timesTamp,
        };
        const json = JSON.stringify(request);

        const userNameSignature = this.securityService.sign(json.toLowerCase());
        const credentials = {
            request: request,
            signature: userNameSignature,
        };

        console.log(credentials);
        return this.http.post<string>(
            `${this.siteEndpoint}/login`,
            credentials,
            {
                headers: this.headers,
            }
        );
    }

    register(
        email: string,
        userName: string,
        role: string
    ): Observable<IRegister | undefined> {
        const originalRegisterData = {
            Email: email,
            Username: userName,
        } as Register;
        const userData = { originalRegisterData };

        const RegisterJsonString = JSON.stringify(userData);
        const signature = this.securityService.sign(RegisterJsonString);

        const RegisterRequestDTO = {
            signature: signature,
            originalRegisterData: userData,
            SenderUserId: this.GetWebUser()?.id,
        };
        let adminUrl = '';
        if (role) adminUrl = '-admin';
        return this.http
            .post<IRegister>(
                `${this.siteEndpoint}/register${adminUrl}`,
                RegisterRequestDTO,
                {
                    headers: this.headers,
                }
            )
            .pipe(
                catchError((error) => {
                    console.log('Error message:', error.error.message);
                    return of(undefined);
                })
            );
    }

    logout(): void {
        this.router
            .navigate(['/'])
            .then((success) => {
                if (success) {
                    console.log('logout - removing local user info');
                    localStorage.removeItem(this.CURRENT_PRIVATE_KEY);
                    localStorage.removeItem(this.CURRENT_PUBLIC_KEY);
                    localStorage.removeItem(this.CURRENT_USER);

                    this.currentPrivKey$.next(undefined);
                } else {
                    console.log('navigate result:', success);
                }
            })
            .catch((error) =>
                console.log('Error message:', error.error.message)
            );
    }

    getUserFromLocalStorage(): Observable<string | undefined> {
        const user = localStorage.getItem(this.CURRENT_USER);

        if (user) {
            return of(user);
        } else {
            return of(undefined);
        }
    }

    StoreKeyPair(pubKey: string, priv: string) {
        localStorage.setItem(this.CURRENT_PRIVATE_KEY, priv);
        localStorage.setItem(this.CURRENT_PUBLIC_KEY, pubKey);
    }

    StoreUser(user: User) {
        const jsonUser: string = JSON.stringify(user);
        localStorage.setItem(this.CURRENT_USER, jsonUser);
    }

    GetWebUser(): User | null {
        const userJson = localStorage.getItem(this.CURRENT_USER);

        if (userJson) {
            const User: User = JSON.parse(userJson);
            return User;
        } else {
            return null;
        }
    }

    GetPubKey() {
        return localStorage.getItem(this.CURRENT_PUBLIC_KEY);
    }

    GetPrivKey() {
        return localStorage.getItem(this.CURRENT_PRIVATE_KEY);
    }
}
