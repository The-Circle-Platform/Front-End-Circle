import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, interval, Observable } from "rxjs";
import { User } from "src/app/Domain/Models/User";

@Component({
  selector: "app-online-list",
  templateUrl: "./online-list.component.html",
  styleUrls: ["./online-list.component.css"],
})
export class OnlineListComponent implements OnInit {
  value: Boolean = true;
  refresher: Observable<any>;
  list$: BehaviorSubject<User[] | undefined>;

  users: User[] = [];
  currentSortOrder: "asc" | "desc" | "status" = "asc";

  constructor(private http: HttpClient) {
    this.list$ = new BehaviorSubject<User[] | undefined>(undefined);
    this.refresher = new Observable<any>();
  }

  // TODO: Link to stream function needs to be implemented.

  ngOnInit(): void {
    //this.refresher = this.http.get<User[]>("https://localhost:7058/api/user");

    // TODO: Decomment when function works fully
    this.RefreshList();
  }

  RefreshList() {
    //let value = true;
    interval(2000).subscribe(() => {
      let ss = this.http
        .get<User[]>("https://localhost:7058/api/user")
        .subscribe((e) => {
          this.users = this.SortList(e);
          //Will assign new value to behavioursubject.
          /*value = !value;
        e[0].isOnline = value;*/

          this.Refresh(e);

          //Will unsubscribe, so that this observable can be reused multiple times.
          ss.unsubscribe();
        });
    });
  }

  SortList(value: User[]): User[] {
    if (this.currentSortOrder == "asc") {
      return value.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (this.currentSortOrder == "desc") {
      return value.sort((a, b) => b.userName.localeCompare(a.userName));
    } else {
      return value.sort((a: User, b: User) => {
        if (a.isOnline && !b.isOnline) {
          return -1;
        } else if (!a.isOnline && b.isOnline) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  toggleSortOrder(order: "asc" | "desc" | "status"): void {
    this.currentSortOrder = order;
    this.users = this.SortList(this.users);
  }

  Refresh(newUserList: User[]) {
    this.list$.next(newUserList);
  }
}
