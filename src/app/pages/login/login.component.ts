import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authServices/auth.service';
import { SecurityService } from '../../services/authServices/security';

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
    public hasIntegrity: boolean = true;
    privKey: string = '';

    constructor(
        private fb: FormBuilder,
        public authService: AuthService,
        private router: Router,
        private securityService: SecurityService
    ) {}

    ngOnInit(): void {
        this.subs = this.authService
            .getUserFromLocalStorage()
            .subscribe((user: string | undefined) => {
                if (user) {
                    console.log('User is already logged in');
                    this.router.navigate(['/']);
                }
            });

        this.loginForm = this.fb.group({
            userName: ['', Validators.required],
        }) as FormGroup;
    }

    onPrivateKeySelected(event: any): void {
        const privateKeyFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const fileContent: string = e.target.result;
            this.privKey = fileContent;
            console.log(fileContent);
        };

        reader.readAsText(privateKeyFile);
    }

    onSubmit(): void {
        if (this.loginForm.value.userName !== '' && this.privKey !== null) {
            this.authService
                .login(this.loginForm.value.userName, this.privKey)
                .subscribe(
                    (reply: any) => {
                        location.reload();
                        console.log('reply: ', reply);
                        this.authService.StoreUser(
                            reply.originalLoad.websiteUser
                        );

                        this.router.navigate(['/']);
                        this.hasIntegrity = this.securityService.verify(
                            reply.originalLoad,
                            reply.signature
                        );

                        if (this.hasIntegrity) {
                            if (reply.originalLoad.isVerified) {
                                this.router.navigate(['/']);
                            } else {
                                localStorage.removeItem('privKey');
                                this.wrongPwOrUserName = true;
                            }
                        }
                    },
                    (err) => {
                        console.log('Login error: ', err);
                        localStorage.removeItem('privKey');
                        this.wrongPwOrUserName = true;
                    }
                );
        }
    }
}
