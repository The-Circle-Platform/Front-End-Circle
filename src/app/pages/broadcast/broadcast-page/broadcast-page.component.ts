import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: "app-broadcast-page",
  templateUrl: "./broadcast-page.component.html",
  styleUrls: ["./broadcast-page.component.css"],
})
export class BroadcastPageComponent implements OnInit, OnDestroy{
  constructor() {}
  recordingCamInit: boolean = false;
  private subscription: Subscription = new Subscription;
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  recording: boolean = false;
  mediaRecorder!: MediaRecorder;
  paused: boolean = false;
  chunks: Blob[] = [];
  stream: any;
  async ngOnInit(): Promise<void> {
    const videoElement = this.videoPlayer.nativeElement;
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video:{width:800, height: 550} , audio: this.recordingCamInit });
      videoElement.srcObject = this.stream;
      videoElement.play();
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  cameraOn() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.play();
    this.mediaRecorder.resume();
  }

  cameraOff() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.pause();
    this.mediaRecorder.pause();
  }

  async startStream() {
    try {
      this.recordingCamInit = true;
      this.ngOnInit();

      this.chunks = [];      
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.addEventListener('dataavailable', (event) => {  
        if (event.data.size > 0) {
          console.log(this.paused);
          this.chunks.push(event.data);
        }
      });

      console.log(this.chunks);

      this.mediaRecorder.addEventListener('stop', () => {
        const videoBlob = new Blob(this.chunks, { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'captured-video.mp4';
        a.click();
        URL.revokeObjectURL(videoUrl);
      });


      this.mediaRecorder.start();
      this.recording = true;

      const minutesInterval = 30000; // 1 minuut = 60.000 millisecondes
      this.subscription = interval(minutesInterval).subscribe(() => {
      this.sendDataToServer();
    });

    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  endStream() {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
      this.recordingCamInit=false;
      this.subscription.unsubscribe();
    }
  }   

  sendDataToServer() {
    const formData = new FormData();
    this.chunks.forEach((blob: Blob, index: number) => {
      formData.append(`recording_${index}`, blob, `recording_${index}.mp4`);
    });
  }
}
