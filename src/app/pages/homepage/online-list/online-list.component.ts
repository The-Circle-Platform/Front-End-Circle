import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { User } from '../../../Domain/Models/User';
import { LoggerService } from '../../../services/loggerServices/logger.service';
import { UserService } from '../../../services/userServices/user.service';

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
        private logger: LoggerService,
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
        //Subscribes to interval per minute
        interval(60000).subscribe(() => {
            //Next step is to request users to api.
            const serve = this.userService.GetAll().subscribe((ul)=>{
                this.users = ul;
                this.SortList(this.users);
                // Verify content

                this.Refresh(ul);

                serve.unsubscribe();
            });
        });
    }

    Refresh(newUserList: User[]) {
        this.list$.next(newUserList);
    }

    DummyData(): User[] {
        return [
            { id: 66, isOnline: true, userName: 'TestDave', followCount: 13, followers: [], following: [] },
            {
                id: 67,
                isOnline: false,
                userName: 'TestLinda',
                followCount: 138,
                followers: [],
                following: []
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
