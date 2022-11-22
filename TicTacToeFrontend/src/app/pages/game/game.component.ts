import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../service/game.service";
import {GameData} from "../../../model/GameData";
import {ConnectionService} from "../../service/connection.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  sub = new Subscription();
  game$: GameData;
  playerNo$ = this.gameService.playerNo;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private connection: ConnectionService) {
  }

  ngOnInit(): void {
    let subscription = this.gameService.game.subscribe(value => {
      this.game$ = value;
    });
    this.sub.add(subscription);
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
    return this.valuesSelected() || this.isCurrentsPlayerTurn() || this.isCorrectNominalSelected();
  }

  valuesSelected() {
    return this.gameService.selectedNominal == 0 || this.gameService.fieldNoToSend == 0;
  }

  isCurrentsPlayerTurn() {
    return this.game$.game.currentPlayer.no != this.gameService.playerNo$.getValue();
  }

  isCorrectNominalSelected() {
    if (this.gameService.selectedNominal) {
      let valueAtField = this.game$.game.board[this.gameService.fieldNoToSend-1];
      return !(this.gameService.selectedNominal > valueAtField.currentNominal);
    }
    return true;
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.game$.game.gameId !== null) {
      await this.connection.disconnect();
    }
  }
}
