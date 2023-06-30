import { Component, Input, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from 'src/app/Domain/Models/User';
import { AuthService } from '../../../services/authServices/auth.service';
import { SecurityService } from '../../../services/authServices/security';
import { ViewService } from './viewCounter.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-view-count',
    templateUrl: './view-count.component.html',
    styleUrls: ['./view-count.component.css'],
})
export class ViewCountComponent implements OnInit {
    _hubConnection: HubConnection | undefined;
    numberList: number;
    @Input()
    isStreamer: boolean = false;

    @Input()
    HostId: number | undefined;

    @Input()
    StreamId: number | undefined;
    user!: User;

    constructor(
        public viewHub: ViewService,
        public securityService: SecurityService,
        private authService: AuthService,
        private router: Router
    ) {
        this.numberList = 0;
    }

    ngOnInit(): void {
        this.connect();
        this.user = JSON.parse(localStorage.getItem('Pop')!) as User;
    }

    private connect(): void {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(this.viewHub.endpoints)
            .build();

        this._hubConnection.on(`IsNotAllowed-${this.StreamId}`, (message) => {
            const original = message.originalAllowWatch;
            const signature = message.signature;
            const IsValid = this.securityService.verify(original, signature);

            if (IsValid) {
                console.log('Warning! Maximum has been exceeded');
                this.router.navigate(['../']);
            }
        });

        this._hubConnection.on(
            'UpdateViewerCount' + this.StreamId,
            (message) => {
                // Verificatie
                const signature = message.signature;
                const updatedCount = message.originalCount;

                const isValid = this.securityService.verify(
                    updatedCount,
                    signature
                );

                if (isValid) {
                    this.numberList = message.originalCount;
                } else {
                    console.warn('Data is tampered');
                }
            }
        );

        this._hubConnection
            .start()
            .then(async () => {
                if (!this.isStreamer) {
                    const ownUserId = this.authService.GetWebUser()?.id;
                    this._hubConnection
                        ?.send('ConnectToStream', ownUserId, this.StreamId)
                        .then();
                }
            })
            .catch((err) =>
                console.log(
                    'Error while establishing signalr connection: ',
                    err
                )
            );
    }
}
