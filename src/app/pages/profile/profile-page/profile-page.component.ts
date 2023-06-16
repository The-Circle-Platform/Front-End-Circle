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
        //    this.userService.getPfp(userId).subscribe((pfpUser) => {
        //         this.pfpUser = pfpUser;
        //     })
    }

    onSelectFile(event: any) {
        console.log('onSelectFile');
        if (event.target.files && event.target.files[0]) {
            const imageFile: File = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url
            //console.dir(event.target.files[0])
            reader.onload = () => {
                // called once readAsDataURL is completed
                // set the image value to the Base64 string -> can be saved in dtb
                const image = reader.result as string;
                console.log('Length van afbeeldinge');
                console.log(image.length);

                /* if (this.pfpUser) { */
                this.pfpUser = {
                    id: 0,
                    userName: '',
                    isOnline: true,
                    followCount: 0,
                    ImageName: imageFile.name,
                    Base64Image: image,
                };
                //}
                console.log('Here', this.pfpUser?.Base64Image); // ------- How does this work?
            };
        }
    }

    onSubmit(): void {
        console.log('Here', this.pfpUser);
        if (this.pfpUser) {
            this.userService.uploadPfp(this.pfpUser);
        }
    }
}
