import {Component, HostListener, OnDestroy} from '@angular/core';
import {HistoryService} from "../../../service/history.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnDestroy{

  history$ = this.historyService.history;

  constructor(private historyService: HistoryService) { }

  showThisMove(i: number) {
    console.log(this.historyService.getMovementAtIndext(i))
  }

  showAllHistory() {
    this.historyService.showAll();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.historyService.clear();
  }
}
