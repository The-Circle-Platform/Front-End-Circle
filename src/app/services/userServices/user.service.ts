import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IService } from "src/app/Domain/Interfaces/IService";
import { User } from "src/app/Domain/Models/User";

@Injectable()
export class userService implements IService<User> {
    url: string;

    constructor(public httpClient: HttpClient){
        this.url = "https://localhost:7058/api/user";
    }
    Get(id: number): Observable<User> {
        return this.httpClient.get<User>(this.url + "/" + id);
    }

    GetAll(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.url);
    }

    Create(entity: User): Observable<any> {
        return this.httpClient.post(this.url, entity, {});
    }

    Update(entity: User): Observable<User> {
        throw new Error("Method not implemented.");
    }
}