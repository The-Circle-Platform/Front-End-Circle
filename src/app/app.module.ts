import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component';
import { BroadcastPageComponent } from './pages/broadcast/broadcast-page/broadcast-page.component';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';
import { StreamingVideoComponent } from './pages/streaming-video/streaming-video.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavComponent } from './shared/nav/nav.component';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        FooterComponent,
        AdminPageComponent,
        BroadcastPageComponent,
        HomePageComponent,
        ProfilePageComponent,
        StreamingVideoComponent,
    ],
    imports: [BrowserModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
