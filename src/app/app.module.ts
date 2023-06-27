import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    LOCALE_ID,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component';
import { BroadcastPageComponent } from './pages/broadcast/broadcast-page/broadcast-page.component';
import { ChatStreamComponent } from './pages/broadcast/chat-stream/chat-stream.component';
import { StreamPageComponent } from './pages/broadcast/stream-page/stream-page.component';
import { StreamingPlayerComponent } from './pages/broadcast/streaming-player/streaming-player.component';
import { ViewCountComponent } from './pages/broadcast/view-count/view-count.component';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import { OnlineListComponent } from './pages/homepage/online-list/online-list.component';
import { UserCardComponent } from './pages/homepage/online-list/user-card/user-card.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';
import { RegistrationPageComponent } from './pages/registration/registration-page/registration-page.component';
import { LoggedInAuthGuard } from './services/authServices/auth.guards';
import { FooterComponent } from './shared/footer/footer.component';
import { ConfigModule } from './shared/moduleconfig/config.module';
import { NavComponent } from './shared/nav/nav.component';
import { VideoPlayerComponent } from './pages/broadcast/video-player/video-player.component';

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
        VideoPlayerComponent,
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
    providers: [{ provide: LOCALE_ID, useValue: 'nl' }, LoggedInAuthGuard],
    bootstrap: [AppComponent],
})
export class AppModule {}
