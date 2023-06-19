import {Component, OnDestroy, OnInit} from '@angular/core';
import { PfpUser } from '../../../Domain/Models/User';
import {AuthService} from "../../../services/authServices/auth.service";
import {DecodedToken, User} from "../../../Domain/Models/User";
import {UserService} from "../../../services/userServices/user.service";
import {Subscription} from "rxjs";
import {securityService} from "../../../services/authServices/security";

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit,OnDestroy{
    PfpUser: PfpUser | undefined;
    private userName: String | undefined;
    public user: User | undefined;
    private subscription: Subscription | undefined;
    constructor( private authService: AuthService, private userService: UserService, private securityService: securityService) {}


    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
      }
    
    ngOnInit(): void {
       console.log("henk")
        this.securityService.sign('henk');
          const jwt = localStorage.getItem("token");
          if(jwt) {
            const tokenUser = this.authService.decodeJwtToken(jwt) as DecodedToken;
            this.userName = tokenUser["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            console.log(this.userName);
      
            this.subscription = this.userService.Get(tokenUser.Id).subscribe((res => {
                console.log(res)
                this.user = res;
                console.log(this.user);
            }))
      
      
          }
      
        }
  
      onSubmit(): void {
          console.log('Here', this.PfpUser);
          if (this.PfpUser) {
              this.userService.uploadPfp(this.PfpUser);
          }
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

                console.log('Here', this.PfpUser); // ------- How does this work?

                if (this.PfpUser) {
                    this.PfpUser.Pfp = {
                        ImageName: imageFile.name,
                        Base64Image: image,
                    };
                }
            };
        }
    }
}
