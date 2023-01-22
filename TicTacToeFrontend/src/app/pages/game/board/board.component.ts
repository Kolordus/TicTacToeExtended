import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Field} from "../../../../model/Field";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  @Input()
  board: Field[];

  @Output()
  selectedField$ = new EventEmitter<number>();
  selectedField: number;

  constructor() {}

  selectFieldNo(fieldNo: number) {
    this.selectedField = fieldNo;
    this.selectedField$.emit(this.selectedField);
  }

  buttonClass(playerNo: number) {
    return playerNo === 1 ?
      'player-1' : playerNo === 2 ?
        'player-2' : 'not-taken';
  }

  isSelected(fieldNo: number) {
    return this.selectedField == fieldNo;
  }
}
