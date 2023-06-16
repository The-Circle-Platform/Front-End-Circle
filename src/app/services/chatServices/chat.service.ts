import { Injectable } from "@angular/core";
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../../Domain/Models/User';
import { ChatMessage, ChatRequestDTO, ChatResponseDTO, ChatMessageDTO } from '../../Domain/Models/ChatMessage';

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
    
    constructor(public con: ConfigService)
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
                //Verify received packages.
                

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
                    .then();
            })
            .catch((err) =>
                console.log(`Error with signalR connection ${err}`)
            );
    }

    public SendToServer(chatMessage: ChatMessageDTO) {
        //Create signature
        //TODO: Hier een methode voor het signen.
        const payload: ChatRequestDTO = {
            Signature: [],
            SenderUserId: chatMessage.WebUserId,
            OriginalData: chatMessage,
        };

        // Sends payload to server.
        this.hubConnection
            ?.send('SendMessage', payload)
            .then(() => {
                console.log('Gelukt');
            })
            .catch((err) => {
                console.log('Niet gelukt');
            });
    }


}