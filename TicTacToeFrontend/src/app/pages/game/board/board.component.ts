import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GameService} from "../../../service/game.service";
import {GameData} from "../../../../model/GameData";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  game: GameData;

  @Output()
  selectedField = new EventEmitter<number>();

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.game = this.gameService.game;
  }

  selectFieldNo(fieldNo: any) {
    this.selectedField.emit(fieldNo);
  }
}
