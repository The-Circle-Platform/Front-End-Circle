import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Hls from 'hls.js';
import { User } from '../../../Domain/Models/User';
import { AuthService } from '../../../services/authServices/auth.service';

@Component({
    selector: 'app-broadcast-page',
    templateUrl: './broadcast-page.component.html',
    styleUrls: ['./broadcast-page.component.css'],
})
export class BroadcastPageComponent {
    NewStream: any | undefined;
    HostId: number = 1;
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
            this.HostId = this.authService.GetWebUser()?.id!;
        } catch (error) {
            console.error('Error accessing WebUser:', error);
        }
    }
}
