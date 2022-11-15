import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../../service/game.service";
import {GameData} from "../../../../model/GameData";

@Component({
  selector: 'app-nominals',
  templateUrl: './nominals.component.html',
  styleUrls: ['./nominals.component.css']
})
export class NominalsComponent implements OnInit {

  @Input()
  playerNo: number | null;

  @Output()
  selectedNominal$ = new EventEmitter<number>();
  selectedNominal: number;

  game: GameData;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.game.subscribe(value => {
      this.game = value;
    });
  }



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
