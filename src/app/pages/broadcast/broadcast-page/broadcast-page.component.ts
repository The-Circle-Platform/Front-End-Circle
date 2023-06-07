import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-broadcast-page',
  templateUrl: './broadcast-page.component.html',
  styleUrls: ['./broadcast-page.component.css']
})

export class BroadcastPageComponent implements OnInit{
  
  constructor() {}

  videoref:any;
  
   ngOnInit(): void {
       this.videoref = document.getElementById('webcam');
       console.log(this.videoref);
       this.setupCamera();
   }

   setupCamera(){
      navigator.mediaDevices.getUserMedia({
        video:{width:1000, height:600},
        audio:true
      }).then(stram =>{
        console.log(stram);
        this.videoref.srcObject = stram;
      })
   }

   cameraOn(){
    this.ngOnInit();
    console.log('1')
   }
   cameraOff(){
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(MediaStream => {
      const stream = MediaStream;
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      videoTracks[0].stop();
      audioTracks[0].stop();

      console.log('2')
    })
   }
}
