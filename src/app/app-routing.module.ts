import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/homepage/home-page/home-page.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'homepage' },
    { path: 'homepage', pathMatch: 'full', component: HomePageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
