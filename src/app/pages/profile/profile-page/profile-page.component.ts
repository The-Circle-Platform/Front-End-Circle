import { Component } from '@angular/core';
import { PfpUser } from '../../../Domain/Models/User';
import { UserService } from '../../../services/userServices/user.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent {
    PfpUser: PfpUser | undefined;

    constructor(public userService: UserService) {}

    ngOnInit(): void {}

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

                console.log('Here', this.PfpUser); // ------- How does this work? -Xin?

                if (this.PfpUser) {
                    this.PfpUser.Pfp = {
                        ImageName: imageFile.name,
                        Base64Image: image,
                    };
                }
            };
        }
    }

    onSubmit(): void {
        console.log('Here', this.PfpUser);
        if (this.PfpUser) {
            this.userService.uploadPfp(this.PfpUser);
        }
    }
}
