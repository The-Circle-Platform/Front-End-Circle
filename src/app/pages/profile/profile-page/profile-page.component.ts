import { Component } from '@angular/core';
import { User } from '../../../Domain/Models/User';
import { UserService } from '../../../services/userServices/user.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent {
    pfpUser: User | undefined;

    constructor(public userService: UserService) {}

    ngOnInit(): void {
        const userId = localStorage.getItem('userId');
        if (userId) {
            // this.userService.Get(userId).subscribe((pfpUser) => {
            //     this.pfpUser = pfpUser;
            // });
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
                console.log('Length van afbeeldinge');
                console.log(image.length);

                if (!this.pfpUser) {
                    this.pfpUser = {
                        id: 1,
                        userName: 'test',
                        isOnline: false,
                        followCount: 1,
                        followers: [],
                        following: [],
                        ImageName: '',
                        Base64Image: ''
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
}
