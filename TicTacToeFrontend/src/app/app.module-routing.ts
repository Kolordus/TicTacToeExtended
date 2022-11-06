import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {NoSuchPageComponent} from "./no-such-page/no-such-page.component";

const paths: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'game/:gameId', component: HomeComponent, pathMatch: 'full'},
  {path: '**', component: NoSuchPageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(paths)],
  exports: [RouterModule]
})
export class AppModuleRouting {

}
