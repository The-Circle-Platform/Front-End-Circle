import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AuthService } from '../../../services/authServices/auth.service';
import { SecurityService } from '../../../services/authServices/security';
import { VidStream } from '../../../services/vidStream/VidStream.service';
import { VideoStreamingService } from './VideoStreamingService';
import Hls from "hls.js";
import {User} from "../../../Domain/Models/User";

@Component({
    selector: 'app-broadcast-page',
    templateUrl: './broadcast-page.component.html',
    styleUrls: ['./broadcast-page.component.css'],
})
export class BroadcastPageComponent implements AfterViewInit, OnDestroy {
    NewStream: any | undefined;
    HostId: number | undefined;
    recordingCamInit: boolean = false;

    // access the declared DOM element; expose all methods and properties
    @ViewChild('videoPlayer') videoElementRef!: ElementRef;

    // declare and inherit the HTML video methods and its properties
    videoElement!: HTMLVideoElement;
    recording: boolean = false;
    mediaRecorder!: MediaRecorder;
    chunks: Blob[] = [];
    chunksTest: Blob[] = [];
    stream: any;
    user?: User;
    // streamId: number = 0;

    constructor(
        private _VideoStreamingService: VideoStreamingService,
        private _Vidstream: VidStream,
        private authService: AuthService,
        private securityService: SecurityService
    ) {}

    async ngOnInit(): Promise<void> {
        // const videoElement = this.videoPlayer.nativeElement;
        try {
            this.HostId = this.authService.GetWebUser()?.id;

            // this.stream = await navigator.mediaDevices.getUserMedia({
            //     video: { width: 800, height: 550 },
            //     audio: this.recordingCamInit,
            // });
            // videoElement.srcObject = this.stream;
            //
            // console.log('videoElement.play() called');
            // videoElement.play();
        } catch (error) {
            console.error('Error accessing WebUser:', error);
        }
    }

    ngAfterViewInit(): void {
        this.user = JSON.parse(localStorage.getItem('Pop')!) as User;
        // the element could be either a wrapped DOM element or a nativeElement
        this.videoElement = this.videoElementRef?.nativeElement;

        if (Hls.isSupported()) {
            console.log("Video streaming supported by HLSjs")

            var hls = new Hls();
            hls.loadSource(`http://localhost:8000/live/${this.user.userName}/index.m3u8`);
            hls.attachMedia(this.videoElement);
            //hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("sending stream")
            // this._Vidstream.SendNewStream().subscribe((reply: any) => {
            //     console.log("epic broadcast")
            //     console.log(reply);
            //     this.streamId = reply.originalData.streamId;
            //     console.log("epic streamid")
            //     console.log(this.streamId);
            // });
            this.videoElement.play();
            // this._Vidstream.GetStreamOfHost(0).subscribe();
            //});
        }

        else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            // alert("You're using an Apple product!");
            this.videoElement.src = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
        }
    }

    ngOnDestroy(): void {
        // Stop receiving the video stream when the component is destroyed
        console.log("Epic destroy")
        // this._Vidstream.TurnOffStream(this.streamId).subscribe();
    }

    testFunction() {
        // this._Vidstream.SendNewStream().subscribe((v) => {
        //     console.log('SendNewStream data: ', v);
        // });
    }

    // cameraOn() {
    //     const videoElement = this.videoPlayer.nativeElement;
    //     videoElement.play();
    // }
    //
    // cameraOff() {
    //     const videoElement = this.videoPlayer.nativeElement;
    //     videoElement.pause();
    // }

    // async startStream() {
    //     try {
    //         this.recordingCamInit = true;
    //         this.chunks = [];
    //         this.mediaRecorder = new MediaRecorder(this.stream);
    //         this.recording = true;
    //
    //         this._Vidstream.SendNewStream().subscribe(async (v: any) => {
    //             //Checks signature
    //             const isValid = this.securityService.verify(
    //                 v.originalData,
    //                 v.signature
    //             );
    //             console.log('Signature check: ', isValid);
    //             if (isValid) {
    //                 //When valid, it will start the stream.
    //                 const StreamId = v.originalData.streamId;
    //                 this.NewStream = v.originalData;
    //                 this.mediaRecorder.start(1000);
    //                 this.mediaRecorder.addEventListener(
    //                     'dataavailable',
    //                     async (event) => {
    //                         if (event.data.size > 0) {
    //                             this.chunks.push(event.data);
    //                             console.log('Chunks: ', this.chunks);
    //                         }
    //                         if (this.chunks.length) {
    //                             console.log('Chunks: ', this.chunks);
    //                             console.log('SendNewStream data: ', v);
    //
    //                             //Sends chunks to signalR hub.
    //                             await this._VideoStreamingService.startVideoStreaming(
    //                                 this.chunks,
    //                                 StreamId
    //                             );
    //                             // this.chunks = []; // Clear the recorded chunks
    //                         } else {
    //                             console.log('No chunks available.');
    //                         }
    //                     }
    //                 );
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error accessing webcam:', error);
    //     }
    // }
    //
    // endStream() {
    //     if (this.mediaRecorder && this.recording) {
    //         this.mediaRecorder.stop();
    //         this.recording = false;
    //         this.recordingCamInit = false;
    //     }
    //
    //     this._Vidstream
    //         .TurnOffStream(this.HostId!, this.NewStream.streamId)
    //         .subscribe((v: any) => {
    //             if (this.securityService.verify(v.originalData, v.signature)) {
    //                 this.NewStream = undefined;
    //             }
    //         });
    //     this.mediaRecorder.addEventListener('stop', async () => {
    //         // this.videoData = await this._VideoStreamingService.startVideoStreaming(this.finalChunks);
    //         // this.cdRef.detectChanges();
    //         const videoBlob = new Blob(this.chunks, {
    //             type: 'video/x-matroska;codecs=avc1',
    //         });
    //         const videoUrl = URL.createObjectURL(videoBlob);
    //         const a = document.createElement('a');
    //         a.href = videoUrl;
    //         a.download = 'captured-video.mkv';
    //         a.click();
    //         URL.revokeObjectURL(videoUrl);
    //     });
    // }
}
