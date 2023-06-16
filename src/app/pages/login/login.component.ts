import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authServices/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    subs!: Subscription;
    loginForm!: FormGroup;
    hide = true;
    wrongPwOrUserName = false;

    constructor(
        private fb: FormBuilder,
        public authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.subs = this.authService
            .getUserFromLocalStorage()
            .subscribe((user: string | undefined) => {
                if (user) {
                    console.log('Gebruiker is al ingelogd');
                    this.router.navigate(['/']);
                }
            });

        this.loginForm = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
        }) as FormGroup;
    }

    onSubmit(): void {
        if (
            this.loginForm.value.userName != '' &&
            this.loginForm.value.password != ''
        ) {
            this.authService
                .login(
                    this.loginForm.value.userName,
                    this.loginForm.value.password
                )
                .subscribe(
                    (reply: any) => {
                        location.reload();

                        localStorage.setItem('token', reply.token);
                        localStorage.setItem('token', reply.originalLoad.token);
                        localStorage.setItem('privateKey', reply.originalLoad.privKey);
                        localStorage.setItem('publicKey', reply.originalLoad.pubKey);
                        this.router.navigate(['/']);
                    },
                    (err) => {
                        console.log(err);
                        this.wrongPwOrUserName = true;
                    }
                );
        }
    }
}
