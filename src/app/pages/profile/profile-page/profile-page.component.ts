import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../Domain/Models/User';
import { SecurityService } from '../../../services/authServices/security';
import { UserService } from '../../../services/userServices/user.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    pfpUser: User | undefined;
    public user: User | undefined;
    private subscription: Subscription | undefined;
    public hasIntegrity: boolean = true;
    constructor(
        private userService: UserService,
        private securityService: SecurityService
    ) {}

    ngOnInit(): void {
        const test = localStorage.getItem('Pop');
        this.user = JSON.parse(test!) as User;

        this.subscription = this.userService
            .Get(this.user.id)
            .subscribe((res) => {
                console.log('res: ', res);
                this.hasIntegrity = this.securityService.verify(
                    res.originalData,
                    res.signature
                );
                console.log('this.hasIntegrity ', this.hasIntegrity);
                if (this.hasIntegrity) {
                    this.user = res.originalData;
                }
            });
    }

    onSelectFile(event: any) {
        if (event.target.files && event.target.files[0]) {
            const imageFile: File = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => {
                const image = reader.result as string;

                if (!this.pfpUser && this.user) {
                    this.pfpUser = {
                        id: this.user?.id,
                        userName: this.user?.userName,
                        isOnline: this.user?.isOnline,
                        followCount: this.user?.followCount,
                        balance: this.user?.balance,
                        imageName: imageFile.name,
                        base64Image: image,
                        timeStamp: null,
                    };
                }
            };
        }
    }

    onSubmit(): void {
        if (this.pfpUser) {
            this.userService.uploadPfp(this.pfpUser).subscribe(
                (reply: any) => {
                    console.log('reply: ', reply);
                    location.reload();
                },
                (err) => {
                    console.log('Upload pfp error: ' + err);
                    location.reload();
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
