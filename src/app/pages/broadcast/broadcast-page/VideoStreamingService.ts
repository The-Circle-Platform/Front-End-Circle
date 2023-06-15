import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Subject} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class VideoStreamingService {
    private hubConnection: signalR.HubConnection = undefined!; // Add the initializer here
    private videoStreamSubject: Subject<any> = new Subject<any>();
    private Buffer: any;
    private isConnected = false;



    public async startVideoStreaming(chunks: Blob[]): Promise<void> {
        await this.getOrCreateConnection();
        console.log('is connected: ', this.isConnected);

        // Assuming blobs is an array of Blob objects
        let base64Strings = chunks.map(async blob => {
            // Convert the blob to an array buffer
            let arrayBuffer = await blob.arrayBuffer();
            // Convert the array buffer to a binary string
            let binaryString = String.fromCharCode(...new Uint8Array(arrayBuffer));
            // Convert the binary string to a base64 string
            return btoa(binaryString);
        });
        let data = new UserModel('thomas',  base64Strings );

        // send data to hub to the Upload method.
        await this.hubConnection.invoke('Upload', data);
    }






    private async getOrCreateConnection() {
        if (!this.hubConnection) {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:7058/hubs/Livestream') // Replace with the actual URL of your SignalR server and the StreamHub endpoint
                .build();
            this.hubConnection.start()
                .catch(err => console.error('Failed to start the SignalR connection:', err)); // Modify this line
            this.isConnected = true;
        }
        return this.hubConnection;
    }



    public stopVideoStreaming(): void {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }
}

export class UserModel {
    name: string;
    stream: Promise<string>[];

    constructor(name: string, stream: Promise<string>[]) {
        this.name = name;
        this.stream = stream;
    }
}