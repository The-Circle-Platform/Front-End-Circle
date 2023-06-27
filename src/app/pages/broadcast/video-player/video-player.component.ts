import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Hls from 'hls.js';
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements AfterViewInit{

  // access the declared DOM element; expose all methods and properties
  @ViewChild('videoPlayer') videoElementRef!: ElementRef;

  // declare and inherit the HTML video methods and its properties
  videoElement!: HTMLVideoElement;

  constructor() { }

  ngAfterViewInit(): void {
    // the element could be either a wrapped DOM element or a nativeElement
    this.videoElement = this.videoElementRef?.nativeElement;

    if (Hls.isSupported()) {
      console.log("Video streaming supported by HLSjs")


      var hls = new Hls();
      hls.loadSource('http://localhost:8000/live/test/index.m3u8');
      hls.attachMedia(this.videoElement);
      //hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoElement.play();
      //});
    }

    else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // alert("You're using an Apple product!");
      this.videoElement.src = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
    }
  }

}
