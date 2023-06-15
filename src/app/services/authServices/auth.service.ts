import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/moduleconfig/config.service';
import { DecodedToken, IRegister } from '../../Domain/Models/User';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public currentToken$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly CURRENT_TOKEN = 'token';
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    private siteEndpoint: string;

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private router: Router
    ) {
        this.siteEndpoint = `${
            this.configService.getConfig().apiEndpoint
        }api/auth`;

        this.getUserFromLocalStorage()
            .pipe(
                switchMap((user: string | undefined) => {
                    if (user) {
                        this.currentToken$.next(user);
                        console.log(
                            'User from local storage:',
                            this.decodeJwtToken(
                                this.getAuthorizationToken() || ''
                            )
                        );
                        return of(user);
                    } else {
                        return of(undefined);
                    }
                })
            )
            .subscribe();
    }

    decodeJwtToken(token: string) {
        return token ? jwt_decode(token) : null;
    }

    login(userName: string, password: string): Observable<string | undefined> {
        const credentials = {
            userName: userName,
            password: password,
        };
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
        const userData = {
            email: email,
            userName: userName,
        };
        let adminUrl = '';
        if (role) adminUrl = '-admin';
        return this.http
            .post<IRegister>(
                `${this.siteEndpoint}/register${adminUrl}`,
                userData,
                {
                    headers: this.headers,
                }
            )
            .pipe(
                map((data: any) => {
                    localStorage.setItem(
                        this.CURRENT_TOKEN,
                        JSON.stringify(data.results)
                    );
                    this.currentToken$.next(data);
                    return data;
                }),
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
                    localStorage.removeItem(this.CURRENT_TOKEN);
                    this.currentToken$.next(undefined);
                } else {
                    console.log('navigate result:', success);
                }
            })
            .catch((error) =>
                console.log('Error message:', error.error.message)
            );
    }

    getUserFromLocalStorage(): Observable<string | undefined> {
        const token = localStorage.getItem(this.CURRENT_TOKEN);

        if (token) {
            return of(token);
        } else {
            return of(undefined);
        }
    }

    getAuthorizationToken(): string | undefined {
        const token = localStorage.getItem(this.CURRENT_TOKEN) || '';

        return token;
    }

    getDecodedToken(): DecodedToken {
        return this.decodeJwtToken(
            this.getAuthorizationToken() || ''
        ) as DecodedToken;
    }
}
