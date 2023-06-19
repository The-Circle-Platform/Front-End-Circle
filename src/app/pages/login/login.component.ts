import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authServices/auth.service';
import {securityService} from "../../services/authServices/security";
import {userDTO} from "../../Domain/Models/User";

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
        private securityService: securityService
    ) {}

    ngOnInit(): void {
        this.subs = this.authService
            .getUserFromLocalStorage()
            .subscribe((user: string | undefined) => {
                if (user) {
                    console.log('Gebruiker is al ingelogd');
                    //this.router.navigate(['/']);
                }
            });

        this.loginForm = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
        }) as FormGroup;
    }

    onSubmit(): void {
        console.log(this.loginForm.value);
        if (
            this.loginForm.value.userName != '' &&
            this.loginForm.value.password != ''
        ) {
            var encryptedPassword = this.securityService.encryptWithServerPublicKey(this.loginForm.value.password);
            this.authService
                .login(
                    this.loginForm.value.userName,
                    encryptedPassword
                )
                .subscribe(
                    (reply: any) => {
                        //location.reload();
                        console.log(reply);
                        this.authService.StoreUser(reply.originalLoad.websiteUser);
                         this.hasIntegrity = this.securityService.verify(reply.originalLoad.websiteUser, reply.signature);

                        console.log(this.hasIntegrity)
                        if(this.hasIntegrity) {
                            location.reload();
                            localStorage.setItem('token', reply.originalLoad.token);
                            localStorage.setItem('privateKey', reply.originalLoad.privateKey);
                            localStorage.setItem('publicKey', reply.originalLoad.publicKey);
                            //this.router.navigate(['/']);
                        }


                    },
                    (err) => {
                        console.log(err);
                        this.wrongPwOrUserName = true;
                    }
                );
        }
    }
}
