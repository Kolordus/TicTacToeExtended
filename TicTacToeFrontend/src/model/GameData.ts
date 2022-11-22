import {Game} from "./Game";

export class GameData {

  static EMPTY = new GameData(Game.EMPTY, -1);

  game: Game;
  whoWon: number;
  constructor(game: Game, whoWon: number) {
    this.game = game;
    this.whoWon = whoWon;
  }

}


