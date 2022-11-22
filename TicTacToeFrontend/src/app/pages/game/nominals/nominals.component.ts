import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GameService} from "../../../service/game.service";
import {GameData} from "../../../../model/GameData";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-nominals',
  templateUrl: './nominals.component.html',
  styleUrls: ['./nominals.component.css']
})
export class NominalsComponent implements OnInit, OnDestroy {

  @Input()
  playerNo: number | null;

  @Output()
  selectedNominal$ = new EventEmitter<number>();
  selectedNominal: number;

  game: GameData;
  subscriptions = new Subscription();

  constructor(private gameService: GameService) { }

  async ngOnInit() {
    let subscription = await this.gameService.game$.subscribe(value => {
      this.game = value;
    });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectNominal(nominal: number) {
    this.selectedNominal = nominal;
    this.selectedNominal$.emit(this.selectedNominal);
    // this
  }

  nominalClass(nominal: number) {
    if (nominal === this.selectedNominal) {
      return 'selectedNominal';
    }
    return 'nominal';
  }

}
