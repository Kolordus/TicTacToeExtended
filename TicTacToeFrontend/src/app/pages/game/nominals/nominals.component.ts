import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameData} from "../../../../model/GameData";

@Component({
  selector: 'app-nominals',
  templateUrl: './nominals.component.html',
  styleUrls: ['./nominals.component.css']
})
export class NominalsComponent {

  @Input()
  playerNo: number | null;

  @Input()
  game: GameData;

  @Output()
  selectedNominal$ = new EventEmitter<number>();
  selectedNominal: number;

  constructor() { }

  selectNominal(nominal: number) {
    this.selectedNominal = nominal;
    this.selectedNominal$.emit(this.selectedNominal);
  }

  nominalClass(nominal: number) {
    if (nominal === this.selectedNominal) {
      return 'selectedNominal';
    }
    return 'nominal';
  }

}
