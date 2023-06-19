import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { User, userDTO } from 'src/app/Domain/Models/User';
import { LoggerService } from 'src/app/services/loggerServices/logger.service';
import { UserService } from 'src/app/services/userServices/user.service';
import { securityService } from 'src/app/services/authServices/security';

@Component({
    selector: 'app-online-list',
    templateUrl: './online-list.component.html',
    styleUrls: ['./online-list.component.css'],
})
export class OnlineListComponent implements OnInit {
    value: Boolean = true;
    refresher: Observable<any>;
    list$: BehaviorSubject<User[] | undefined>;
    hasIntigrety: boolean = true;

    users: User[] = [];
    currentSortOrder: 'asc' | 'desc' | 'status' = 'asc';

    constructor(
        public userService: UserService,
        private http: HttpClient,
        private logger: LoggerService,
        public securityService: securityService
    ) {
        this.list$ = new BehaviorSubject<User[] | undefined>(undefined);
        this.refresher = new Observable<any>();
    }

    // TODO: Link to stream function needs to be implemented.

    ngOnInit(): void {
        this.RefreshList();
    }

    RefreshList() {
        console.log('Ophalen streamers US-3');
        //Subscribes to interval.
        //interval(200000000000).subscribe(() => {
        //Next step is to request users to api.

                    // console.log(e.originalList)
                    this.users = e.originalList as User[];
                    // console.log(this.users)
                    this.users = this.SortList(this.users);
                    // console.log("VERIFYING REQUEST")
                    // console.log(e);
                     this.hasIntigrety = this.securityService.verify(e.originalList, e.signature!)
                    if(this.hasIntigrety) {
                        console.log("Data has not changed");
                    }
                    else {
                        console.log("Data is not the same as was send by server");

                    }
                    //Will assign new value to behavioursubject.
                    /*value = !value;
          e[0].isOnline = value;*/

            this.Refresh(e.originalList!);

            //Will unsubscribe, so that this observable can be reused multiple times.
            ss.unsubscribe();
        });
        //});
    }

    Refresh(newUserList: User[]) {
        this.list$.next(newUserList);
    }

    SortList(value: User[]): User[] {
        if (this.currentSortOrder == 'asc') {
            return value.sort((a, b) => a.userName.localeCompare(b.userName));
        } else if (this.currentSortOrder == 'desc') {
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

    toggleSortOrder(order: 'asc' | 'desc' | 'status'): void {
        this.currentSortOrder = order;
        this.users = this.SortList(this.users);
    }
}
