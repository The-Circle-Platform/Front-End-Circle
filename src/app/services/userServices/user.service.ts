import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IService } from '../../Domain/Interfaces/IService';
import { PfpUser, User } from '../../Domain/Models/User';
import { ConfigService } from '../../shared/moduleconfig/config.service';

@Injectable({ providedIn: 'root' })
export class UserService implements IService<User> {
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
        return this.httpClient.get<User>(`${this.siteEndpoint}/${id}`);
    }

    GetAll(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.siteEndpoint);
    }

    Create(entity: User): Observable<any> {
        return this.httpClient.post(this.siteEndpoint, entity);
    }

    Update(entity: User): Observable<User> {
        return this.httpClient.put<User>(
            `${this.siteEndpoint}/${entity.id}`,
            entity
        );
    }

    uploadPfp(pfpUser: User): Observable<any> {
        console.log('hij roept de methode aan', pfpUser);
        return this.httpClient.post(`${this.siteEndpoint}/2/pfp`, pfpUser);
    }

    getPfp(userId: number): Observable<any> {
        // TODO: Update this to use the correct endpoint
        console.log('hij roept de methode aan', userId);
        return this.httpClient.get(`${this.siteEndpoint}/${userId}`);
    }
}
