import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../service/game.service";
import {GameData} from "../../../model/GameData";
import {ConnectionService} from "../../service/connection.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  game: GameData;

  playerNo$ = this.gameService.playerNo;
  selectedNominal$ = this.gameService.selectedNominal;
  selectedFieldNo$ = this.gameService.selectedFieldNo;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private connection: ConnectionService) {
  }

  ngOnInit(): void {
    this.gameService.game.subscribe(value => {
      this.game = value;
    });
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
    return this.valuesSelected() || this.isCurrentsPlayerTurn();
  }

  valuesSelected() {
    return this.selectedNominal$.getValue() == 0 || this.selectedFieldNo$.getValue() == 0;
  }

  isCurrentsPlayerTurn() {
    return this.game.game.currentPlayer.no != this.playerNo$.getValue();
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    if (this.game.game.gameId !== null) {
      await this.connection.disconnect();
    }
  }
}
