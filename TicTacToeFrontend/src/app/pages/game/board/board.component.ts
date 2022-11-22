import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {GameService} from "../../../service/game.service";
import {GameData} from "../../../../model/GameData";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  @Output()
  selectedField$ = new EventEmitter<number>();
  selectedField: number;

  game: GameData;
  subscriptions = new Subscription();

  constructor(private gameService: GameService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    let subscription = this.gameService.game$.subscribe(value => {
      this.game = value;
    });
    this.subscriptions.add(subscription);
  }

  selectFieldNo(fieldNo: number) {
    this.selectedField = fieldNo;
    this.selectedField$.emit(this.selectedField);
  }

  buttonClass(playerNo: number) {
    switch (playerNo) {
      case 1:
        return 'player-1';
      case 2:
        return 'player-2';
      default:
        return 'not-taken';
    }
  }

  isSelected(fieldNo: number) {
    return this.selectedField == fieldNo;
  }
}
