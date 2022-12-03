import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-who-won',
  templateUrl: './who-won.component.html',
  styleUrls: ['./who-won.component.css']
})
export class WhoWonComponent{

  @Input()
  whoWon: number;

}
