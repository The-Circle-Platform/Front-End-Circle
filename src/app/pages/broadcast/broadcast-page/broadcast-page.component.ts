import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { VideoStreamingService } from "./VideoStreamingService";
import {VidStream} from "../../../services/vidStream/VidStream.service";
import { AuthService } from "src/app/services/authServices/auth.service";
import { securityService } from "src/app/services/authServices/security";


@Component({
  selector: "app-broadcast-page",
  templateUrl: "./broadcast-page.component.html",
  styleUrls: ["./broadcast-page.component.css"],
})
export class BroadcastPageComponent implements OnInit, OnDestroy{
  constructor(
    private _VideoStreamingService: VideoStreamingService, 
    private _Vidstream: VidStream, private authService: AuthService,
    private securityService: securityService) {}
  
  NewStream: any | undefined;
  HostId: number | undefined;
  
 
  recordingCamInit: boolean = false;

  @ViewChild("videoPlayer", { static: true })
  videoPlayer!: ElementRef<HTMLVideoElement>;
  recording: boolean = false;
  mediaRecorder!: MediaRecorder;
  chunks: Blob[] = [];
  chunksTest: Blob[] = [];
  stream: any;

  async ngOnInit(): Promise<void> {
    const videoElement = this.videoPlayer.nativeElement;
    try {
      this.HostId = this.authService.GetWebUser()?.id;

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 800, height: 550 },
        audio: this.recordingCamInit,
      });
      videoElement.srcObject = this.stream;

      console.log("1234");
      videoElement.play();
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }

  ngOnDestroy(): void {
    // Stop receiving the video stream when the component is destroyed
    this._VideoStreamingService.stopVideoStreaming();
  }

  testFunction(){
    this._Vidstream.SendNewStream().subscribe((v)=>{
      console.warn("Test functie");
      console.log(v);
    })
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
      this.recording = true;

      this._Vidstream.SendNewStream().subscribe(async (v:any) => {
        //Checks signature
        const isValid = this.securityService.verify(v.originalData, v.signature);
        console.log(isValid);
        if(isValid){
          //When valid, it will start the stream.
          console.log("Stream is geldig");
          const StreamId = v.originalData.streamId;
          this.NewStream = v.originalData;
          this.mediaRecorder.start(1000);
          this.mediaRecorder.addEventListener("dataavailable", async (event) => {
          if (event.data.size > 0) {
            this.chunks.push(event.data);
            console.log("data1", this.chunks);
          }
          if (this.chunks.length) {
              console.log("sending data");
              console.log(this.chunks);
              console.log(v)
              
              //Sends chunks to signalR hub.
              await this._VideoStreamingService.startVideoStreaming(this.chunks, StreamId);
            // this.chunks = []; // Clear the recorded chunks
          } else {
            console.log("no chunks available.");
          }
        });
        }
      })
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }

  endStream() {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
      this.recordingCamInit = false;
    }

    this._Vidstream.TurnOffStream(this.HostId!, this.NewStream.id).subscribe((v: any)=>{
      if(this.securityService.verify(v.originalData, v.signature)){
        this.NewStream = undefined;
      }
    })
    this.mediaRecorder.addEventListener("stop", async () => {
      // this.videoData = await this._VideoStreamingService.startVideoStreaming(this.finalChunks);
      // this.cdRef.detectChanges();
      const videoBlob = new Blob(this.chunks, {
        type: "video/x-matroska;codecs=avc1",
      });
      const videoUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "captured-video.mkv";
      a.click();
      URL.revokeObjectURL(videoUrl);
    });
  }
}
