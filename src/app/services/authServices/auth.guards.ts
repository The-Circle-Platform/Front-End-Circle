import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.currentPrivKey$.pipe(
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
