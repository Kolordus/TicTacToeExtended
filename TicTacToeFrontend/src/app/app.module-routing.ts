import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./pages/home/home.component";
import {NoSuchPageComponent} from "./pages/no-such-page/no-such-page.component";
import {GameComponent} from "./pages/game/game.component";

const paths: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'game/:gameId', component: GameComponent, pathMatch: 'full'},
  {path: '**', component: NoSuchPageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(paths)],
  exports: [RouterModule]
})
export class AppModuleRouting {

}
