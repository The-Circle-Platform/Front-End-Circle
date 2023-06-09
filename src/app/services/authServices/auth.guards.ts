import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IToken } from '../../Domain/Models/User';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.currentUser$.pipe(
            map((user: IToken | undefined) => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['login']);
                    return false;
                }
            })
        );
    }

    canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate();
    }
}

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.currentUser$.pipe(
            map((user: IToken | undefined) => {
                if (user) {
                    const loggedIn = this.authService.decodeJwtToken(
                        user.token
                    ) as any;
                    if (loggedIn.role === 'admin') {
                        return true;
                    } else {
                        this.router.navigate(['/']);
                        return false;
                    }
                } else {
                    this.router.navigate(['login']);
                    return false;
                }
            })
        );
    }

    canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate();
    }
}
