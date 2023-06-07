import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./pages/homepage/home-page/home-page.component";
import { OnlineListComponent } from "./pages/homepage/online-list/online-list.component";
import { ProfilePageComponent } from "./pages/profile/profile-page/profile-page.component";
import { BroadcastPageComponent } from "./pages/broadcast/broadcast-page/broadcast-page.component";
import { StreamPageComponent } from "./pages/broadcast/stream-page/stream-page.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "homepage" },
  { path: "homepage", pathMatch: "full", component: HomePageComponent },
  { path: "listStreamers", pathMatch: "full", component: OnlineListComponent },
  { path: "Profile", pathMatch: "full", component: ProfilePageComponent },
  { path: "Stream", pathMatch: "full", component: StreamPageComponent },
  { path: "Login", pathMatch: "full", component: LoginComponent },
  { path: "**", redirectTo: "homepage" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
