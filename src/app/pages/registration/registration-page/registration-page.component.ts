import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/authServices/auth.service';

@Component({
    selector: 'app-registration-page',
    templateUrl: './registration-page.component.html',
    styleUrls: ['./registration-page.component.css'],
})
export class RegistrationPageComponent {
    subs!: Subscription;
    registerForm!: FormGroup;
    hide = true;

    constructor(
        private fb: FormBuilder,
        public authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            email: ['', Validators.required],
            userName: ['', Validators.required],
            role: [''],
        }) as FormGroup;
    }

    onSubmit(): void {
        if (
            this.registerForm.value.email != '' &&
            this.registerForm.value.userName != ''
        ) {
            this.authService
                .register(
                    this.registerForm.value.email,
                    this.registerForm.value.userName,
                    this.registerForm.value.role
                )
                .subscribe(
                    () => {
                        this.router.navigate(['/']);
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }
}
