import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../Domain/Models/ChatMessage';
import { User } from '../../Domain/Models/User';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { SecurityService } from '../authServices/security';
import { LoggerService } from '../loggerServices/logger.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
    ListOfChats: ChatMessage[];
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    private hubConnection: HubConnection | undefined;
    public currentUser: User | undefined = undefined;
    public hubEndpoint: string;
    subscription: Subscription | undefined;

    constructor(
        public con: ConfigService,
        private logger: LoggerService,
        private securityService: SecurityService
    ) {
        this.ListOfChats = [];
        this.hubEndpoint = `${con.getApiEndpoint()}hubs/ChatHub`;
    }

    public SetUpConnections(HostId: number) {
        console.log('Start connection chat');

        //Setup url
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubEndpoint)
            .build();

        //Setup receiver methode
        const ReceiverEndpoint = `ReceiveChat-${HostId}`;

        this.hubConnection.on(ReceiverEndpoint, (response: any) => {
            console.log('Received new chatmessages');
            console.log('Response: ', response);
            // Turn into string
            const stringJson = JSON.stringify(response.originalList);

            //Verify signature
            this.securityService.verify(stringJson, response.Signature);

            // Assigns new user to response.
            this.ListOfChats = response.originalList;
        });

        //Start connection
        this.hubConnection
            .start()
            .then(async () => {
                // -> Send connection
                console.log('Get current chatmessages');
                this.hubConnection
                    ?.send('RetrieveCurrentChat', HostId)
                    .then(() => {
                        this.subscription = this.logger
                            .logToDB('/hubs/ChatHub/', 'RetrieveCurrentChat')
                            .subscribe((res) => {
                                console.log('Res: ', res);
                                this.subscription?.unsubscribe();
                            });
                    });
            })
            .catch((err) =>
                console.log(`Error with signalR connection ${err}`)
            );
    }
}
