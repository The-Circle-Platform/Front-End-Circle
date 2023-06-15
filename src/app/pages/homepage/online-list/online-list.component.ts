import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { User } from 'src/app/Domain/Models/User';
import { LoggerService } from 'src/app/services/loggerServices/logger.service';
import { UserService } from 'src/app/services/userServices/user.service';

@Component({
    selector: 'app-online-list',
    templateUrl: './online-list.component.html',
    styleUrls: ['./online-list.component.css'],
})
export class OnlineListComponent implements OnInit {
    value: Boolean = true;
    refresher: Observable<any>;
    list$: BehaviorSubject<User[] | undefined>;

    users: User[] = [];
    currentSortOrder: 'asc' | 'desc' | 'status' = 'asc';

    constructor(
        public userService: UserService,
        private http: HttpClient,
        private logger: LoggerService
    ) {
        this.list$ = new BehaviorSubject<User[] | undefined>(undefined);
        this.refresher = new Observable<any>();
    }

    // TODO: Link to stream function needs to be implemented.

    ngOnInit(): void {
        // this.logger.trace('converting data to export');
        //this.refresher = this.http.get<User[]>("https://localhost:7058/api/user");

        // TODO: Decomment when function works fully
        this.RefreshList();
    }

    RefreshList() {
        console.log('Ophalen streamers US-3');
        //Subscribes to interval.
        interval(2000).subscribe(() => {
            //Next step is to request users to api.
            const ss = this.http
                .get<User[]>('https://localhost:7058/api/user')
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

    Refresh(newUserList: User[]) {
        this.list$.next(newUserList);
    }

    DummyData(): User[] {
        return [
            { id: 66, isOnline: true, userName: 'TestDave', followCount: 13 },
            {
                id: 67,
                isOnline: false,
                userName: 'TestLinda',
                followCount: 138,
            },
        ];
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
