import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component';
import { BroadcastPageComponent } from './pages/broadcast/broadcast-page/broadcast-page.component';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';
import { OnlineListComponent } from './pages/homepage/online-list/online-list.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    AdminPageComponent,
    BroadcastPageComponent,
    HomePageComponent,
    ProfilePageComponent,
    OnlineListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
