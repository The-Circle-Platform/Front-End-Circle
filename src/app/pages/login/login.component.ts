import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authServices/auth.service';
import { SecurityService } from '../../services/authServices/security';
import { userDTO } from '../../Domain/Models/User';

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
                    console.log('Gebruiker is al ingelogd');
                    this.router.navigate(['/']);
                }
            });

        this.loginForm = this.fb.group({
            userName: ['', Validators.required],
            inputPrivateKey: ['', Validators.required],
        }) as FormGroup;
    }

    onSubmit(): void {
        console.log(this.loginForm.value);
        if (
            this.loginForm.value.userName != '' &&
            this.loginForm.value.inputPrivateKey != ''
        ) {
            this.authService
                .login(
                    this.loginForm.value.userName,
                    this.loginForm.value.inputPrivateKey
                )
                .subscribe(
                    (reply: any) => {
                        //location.reload();
                        console.log(reply);
                        this.authService.StoreToken(reply.originalLoad.token);
                        this.authService.StoreUser(
                            reply.originalLoad.websiteUser
                        );

                        this.router.navigate(['/']);
                        this.hasIntegrity = this.securityService.verify(
                            reply.originalLoad.websiteUser,
                            reply.signature
                        );

                        console.log(this.hasIntegrity);
                        if (this.hasIntegrity) {
                            if (reply.isVerified) {
                                console.log('henk');
                                //location.reload();
                                // localStorage.setItem('token', reply.originalLoad.token);
                                // localStorage.setItem('privateKey', reply.originalLoad.privateKey);
                                // localStorage.setItem('publicKey', reply.originalLoad.publicKey);
                                //this.router.navigate(['/']);
                            } else {
                                localStorage.removeItem('privKey');
                                this.wrongPwOrUserName = true;
                            }
                        }
                    },
                    (err) => {
                        console.log(err);
                        localStorage.removeItem('privKey');
                        this.wrongPwOrUserName = true;
                    }
                );
        }
    }
}
