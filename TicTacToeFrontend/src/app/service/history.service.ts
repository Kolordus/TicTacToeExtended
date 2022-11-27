import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Game} from "../../model/Game";
import {GameData} from "../../model/GameData";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private historyMovesArray: Array<Game> = [Game.EMPTY];
  private historyMoves$ = new BehaviorSubject<Game[]>(this.historyMovesArray);

  constructor() { }

  get history() {
    return this.historyMoves$.asObservable();
  }

  addMovement(game: GameData) {
    if (game.game == undefined) return
    this.historyMovesArray.push(game.game)
    this.historyMoves$.next(this.historyMovesArray);
  }

  getMovementAtIndext(index: number): Game {
    console.log('array size: ' + this.historyMoves$.getValue().length);
    return this.historyMoves$.getValue()[index];
  }

  showAll() {
    console.log(this.historyMoves$.getValue());
  }

  clear() {
    this.historyMovesArray = [];
    this.historyMoves$.next(this.historyMovesArray);
  }
}
