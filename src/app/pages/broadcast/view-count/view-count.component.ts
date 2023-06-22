import { Component, Input, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from '../../../services/authServices/auth.service';
import { SecurityService } from '../../../services/authServices/security';
import { ViewService } from './viewCounter.service';

@Component({
    selector: 'app-view-count',
    templateUrl: './view-count.component.html',
    styleUrls: ['./view-count.component.css'],
})
export class ViewCountComponent implements OnInit {
    _hubConnection: HubConnection | undefined;
    numberList: any;
    @Input()
    isStreamer: boolean = false;

    @Input()
    HostId: number | undefined;

    @Input()
    StreamId: number | undefined;

    constructor(
        public viewHub: ViewService,
        public securityService: SecurityService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.connect();
    }

    private connect(): void {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(this.viewHub.endpoints)
            .build();

        this._hubConnection.on(
            'UpdateViewerCount' + this.StreamId,
            (message) => {
                console.log('Nummer count');
                console.log(message);
                // Verificatie
                const signature = message.signature;
                const updatedCount = message.originalCount;

                const isValid = this.securityService.verify(
                    updatedCount,
                    signature
                );

                this.numberList = message.originalCount;
            }
        );

        this._hubConnection
            .start()
            .then(async () => {
                console.log('Connection started');
                if (!this.isStreamer) {
                    const ownUserId = this.authService.GetWebUser()?.id;
                    this._hubConnection
                        ?.send('ConnectToStream', this.StreamId, ownUserId)
                        .then();
                }
            })
            .catch((err) =>
                console.log(
                    'error while establishing signalr connection: ' + err
                )
            );
    }
}
