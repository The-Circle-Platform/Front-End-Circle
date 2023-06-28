import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component';
import { BroadcastPageComponent } from './pages/broadcast/broadcast-page/broadcast-page.component';
import { StreamPageComponent } from './pages/broadcast/stream-page/stream-page.component';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import { OnlineListComponent } from './pages/homepage/online-list/online-list.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';
import { RegistrationPageComponent } from './pages/registration/registration-page/registration-page.component';
import {VideoPlayerComponent} from "./pages/broadcast/video-player/video-player.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'homepage' },
    { path: 'homepage', pathMatch: 'full', component: HomePageComponent },
    {
        path: 'listStreamers',
        pathMatch: 'full',
        component: OnlineListComponent,
    },
    { path: 'broadcast', pathMatch: 'full', component: BroadcastPageComponent },
    { path: 'profile', pathMatch: 'full', component: ProfilePageComponent },
    {
        path: 'user/:id/stream/current',
        pathMatch: 'full',
        component: StreamPageComponent,
    },
    { path: 'login', pathMatch: 'full', component: LoginComponent },
    {
        path: 'registration',
        pathMatch: 'full',
        component: RegistrationPageComponent,
    },
    { path: 'admin', pathMatch: 'full', component: AdminPageComponent },
    {path: 'test', pathMatch: "full", component: VideoPlayerComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
