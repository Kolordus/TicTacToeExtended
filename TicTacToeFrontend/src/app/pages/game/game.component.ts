import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../service/game.service";
import {GameData} from "../../../model/GameData";
import {ConnectionService} from "../../service/connection.service";
import {map, Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject();
  playerNo$ = this.gameService.playerNo;
  game$ = this.gameService.game;
  image$ = this.connection.isOpponentConnected().pipe(
    map(is => is ? 'assets/is.jpg' : 'assets/isNot.jpg')
  );

  constructor(private route: ActivatedRoute,
              private router: Router,
              private gameService: GameService,
              private connection: ConnectionService) {
  }

  ngOnInit(): void {
    this.game$.pipe(
      takeUntil(this.unsubscribe$),
      tap(gameData => {
        if (gameData === GameData.EMPTY) {
          this.router.navigate(["home"]);
        }
      })
    ).subscribe(_ => _);
  }

  selectFieldNo(fieldNo: number) {
    this.gameService.selectFieldNo(fieldNo);
  }

  selectNominal(nominal: number) {
    this.gameService.selectNominal(nominal);
  }

  send() {
    this.connection.send();
  }

  canSend() {
    return this.gameService.canSend();
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    await this.connection.disconnect();
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
