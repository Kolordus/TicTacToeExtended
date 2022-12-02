import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {GameData} from "../../model/GameData";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private historyMoves$ = new BehaviorSubject<GameData[]>([GameData.EMPTY]);

  constructor() { }

  get history() {
    return this.historyMoves$.asObservable();
  }

  addMovement(game: GameData) {
    if (game.game == undefined)
      return
    this.historyMoves$.next([...this.historyMoves$.value, game]);
  }

  getMovementAtIndext(index: number): GameData {
    return this.historyMoves$.getValue()[index];
  }

  getMovesAmount(): number {
    return this.historyMoves$.getValue().length;
  }

  clear() {
    this.historyMoves$.next([]);
  }
}
