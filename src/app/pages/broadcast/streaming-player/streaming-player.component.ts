import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import { HubConnection } from "@microsoft/signalr";
import {StreamChunkDTO} from "../broadcast-page/VideoStreamingService";
import * as signalR from '@microsoft/signalr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {securityService} from "../../../services/authServices/security";

@Component({
    selector: 'app-streaming-player',
    templateUrl: './streaming-player.component.html',
    styleUrls: ['./streaming-player.component.css']
})
export class StreamingPlayerComponent implements OnInit, OnDestroy {
    public _hubConnection: signalR.HubConnection | undefined;
    public video: any = "nothing"
    @Input()
    HostId?: number

    constructor(private sanitizer: DomSanitizer, private securityService: securityService) { }

    ngOnInit() {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7058/hubs/Livestream')
            .build();

        this._hubConnection.start().then(() => {
            console.log('Connection started.');
        }).catch((err: any) => {
            console.error(err.toString());
        });



    }

    ngOnDestroy(): void {
        this._hubConnection?.stop();
    }

    @ViewChild('videoPlayer') videoPlayer: any;


    playVideo() {
        if (this._hubConnection instanceof HubConnection) {
            this._hubConnection.on(`Stream-${this.HostId}}`, async (data: StreamChunkDTO) => {

                if (this.securityService.verify(data.OriginalData, data.Signature)){
                    console.log(data.OriginalData.chunk);
                    try {
                        await base64ToBlob(data.OriginalData.chunk).then((blob) => {
                            const videoURL = URL.createObjectURL(blob);
                            this.videoPlayer.nativeElement.src = videoURL;
                            this.videoPlayer.nativeElement.play();
                        }).catch((error) => {
                            // Handle any errors
                            console.error(error);
                        });
                    } catch (error) {
                        // Handle any errors
                        console.error(error);
                    }
                }
            });
        }
    }
}


async function base64ToBlob(base64String: string): Promise<Blob> {
    //video/x-matroska;codecs=avc1 misschien data: dit ipv applicaton blah.
    const response = await fetch(`data:application/octet-stream;base64,${base64String}`);
    const blob = await response.blob();
    return blob;
}