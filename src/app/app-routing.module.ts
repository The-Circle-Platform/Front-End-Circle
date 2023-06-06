import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import {OnlineListComponent} from "./pages/homepage/online-list/online-list.component";
import {ProfilePageComponent} from "./pages/profile/profile-page/profile-page.component";
import {BroadcastPageComponent} from "./pages/broadcast/broadcast-page/broadcast-page.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'homepage' },
    { path: 'homepage', pathMatch: 'full', component: HomePageComponent },
    { path: 'listStreamers', pathMatch: 'full', component:OnlineListComponent},
    { path: 'Profile', pathMatch: 'full', component: ProfilePageComponent},
    { path: 'Stream', pathMatch: 'full', component: BroadcastPageComponent},
    { path: '**', redirectTo: 'homepage' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
