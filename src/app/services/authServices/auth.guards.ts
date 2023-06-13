import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.currentToken$.pipe(
            map((user: string | undefined) => {
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
        return this.authService.currentToken$.pipe(
            map((token: string | undefined) => {
                if (token) {
                    const loggedIn = this.authService.decodeJwtToken(
                        token
                    ) as any;
                    const userRoles =
                        loggedIn[
                            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                        ];

                    if (userRoles.includes('admin')) {
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
