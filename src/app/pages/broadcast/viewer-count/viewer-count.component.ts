import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
    selector: 'app-viewer-count',
    templateUrl: './viewer-count.component.html',
    styleUrls: ['./viewer-count.component.css'],
})
export class ViewerCountComponent implements OnInit, OnDestroy {
    _hubConnection: HubConnection | undefined;
    numberList: any;
    @Input()
    isStreamer: boolean = false;

    ngOnInit(): void {
        this.connect();
        console.log(this.numberList);
    }

    private connect(): void {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7058/hubs/ViewHub')
            .build();

        this._hubConnection.on('UpdateViewerCount' + 7, (message) => {
            console.log(message);
            console.log('henk');
            this.numberList = message;
        });

        this._hubConnection
            .start()
            .then(async (u) => {
                console.log('Connection started');
                if (!this.isStreamer) {
                    this._hubConnection
                        ?.send('ConnectToStream', {
                            ConnectionId: null,
                            StreamId: 1,
                            UserId: 1,
                        })
                        .then();
                }
            })
            .catch((err) =>
                console.log(
                    'error while establishing signalr connection: ' + err
                )
            );
    }

    ngOnDestroy(): void {}
}
