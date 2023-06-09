import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoStreamingService {
    private hubConnection: signalR.HubConnection = undefined!; // Add the initializer here
    private videoStreamSubject: Subject<string> = new Subject<string>();


    public startVideoStreaming( chunks: Blob[]): Observable<string> {
        // Create a new SignalR connection
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7058/hubs/Livestream') // Replace with the actual URL of your SignalR server and the StreamHub endpoint
            .build();

        // Subscribe to the "ReceiveVideoStream" method on the hub
        this.hubConnection.on('ReceiveVideoStream', (videoData: string) => {
            this.videoStreamSubject.next(videoData); // Emit the received video data to subscribers
        });

        // Start the SignalR connection
        this.hubConnection.start().catch(err => console.error(err));

        const subject = new signalR.Subject();
        subject.next(chunks)
        this.hubConnection.send("UploadStream", subject)

        console.log(subject)

        return this.videoStreamSubject.asObservable();
    }

    public stopVideoStreaming(): void {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }

    }
}
