import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectionService} from "../../service/connection.service";
import {Observable, Subscription} from "rxjs";
import {SseService} from "../../service/sse.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  subs = new Subscription()

  // isUserNotConnected$ = this.connection.isUserNotConnected.asObservable();
  availableGames$: Observable<string[]> = this.connection.showOpenGames();

  constructor(
    private connection: ConnectionService,
    private sse: SseService,
  ) {}
  /*
  można zrobic fork join z show open games i emmitera
  wtedy będzie można pozyskiwac emmitera z requesta
  trzeba będzie chyba rozbic na dwa requesty - nie?
  no chyba żeby zrobić to w jednym i elo - ale z obsevabla dostaje rekord z id i emmiterem i pozyskuje tego emittera
  spokojnie można tak zrobić przecież
   */

  async ngOnInit() {
    this.connection.updateGamesList();
    let subscription = this.sse.subscribeToLobby().subscribe( async value => {
      let event = value as MessageEvent;
      let data = event.data as string;

      let msg: string[] = data.split(" ");

      if (msg[0].startsWith("create")) {
        await this.connection.updateGamesList();
      }
      if (msg[0].startsWith("delete")) {
        this.connection.removeFromGamesList(msg[1].substring(0, msg[1].length));
      }
    });

    this.subs.add(subscription);
  }

  async ngOnDestroy() {
    await this.sse.unsubscribeLobby().subscribe(_ => console.log('halo?'));
    this.subs.unsubscribe();
  }

  async createGameAndConnect() {
    setTimeout(async () => {
      await this.connection.createGame()
    }, 10);
  }
}
