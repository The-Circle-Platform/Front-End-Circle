import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/authServices/auth.service';
import { DecodedToken, User } from '../../../Domain/Models/User';
import { UserService } from '../../../services/userServices/user.service';
import { Subscription } from 'rxjs';
import { securityService } from '../../../services/authServices/security';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    pfpUser: User | undefined;

    private userName: String | undefined;
    public user: User | undefined;
    private subscription: Subscription | undefined;
    public hasIntegrity: boolean = true;
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private securityService: securityService
    ) {}

    // ngOnInit(): void {
    //     var jwt = localStorage.getItem("token");
    //     if(jwt) {
    //       const tokenUser = this.authService.decodeJwtToken(jwt) as DecodedToken;
    //       console.log(tokenUser)
    //       this.userName = tokenUser["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    //       console.log(this.userName);
    //
    //       this.subscription = this.userService.Get(tokenUser.Id).subscribe((res => {
    //           this.hasIntegrity = this.securityService.verify(res.originalData, res.signature);
    //           if(this.hasIntegrity) {
    //             console.log(res);
    //             this.user = res.originalData;
    //             console.log(this.user?.userName);
    //           }
    //
    //       }))
    //     }
    //   }

    ngOnInit(): void {
        const jwt = localStorage.getItem('token');
        if (jwt) {
            const tokenUser = this.authService.decodeJwtToken(
                jwt
            ) as DecodedToken;
            console.log(tokenUser);
            this.userName =
                tokenUser[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                ];
            console.log(this.userName);

            this.subscription = this.userService
                .Get(tokenUser.Id)
                .subscribe((res) => {
                    console.log(res);
                    this.hasIntegrity = this.securityService.verify(
                        res.originalData,
                        res.signature
                    );
                    if (this.hasIntegrity) {
                        this.user = res.originalData;
                        console.log(this.user?.balance);
                    }
                });
        }
    }

    onSelectFile(event: any) {
        console.log('onSelectFile');
        if (event.target.files && event.target.files[0]) {
            const imageFile: File = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => {
                const image = reader.result as string;

                if (!this.pfpUser) {
                    this.pfpUser = {
                        id: 1,
                        userName: 'test',
                        isOnline: true,
                        followCount: 0,
                        ImageName: imageFile.name,
                        Base64Image: image,
                        balance: 0,
                    };
                }
            };
        }
    }

    onSubmit(): void {
        if (this.pfpUser) {
            this.userService.uploadPfp(this.pfpUser).subscribe(
                (reply: any) => {
                    console.log(reply);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
