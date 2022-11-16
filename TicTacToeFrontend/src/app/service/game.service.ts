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
  playerNo = new BehaviorSubject<number>(0);
  selectedNominal: number = 0;
  selectedFieldNo: number = 0;

  constructor() { }

  setGame(game: GameData) {
    this.game.next(game);
  }

  get getGameId() {
    return this.game.getValue().game.gameId;
  }

  get getNominalToSend() {
    return this.selectedNominal;
  }

  get getFieldNoToSend() {
    return this.selectedFieldNo;
  }

  set setWinner(winner: number) {
    this.winner = winner;
  }

  updateGame(game: GameData) {
    this.setGame(game);
    this.winner = this.game.getValue().whoWon == -1 ? -1 : this.game.getValue().whoWon;
  }

  setPlayerNo(playerNo: number) {
    this.playerNo.next(playerNo)
  }

  selectFieldNo(fieldNo: number) {
    if (this.isGameFinished()) return;
    if (this.game.getValue().game.currentPlayer.no === this.playerNo.getValue()) {
      this.selectedFieldNo = fieldNo;
    }

    console.log(this.selectedFieldNo);
  }

  selectNominal(nominal: number) {
    if (this.isGameFinished()) return;
    if (this.game.getValue().game.currentPlayer.no === this.playerNo.getValue() && this.winner === -1) {
      this.selectedNominal = nominal;
    }

    console.log(this.selectedNominal);

  }

  private isGameFinished() {
    return this.winner !== -1;
  }

  resetNominalAndField() {
    this.selectedFieldNo = 0;
    this.selectedNominal = 0;
  }
}
