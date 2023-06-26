import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
    ChatRequestDTO
} from '../../../Domain/Models/ChatMessage';
import { User } from '../../../Domain/Models/User';
import { AuthService } from '../../../services/authServices/auth.service';
import { SecurityService } from '../../../services/authServices/security';
import { ChatService } from '../../../services/chatServices/chat.service';
import { LoggerService } from 'src/app/services/loggerServices/logger.service';

@Component({
    selector: 'app-chat-stream',
    templateUrl: './chat-stream.component.html',
    styleUrls: ['./chat-stream.component.css'],
})
export class ChatStreamComponent implements OnInit {
    ListOfChats: any[];
    public IsBusy: boolean;
    public warning: string;
    public currentChatBox: any | undefined;
    private hubConnection: HubConnection | undefined;

    @Input()
    public HostUserId: number | undefined;

    public WriterId: number | undefined;
    public currentUser: User | undefined = undefined;
    public  subscription: any;

    constructor(
        private Router: Router,
        private viewHub: ChatService,
        private authService: AuthService,
        private logger: LoggerService,
        private securityService: SecurityService
    ) {
        this.ListOfChats = [];
        this.IsBusy = false;
        this.warning = '';
        this.HostUserId = 0;
    }

    ngOnInit(): void {
        const HostId = this.HostUserId;

        if (HostId) {
            //Checks if user is allowed. Takes user out of storage.
            const writer = this.authService.GetWebUser();
            //const writerId = this.currentUser?.id;
            if (writer) {
                this.SetupChat(writer.id, HostId);
                this.SetUpConnections(HostId);
                //Link reference to object
                this.ListOfChats = this.viewHub.ListOfChats;
            } else {
                this.Router.navigate(['../']);
            }
        } else {
            this.Router.navigate(['../']);
        }
    }

    private SetupChat(userId: number, hostId: number) {
        this.currentChatBox = {
            Id: 0,
            Message: '',
            WebUserId: userId,
            ReceiverId: hostId,   
            Date: new Date(),
        };
    }

    public SendMessage(): void {
        this.warning = '';
        if (this.currentChatBox != undefined) {
            this.SendToServer(this.currentChatBox);
            //Resets
            this.currentChatBox.Message = '';
            this.IsBusy = true;
        } else {
            console.warn('Chat box has failed to initalize');
            this.warning =
                'Chat box has failed to initalize. Contact website manager';
        }
    }

    private SetUpConnections(HostId: number) {
        console.log('Start connection chat');

        //Setup url
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.viewHub.hubEndpoint)
            .build();

        //Setup receiver methode
        const ReceiverEndpoint = `ReceiveChat-${HostId}`;

        this.hubConnection.on(ReceiverEndpoint, (updatedMessageList: any) => {
            console.log('Received new chatmessages');
            //Verify received packages.
            //Verify signature
            console.log(updatedMessageList);
            const isValid = this.securityService.verify(
                updatedMessageList.originalList,
                updatedMessageList.signature
            );

            if (isValid) {
                this.ListOfChats = updatedMessageList.originalList;
            } else {
                this.warning =
                    'Data integriteit is aangetast, probeer later nog eens.';
            }

            this.IsBusy = false;
        });

        //Start connection
        this.hubConnection
            .start()
            .then(async () => {
                // -> Send connection
                console.log('Get current chatmessages');

                this.hubConnection?.send('RetrieveCurrentChat', HostId).then();
            })
            .catch((err) =>
                console.log(`Error with signalR connection: ${err}`)
            );
    }

    private SendToServer(chatMessage: any) {
        //Create signature
        const txt = JSON.stringify(chatMessage, null, 0).toLowerCase();

        const signature = this.securityService.sign(txt);

        const payload: ChatRequestDTO = {
            Signature: signature,
            SenderUserId: chatMessage.WebUserId,
            OriginalData: chatMessage,
        };
        console.log(payload);
        this.hubConnection
            ?.send('SendMessage', payload)
            .then(() => {
                console.log('Data naar server versturen is gelukt');
                this.subscription = this.logger.logToDB("/hubs/ChatHub/", "SendMessage").subscribe((res => {
                    console.log(res);
                    this.subscription?.unsubscribe();
                }));
            })
            .catch((err) => {
                console.log(
                    'Data naar server versturen is niet gelukt',
                    err.message
                );
            });
    }
}
