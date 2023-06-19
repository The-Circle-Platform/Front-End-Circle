import { Component, OnInit, OnDestroy } from '@angular/core';
import { HubConnection } from "@microsoft/signalr";
import { UserModel } from "../broadcast-page/VideoStreamingService";
import { DomSanitizer } from "@angular/platform-browser";
import * as signalR from '@microsoft/signalr';

@Component({
    selector: 'app-streaming-player',
    templateUrl: './streaming-player.component.html',
    styleUrls: ['./streaming-player.component.css']
})
export class StreamingPlayerComponent implements OnInit, OnDestroy {
    public _hubConnection: signalR.HubConnection | undefined;
    public videoSrc: any;
    public url: any;

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
        // this._hubConnection?.stop();
    }

    playVideo() {
        console.log("start vid");
        const streamBlobs: Blob[] = [];
        let sourceBuffer: SourceBuffer | null = null;

        const mediaSource = new MediaSource();
        this.url = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener("sourceopen", () => {
            sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');

            sourceBuffer.addEventListener("update", () => {
                if (streamBlobs.length > 0 && !sourceBuffer!.updating) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.result instanceof ArrayBuffer && sourceBuffer) {
                            try {
                                sourceBuffer.appendBuffer(reader.result);
                            } catch (error) {
                                console.error("Failed to append buffer:", error);
                                // Handle error (e.g., close the MediaSource or restart the stream)
                            }
                        }
                    };
                    reader.readAsArrayBuffer(streamBlobs[0]);
                    streamBlobs.shift();
                }
            });

            if (this._hubConnection instanceof HubConnection) {
                this._hubConnection.on('test', (data: UserModel) => {
                    console.log(data.stream);

                    streamBlobs.push(this.base64ToBlob(data.stream, "video/webm; codecs=\"vp8\""));

                    if (!sourceBuffer!.updating) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (reader.result instanceof ArrayBuffer && sourceBuffer && mediaSource.readyState === 'open') {
                                try {
                                    sourceBuffer.appendBuffer(reader.result);
                                } catch (error) {
                                    console.error("Failed to append buffer:", error);
                                    // Handle error (e.g., close the MediaSource or restart the stream)
                                }
                            }
                        };
                        reader.readAsArrayBuffer(streamBlobs[0]);
                        streamBlobs.shift();
                    }
                });
            }
        });

        mediaSource.addEventListener("sourceended", () => {
            console.log("MediaSource ended.");
            // Handle the end of the stream (e.g., clean up resources, stop playback)
        });

        mediaSource.addEventListener("sourceclose", () => {
            console.log("MediaSource closed.");
            // Handle the closure of the MediaSource (e.g., clean up resources, stop playback)
        });

        mediaSource.addEventListener("error", (error) => {
            console.error("MediaSource error:", error);
            // Handle error (e.g., close the MediaSource or restart the stream)
        });
    }

    base64ToBlob(base64String: string, contentType: string) {
        const byteCharacters = atob(base64String);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    }
}
