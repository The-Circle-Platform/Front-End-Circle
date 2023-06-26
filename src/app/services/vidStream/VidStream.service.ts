import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IContent } from '../../Domain/Interfaces/IContent';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import { AuthService } from '../authServices/auth.service';
import { SecurityService } from '../authServices/security';

@Injectable({ providedIn: 'root' })
export class VidStream {
    endpoint: string;

    constructor(
        public config: ConfigService,
        private http: HttpClient,
        private authService: AuthService,
        private signatureSerivce: SecurityService
    ) {
        this.authService = authService;
        this.signatureSerivce = signatureSerivce;
        this.endpoint = `${config.getApiEndpoint()}api/VideoStream/`;
    }

    GetStreamOfHost(HostId: number): Observable<any> {
        return this.http.get(`${this.endpoint}${HostId}`);
    }

    SendNewStream() {
        const sendStream = {
            id: 0,
            title: 'Een stream',
            startStream: new Date(),
            endStream: null,
            transparantUserName: this.authService.GetWebUser()?.userName,
            transparantUserId: this.authService.GetWebUser()?.id,
        };

        const sig = this.signatureSerivce.sign(
            JSON.stringify(sendStream).toLowerCase()
        );

        const dto = {
            OriginalData: sendStream,
            SenderUserId: sendStream.transparantUserId!,
            Signature: sig,
        };

        return this.http.post(this.endpoint, dto);
    }

    TurnOffStream(HostId: number, streamId: number) {
        return this.http.put(
            `${this.endpoint}${HostId}/CurrentStream/${streamId}`,
            {}
        );
    }
}

export interface Istream extends IContent {
    OriginalData: OriginalData;
}

export class OriginalData {
    Id?: number;
    Title?: string;
    StartStream?: Date;
    EndStream?: Date;
    TransparantUserName: string | undefined;
    TransparantUserId: number | undefined;
}
