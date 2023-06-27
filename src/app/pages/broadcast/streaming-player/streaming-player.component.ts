import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { SecurityService } from '../../../services/authServices/security';
import { ConfigService } from '../../../shared/moduleconfig/config.service';

@Component({
    selector: 'app-streaming-player',
    templateUrl: './streaming-player.component.html',
    styleUrls: ['./streaming-player.component.css'],
})
export class StreamingPlayerComponent implements OnInit, OnDestroy {
    public _hubConnection: signalR.HubConnection | undefined;
    public video: any = 'nothing';

    @Input()
    HostId?: number;

    @Input()
    StreamId?: number;

    constructor(
        private securityService: SecurityService,
        private configService: ConfigService
    ) {}

    ngOnInit() {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7058/" + 'hubs/Livestream')
            .build();

        this._hubConnection
            .start()
            .then(() => {
                console.log('Connection started.');
            })
            .catch((err: any) => {
                console.error(err.toString());
            });
    }

    ngOnDestroy(): void {
        this._hubConnection?.stop();
    }

    @ViewChild('videoPlayer') videoPlayer: any;

    playVideo() {
        console.log("Klik op player")
        console.log(this._hubConnection instanceof HubConnection);
        if (this._hubConnection instanceof HubConnection) {
            console.log("Connectie ontvangen!");
            console.log(this.StreamId);
            this._hubConnection.on(
                `Stream-${this.StreamId}`,
                async (data: any) => {
                    console.log("Hier is een stream ontvangen");
                    console.log(data);
                    try {
                        await base64ToBlob(data)
                            .then((blob) => {
                                const videoURL = URL.createObjectURL(blob);
                                this.videoPlayer.nativeElement.src =
                                    videoURL;
                                this.videoPlayer.nativeElement.play();
                            })
                            .catch((error) => {
                                // Handle any errors
                                console.error(error);
                            });
                    } catch (error) {
                        // Handle any errors
                        console.error(error);
                    }

                    // if (
                    //     this.securityService.verify(
                    //         data.originalData,
                    //         data.signature
                    //     )
                    // ) {
                    //     console.log('Data chunk: ', data.originalData.chunk);
                    // }
                }
            );
        }
    }
}

async function base64ToBlob(base64String: string): Promise<Blob> {
    //video/x-matroska;codecs=avc1 misschien data: dit ipv applicaton blah.
    const response = await fetch(
        `data:application/octet-stream;base64,${base64String}`
    );
    const blob = await response.blob();
    return blob;
}
