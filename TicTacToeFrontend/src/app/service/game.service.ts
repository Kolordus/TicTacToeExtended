import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, filter, map, Observable} from "rxjs";
import {GameData} from "../../model/GameData";
import {HistoryService} from "./history.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  #game$ = new BehaviorSubject<GameData>(GameData.EMPTY);
  #playerNo$ = new BehaviorSubject<number>(0);
  #selectedNominal = new BehaviorSubject<number>(0);
  #selectedFieldNo = new BehaviorSubject<number>(0);

  constructor(private historyService: HistoryService) {
  }

  selectFieldNo(fieldNo: number) {
    if (this.isGameFinished()) return;
    if (this.#game$.getValue().game.currentPlayer.no === this.#playerNo$.getValue()) {
      this.#selectedFieldNo.next(fieldNo);
    }
  }

  selectNominal(nominal: number) {
    if (this.isGameFinished()) return;
    if (this.#game$.getValue().game.currentPlayer.no === this.#playerNo$.getValue()
      && this.#game$.getValue().whoWon === -1) {

      this.#selectedNominal.next(nominal);
    }
  }

  canSend(): Observable<boolean> {
    return combineLatest(
      [
        this.game.pipe(
          filter(gameData => gameData.game !== undefined),
          map(gameData => gameData.game.currentPlayer.no === this.currentPlayer)
        ),
        this.game.pipe(
          filter(gameData => gameData !== undefined),
          filter(_ => this.fieldNoToSend != 0),
          map(gameData => gameData.game.board[this.fieldNoToSend - 1].currentNominal < this.nominalToSend)
        ),
      ],
      (correctPlayer, correctNominal) => ({correctPlayer, correctNominal})
    ).pipe(
      map(value => value.correctNominal && value.correctNominal),
    );
  }

  setGame(game: GameData) {
    if (game) {
      this.#game$.next(game);
    }
  }

  get game(): Observable<GameData> {
    return this.#game$.asObservable();
  }

  get getGameId(): string {
    return this.#game$.getValue().game.gameId;
  }

  get nominalToSend(): number {
    return this.#selectedNominal.getValue();
  }

  get fieldNoToSend(): number {
    return this.#selectedFieldNo.getValue();
  }

  updateGame(game: GameData) {
    this.setGame(game);
    this.historyService.addMovement(game);
  }

  setPlayerNo(playerNo: number) {
    this.#playerNo$.next(playerNo)
  }

  get playerNo(): Observable<number> {
    return this.#playerNo$.asObservable();
  }

  get currentPlayer(): number {
    return this.#playerNo$.getValue();
  }

  private isGameFinished() {
    return this.#game$.getValue().whoWon !== -1;
  }

  resetNominalAndField() {
    this.#selectedFieldNo.next(0);
    this.#selectedNominal.next(0);
  }
}
