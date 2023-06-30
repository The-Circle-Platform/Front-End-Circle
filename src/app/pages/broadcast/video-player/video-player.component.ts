import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Hls from 'hls.js';
@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements AfterViewInit {
    @ViewChild('videoPlayer') videoElementRef!: ElementRef;
    videoElement!: HTMLVideoElement;

    constructor() {}

    ngAfterViewInit(): void {
        this.videoElement = this.videoElementRef?.nativeElement;

        if (Hls.isSupported()) {
            console.log('Video streaming supported by HLSjs');
            const hls = new Hls();
            hls.loadSource('http://localhost:8000/live/Jascha/index.m3u8');
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
