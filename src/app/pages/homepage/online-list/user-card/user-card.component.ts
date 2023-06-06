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
  }

}
