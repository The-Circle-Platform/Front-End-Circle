import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component';
import { BroadcastPageComponent } from './pages/broadcast/broadcast-page/broadcast-page.component';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminPageComponent,
    BroadcastPageComponent,
    HomePageComponent,
    ProfilePageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
