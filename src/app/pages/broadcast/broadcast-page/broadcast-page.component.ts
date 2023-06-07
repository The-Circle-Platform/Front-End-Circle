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
        video:{width:800, height:550},
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
    this.videoref.srcObject= null;
   }
}
