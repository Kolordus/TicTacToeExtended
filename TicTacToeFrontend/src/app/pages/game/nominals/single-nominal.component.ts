import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-single-nominal',
  template: `
    <button mat-stroked-button
            [ngClass]="classNg"
            class="default-nominal">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./single-nominal.component.css']
})
export class SingleNominalComponent {

  @Input()
  classNg: string;
}
