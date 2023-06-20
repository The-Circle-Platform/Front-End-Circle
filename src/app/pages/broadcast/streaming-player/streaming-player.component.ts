import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { HubConnection } from "@microsoft/signalr";
import { UserModel } from "../broadcast-page/VideoStreamingService";
import * as signalR from '@microsoft/signalr';
import { DomSanitizer } from '@angular/platform-browser';




@Component({
    selector: 'app-streaming-player',
    templateUrl: './streaming-player.component.html',
    styleUrls: ['./streaming-player.component.css']
})
export class StreamingPlayerComponent implements OnInit, OnDestroy {
    public _hubConnection: signalR.HubConnection | undefined;
    public mediaSource:any;
    public url:any;
    public sourceBuffer:any;
    public socket:any;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7058/hubs/Livestream')
            .build();

        this._hubConnection.start().then(() => {
            console.log('Connection started.');
        }).catch((err: any) => {
            console.error(err.toString());
        });

        this.mediaSource = new MediaSource();
        this.url = URL.createObjectURL(this.mediaSource);
        this.sourceBuffer = this.mediaSource.addSourceBuffer('video/x-matroska;codecs=avc1');
        this.socket = new WebSocket('ws://localhost:8090');
    }

    ngOnDestroy(): void {
        this._hubConnection?.stop();
    }

    @ViewChild('videoPlayer') videoPlayer: any;


    playVideo() {
        if (this._hubConnection instanceof HubConnection) {
            this._hubConnection.on('test', async (data: UserModel) => {
                console.log(data.stream);
                try {
                    await base64ToBlob(data.stream).then((blob) => {
                        this.videoPlayer.nativeElement.src = this.url;
                        this.mediaSource.addEventListener('sourceopen', () => {


                            this.sourceBuffer.appendBuffer(blob)
                            this.socket.addEventListener('livestream', (event : any) => {
                                console.log('event.data: ', event.data)
                                this.sourceBuffer.appendBuffer(event.data);
                            });
                        });
                    }).catch((error) => {
                        // Handle any errors
                        console.error(error);
                    });
                } catch (error) {
                    // Handle any errors
                    console.error(error);
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

