import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/authServices/auth.service";
import { LoggerService } from "src/app/services/loggerServices/logger.service";
import { UserService } from "src/app/services/userServices/user.service";

@Component({
  selector: "app-stream-page",
  templateUrl: "./stream-page.component.html",
  styleUrls: ["./stream-page.component.css"],
})
export class StreamPageComponent implements OnInit {
  IsFollowing: boolean = false;
  streamerId!: number;
  followerId!: number;

  constructor(
    private route: ActivatedRoute,
    private loggerService: LoggerService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.streamerId = this.route.snapshot.params["id"];

    this.authService.currentToken$.subscribe((user: any) => {
      this.followerId = user;
    });

    this.checkFollowerExists();
  }

  checkFollowerExists(): void {
    this.userService
      .checkFollowerExists(this.streamerId, this.followerId)
      .subscribe(
        (isFollowing: boolean) => {
          this.IsFollowing = isFollowing;
          // TODO: Change later
          this.loggerService.addLog(`User ${this.followerId} folllows`);
        },
        (error: any) => {
          console.error("Error checking follower:", error);
        }
      );
  }
}
