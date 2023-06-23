import { Injectable } from '@angular/core';
import { ConfigService } from '../../../shared/moduleconfig/config.service';

@Injectable({ providedIn: 'root' })
export class ViewService {
    public endpoints: string;
    public viewCount: number;

    constructor(public con: ConfigService) {
        this.endpoints = `${con.getApiEndpoint()}hubs/ViewHub`;
        this.viewCount = 0;
    }
}
