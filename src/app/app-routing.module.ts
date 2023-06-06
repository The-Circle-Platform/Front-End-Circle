import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';
import { BroadcastPageComponent } from './pages/broadcast/broadcast-page/broadcast-page.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'homepage' },
    { path: 'homepage', pathMatch: 'full', component: HomePageComponent },
    { path: 'broadcast', pathMatch: 'full', component: BroadcastPageComponent},
    { path: '**', redirectTo: 'homepage' },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
