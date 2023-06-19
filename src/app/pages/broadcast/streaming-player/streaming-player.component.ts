import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { HubConnection } from "@microsoft/signalr";
import { UserModel } from "../broadcast-page/VideoStreamingService";
import * as signalR from '@microsoft/signalr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-streaming-player',
    templateUrl: './streaming-player.component.html',
    styleUrls: ['./streaming-player.component.css']
})
export class StreamingPlayerComponent implements OnInit, OnDestroy {
    public _hubConnection: signalR.HubConnection | undefined;
    public video: any = "nothing"


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
            });
        }
    }



    //codecs=avc1;
    //
    // base64ToVideo(base64String: string): SafeUrl {
    //     const videoBlob = this.base64ToBlob(base64String, 'video/x-matroska; codecs=\\"avc1\\"'); // Replace 'video/mp4' with the appropriate MIME type of your video
    //
    //     URL.createObjectURL(videoBlob);
    //
    //     const videoUrl = URL.createObjectURL(videoBlob);
    //
    //     // const videoBlob = new Blob(this.chunks, {type: 'video/x-matroska; codecs=\\"avc1\\"'});
    //     // const videoUrl = URL.createObjectURL(videoBlob);
    //     const a = document.createElement('a');
    //     a.href = videoUrl;
    //     a.download = 'captured-video.mp4';
    //     a.click();
    //     // URL.revokeObjectURL(videoUrl);
    //     this.video = URL.revokeObjectURL(videoUrl);
    //     this.ngOnDestroy()
    //
    //     return this.sanitizer.bypassSecurityTrustUrl(videoUrl);
    // }
    //
    // base64ToBlob(base64String: string, mimeType: string): Blob {
    //     const byteArrays = [];
    //
    //     console.log(base64String)
    //
    //     for (let offset = 0; offset < base64String.length; offset += 512) {
    //         const slice = base64String.slice(offset, offset + 512);
    //         const byteNumbers = new Array(slice.length);
    //
    //         for (let i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //         }
    //         const byteArray = new Uint8Array(byteNumbers);
    //         byteArrays.push(byteArray);
    //     }
    //     return new Blob(byteArrays, { type: mimeType });
    // }

}


async function base64ToBlob(base64String: string): Promise<Blob> {
    //video/x-matroska;codecs=avc1 misschien data: dit ipv applicaton blah.
    const response = await fetch(`data:application/octet-stream;base64,${base64String}`);
    const blob = await response.blob();
    return blob;
}