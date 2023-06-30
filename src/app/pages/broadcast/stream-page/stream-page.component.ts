import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../../services/authServices/security';
import { AuthService } from "../../../services/authServices/auth.service";
import { UserService } from "../../../services/userServices/user.service";
import { VidStream } from '../../../services/vidStream/VidStream.service';
import Hls from "hls.js";
import {User} from "../../../Domain/Models/User";

@Component({
    selector: 'app-stream-page',
    templateUrl: './stream-page.component.html',
    styleUrls: ['./stream-page.component.css'],
})
export class StreamPageComponent implements OnInit, AfterViewInit {
    @ViewChild('videoPlayer') videoElementRef!: ElementRef;

    videoElement!: HTMLVideoElement;
    NewStream: any | undefined;
    HostId: number;
    StreamId: number;
    user?: User;
    HostUserName: String | undefined;

    constructor(
        private router: ActivatedRoute,
        private VidService: VidStream,
        private securityService: SecurityService,
        private authService: AuthService,
        private userService: UserService
    ) {
        this.HostId = 0;
        this.NewStream = undefined;
        this.StreamId = 0;
    }

     ngOnInit(): void {
        this.CheckParams();

        // Use router to get url parameters in order to get transparent user id
        // Get latest stream.
    }

    ngAfterViewInit(): void {

        this.userService.Get(this.HostId).subscribe((res) => {
            console.log(res);
            this.HostUserName = res.originalData?.userName;

            this.user = JSON.parse(localStorage.getItem('Pop')!) as User;
            // the element could be either a wrapped DOM element or a nativeElement
            this.videoElement = this.videoElementRef?.nativeElement;

            if (Hls.isSupported()) {
                console.log("Video streaming supported by HLSjs")
                console.log(this.HostUserName);
                var hls = new Hls();
                hls.loadSource(`http://localhost:8000/live/${this.HostUserName!}/index.m3u8`);
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


        })

    }

    CheckParams() {
        this.router.paramMap.subscribe((v) => {
            const id: string = v.get('id')!;
            if (id) {
                console.log(`=========> URL PARAMS IS ${id}`);
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
            //console.log(ol);
            const sign = ol.signature;

            const IsValid = this.securityService.verify(ol.originalData, sign);

            if (IsValid) {
                console.log('### Stream is valid');
                console.log(ol.originalData);
                //this.HostId = ol.transparantuserid;
                this.NewStream = ol.originalData;
            } else {
                console.warn('No stream is running');
            }
        });
    }
}
