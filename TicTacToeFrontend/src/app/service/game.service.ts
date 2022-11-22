import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {GameData} from "../../model/GameData";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  winner: number | undefined = -1;

  game$ = new BehaviorSubject<GameData>(GameData.EMPTY);
  playerNo$ = new BehaviorSubject<number>(0);

  selectedNominal: number = 0;
  selectedFieldNo: number = 0;

  constructor() { }

  setGame(game: GameData) {
    this.game$.next(game);
  }

  get game(): Observable<GameData> {
    return this.game$.asObservable();
  }

  get getGameId(): string {
    return this.game$.getValue().game.gameId;
  }

  get nominalToSend(): number {
    return this.selectedNominal;
  }

  get fieldNoToSend(): number {
    return this.selectedFieldNo;
  }

  set setWinner(winner: number) {
    this.winner = winner;
  }

  updateGame(game: GameData) {
    this.setGame(game);
    this.winner = this.game$.getValue().whoWon == -1 ? -1 : this.game$.getValue().whoWon;
  }

  setPlayerNo(playerNo: number) {
    this.playerNo$.next(playerNo)
  }

  get playerNo():Observable<number> {
    return this.playerNo$.asObservable();
  }

  selectFieldNo(fieldNo: number) {
    if (this.isGameFinished()) return;
    if (this.game$.getValue().game.currentPlayer.no === this.playerNo$.getValue()) {
      this.selectedFieldNo = fieldNo;
    }
  }

  selectNominal(nominal: number) {
    if (this.isGameFinished()) return;
    if (this.game$.getValue().game.currentPlayer.no === this.playerNo$.getValue() && this.winner === -1) {
      this.selectedNominal = nominal;
    }
  }

  private isGameFinished() {
    return this.winner !== -1;
  }

  resetNominalAndField() {
    this.selectedFieldNo = 0;
    this.selectedNominal = 0;
  }
}
