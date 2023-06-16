import { Component, OnInit, OnDestroy } from '@angular/core';
import {HubConnection} from "@microsoft/signalr";
import {UserModel} from "../broadcast-page/VideoStreamingService";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-streaming-player',
  templateUrl: './streaming-player.component.html',
  styleUrls: ['./streaming-player.component.css']
})
export class StreamingPlayerComponent implements OnInit, OnDestroy {

  private _hubConnection: HubConnection | undefined;
  public async: any;

  constructor(private sanitizer: DomSanitizer) {}

  streamBlob: Blob[] = [];

  ngOnInit() {
    this._hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7058/hubs/Livestream')
        .build();
    this._hubConnection.stop();
    this._hubConnection.start().catch((err) => {
      console.error(err.toString());
    });

    this._hubConnection.on('test', (data: UserModel) => {
      console.log(data.name);
      this.streamBlob.push(base64ToBlob(data.stream, 'video/mp4'));
      console.log(this.streamBlob.length)
    });
  }

  ngOnDestroy(): void {
  }



}

function base64ToBlob(base64String : string, contentType : string) {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }


  return new Blob(byteArrays, { type: contentType });
}
