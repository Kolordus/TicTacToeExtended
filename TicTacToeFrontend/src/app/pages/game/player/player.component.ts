import {Component, Input} from '@angular/core';
import {GameData} from "../../../../model/GameData";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {

  @Input()
  game$: GameData;

  constructor() { }

}
