import jwt_decode from "jwt-decode";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Router } from "@angular/router";
import { map, catchError, switchMap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "src/app/shared/moduleconfig/config.service";
import {
  IToken,
  IRegister,
  UserIdentity,
  UserInfo,
  ILogin,
} from "../../Domain/Models/User";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<IToken | undefined>(undefined);
  private readonly CURRENT_USER = "currentuser";
  private readonly headers = new HttpHeaders({
    "Content-Type": "application/json",
  });
  private siteEndpoint: string;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private router: Router
  ) {
    this.siteEndpoint = `${this.configService.getConfig().apiEndpoint}api/auth`;

    this.getUserFromLocalStorage()
      .pipe(
        switchMap((user: IToken | undefined) => {
          if (user) {
            this.currentUser$.next(user);
            console.log(
              "User from local storage:",
              this.decodeJwtToken(this.getAuthorizationToken() || "")
            );
            return of(user);
          } else {
            return of(undefined);
          }
        })
      )
      .subscribe();
  }

  decodeJwtToken(token: string) {
    return token ? jwt_decode(token) : null;
  }

  login(
      userName: string,
      password: string
  ): Observable<Object>
  {
    const credentials = {
      userName: userName,
      password: password
    }
    return this.http.post("https://localhost:7058/api/Auth/login", credentials);
  }

  register(userData: IRegister): Observable<UserInfo | undefined> {
    return this.http
      .post<UserInfo>(`${this.siteEndpoint}/register`, userData, {
        headers: this.headers,
      })
      .pipe(
        map((data: any) => {
          localStorage.setItem(this.CURRENT_USER, JSON.stringify(data.results));
          this.currentUser$.next(data);
          return data;
        }),
        catchError((error) => {
          console.log("Error message:", error.error.message);
          return of(undefined);
        })
      );
  }

  logout(): void {
    this.router
      .navigate(["/"])
      .then((success) => {
        if (success) {
          console.log("logout - removing local user info");
          localStorage.removeItem(this.CURRENT_USER);
          this.currentUser$.next(undefined);
        } else {
          console.log("navigate result:", success);
        }
      })
      .catch((error) => console.log("Error message:", error.error.message));
  }

  getUserFromLocalStorage(): Observable<UserInfo | undefined> {
    const user = localStorage.getItem(this.CURRENT_USER);

    if (user) {
      const localUser = JSON.parse(user);
      return of(localUser);
    } else {
      return of(undefined);
    }
  }

  getAuthorizationToken(): string | undefined {
    const user = JSON.parse(localStorage.getItem(this.CURRENT_USER) || "{}");
    return user.token;
  }

  getCurrentUserId(): string | undefined {
    const user = JSON.parse(localStorage.getItem(this.CURRENT_USER) || "{}");
    return user.id;
  }
}
