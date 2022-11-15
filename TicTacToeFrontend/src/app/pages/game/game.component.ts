import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../service/game.service";
import {GameData} from "../../../model/GameData";
import {ConnectionService} from "../../service/connection.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

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
      console.log(value);
    });
  }

  selectFieldNo(fieldNo: number) {
    console.log(fieldNo);
    this.gameService.selectFieldNo(fieldNo);
  }


  selectNominal(nominal: number) {
    console.log(nominal);
    this.gameService.selectNominal(nominal);
  }

  send() {
    this.connection.send();
  }
}
