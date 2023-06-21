import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IService } from '../../Domain/Interfaces/IService';
import { User, userDTO } from '../../Domain/Models/User';
import { ConfigService } from '../../shared/moduleconfig/config.service';
import {securityService} from "../authServices/security";
import {environment} from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UserService implements IService<User> {
    private siteEndpoint: string;

    constructor(
        private configService: ConfigService,
        public httpClient: HttpClient,
        private securityService: securityService
    ) {
        this.siteEndpoint = `${
            this.configService.getConfig().apiEndpoint
        }api/user`;
    }

    Get(id: number): Observable<userDTO> {
        return this.httpClient.get<userDTO>(`${this.siteEndpoint}/${id}`);
    }

    GetAll(): Observable<userDTO> {
        return this.httpClient.get<userDTO>(this.siteEndpoint);
    }

    Create(user: any): Observable<any> {
        var json = JSON.stringify(user, null, 0).toLowerCase();
        const signature = this.securityService.sign(json);
        var request = {
            originalRegisterData: user,
            signature: signature
        }
        return this.httpClient.post(environment.SERVER_API_URL + "api/auth/register", request);
    }

    CreateAdmin(admin: any): Observable<any> {
        var json = JSON.stringify(admin, null, 0).toLowerCase();
        const signature = this.securityService.sign(json);
        var request = {
            originalRegisterData: admin,
            signature: signature
        }
        return this.httpClient.post(environment.SERVER_API_URL + "api/auth/register-admin", request);

    }

    Update(entity: User): Observable<userDTO> {
        return this.httpClient.put<userDTO>(
            `${this.siteEndpoint}/${entity.id}`,
            entity
        );
    }

    uploadPfp(pfpUser: User): Observable<userDTO> {
        console.log("made it to uploadPFP")
        console.log(pfpUser);
        pfpUser.timeStamp = Date.now();
        console.log(pfpUser);


        var json = JSON.stringify(pfpUser, null, 0).toLowerCase();
        var signature = this.securityService.sign(json);
        var test = {
            request: pfpUser,
            signature: signature
        }
        return this.httpClient.put<userDTO>(
            `${this.siteEndpoint}/${pfpUser.id}/pfp`,
            test
        );
    }
}
