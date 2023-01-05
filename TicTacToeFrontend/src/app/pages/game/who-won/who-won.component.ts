import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-who-won',
  template: `
      <div *ngIf="whoWon > -1">
        <hr/>
        <br/>
        Winner:
        <var>{{ getWhoWon() }}</var>
      </div>
`,
  styleUrls: ['./who-won.component.css']
})
export class WhoWonComponent {

  @Input()
  whoWon: number;

  getWhoWon(): string {
      return this.whoWon === 1 ? 'Player 1' : this.whoWon === 2 ? 'Player 2' : "Remis";
  }

}
