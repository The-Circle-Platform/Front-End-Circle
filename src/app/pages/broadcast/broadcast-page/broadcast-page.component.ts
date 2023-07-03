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
    HostId: number = 1;

    // access the declared DOM element; expose all methods and properties

    // declare and inherit the HTML video methods and its properties

    constructor(private authService: AuthService) {}

    async ngOnInit(): Promise<void> {
        try {
            this.HostId = this.authService.GetWebUser()?.id!;
        } catch (error) {
            console.error('Error accessing WebUser:', error);
        }
    }
}
