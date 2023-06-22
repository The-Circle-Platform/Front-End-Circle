import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../Domain/Models/User';
import { SecurityService } from '../../../services/authServices/security';
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
    hasIntigrety: boolean = true;

    users: User[] = [];
    currentSortOrder: 'asc' | 'desc' | 'status' = 'asc';

    constructor(
        public userService: UserService,
        public securityService: SecurityService
    ) {
        this.list$ = new BehaviorSubject<User[] | undefined>(undefined);
        this.refresher = new Observable<any>();
    }

    ngOnInit(): void {
        this.RefreshList();
    }

    RefreshList() {
        console.log('Ophalen streamers US-3');
        const ss = this.userService.GetAll().subscribe((e) => {
            console.log(e.originalList);
            this.users = e.originalList as User[];
            this.hasIntigrety = this.securityService.verify(
                e.originalList,
                e.signature!
            );
            if (this.hasIntigrety) {
                console.log('Data has not changed');
            } else {
                console.log('Data is not the same as was send by server');
            }
            this.users = this.SortList(this.users);
            console.log(e.originalList!);
            this.Refresh(e.originalList!);

            ss.unsubscribe();
        });
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
