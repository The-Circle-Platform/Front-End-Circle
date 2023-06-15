import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {HubConnectionState} from '@microsoft/signalr';
import {Subject} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class VideoStreamingService {
    private hubConnection: signalR.HubConnection = undefined!; // Add the initializer here
    private videoStreamSubject: Subject<any> = new Subject<any>();
    private Buffer: any;
    private isConnected = false;



    public async startVideoStreaming(chunks: Blob[]) {
        await this.getOrCreateConnection();
        console.log('is connected: ', this.isConnected);
        console.log('chunk: ' + JSON.stringify( chunks[0]));
        //let testje = new TextEncoder().encode('blablabla');
        //let iets = await  chunks[0].text();
        //let data = new UserModel('thomas',  iets );

        //weird unknown type

        let probablyNotAString = await blobToBase64(chunks[0])
        console.log("something", probablyNotAString)

        // string of the 64. Need string!!! aaaaargh.

        let Astring: string = blobToBase64(chunks[0]).toString()
        console.log("A String?", Astring)

        //
        function blobToBase64(blob: any) {
            return new Promise((resolve, data: any) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);

            });
        }


        //await this.hubConnection.invoke('Upload', data);



    }






    private async getOrCreateConnection() {
        if (!this.hubConnection) {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:7058/hubs/Livestream') // Replace with the actual URL of your SignalR server and the StreamHub endpoint
                .build();
            this.hubConnection.start()
                .catch(err => console.error('Failed to start the SignalR connection:', err)); // Modify this line
            this.isConnected = true;
        } else {
            if (this.hubConnection.state == HubConnectionState.Connected)
                this.isConnected = true;
            else this.isConnected = false;
        }
        console.log('connection state: ' + this.hubConnection.state);
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
    stream: string;

    constructor(name: string, stream: string) {
        this.name = name;
        this.stream = stream;
    }
}