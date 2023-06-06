import { CommonModule } from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component';
import { BroadcastPageComponent } from './pages/broadcast/broadcast-page/broadcast-page.component';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavComponent } from './shared/nav/nav.component';
import { OnlineListComponent } from './pages/homepage/online-list/online-list.component';
import {HttpClientModule} from "@angular/common/http";
import { UserCardComponent } from './pages/homepage/online-list/user-card/user-card.component';
import { ChatStreamComponent } from './pages/broadcast/chat-stream/chat-stream.component';
import { StreamingPlayerComponent } from './pages/broadcast/streaming-player/streaming-player.component';

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
    ],
    imports: [BrowserModule, CommonModule, RouterModule, AppRoutingModule, HttpClientModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
