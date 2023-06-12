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

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.loggedInUser$ = this.authService.currentToken$;
    }

    logout(): void {
        this.authService.logout();
    }
}
