import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "src/app/shared/moduleconfig/config.service";
import { IContent } from "src/app/Domain/Interfaces/IContent"
import {Title} from "@angular/platform-browser";
import {AuthService} from "../authServices/auth.service";
import {securityService} from "../authServices/security";

@Injectable({providedIn: 'root'})
export class VidStream{

    endpoint: string


    constructor(public config: ConfigService, private http: HttpClient,private authService: AuthService, private signatureSerivce: securityService){
        this.authService = authService;
        this.signatureSerivce = signatureSerivce;
        this.endpoint = `${config.getApiEndpoint()}api/VideoStream`;
    }

    GetStreamOfHost(HostId: number): Observable<any>{
        return this.http.get(`${this.endpoint}${HostId}`);
    }


    SendNewStream(){

        const newStream = new OriginalData();
        newStream.StartStream = new Date();
        newStream.Title = "joepie"
        newStream.TransparantUserId = this.authService.GetWebUser()?.id
        newStream.TransparantUserName = "DummyData"
        newStream.EndStream = undefined


        const sig = this.signatureSerivce.sign(JSON.stringify(newStream, null, 0).toLowerCase());

        const dto: Istream = {
            OriginalData: newStream,
            SenderUserId: newStream.TransparantUserId!,
            Signature: sig
        }

        return this.http.post(this.endpoint, dto);
    }





}

export interface Istream extends IContent {
    OriginalData: OriginalData;

}

export class OriginalData {
    Id?: number;
    Title?:string;
    StartStream?: Date;
    EndStream?:Date;
    TransparantUserName: string | undefined;
    TransparantUserId: number | undefined;
}

