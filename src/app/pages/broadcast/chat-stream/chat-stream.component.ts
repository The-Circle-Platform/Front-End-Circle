import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { delay } from 'rxjs';
import { ChatMessage } from 'src/app/Domain/Models/ChatMessage';
import { User } from 'src/app/Domain/Models/User';

@Component({
  selector: 'app-chat-stream',
  templateUrl: './chat-stream.component.html',
  styleUrls: ['./chat-stream.component.css']
})

export class ChatStreamComponent implements OnInit{

  ListOfChats: ChatMessage[];
  public IsBusy: boolean;
  public text: string;
  public currentChatBox: ChatMessage | undefined;

  private hubConnection: HubConnection | undefined;
  private HostUserId: number | undefined;

  //Template value for textbox.

  constructor(private router: ActivatedRoute){
    this.ListOfChats = [];
    //Placeholder value.
    this.HostUserId = 1;
    this.IsBusy = false;
    this.text = " Heloo "
  }

  ngOnInit(): void {

    const HostId = 1;
    const writerId = 1;
    this.SetupChat(writerId, HostId);
    // this.connectToChatHub();
    
    // this.router.paramMap.subscribe((v)=>{
    //   const HostId: number = v.get("id") as unknown as number;
    //   if(HostId){
    //     //Check if user is allowed
    //     //Method();
    //     const writerId = 1;
    //     this.SetupChat(writerId, HostId);
    //     //Starts connection to server
    //     //this.connectToChatHub();
    //   } else{
    //     //Something else
    //   }
    // })
  }

  private SetupChat(userId: number, hostId: number){
    this.currentChatBox = { Message: "", id: 0, Writer: userId, Receiver: hostId, DateOfWriting: new Date() };
  }

  private connectToChatHub(){
    console.log("Begin connectie chat");

    //Setup url
    this.hubConnection = new HubConnectionBuilder()
    .withUrl("https://localhost:7058/hubs/ChatHub")
    .build();

    //Setup receiver methode
    const ReceiverEndpoint = `ReceiveChat-${this.HostUserId}`;

    this.hubConnection.on(ReceiverEndpoint, (updatedMessageList: ChatMessage[])=>{
      console.log("Received new chatmessages");
      this.ListOfChats = updatedMessageList;
      this.IsBusy = false;
    })

    //Start connection

    this.hubConnection.start()
    .then(async ()=>{
      // -> Send connection
      console.log("Get current chatmessages");
      this.hubConnection?.send("RetrieveCurrentChat", this.HostUserId).then();
    })
    .catch((err)=> console.log(`Error with signalR connection ${err}`));
    

  }

  public onValueChange(event: Event){
    console.log(event.target);
    this.text = (event.target as any).value;
  }

  public SendMessage(): void{
    console.log("Sending started");

    this.IsBusy = true;
  }

  private SendToServer(chatMessage: ChatMessage){
   
    const message = {
      Message: chatMessage.Message,
      Writer: chatMessage.Writer,
      Receiver: chatMessage.Receiver,
      DateOfWriting: chatMessage.DateOfWriting,
    }

    this.hubConnection?.send("SendMessage", message).then(()=>{
      console.log("Gelukt");
    }).catch((err)=>{
      console.log("Niet gelukt");
    });
  }
}
