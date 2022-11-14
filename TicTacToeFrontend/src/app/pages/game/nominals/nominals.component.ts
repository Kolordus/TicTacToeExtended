import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../../service/game.service";

@Component({
  selector: 'app-nominals',
  templateUrl: './nominals.component.html',
  styleUrls: ['./nominals.component.css']
})
export class NominalsComponent {

  constructor(private gameService: GameService) { }

  @Input()
  playerNo: number | null;

  @Output()
  selectedNominal = new EventEmitter<number>();

  currentNominal: number;

  game = this.gameService.game;

  selectNominal(nominal: number) {
    this.currentNominal = nominal;
    this.selectedNominal.emit(this.currentNominal);
  }

  nominalClass(nominal: number) {
    if (nominal === this.currentNominal) {
      return 'selected-nominal';
    }
    return 'nominal';
  }
}
