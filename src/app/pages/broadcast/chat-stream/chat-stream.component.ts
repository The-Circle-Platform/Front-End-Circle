import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
    ChatMessage,
    ChatMessageDTO,
} from '../../../Domain/Models/ChatMessage';
import { User } from '../../../Domain/Models/User';
import { ChatService } from '../../../services/chatServices/chat.service';
import { AuthService } from 'src/app/services/authServices/auth.service';

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

    //private hubConnection: HubConnection | undefined;
    
    @Input()
    public HostUserId: number | undefined;

    public WriterId: number | undefined;
    public currentUser: User | undefined = undefined;
    //Template value for textbox.

    constructor(private Router: Router, private viewHub: ChatService, private authService: AuthService) {
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
                this.SetupChat(writer.Id, HostId);
                this.viewHub.SetUpConnections(HostId); 
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
            Id: 0,
            WebUserId: userId,
            ReceiverId: hostId,
            Date: new Date(),
        };

    }

    public SendMessage(): void {
        this.warning = '';
        console.log('Sending started');
        if (this.currentChatBox != undefined) {
            this.viewHub.SendToServer(this.currentChatBox);
            //Resets
            this.currentChatBox.Message = '';
            this.IsBusy = true;
        } else {
            console.warn('Chat box has failed to initalize');
            this.warning = 'Chat box has failed to initalize. Contact website manager';
        }
    }

    // private SetUpConnections(HostId: number) {
    //     console.log('Begin connectie chat');

    //     //Setup url
    //     this.hubConnection = new HubConnectionBuilder()
    //         .withUrl(this.viewHub.hubEndpoint)
    //         .build();

    //     //Setup receiver methode
    //     const ReceiverEndpoint = `ReceiveChat-${HostId}`;

    //     this.hubConnection.on(
    //         ReceiverEndpoint,
    //         (updatedMessageList: ChatMessage[]) => {
    //             console.log('Received new chatmessages');
    //             //Verify received packages.
                
    //             this.ListOfChats = updatedMessageList;
    //             this.IsBusy = false;
    //         }
    //     );

    //     //Start connection

    //     this.hubConnection
    //         .start()
    //         .then(async () => {
    //             // -> Send connection
    //             console.log('Get current chatmessages');

    //             this.hubConnection
    //                 ?.send('RetrieveCurrentChat', HostId)
    //                 .then();
    //         })
    //         .catch((err) =>
    //             console.log(`Error with signalR connection ${err}`)
    //         );
    // }

    

    // private SendToServer(chatMessage: ChatMessageDTO) {
    //     this.hubConnection
    //         ?.send('SendMessage', chatMessage)
    //         .then(() => {
    //             console.log('Gelukt');
    //         })
    //         .catch((err) => {
    //             console.log('Niet gelukt');
    //         });
    // }
}
