import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectionService} from "../../service/connection.service";
import {Observable, Subscription} from "rxjs";
import {SseService} from "../../service/sse.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{

  subs = new Subscription()

  isUserNotConnected$ = this.connection.isUserNotConnected.asObservable();
  availableGames$: Observable<string[]> = this.connection.showOpenGames();

  constructor(
    private connection: ConnectionService,
    private sse: SseService
  ) { }

  ngOnInit() {
    let subscription = this.sse.subscribeToLobby().subscribe(value => {
      let event = value as MessageEvent;
      let data = event.data as string;

      let msg: string[] = data.split(" ");

      if (msg[0].includes("create"))
        this.connection.updateGamesList();
      if (msg[0].includes("delete")) {
        this.connection.removeFromGamesList(msg[1].substring(0, msg[1].length));
      }
    });

    this.subs.add(subscription);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async createGameAndConnect() {
    await this.connection.createGame();
  }
}
