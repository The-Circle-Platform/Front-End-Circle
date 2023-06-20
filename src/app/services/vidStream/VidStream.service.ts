import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { VideoStream } from "src/app/Domain/Models/Stream";
import { ConfigModule } from "src/app/shared/moduleconfig/config.module";
import { ConfigService } from "src/app/shared/moduleconfig/config.service";

@Injectable({providedIn: 'root'})
export class VidStream{

    endpoint: string

    constructor(public config: ConfigService, private http: HttpClient){
        this.endpoint = `${config.getApiEndpoint()}VideoStream/`;
    }

    GetStreamOfHost(HostId: number): Observable<any>{
        return this.http.get(`${this.endpoint}${HostId}`);
    }
}