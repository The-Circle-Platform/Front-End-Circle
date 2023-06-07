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
  constructor() { }

  ngOnInit(): void {
    console.log(this.User);
    if(!this.User){
      this.User = {id: 0, userName: "Unknown", isOnline: false, followCount: 1};
    }
  }

}
