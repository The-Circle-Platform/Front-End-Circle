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

        let Astring: string = await blobToBase64(chunks[0]);

        let base64String = Astring.substring(Astring.indexOf(',') + 1);
        console.log(base64String)

        function blobToBase64(blob: Blob): Promise<string> {
            return new Promise((resolve, data) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        }



        const data = new UserModel('thomas',  base64String );

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

    base64ToBlob(base64String: string, mimeType: string): Blob {
        const byteArrays = [];
        console.log(base64String)

        for (let offset = 0; offset < base64String.length; offset += 512) {
            const slice = base64String.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: mimeType });
    }
}

async function base64ToBlob(base64String: string): Promise<Blob> {
    //video/x-matroska;codecs=avc1 misschien data: dit ipv applicaton blah.
    const response = await fetch(`data:application/octet-stream;base64,${base64String}`);
    const blob = await response.blob();
    return blob;
}


export class UserModel {
    name: string;
    stream: string;

    constructor(name: string, stream: string) {
        this.name = name;
        this.stream = stream;
    }
}