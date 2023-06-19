import { Component, Input, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ViewService } from './viewCounter.service';
import { securityService } from 'src/app/services/authServices/security';
import { AuthService } from 'src/app/services/authServices/auth.service';

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

  constructor(public viewHub: ViewService, public securityService: securityService, private authService: AuthService){}

  ngOnInit(): void {
    this.connect();
  }

  private connect(): void {
    this._hubConnection = new HubConnectionBuilder()
        .withUrl(this.viewHub.endpoints)
        .build();

    this._hubConnection.on("UpdateViewerCount" + this.StreamId, (message) => {
      console.log(message);
      // Verificatie 
      const signature = message.signature;
      const updatedCount = message.OriginalCount;

      const isValid = this.securityService.verify(updatedCount, signature);

      if(isValid){
        this.numberList = message.OriginalCount;
      } else{
        console.warn("Data is tainted");
      }
      
    });

    this._hubConnection.start()
        .then(async (u) => {
          console.log("Connection started");
          if(!this.isStreamer) {
            const ownUserId = this.authService.GetWebUser()?.Id;
            this._hubConnection?.send("ConnectToStream", this.StreamId, ownUserId).then();
          }
        })
        .catch((err) => console.log('error while establishing signalr connection: ' + err));


  }
}
