import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { VideoStreamingService } from "./VideoStreamingService";



@Component({
  selector: "app-broadcast-page",
  templateUrl: "./broadcast-page.component.html",
  styleUrls: ["./broadcast-page.component.css"],
})
export class BroadcastPageComponent implements OnInit {


  constructor(private _VideoStreamingService: VideoStreamingService) {


  }


  recordingCamInit: boolean = false;

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  recording: boolean = false;
  mediaRecorder!: MediaRecorder;
  chunks: Blob[] = [];
  stream: any;


  async ngOnInit(): Promise<void> {
    const videoElement = this.videoPlayer.nativeElement;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video:{width:800, height: 550} , audio: this.recordingCamInit });
      videoElement.srcObject = this.stream;
      
      console.log('1234')
      videoElement.play();
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }



  }

  private processVideoData(videoData: any): void {
    // Update the video element with the new video frame
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.src = videoData.toString();
    videoElement.play();
  }

  ngOnDestroy(): void {
    // Stop receiving the video stream when the component is destroyed
    this._VideoStreamingService.stopVideoStreaming();
  }

  cameraOn() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.play();
  }

  cameraOff() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.pause();
  }

  async startStream() {
    try {
      this.recordingCamInit = true;
      this.chunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      });

      this.mediaRecorder.start(2000);
      this.recording = true;

        // Send the recorded video chunks to the service at regular intervals
        setInterval(() => {
          console.log('chunkssssss Interval', this.chunks);
          if (this.chunks.length) {
            this._VideoStreamingService.startVideoStreaming(this.chunks)
            this.chunks = []; // Clear the recorded chunks
          } else {
            console.log('no chunks available.');
          }
        }, 2000);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  endStream() {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
      this.recordingCamInit=false;
      this._VideoStreamingService.stopVideoStreaming();
    }

    this.mediaRecorder.addEventListener('stop', () => {
      const videoBlob = new Blob(this.chunks, {type: 'video/mp4'});
      const videoUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'captured-video.mp4';
      a.click();
      URL.revokeObjectURL(videoUrl);
    });
  }   
}
