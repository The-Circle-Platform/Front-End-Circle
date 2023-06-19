import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../services/authServices/auth.service";
import {DecodedToken, User, userDTO} from "../../../Domain/Models/User";
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
  public hasIntegrity: boolean = true;
  constructor(private authService: AuthService, private userService: userService, private securityService: securityService) {}

ngOnInit(): void {
    var jwt = localStorage.getItem("token");
    if(jwt) {
      const tokenUser = this.authService.decodeJwtToken(jwt) as DecodedToken;
      console.log(tokenUser)
      this.userName = tokenUser["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      console.log(this.userName);

      this.subscription = this.userService.Get(tokenUser.Id).subscribe((res => {
          this.hasIntegrity = this.securityService.verify(res.originalData, res.signature);
          if(this.hasIntegrity) {
            console.log(res);
            this.user = res.originalData;
            console.log(this.user?.userName);
          }

      }))
    }
  }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

}
