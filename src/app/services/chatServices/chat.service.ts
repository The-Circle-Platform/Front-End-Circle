import { Injectable } from "@angular/core";
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../../Domain/Models/User';
import { ChatMessage, ChatRequestDTO, ChatResponseDTO, ChatMessageDTO } from '../../Domain/Models/ChatMessage';
import { LoggerService } from "../loggerServices/logger.service";
import { Subscription } from "rxjs";
import { securityService } from "../authServices/security";

@Injectable({providedIn: 'root'})
export class ChatService{
    ListOfChats: ChatMessage[];
    private readonly CURRENT_TOKEN = 'token';
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
        private securityService: securityService)
    {
        this.ListOfChats = [];
        this.hubEndpoint = `${con.getApiEndpoint()}hubs/ChatHub`
    }
    
    public SetUpConnections(HostId: number){
        console.log('Begin connectie chat');

        //Setup url
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubEndpoint)
            .build();

        //Setup receiver methode
        const ReceiverEndpoint = `ReceiveChat-${HostId}`;

        this.hubConnection.on(
            ReceiverEndpoint,
            (response: ChatResponseDTO) => {
                console.log('Received new chatmessages');
                console.log(response);
                // Turn into string
                const stringJson = JSON.stringify(response);

                //Verify signature
                this.securityService.verify(stringJson, response.Signature);

                // Assigns new user to response.
                this.ListOfChats = response.OriginalList;
            }
        );

        //Start connection
        this.hubConnection
            .start()
            .then(async () => {
                // -> Send connection
                console.log('Get current chatmessages');
                this.hubConnection
                    ?.send('RetrieveCurrentChat', HostId)
                    .then(()=>{
                        this.subscription = this.logger.logToDB("/hubs/ChatHub/", "RetrieveCurrentChat").subscribe((res => {
                            console.log(res);
                            this.subscription?.unsubscribe();
                          }));
                    });
            })
            .catch((err) =>
                console.log(`Error with signalR connection ${err}`)
            );
    }

    public SendToServer(chatMessage: ChatMessageDTO) {
        //Create signature
        const txt = JSON.stringify(chatMessage);
        const signature = this.securityService.sign(txt);
        const payload: ChatRequestDTO = {
            Signature: signature,
            SenderUserId: chatMessage.WebUserId,
            OriginalData: chatMessage,
        };

        // Sends payload to server.
        this.hubConnection
            ?.send('SendMessage', payload)
            .then(() => {
                console.log('Gelukt');
                // this.subscription = this.logger.logToDB("/hubs/ChatHub/", "SendMessage").subscribe((res => {
                //     console.log(res);
                //     this.subscription?.unsubscribe();
                // }));

            })
            .catch((err) => {
                console.log('Niet gelukt');
            });
    }
}