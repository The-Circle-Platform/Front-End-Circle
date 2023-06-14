import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IService } from '../../Domain/Interfaces/IService';
import { User } from '../../Domain/Models/User';
import { ConfigService } from '../../shared/moduleconfig/config.service';

@Injectable({ providedIn: 'root' })
export class userService implements IService<User> {
    private siteEndpoint: string;

    constructor(
        private configService: ConfigService,
        public httpClient: HttpClient
    ) {
        this.siteEndpoint = `${
            this.configService.getConfig().apiEndpoint
        }api/user`;
    }
    Get(id: number): Observable<User> {
        return this.httpClient.get<User>(this.siteEndpoint + '/' + id);
    }

    GetAll(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.siteEndpoint);
    }

    Create(entity: User): Observable<any> {
        return this.httpClient.post(this.siteEndpoint, entity, {});
    }

    Update(entity: User): Observable<User> {
        throw new Error('Method not implemented.');
    }
}
