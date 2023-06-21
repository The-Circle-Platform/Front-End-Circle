import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./pages/homepage/home-page/home-page.component";
import { OnlineListComponent } from "./pages/homepage/online-list/online-list.component";
import { ProfilePageComponent } from "./pages/profile/profile-page/profile-page.component";
import { BroadcastPageComponent } from "./pages/broadcast/broadcast-page/broadcast-page.component";
import { StreamPageComponent } from "./pages/broadcast/stream-page/stream-page.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegistrationPageComponent } from "./pages/registration/registration-page/registration-page.component";
import {ViewerCountComponent} from "./pages/broadcast/viewer-count/viewer-count.component";
import {AdminPageComponent} from "./pages/admin/admin-page/admin-page.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "homepage" },
  { path: "homepage", pathMatch: "full", component: HomePageComponent },
  { path: "listStreamers", pathMatch: "full", component: OnlineListComponent },
  { path: "broadcast", pathMatch: "full", component: BroadcastPageComponent },
  { path: "profile", pathMatch: "full", component: ProfilePageComponent },
  { path: "user/:id/stream/current", pathMatch: "full", component: StreamPageComponent },
  { path: "login", pathMatch: "full", component: LoginComponent },
  {
    path: "registration",
    pathMatch: "full",
    component: RegistrationPageComponent,
  },
    //temp path for development of view
  {path: "viewerCount",
  pathMatch: "full",
  component: ViewerCountComponent},
  {path: "admin", pathMatch: "full", component: AdminPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
