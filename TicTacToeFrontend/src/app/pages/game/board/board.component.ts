import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GameService} from "../../../service/game.service";
import {GameData} from "../../../../model/GameData";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {


  @Output()
  selectedField$ = new EventEmitter<number>();
  selectedField: number;

  game: GameData;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.game.subscribe(value => {
      this.game = value;
    });
  }

  selectFieldNo(fieldNo: number) {
    this.selectedField = fieldNo;
    this.selectedField$.emit(this.selectedField);
  }

  buttonClass(playerNo: number) {
    switch (playerNo) {
      case 1: return 'player-1';
      case 2: return 'player-2';
      default: return 'not-taken';
    }
  }

  isSelected(fieldNo: number) {
    return this.selectedField == fieldNo;
  }
}
