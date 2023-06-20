import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/authServices/auth.service';


@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    @Input() title!: string;
    isNavbarCollapsed = true;
    loggedInUser$!: Observable<string | undefined>;
    username: string | undefined;
    // PfpUser: PfpUser | undefined;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.loggedInUser$ = this.authService.currentToken$;

        const user = this.authService.getDecodedToken();

        if (user) {
            this.username =
                user[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                ];
        }
    }

    logout(): void {
        this.authService.logout();
    }
}
