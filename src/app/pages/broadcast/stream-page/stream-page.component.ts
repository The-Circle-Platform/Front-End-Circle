import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../../services/authServices/security';
import { VidStream } from '../../../services/vidStream/VidStream.service';

@Component({
    selector: 'app-stream-page',
    templateUrl: './stream-page.component.html',
    styleUrls: ['./stream-page.component.css'],
})
export class StreamPageComponent implements OnInit {
    NewStream: any | undefined;
    HostId: number;
    StreamId: number;

    constructor(
        private router: ActivatedRoute,
        private VidService: VidStream,
        private securityService: SecurityService
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
