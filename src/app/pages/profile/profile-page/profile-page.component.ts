import { Component } from '@angular/core';
import { PfpUser } from 'src/app/Domain/Models/User';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent {
    PfpUser: PfpUser | undefined;

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
                this.PfpUser!.Pfp = {
                    ImageName: imageFile.name,
                    Base64Image: image,
                };
            };
        }
    }
}
