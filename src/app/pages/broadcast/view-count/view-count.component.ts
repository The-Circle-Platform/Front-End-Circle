import { Component, Input, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ViewService } from './viewCounter.service';

@Component({
  selector: 'app-view-count',
  templateUrl: './view-count.component.html',
  styleUrls: ['./view-count.component.css']
})
export class ViewCountComponent implements OnInit{
  _hubConnection: HubConnection | undefined;
  numberList: any;
  @Input()
  isStreamer: boolean = false;

  @Input()
  HostId: number | undefined;

  @Input()
  StreamId: number | undefined;

  constructor(public viewHub: ViewService){}

  ngOnInit(): void {
    this.connect();
    console.log(this.numberList);
  }

  private connect(): void {
    this._hubConnection = new HubConnectionBuilder()
        .withUrl(this.viewHub.endpoints)
        .build();

    this._hubConnection.on("UpdateViewerCount" + this.StreamId, (message) => {
      console.log(message);
      // Verificatie 


      this.numberList = message.OriginalCount;
    });

    this._hubConnection.start()
        .then(async (u) => {
          console.log("Connection started");
          if(!this.isStreamer) {
            this._hubConnection?.send("ConnectToStream", {ConnectionId: null, StreamId: 1, UserId: 1}).then();
          }
        })
        .catch((err) => console.log('error while establishing signalr connection: ' + err));


  }
}
