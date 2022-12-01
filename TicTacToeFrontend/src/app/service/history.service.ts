import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Game} from "../../model/Game";
import {GameData} from "../../model/GameData";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private historyMoves$ = new BehaviorSubject<Game[]>([Game.EMPTY]);

  constructor() { }

  get history() {
    return this.historyMoves$.asObservable();
  }

  addMovement(game: GameData) {
    if (game.game == undefined) return
    this.historyMoves$.next([...this.historyMoves$.value, game.game]);
  }

  getMovementAtIndext(index: number): Game {
    console.log('array size: ' + this.historyMoves$.getValue().length);
    return this.historyMoves$.getValue()[index];
  }

  showAll() {
    console.log(this.historyMoves$.getValue());
  }

  clear() {
    this.historyMoves$.next([]);
  }
}
