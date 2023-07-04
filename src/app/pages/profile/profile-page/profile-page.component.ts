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
    public streamingKey: string;

    constructor(
        private userService: UserService,
        private securityService: SecurityService
    ) {
        this.streamingKey = '';
    }

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('Pop')!) as User;

        this.subscription = this.userService
            .Get(this.user.id)
            .subscribe((res) => {
                this.hasIntegrity = this.securityService.verify(
                    res.originalData,
                    res.signature
                );
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

    generateStreamingKey(): void {
        const username = this.user?.userName;
        const timestamp = Date.now();
        const plainText = {
            username: username,
            timeStamp: timestamp,
        };
        const signature = this.securityService.sign(
            JSON.stringify(plainText).toLowerCase()
        );

        const streamingKey = `${username}?sign=${signature}-${timestamp}`;
        this.streamingKey = streamingKey;
    }

    copyToClipboard(): void {
        const element = document.createElement('textarea');
        element.value = this.streamingKey;
        document.body.appendChild(element);
        element.select();
        document.execCommand('copy');
        document.body.removeChild(element);
    }

    onSubmit(): void {
        if (this.pfpUser) {
            this.userService.uploadPfp(this.pfpUser).subscribe(
                () => {
                    location.reload();
                },
                (err) => {
                    console.log('Upload pfp error: ', err);
                    location.reload();
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
