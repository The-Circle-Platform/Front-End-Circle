import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
    ChatMessage,
    ChatMessageDTO,
    ChatRequestDTO,
} from '../../../Domain/Models/ChatMessage';
import { User } from '../../../Domain/Models/User';
import { ChatService } from '../../../services/chatServices/chat.service';
import { AuthService } from 'src/app/services/authServices/auth.service';
import { securityService } from 'src/app/services/authServices/security';

@Component({
    selector: 'app-chat-stream',
    templateUrl: './chat-stream.component.html',
    styleUrls: ['./chat-stream.component.css'],
})
export class ChatStreamComponent implements OnInit {
    ListOfChats: ChatMessage[];
    public IsBusy: boolean;
    public warning: string;
    public currentChatBox: ChatMessageDTO | undefined;
    private hubConnection: HubConnection | undefined;
    //private hubConnection: HubConnection | undefined;
    
    @Input()
    public HostUserId: number | undefined;

    public WriterId: number | undefined;
    public currentUser: User | undefined = undefined;
    //Template value for textbox.

    constructor(private Router: Router, 
        private viewHub: ChatService, 
        private authService: AuthService,
        private securityService: securityService) {
        this.ListOfChats = [];
        //Placeholder value.
        this.IsBusy = false;
        this.warning = '';
        this.HostUserId = 0;
    }

    ngOnInit(): void {
        const HostId = this.HostUserId;
        //Setup form.
        
        if(HostId){
            //Check if user is allowed
            //Haal gebruiker uit storage aan.
            const writer = this.authService.GetWebUser();
            //const writerId = this.currentUser?.id;
            if(writer){ 
                this.SetupChat(writer.id, HostId);
                this.SetUpConnections(HostId); 
                //Link reference to object
                this.ListOfChats = this.viewHub.ListOfChats;
            } else{
                // something else
                this.Router.navigate(["../"]);
            }
        } else{
            //Something else
            this.Router.navigate(["../"]);
        }
    }

    private SetupChat(userId: number, hostId: number) {
        this.currentChatBox = {
            Message: '',
            id: 0,
            WebUserId: userId,
            ReceiverId: hostId,
            Date: new Date(),
        };

    }

    public SendMessage(): void {
        this.warning = '';
        console.log('Sending started');
        if (this.currentChatBox != undefined) {
            console.log("Versturen gestart.");
            this.SendToServer(this.currentChatBox);
            //Resets
            this.currentChatBox.Message = '';
            this.IsBusy = true;
        } else {
            console.warn('Chat box has failed to initalize');
            this.warning = 'Chat box has failed to initalize. Contact website manager';
        }
    }

    private SetUpConnections(HostId: number) {
        console.log('Begin connectie chat');

        //Setup url
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.viewHub.hubEndpoint)
            .build();

        //Setup receiver methode
        const ReceiverEndpoint = `ReceiveChat-${HostId}`;

        this.hubConnection.on(
            ReceiverEndpoint,
            (updatedMessageList: any) => {
                console.log('Received new chatmessages');
                //Verify received packages.
                //Verify signature
                const isValid = this.securityService.verify(updatedMessageList.originalList, updatedMessageList.signature);
                
                if(isValid){
                    this.ListOfChats = updatedMessageList.originalList;
                } else{
                    this.warning = 'Data integriteit is aangetast, probeer later nog eens.';
                }
                
                this.IsBusy = false;
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

    

    private SendToServer(chatMessage: ChatMessageDTO) {
        //Create signature
        const txt = JSON.stringify(chatMessage);
        const signature = this.securityService.sign(txt);
        const payload: ChatRequestDTO = {
            Signature: signature,
            SenderUserId: chatMessage.WebUserId,
            OriginalData: chatMessage,
        };
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
