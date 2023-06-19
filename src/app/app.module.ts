import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  LOCALE_ID,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

import { AppComponent } from "./app.component";
import { AdminPageComponent } from "./pages/admin/admin-page/admin-page.component";
import { BroadcastPageComponent } from "./pages/broadcast/broadcast-page/broadcast-page.component";
import { HomePageComponent } from "./pages/homepage/home-page/home-page.component";
import { ProfilePageComponent } from "./pages/profile/profile-page/profile-page.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { NavComponent } from "./shared/nav/nav.component";
import { OnlineListComponent } from "./pages/homepage/online-list/online-list.component";
import { HttpClientModule } from "@angular/common/http";
import { UserCardComponent } from "./pages/homepage/online-list/user-card/user-card.component";
import { ChatStreamComponent } from "./pages/broadcast/chat-stream/chat-stream.component";
import { StreamingPlayerComponent } from "./pages/broadcast/streaming-player/streaming-player.component";
import { StreamPageComponent } from "./pages/broadcast/stream-page/stream-page.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegistrationPageComponent } from "./pages/registration/registration-page/registration-page.component";
import { ConfigModule } from "./shared/moduleconfig/config.module";
import { environment } from "../environments/environment";
import { ReactiveFormsModule } from "@angular/forms";
import { LoggedInAuthGuard } from "./services/authServices/auth.guards";
import { FormsModule } from "@angular/forms";
import { ViewCountComponent } from './pages/broadcast/view-count/view-count.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavComponent,
    FooterComponent,
    AdminPageComponent,
    BroadcastPageComponent,
    ProfilePageComponent,
    OnlineListComponent,
    UserCardComponent,
    ChatStreamComponent,
    StreamingPlayerComponent,
    StreamPageComponent,
    LoginComponent,
    RegistrationPageComponent,
    ViewCountComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [{ provide: LOCALE_ID, useValue: "nl" }, LoggedInAuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
