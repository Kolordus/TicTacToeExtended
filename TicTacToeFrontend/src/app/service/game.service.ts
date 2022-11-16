import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {GameData} from "../../model/GameData";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  winner: number | undefined = -1;

  game = new BehaviorSubject<GameData>(GameData.empty);
  availableGames = new BehaviorSubject<string[]>([]);
  // selectedNominal = new BehaviorSubject<number>(0);
  selectedNominal = new BehaviorSubject<number>(0);
  selectedFieldNo = new BehaviorSubject<number>(0);
  playerNo = new BehaviorSubject<number>(0);

  constructor() { }

  setGame(game: GameData) {
    this.game.next(game);
  }

  get getGameId() {
    return this.game.getValue().game.gameId;
  }

  get getNominalToSend() {
    return this.selectedNominal.getValue();
  }

  get getFieldNoToSend() {
    return this.selectedFieldNo.getValue();
  }

  set setWinner(winner: number) {
    this.winner = winner;
  }

  updateGame(game: GameData) {
    this.setGame(game);
    this.winner = this.game.getValue().whoWon == -1 ? -1 : this.game.getValue().whoWon;
  }

  setPlayerNo(playerNo: number) {
    this.playerNo.next(playerNo);
  }

  selectFieldNo(fieldNo: number) {
    if (this.isGameFinished()) return;
    if (this.game.getValue().game.currentPlayer.no === this.playerNo.getValue()) {
      this.selectedFieldNo.next(fieldNo);
    }
  }

  selectNominal(nominal: number) {
    if (this.isGameFinished()) return;
    if (this.game.getValue().game.currentPlayer.no === this.playerNo.getValue() && this.winner === -1) {
      this.selectedNominal.next(nominal);
    }
  }

  private isGameFinished() {
    return this.winner !== -1;
  }

  resetNominalAndField() {
    this.selectedFieldNo.next(0);
    this.selectedNominal.next(0);
  }
}
