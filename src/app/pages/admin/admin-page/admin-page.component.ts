import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../Domain/Models/User';
import { UserService } from '../../../services/userServices/user.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
    registerForm = this.formBuilder.group({
        userName: '',
        email: '',
        isAdmin: false,
    });

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}
    ngOnInit(): void {}

    onSubmit() {
        console.log(this.registerForm.value);
        const admin = JSON.parse(localStorage.getItem('Pop')!) as User;
        console.log(admin.userName);
        if (
            this.registerForm.value.email != '' &&
            this.registerForm.value.userName != ''
        ) {
            if (!this.registerForm.value.isAdmin) {
                const userToRegister = {
                    userName: this.registerForm.value.userName,
                    email: this.registerForm.value.email,
                    userNameOfAdmin: admin.userName,
                    timeStamp: Date.now(),
                };

                this.userService.Create(userToRegister).subscribe((res) => {
                    console.log(res);
                    this.router.navigate(['/']);
                });
            } else {
                const adminToRegister = {
                    userName: this.registerForm.value.userName,
                    email: this.registerForm.value.email,
                    userNameOfAdmin: admin.userName,
                    timeStamp: Date.now(),
                };
                this.userService
                    .CreateAdmin(adminToRegister)
                    .subscribe((res) => {
                        console.log(res);
                        this.router.navigate(['/']);
                    });
            }
        }
    }
}
