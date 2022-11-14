import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../service/game.service";
import {GameData} from "../../../model/GameData";
import {Observable} from "rxjs";
import {ConnectionService} from "../../service/connection.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  /*
  teraz trzeba się zastanawoić nad czymś takim:

każdy send i każdy receive to powinien być behaviour subject ponownie
i wtedy się
aktualizuje gra!
   */

  game: GameData;

  playerNo$ = this.gameService.playerNo;
  selectedNominal$ = this.gameService.selectedNominal;
  selectedFieldNo$ = this.gameService.selectedFieldNo;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private connection: ConnectionService) {
  }

  ngOnInit(): void {
    // console.log(this.route.snapshot.paramMap.get('gameId'));
    // console.log(this.gameService.getGame);
    this.game = this.gameService.game;
  }

  selectFieldNo(fieldNo: number) {
    this.gameService.selectFieldNo(fieldNo);
  }

  getBackgroundColor(playerNo: number) {
    return 'red';
  }

  selectNominal(nominal: number) {
    this.gameService.selectNominal(nominal);
  }

  send() {
    // this.connection.send();
  }
}
