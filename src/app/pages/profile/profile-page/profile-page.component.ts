import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../services/authServices/auth.service";
import {DecodedToken, User} from "../../../Domain/Models/User";
import {userService} from "../../../services/userServices/user.service";
import {Subscription} from "rxjs";
import {securityService} from "../../../services/authServices/security";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy{

  private userName: String | undefined;
  public user: User | undefined;
  private subscription: Subscription | undefined;
  constructor(private authService: AuthService, private userService: userService, private securityService: securityService) {}

ngOnInit(): void {
  console.log("henk")
  this.securityService.sign('henk');
    var jwt = localStorage.getItem("token");
    if(jwt) {
      const tokenUser = this.authService.decodeJwtToken(jwt) as DecodedToken;
      this.userName = tokenUser["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      console.log(this.userName);

      this.subscription = this.userService.Get(tokenUser.id).subscribe((res => {
          console.log(res)
          this.user = res;
          console.log(this.user);
      }))


    }

  }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

}
