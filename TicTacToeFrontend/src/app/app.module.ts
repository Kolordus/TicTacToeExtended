import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {HomeComponent} from './pages/home/home.component';
import {NoSuchPageComponent} from './pages/no-such-page/no-such-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppModuleRouting} from "./app.module-routing";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import { GameComponent } from './pages/game/game.component';
import { AvailableGamesComponent } from './components/available-games/available-games.component';
import { NominalsComponent } from './pages/game/nominals/nominals.component';
import { BoardComponent } from './pages/game/board/board.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoSuchPageComponent,
    GameComponent,
    AvailableGamesComponent,
    NominalsComponent,
    BoardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppModuleRouting,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
