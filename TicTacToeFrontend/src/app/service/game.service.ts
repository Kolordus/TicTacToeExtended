import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {GameData} from "../../model/GameData";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  winner: number | undefined = -1;

  game: GameData;
  // game = new BehaviorSubject<GameData>(GameData.empty);
  availableGames = new BehaviorSubject<string[]>([]);
  selectedNominal = new BehaviorSubject<number>(0);
  selectedFieldNo = new BehaviorSubject<number>(0);
  playerNo = new BehaviorSubject<number>(0);

  constructor() { }

  setGame(game: GameData) {
    this.game = game
  }

  get getGameId() {
    // return this.game.getValue().game.gameId;
    return this.game.game.gameId;
  }

  set setWinner(winner: number) {
    this.winner = winner;
  }

  updateGame(game: GameData) {
    this.game = game;
    this.winner = this.game?.whoWon == -1 ? -1 : this.game?.whoWon;
  }

  setPlayerNo(playerNo: number) {
    this.playerNo.next(playerNo);
  }

  selectFieldNo(fieldNo: number) {
    if (this.isGameFinished()) return;
    if (this.game?.game.currentPlayer.no === this.playerNo.getValue()) {
      this.selectedFieldNo.next(fieldNo);
      console.log(this.selectedFieldNo.getValue());
    }

  }

  selectNominal(nominal: number) {
    if (this.isGameFinished()) return;
    if (this.game?.game.currentPlayer.no === this.playerNo.getValue() && this.winner === -1) {
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
