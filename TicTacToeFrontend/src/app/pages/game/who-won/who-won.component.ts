import {Component, Input} from '@angular/core';
import {GameData} from "../../../../model/GameData";

@Component({
  selector: 'app-who-won',
  templateUrl: './who-won.component.html',
  styleUrls: ['./who-won.component.css']
})
export class WhoWonComponent{

  @Input()
  game: GameData;

}
