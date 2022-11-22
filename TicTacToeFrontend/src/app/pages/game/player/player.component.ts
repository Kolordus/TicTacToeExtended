import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from "../../../service/game.service";
import {GameData} from "../../../../model/GameData";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {

  game$: GameData;
  private sub = new Subscription();

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    let subscription = this.gameService.game.subscribe(value => {
      this.game$ = value;
    });
    this.sub.add(subscription);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
