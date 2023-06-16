import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {delay, Subscription} from 'rxjs';
import { ChatMessage, ChatMessageDTO } from 'src/app/Domain/Models/ChatMessage';
import { User } from 'src/app/Domain/Models/User';
import {LoggerService} from "../../../services/loggerServices/logger.service";

@Component({
  selector: 'app-chat-stream',
  templateUrl: './chat-stream.component.html',
  styleUrls: ['./chat-stream.component.css']
})


export class ChatStreamComponent implements OnInit{

  ListOfChats: ChatMessage[];
  public IsBusy: boolean;
  public warning: string;
  public currentChatBox: ChatMessageDTO| undefined;
  private subscription: Subscription | undefined;
  private hubConnection: HubConnection | undefined;
  public HostUserId: number | undefined;
  public WriterId: number | undefined;

  //Template value for textbox.

  constructor(private router: ActivatedRoute, private logger: LoggerService){
    this.ListOfChats = [];
    //Placeholder value.
    this.HostUserId = 1;
    this.IsBusy = false;
    this.warning = "";
  }

  ngOnInit(): void {

    // In normal circumstances, it will retrieve the User object from localstorage.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentUser: User | undefined = undefined;

    this.HostUserId = 1;
    this.WriterId = 1;
    //Setup form.
    this.SetupChat(this.WriterId, this.HostUserId);
    this.connectToChatHub();
    
    // this.router.paramMap.subscribe((v)=>{
    //   const HostId: number = v.get("id") as unknown as number;
    //   if(HostId){
    //     this.HostUserId = parse(HostId);
    //     //Check if user is allowed
    //     //Method();
    //     //Haal gebruiker uit storage aan.
    //     const writerId = 1;
    //     // if(writerId){ this.SetupChat(writerId, this.HostUserId);
    //     this.connectToChatHub(); } else{ 
    //      something else }
    //   } else{
    //     //Something else
    //   }
    // })
  }

  private SetupChat(userId: number, hostId: number){
    this.currentChatBox = { Message: "", id: 0, WebUserId: userId, ReceiverId: hostId, Date: new Date() };
  }

  private connectToChatHub(){
    console.log("Begin connectie chat");

    //Setup url
    this.hubConnection = new HubConnectionBuilder()
    .withUrl("https://localhost:7058/hubs/ChatHub")
    .build();

    //Setup receiver methode
    this.subscription = this.logger.logToDB("/hubs/ChatHub/", "Connect").subscribe((res => {
      console.log(res);
      this.subscription?.unsubscribe();
    }));
    const ReceiverEndpoint = `ReceiveChat-${this.HostUserId}`;
    this.hubConnection.on(ReceiverEndpoint, (updatedMessageList: ChatMessage[])=>{
      console.log("Received new chatmessages");
      console.log(updatedMessageList);
      this.ListOfChats = updatedMessageList;
      this.IsBusy = false;
    })

    //Start connection

    this.hubConnection.start()
    .then(async ()=>{
      // -> Send connection
      console.log("Get current chatmessages");
      
      this.hubConnection?.send("RetrieveCurrentChat", this.HostUserId).then();
      this.subscription = this.logger.logToDB("/hubs/ChatHub/", "RetrieveCurrentChat").subscribe((res => {
        console.log(res);
        this.subscription?.unsubscribe();
      }));
    })
    .catch((err)=> console.log(`Error with signalR connection ${err}`));
    

  }


  public SendMessage(): void{
    this.warning = "";
    console.log("Sending started");
    if(this.currentChatBox != undefined){
      this.SendToServer(this.currentChatBox);
      //Resets 
      this.currentChatBox.Message = "";
      this.IsBusy = true;
    } else{
      console.warn("Chat box has failed to initalize");
      this.warning = "Chat box has failed to initalize. Contact website manager";
    }
  }

  private SendToServer(chatMessage: ChatMessageDTO){
    this.hubConnection?.send("SendMessage", chatMessage).then(()=>{
      console.log("Gelukt");
      this.subscription = this.logger.logToDB("/hubs/ChatHub/", "SendMessage").subscribe((res => {
        console.log(res);
        this.subscription?.unsubscribe();
      }));

    }).catch((err)=>{
      console.log("Niet gelukt");
    });
  }

}
