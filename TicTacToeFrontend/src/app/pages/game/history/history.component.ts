import {Component, HostListener, OnDestroy} from '@angular/core';
import {HistoryService} from "../../../service/history.service";
import {GameData} from "../../../../model/GameData";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnDestroy{

  history$ = this.historyService.history;
  showingGame: GameData | null;

  constructor(private historyService: HistoryService) { }

  showThisMove(i: number) {
    if ((i + 1) === this.historyService.getMovesAmount()) {
      this.showingGame = null;
      return;
    }
    this.showingGame = this.historyService.getMovementAtIndext(i);
  }

  showName(i: number):string {
    if ((i) === this.historyService.getMovesAmount())
      return 'Current move';

    return i.toString();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.historyService.clear();
  }
}
