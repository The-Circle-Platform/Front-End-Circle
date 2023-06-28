import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { IContent } from '../../../Domain/Interfaces/IContent';
import { AuthService } from '../../../services/authServices/auth.service';
import { SecurityService } from '../../../services/authServices/security';

@Injectable({
    providedIn: 'root',
})
export class VideoStreamingService {
    private hubConnection: signalR.HubConnection = undefined!; // Add the initializer here
    private videoStreamSubject: Subject<any> = new Subject<any>();
    private Buffer: any;
    private isConnected = false;

    constructor(
        private authService: AuthService,
        private secService: SecurityService
    ) {
        this.authService = authService;
    }

    public async startVideoStreaming(chunks: Blob[], streamId: number) {
        await this.getOrCreateConnection();

        const Astring: string = await blobToBase64(chunks[0]);
        const base64String = Astring.substring(Astring.indexOf(',') + 1);

        function blobToBase64(blob: Blob): Promise<string> {
            return new Promise((resolve, data) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        }

        // const data = new StreamChunkInOutDTO()
        // data.chunk = base64String;
        // data.chunksize = base64String.length;
        // data.streamId = streamId;
        // data.timestamp = new Date();

        const chunkData = {
            id: 0,
            streamId: streamId,
            timestamp: new Date(),
            chunksize: base64String.length,
            chunk: base64String,
        };

        const sig = this.secService.sign(
            JSON.stringify(chunkData).toLowerCase()
        );

        const newData: StreamChunkDTO = {
            SenderUserId: this.authService.GetWebUser()!.id,
            Signature: sig,
            OriginalData: chunkData,
        };

        await this.hubConnection.invoke('Upload', newData);
    }

    private async getOrCreateConnection() {
        if (!this.hubConnection) {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:7058/hubs/Livestream') // Replace with the actual URL of your SignalR server and the StreamHub endpoint
                .build();
            this.hubConnection
                .start()
                .catch((err) =>
                    console.error(
                        'Failed to start the SignalR connection:',
                        err
                    )
                ); // Modify this line
            this.isConnected = true;
        } else {
            if (this.hubConnection.state == HubConnectionState.Connected)
                this.isConnected = true;
            else this.isConnected = false;
        }
        console.log('Connection state: ', this.hubConnection.state);
        return this.hubConnection;
    }

    public stopVideoStreaming(): void {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }
}

export class StreamChunkInOutDTO {
    id: number = 0;
    streamId: number = 0;
    timestamp: any;
    chunksize: number = 0;
    chunk: string = '';
}

export interface StreamChunkDTO extends IContent {
    OriginalData: StreamChunkInOutDTO;
}
