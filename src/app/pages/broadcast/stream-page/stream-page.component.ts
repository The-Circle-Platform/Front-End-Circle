import {
    AfterViewInit,
    Component,
    ElementRef, Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Hls from 'hls.js';
import { User } from '../../../Domain/Models/User';
import { SecurityService } from '../../../services/authServices/security';
import { UserService } from '../../../services/userServices/user.service';
import { VidStream } from '../../../services/vidStream/VidStream.service';

@Component({
    selector: 'app-stream-page',
    templateUrl: './stream-page.component.html',
    styleUrls: ['./stream-page.component.css'],
})
export class StreamPageComponent implements OnInit, AfterViewInit {
    @ViewChild('videoPlayer') videoElementRef!: ElementRef;

    videoElement!: HTMLVideoElement;
    NewStream: any | undefined;
    @Input()
    HostId: number;
    StreamId: number;
    user?: User;
    HostUserName: String | undefined;

    constructor(
        private router: ActivatedRoute,
        private VidService: VidStream,
        private securityService: SecurityService,
        private userService: UserService
    ) {
        this.HostId = 0;
        this.NewStream = undefined;
        this.StreamId = 0;
    }

    ngOnInit(): void {
        this.CheckParams();
    }

    ngAfterViewInit(): void {
        this.userService.Get(this.HostId).subscribe((res) => {
            this.HostUserName = res.originalData?.userName;
            this.user = JSON.parse(localStorage.getItem('Pop')!) as User;
            this.videoElement = this.videoElementRef?.nativeElement;

            if (Hls.isSupported()) {
                console.log('Video streaming supported by HLSjs');
                console.log(this.HostUserName);
                const hls = new Hls();
                hls.loadSource(
                    `http://localhost:8000/live/${this
                        .HostUserName!}/index.m3u8`
                );
                hls.attachMedia(this.videoElement);
                this.videoElement.play();
            } else if (
                this.videoElement.canPlayType('application/vnd.apple.mpegurl')
            ) {
                this.videoElement.src =
                    'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
            }
        });
    }

    CheckParams() {
        this.router.paramMap.subscribe((v) => {
            const id: string = v.get('id')!;
            if (id) {
                this.HostId = parseInt(id);
                this.GetLatestStream(this.HostId);
            } else {
                console.log('No params');
            }
        });
    }

    GetLatestStream(HostId: number) {
        console.log('Getting latest stream');
        this.VidService.GetStreamOfHost(HostId).subscribe((ol) => {
            const sign = ol.signature;

            const IsValid = this.securityService.verify(ol.originalData, sign);

            if (IsValid) {
                console.log(ol.originalData);
                this.NewStream = ol.originalData;
            } else {
                console.warn('No stream is running');
            }
        });
    }
}
