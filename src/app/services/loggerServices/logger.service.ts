import { Injectable } from '@angular/core';
import { LogLevel } from '../../Domain/Models/LogLevel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SecurityService } from '../authServices/security';
import { AuthService } from '../authServices/auth.service';

@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    logLevel: LogLevel = new LogLevel();
    ipAddress = '';

    constructor(private http: HttpClient, private security: SecurityService, private authService: AuthService) {
        this.getIPAddress();
    }

    trace(msg: string): void {
        this.logWith(this.logLevel.Trace, msg);
    }

    debug(msg: string): void {
        this.logWith(this.logLevel.Debug, msg);
    }

    information(msg: string): void {
        this.logWith(this.logLevel.Information, msg);
    }

    warning(msg: string): void {
        this.logWith(this.logLevel.Warning, msg);
    }

    error(msg: string): void {
        this.logWith(this.logLevel.Error, msg);
    }

    critical(msg: string): void {
        this.logWith(this.logLevel.Critical, msg);
    }

    logToDB(endpoint: string, action: string): Observable<any> {
        this.logWith(this.logLevel.Trace, endpoint + ' ' + action);
        this.getIPAddress();

        const User = this.authService.GetWebUser();

        const original = {
            Id: 0,
            DateTime: new Date(),
            Ip: "this.ipAddress",
            Endpoint: endpoint,
            SubjectUser: User?.userName,
            Action: action
          };
        
        

        const signature = this.security.sign(JSON.stringify(original,null, 0).toLowerCase());

        const log = {
            RandomId: "string",
            Signature: signature,
            SenderUserId: User?.id,
            OriginalData: original
        }

        console.log(log);

        console.log(`Endpoint is: ${environment.SERVER_API_URL + 'api/Logging'}`);
        return this.http.post(environment.SERVER_API_URL + 'api/Logging', log);
    }

    private logWith(level: any, msg: string): void {
        this.getIPAddress();

        if (level <= this.logLevel.None) {
            switch (level) {
                case this.logLevel.None:
                    return console.log(msg);
                case this.logLevel.Trace:
                    return console.trace(
                        `%c IP: ${this.ipAddress} |  ${msg}`,
                        'color: #6495ED'
                    );
                case this.logLevel.Debug:
                    return console.debug('%c' + msg, 'color: #6495ED');
                case this.logLevel.Information:
                    return console.info('%c' + msg, 'color: #6495ED');
                case this.logLevel.Warning:
                    return console.warn('%c' + msg, 'color: #FF8C00');
                case this.logLevel.Error:
                    return console.error('%c' + msg, 'color: #DC143C');
                case this.logLevel.Critical:
                    return console.error('%c' + msg, 'color: #DC143C');
                default:
                    console.debug(msg);
            }
        }
    }

    getIPAddress() {
        this.http
            .get('http://api.ipify.org/?format=json')
            .subscribe((res: any) => {
                this.ipAddress = res;
                console.log(res);
            });
    }
}
