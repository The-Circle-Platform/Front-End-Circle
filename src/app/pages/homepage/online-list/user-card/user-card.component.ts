import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/Domain/Models/User';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input()
  User!: User;

  ngOnInit(): void {
    console.log(this.User);
    if(!this.User){
      this.User = {Id: 0, UserName: "Unknown", IsOnline: false, FollowCount: 1, Email: "unknown", Balance: 0};
    }
  }

}
