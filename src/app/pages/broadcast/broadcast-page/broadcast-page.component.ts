import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Hls from 'hls.js';
import { User } from '../../../Domain/Models/User';
import { AuthService } from '../../../services/authServices/auth.service';

@Component({
    selector: 'app-broadcast-page',
    templateUrl: './broadcast-page.component.html',
    styleUrls: ['./broadcast-page.component.css'],
})
export class BroadcastPageComponent implements AfterViewInit {
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

    constructor(private authService: AuthService) {}

    async ngOnInit(): Promise<void> {
        try {
            this.HostId = this.authService.GetWebUser()?.id;
        } catch (error) {
            console.error('Error accessing WebUser:', error);
        }
    }

    ngAfterViewInit(): void {
        this.user = JSON.parse(localStorage.getItem('Pop')!) as User;
        // the element could be either a wrapped DOM element or a nativeElement
        this.videoElement = this.videoElementRef?.nativeElement;

        if (Hls.isSupported()) {
            console.log('Video streaming supported by HLSjs');

            const hls = new Hls();
            hls.loadSource(
                `http://localhost:8000/live/${this.user.userName}/index.m3u8`
            );
            hls.attachMedia(this.videoElement);

            this.videoElement.play();
        } else if (
            this.videoElement.canPlayType('application/vnd.apple.mpegurl')
        ) {
            this.videoElement.src =
                'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
        }
    }
}
